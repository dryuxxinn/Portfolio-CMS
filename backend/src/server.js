require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { Op } = require('sequelize');

const { sequelize, connectDB } = require('./config/db');
const Admin = require('./modules/admin.model');
const WebConfig = require('./modules/config.model');
const Project = require('./modules/project.model');
const Certificate = require('./modules/certificate.model');
const SinRegistration = require('./modules/sin.model');
const ContactMessage = require('./modules/message.model');
const Visitor = require('./modules/visitor.model');
const verifyToken = require('./middleware/auth.middleware');
const mikrotikService = require('./services/mikrotik.service');

const app = express();
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads & existing assets
const uploadsDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Serve root assets folder
const rootAssetsDir = path.join(__dirname, '../../assets');
if (fs.existsSync(rootAssetsDir)) {
  app.use('/assets', express.static(rootAssetsDir));
}
const rootPdf = path.join(__dirname, '../../CV Bergas Ardiansyah.pdf');
if (fs.existsSync(rootPdf)) {
  app.use('/CV Bergas Ardiansyah.pdf', (req, res) => res.sendFile(rootPdf));
}

// Multer Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

// Swagger UI Setup
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Port-sin PostgreSQL Dynamic API',
      version: '1.0.0',
      description: 'REST API untuk Portfolio Bergas Ardiansyah & Hotspot/PPPoE Registration System berbasis PostgreSQL',
    },
    servers: [{ url: BASE_URL, description: 'Local Server' }]
  },
  apis: ['./src/server.js']
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    app: 'Port-sin PostgreSQL Dynamic Backend API',
    database: 'PostgreSQL',
    version: '1.0.0',
    docs: `${BASE_URL}/api-docs`
  });
});

/* ==========================================================================
   1. AUTHENTICATION (ADMIN)
   ========================================================================== */

app.post('/api/v1/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username dan password wajib diisi!' });
    }

    const admin = await Admin.findOne({ where: { username } });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Kredensial login salah!' });
    }

    if (admin.status === 'Nonaktif') {
      return res.status(403).json({ success: false, message: 'Akun dinonaktifkan oleh administrator.' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Kredensial login salah!' });
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET || 'port_sin_super_secret_jwt_key_2026',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login berhasil!',
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/v1/auth/me', verifyToken, async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.adminId, {
      attributes: { exclude: ['password'] }
    });
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin tidak ditemukan' });
    }
    res.json({ success: true, data: admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/v1/auth/password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Password saat ini dan password baru wajib diisi!' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password baru minimal 6 karakter!' });
    }

    const admin = await Admin.findByPk(req.adminId);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin tidak ditemukan!' });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Password saat ini salah!' });
    }

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);
    await admin.save();

    res.json({ success: true, message: 'Password admin berhasil diperbarui!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ==========================================================================
   2. WEB CONFIG (PROFILE, ABOUT, SKILLS, TOOLS, CONTACT)
   ========================================================================== */

app.get('/api/v1/config', async (req, res) => {
  try {
    let config = await WebConfig.findOne();
    if (!config) {
      config = await WebConfig.create({});
    }
    res.json({ success: true, data: config });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/v1/config', verifyToken, async (req, res) => {
  try {
    let config = await WebConfig.findOne();
    if (!config) {
      config = await WebConfig.create(req.body);
    } else {
      await config.update(req.body);
    }
    res.json({ success: true, message: 'Konfigurasi website berhasil disimpan!', data: config });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ==========================================================================
   3. PROJECTS (CRUD)
   ========================================================================== */

app.get('/api/v1/projects', async (req, res) => {
  try {
    const where = { status: 'published' };
    if (req.query.category && req.query.category !== 'All') {
      where.category = req.query.category;
    }
    if (req.query.featured === 'true') {
      where.featured = true;
    }

    const projects = await Project.findAll({
      where,
      order: [['order', 'ASC'], ['createdAt', 'DESC']]
    });
    res.json({ success: true, total: projects.length, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/v1/admin/projects', verifyToken, async (req, res) => {
  try {
    const projects = await Project.findAll({
      order: [['order', 'ASC'], ['createdAt', 'DESC']]
    });
    res.json({ success: true, total: projects.length, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/v1/projects/:slug', async (req, res) => {
  try {
    const project = await Project.findOne({ where: { slug: req.params.slug } });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Proyek tidak ditemukan!' });
    }
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/v1/projects', verifyToken, async (req, res) => {
  try {
    let { title, slug } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Judul proyek wajib diisi!' });

    let baseSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    let finalSlug = baseSlug;
    let counter = 1;
    while (await Project.findOne({ where: { slug: finalSlug } })) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newProject = await Project.create({
      ...req.body,
      slug: finalSlug
    });

    res.status(201).json({ success: true, message: 'Proyek berhasil ditambahkan!', data: newProject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/v1/projects/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === 'undefined') {
      return res.status(400).json({ success: false, message: 'ID Proyek tidak valid!' });
    }
    const project = await Project.findByPk(id);
    if (!project) return res.status(404).json({ success: false, message: 'Proyek tidak ditemukan!' });

    await project.update(req.body);
    res.json({ success: true, message: 'Proyek berhasil diperbarui!', data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/v1/projects/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === 'undefined') {
      return res.status(400).json({ success: false, message: 'ID Proyek tidak valid!' });
    }
    await Project.destroy({ where: { id } });
    res.json({ success: true, message: 'Proyek berhasil dihapus!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ==========================================================================
   4. CERTIFICATES (CRUD)
   ========================================================================== */

app.get('/api/v1/certificates', async (req, res) => {
  try {
    const where = {};
    if (req.query.category && req.query.category !== 'All') {
      where.category = req.query.category;
    }
    const certs = await Certificate.findAll({
      where,
      order: [['order', 'ASC'], ['createdAt', 'DESC']]
    });
    res.json({ success: true, total: certs.length, data: certs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/v1/certificates', verifyToken, async (req, res) => {
  try {
    const newCert = await Certificate.create(req.body);
    res.status(201).json({ success: true, message: 'Sertifikat berhasil ditambahkan!', data: newCert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/v1/certificates/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === 'undefined') return res.status(400).json({ success: false, message: 'ID Sertifikat tidak valid!' });
    const cert = await Certificate.findByPk(id);
    if (!cert) return res.status(404).json({ success: false, message: 'Sertifikat tidak ditemukan!' });
    await cert.update(req.body);
    res.json({ success: true, message: 'Sertifikat berhasil diperbarui!', data: cert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/v1/certificates/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === 'undefined') return res.status(400).json({ success: false, message: 'ID Sertifikat tidak valid!' });
    await Certificate.destroy({ where: { id } });
    res.json({ success: true, message: 'Sertifikat berhasil dihapus!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ==========================================================================
   5. SIN REGISTRATION (HOTSPOT / PPPOE FOR MIKROTIK)
   ========================================================================== */

app.post('/api/v1/sin/register', async (req, res) => {
  try {
    const { username, password, password_confirm, service_type = 'hotspot', full_name, phone } = req.body;

    if (!username || !password) {
      return res.status(400).json({ status: 'error', message: 'Username dan Password wajib diisi!' });
    }

    if (password_confirm && password !== password_confirm) {
      return res.status(400).json({ status: 'error', message: 'Konfirmasi password tidak cocok!' });
    }

    const existing = await SinRegistration.findOne({ where: { username: username.trim().toLowerCase() } });
    if (existing) {
      return res.status(400).json({ status: 'error', message: 'Username sudah digunakan. Silakan pilih username lain!' });
    }

    const registration = await SinRegistration.create({
      username: username.trim().toLowerCase(),
      password: password,
      service_type: service_type,
      full_name: full_name || username,
      phone: phone || '',
      status: 'active'
    });

    let syncResult = null;
    if (service_type === 'hotspot') {
      syncResult = await mikrotikService.syncHotspotUser({
        username: registration.username,
        password: registration.password,
        comment: `Reg by ${registration.full_name}`
      });
    } else {
      syncResult = await mikrotikService.syncPppoeSecret({
        username: registration.username,
        password: registration.password,
        comment: `Reg by ${registration.full_name}`
      });
    }

    if (syncResult && syncResult.success) {
      await registration.update({
        mikrotik_synced: true,
        synced_at: new Date()
      });
    }

    res.status(201).json({
      status: 'success',
      message: `Pendaftaran berhasil! Akun ${service_type.toUpperCase()} Anda telah aktif. Silakan gunakan username dan password untuk login.`,
      data: {
        username: registration.username,
        service_type: registration.service_type,
        status: registration.status,
        mikrotik_synced: registration.mikrotik_synced
      }
    });
  } catch (error) {
    console.error('Sin register error:', error);
    res.status(500).json({ status: 'error', message: 'Terjadi kesalahan sistem saat mendaftarkan akun.' });
  }
});

app.get('/api/v1/sin/users', verifyToken, async (req, res) => {
  try {
    const where = {};
    if (req.query.service_type) where.service_type = req.query.service_type;
    if (req.query.status) where.status = req.query.status;

    const users = await SinRegistration.findAll({ where, order: [['createdAt', 'DESC']] });
    res.json({ success: true, total: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.patch('/api/v1/sin/users/:id/status', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === 'undefined') return res.status(400).json({ success: false, message: 'ID User tidak valid!' });
    const { status } = req.body;
    const user = await SinRegistration.findByPk(id);
    if (!user) return res.status(404).json({ success: false, message: 'User tidak ditemukan' });

    await user.update({ status });
    res.json({ success: true, message: `Status berhasil diubah menjadi ${status}!`, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/v1/sin/users/:id/sync', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === 'undefined') return res.status(400).json({ success: false, message: 'ID User tidak valid!' });
    const user = await SinRegistration.findByPk(id);
    if (!user) return res.status(404).json({ success: false, message: 'User tidak ditemukan' });

    let result = null;
    if (user.service_type === 'hotspot') {
      result = await mikrotikService.syncHotspotUser({
        username: user.username,
        password: user.password
      });
    } else {
      result = await mikrotikService.syncPppoeSecret({
        username: user.username,
        password: user.password
      });
    }

    if (result.success) {
      await user.update({
        mikrotik_synced: true,
        synced_at: new Date()
      });
      res.json({ success: true, message: result.message || 'Sinkronisasi berhasil!' });
    } else {
      res.status(400).json({ success: false, message: result.error || 'Gagal sinkron ke MikroTik' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/v1/sin/users/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === 'undefined') return res.status(400).json({ success: false, message: 'ID User tidak valid!' });
    await SinRegistration.destroy({ where: { id } });
    res.json({ success: true, message: 'Akun berhasil dihapus!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ==========================================================================
   6. CONTACT MESSAGES
   ========================================================================== */

app.post('/api/v1/messages', async (req, res) => {
  try {
    const { name, email, subject, message, phone } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Nama, Email, dan Pesan wajib diisi!' });
    }
    const msg = await ContactMessage.create({ name, email, subject, message, phone });
    res.status(201).json({ success: true, message: 'Pesan berhasil dikirim! Terima kasih telah menghubungi.', data: msg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/v1/messages', verifyToken, async (req, res) => {
  try {
    const messages = await ContactMessage.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ success: true, total: messages.length, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.patch('/api/v1/messages/:id/read', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === 'undefined') return res.status(400).json({ success: false, message: 'ID Pesan tidak valid!' });
    const msg = await ContactMessage.findByPk(id);
    if (!msg) return res.status(404).json({ success: false, message: 'Pesan tidak ditemukan' });

    await msg.update({ is_read: true });
    res.json({ success: true, message: 'Pesan ditandai telah dibaca.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/v1/messages/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === 'undefined') return res.status(400).json({ success: false, message: 'ID Pesan tidak valid!' });
    await ContactMessage.destroy({ where: { id } });
    res.json({ success: true, message: 'Pesan berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ==========================================================================
   7. VISITOR ANALYTICS & STATS
   ========================================================================== */

app.post('/api/v1/visitors/hit', async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || '';
    const { page } = req.body;
    await Visitor.create({ ip, userAgent, page: page || '/' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/v1/admin/stats', verifyToken, async (req, res) => {
  try {
    const totalProjects = await Project.count();
    const totalCertificates = await Certificate.count();
    const totalSinUsers = await SinRegistration.count();
    const totalMessages = await ContactMessage.count();
    const unreadMessages = await ContactMessage.count({ where: { is_read: false } });
    const totalVisitors = await Visitor.count();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayVisitors = await Visitor.count({
      where: {
        createdAt: {
          [Op.gte]: today
        }
      }
    });

    res.json({
      success: true,
      data: {
        totalProjects,
        totalCertificates,
        totalSinUsers,
        totalMessages,
        unreadMessages,
        totalVisitors,
        todayVisitors
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ==========================================================================
   8. MEDIA FILE UPLOADS
   ========================================================================== */

app.post('/api/v1/uploads', verifyToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Tidak ada file yang diunggah!' });
  }
  const fileUrl = `${BASE_URL}/uploads/${req.file.filename}`;
  res.json({
    success: true,
    message: 'File berhasil diunggah!',
    url: fileUrl,
    filename: req.file.filename
  });
});

app.post('/api/v1/uploads/multiple', verifyToken, upload.array('files', 15), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'Tidak ada file yang diunggah!' });
  }
  const uploadedFiles = req.files.map((f) => ({
    url: `${BASE_URL}/uploads/${f.filename}`,
    filename: f.filename
  }));
  res.json({
    success: true,
    message: `${req.files.length} file berhasil diunggah!`,
    urls: uploadedFiles.map((f) => f.url),
    files: uploadedFiles
  });
});

// Start Server & Connect PostgreSQL
connectDB().then(async () => {
  try {
    const adminCount = await Admin.count();
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await Admin.create({
        username: 'admin',
        password: hashedPassword,
        fullName: 'Bergas Ahmad Ardiansyah',
        email: 'bgasrdy@gmail.com',
        role: 'Super Admin',
        status: 'Aktif'
      });
      console.log('[SECURITY] Default admin initialized in PostgreSQL: admin / admin123');
    }
  } catch (e) {
    console.error('[DATABASE SYNC WARNING]', e.message);
  }

  app.listen(PORT, () => {
    console.log(`[SERVER] Port-sin PostgreSQL Dynamic API berjalan di ${BASE_URL}`);
    console.log(`[DOCS] Dokumentasi Swagger aktif di ${BASE_URL}/api-docs`);
  });
});
