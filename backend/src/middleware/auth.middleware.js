const jwt = require('jsonwebtoken');
const Admin = require('../modules/admin.model');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(403).json({ success: false, message: 'Akses ditolak! Token otentikasi tidak disediakan.' });
  }

  const token = authHeader.split(' ')[1]; // Format: Bearer <token>
  if (!token) {
    return res.status(403).json({ success: false, message: 'Format token otentikasi tidak valid.' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'port_sin_super_secret_jwt_key_2026', (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'Sesi login tidak valid atau telah kadaluarsa.' });
    }
    req.adminId = decoded.id;
    req.adminRole = decoded.role || 'Super Admin';
    next();
  });
};

verifyToken.requireRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const admin = await Admin.findByPk(req.adminId, { attributes: ['role', 'status'] });
      if (!admin || admin.status === 'Nonaktif') {
        return res.status(403).json({ success: false, message: 'Akun admin tidak aktif atau telah dihapus.' });
      }
      const effectiveRole = admin.role || 'Super Admin';
      if (!allowedRoles.includes(effectiveRole)) {
        return res.status(403).json({
          success: false,
          message: `Akses ditolak! Fitur ini membutuhkan hak akses: ${allowedRoles.join(', ')}.`
        });
      }
      req.adminRole = effectiveRole;
      next();
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };
};

module.exports = verifyToken;
