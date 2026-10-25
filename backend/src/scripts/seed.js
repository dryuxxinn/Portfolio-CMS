require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, connectDB } = require('../config/db');

const Admin = require('../modules/admin.model');
const WebConfig = require('../modules/config.model');
const Project = require('../modules/project.model');
const Certificate = require('../modules/certificate.model');

const seedData = async () => {
  try {
    await connectDB();
    console.log('[SEED] Memulai seeding data PostgreSQL...');

    // 1. Seed Admin
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
      console.log('[SEED] Default Super Admin dibuat di PostgreSQL: admin / admin123');
    }

    // 2. Seed WebConfig
    const configCount = await WebConfig.count();
    if (configCount === 0) {
      await WebConfig.create({
        site_name: 'Bergas Ahmad Ardiansyah',
        site_initials: 'BAA',
        tagline: 'Cyber Security Network Engineer',
        hero_roles: ['Cyber Security Engineer', 'Network Engineer', 'System Administrator'],
        hero_bio: 'Saya adalah praktisi jaringan yang berfokus pada rancangan jaringan dan keamanan sistem. Berpengalaman dalam konfigurasi router, pengelolaan server Linux dan Windows, serta perancangan topologi jaringan adaptif, saya juga mendalami Penetration Testing dan Cyber Forensic. Terbiasa menggunakan SIEM Wazuh, IDS Snort, dan optimasi server.',
        profile_image: '/assets/img/profile/profile-square-11.webp',
        resume_url: '/CV Bergas Ardiansyah.pdf',
        education: [
          {
            institution: 'Universitas Trilogi',
            period: '2025 - Sekarang',
            major: 'Teknik Informatika (S1)',
            description: 'Program Sarjana Teknik Informatika yang menekankan pengembangan kemampuan analisis, perancangan, dan implementasi sistem berbasis teknologi informasi.'
          },
          {
            institution: 'CEP CCIT Fakultas Teknik Universitas Indonesia',
            period: '2023 - 2025',
            major: 'Teknologi Informasi - Cyber Security',
            description: 'Program Profesional dari Universitas Indonesia berfokus pada Cyber Security, meliputi network security, penetration testing, incident response, digital forensics, serta implementasi sistem keamanan industri.'
          }
        ],
        experience: [
          {
            role: 'Security Operations Center Analyst Internship',
            period: '2025',
            company: 'PT. Krakatau Sarana Properti',
            responsibilities: [
              'Merancang dan mensimulasikan tools keamanan jaringan untuk Server dan Endpoint menggunakan Tools SIEM (Wazuh).',
              'Menganalisis log aktivitas (network traffic, firewall, IDS/IPS, endpoint) untuk mendeteksi anomali dan potensi serangan.',
              'Membantu investigasi insiden keamanan dengan mengumpulkan, mengkorelasikan, dan mendokumentasikan bukti digital.',
              'Berkolaborasi dengan tim IT dalam menanggapi insiden serta melakukan tindakan mitigasi awal.',
              'Melakukan riset tentang tren ancaman siber terbaru untuk meningkatkan efektivitas deteksi.'
            ]
          },
          {
            role: 'Junior Data Analyst',
            period: '2023 - 2024',
            company: 'Partai Persatuan Pembangunan',
            responsibilities: [
              'Mengumpulkan, mengelola, dan menganalisis data menggunakan Microsoft Excel.',
              'Memastikan ketelitian dalam proses pengumpulan data agar hasil akurat dan konsisten.',
              'Mengorganisir data ke dalam format yang rapi serta mudah dipahami.',
              'Membuat laporan berdasarkan hasil analisis untuk mendukung kebutuhan tim atau manajemen.'
            ]
          }
        ],
        core_skills: [
          'Proficient in Linux & Windows Server administration',
          'Skilled in network setup and topology design',
          'Experienced as Security Analyst and Incident Responder',
          'Hands-on with SIEM deployment (Wazuh) and log monitoring',
          'Familiar with Cisco and Mikrotik networking and device configuration',
          'Knowledge of virtualization (VMware, VirtualBox, Proxmox)',
          'Basic knowledge of penetration testing methodologies',
          'Strong troubleshooting and problem-solving skills'
        ],
        tools: [
          { name: 'Linux', icon_url: 'https://www.svgrepo.com/show/452054/linux.svg' },
          { name: 'Windows', icon_url: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/webp/windows-11.webp' },
          { name: 'Cisco', icon_url: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/webp/cisco.webp' },
          { name: 'Mikrotik', icon_url: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/mikrotik-light.svg' },
          { name: 'Wazuh', icon_url: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/webp/wazuh.webp' },
          { name: 'Snort', icon_url: '/assets/img/snort.svg' },
          { name: 'VMware', icon_url: 'https://img.icons8.com/color/96/vmware.png' },
          { name: 'Proxmox', icon_url: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/webp/proxmox-light.webp' },
          { name: 'VirtualBox', icon_url: 'https://www.virtualbox.org/graphics/vbox_logo2_gradient.png' },
          { name: 'Docker', icon_url: 'https://img.icons8.com/color/96/docker.png' },
          { name: 'GitHub', icon_url: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/webp/github-light.webp' }
        ],
        contact_info: {
          domicile: 'Depok, Indonesia',
          whatsapp: '+6285179958005',
          email: 'bgasrdy@gmail.com'
        },
        social_links: {
          github: 'https://github.com/dryuxxinn',
          linkedin: 'https://www.linkedin.com/in/bgasrdy/',
          instagram: 'https://www.instagram.com/bgasrdy/',
          blog: 'https://blog.bgasrdy.my.id'
        }
      });
      console.log('[SEED] WebConfig PostgreSQL berhasil di-seed.');
    }

    // 3. Seed Projects
    const projectCount = await Project.count();
    if (projectCount === 0) {
      const projects = [
        {
          title: 'Rancangan SIEM Terintegrasi dengan Network IDS berbasis Wazuh dan Suricata',
          slug: 'wazuh-suricata-integration',
          category: 'Security',
          client: 'Internship Project',
          date: '2025',
          excerpt: 'Mendeteksi ancaman jaringan secara real-time dengan integrasi IDS dan visualisasi log SIEM.',
          content: 'Project ini merancang arsitektur keamanan terpusat dengan mengintegrasikan Suricata IDS dan Wazuh SIEM pada sistem berbasis Linux. Suricata berfungsi mendeteksi anomali paket data lalu lintas jaringan secara real-time menggunakan signature-based ruleset, sedangkan Wazuh bertindak sebagai manajer SIEM yang mengumpulkan, mengkorelasikan log kejadian, serta memicu alert keamanan terpusat.',
          features: [
            'Real-time network traffic anomaly detection dengan Suricata.',
            'Korelasi log keamanan terpusat menggunakan Wazuh Manager.',
            'Visualisasi dasbor serangan siber dan event alert interaktif.',
            'Automated active response terhadap ancaman berbahaya.'
          ],
          tech_stack: ['Wazuh', 'Suricata', 'Linux', 'SIEM', 'IDS/IPS'],
          thumbnail: '/assets/img/portfolio/wazuh-suri1.webp',
          gallery: [
            '/assets/img/portfolio/wazuh-suri1.webp',
            '/assets/img/portfolio/wazuh-suri2.webp',
            '/assets/img/portfolio/wazuh-suri3.webp',
            '/assets/img/portfolio/wazuh-suri4.webp'
          ],
          featured: true,
          status: 'published',
          github_url: 'https://github.com/dryuxxinn/Wazuh-Surricata-Integration',
          order: 1
        },
        {
          title: 'Membuat Home Server dengan Casa OS pada STB HG680P',
          slug: 'casaos-home-server',
          category: 'Server',
          client: 'Self Project',
          date: 'Januari 2025',
          excerpt: 'Eksplorasi pembuatan server lokal hemat daya menggunakan STB bekas dan manajemen container.',
          content: 'Project ini bertujuan untuk memanfaatkan STB HG680P menjadi Home Server menggunakan CasaOS. Dengan konfigurasi ini, perangkat STB dapat diubah menjadi server lokal yang ringan, hemat daya, dan mudah diakses melalui antarmuka berbasis web untuk mengelola aplikasi maupun layanan server pribadi.',
          features: [
            'Flashing Armbian OS ringan pada hardware STB HG680P.',
            'Manajemen aplikasi berbasis Docker container dengan CasaOS.',
            'Akses server jarak jauh yang aman via SSH & Cloudflare Tunnel.',
            'Hemat daya listrik, stabil running 24/7 untuk layanan lokal.'
          ],
          tech_stack: ['SSH', 'Linux Server', 'CasaOS', 'Armbian', 'Docker'],
          thumbnail: '/assets/img/portfolio/Armbian1.webp',
          gallery: [
            '/assets/img/portfolio/Armbian1.webp',
            '/assets/img/portfolio/Armbian2.webp',
            '/assets/img/portfolio/Armbian3.webp'
          ],
          featured: true,
          status: 'published',
          order: 2
        },
        {
          title: 'Implementasi Infrastruktur Blog Berbasis Container pada Home Server',
          slug: 'self-hosted-blog',
          category: 'Cloud',
          client: 'Cyber Security Ethics Project - CCIT',
          date: 'Maret 2025',
          excerpt: 'Deployment infrastruktur web statis menggunakan Nginx, Docker, dan akses aman Cloudflare Tunnel.',
          content: 'Project ini bertujuan untuk mengimplementasikan blog self-hosted berbasis container pada STB HG680P menggunakan CasaOS. Dengan dukungan Cloudflare Tunnel, server lokal dapat diakses secara aman melalui domain publik ber-SSL tanpa perlu port forwarding atau IP publik statis.',
          features: [
            'Containerized web server Nginx menggunakan Docker.',
            'Cloudflare Tunnel untuk proteksi DDoS dan SSL publik gratis.',
            'Integrasi webhook otomatis untuk publikasi postingan.',
            'Monitoring performa server secara berkala.'
          ],
          tech_stack: ['Hosting', 'Cloudflare', 'SSL', 'Docker', 'HTML'],
          thumbnail: '/assets/img/portfolio/blog.png',
          gallery: [
            '/assets/img/portfolio/blog1.webp',
            '/assets/img/portfolio/blog2.webp',
            '/assets/img/portfolio/blog3.webp',
            '/assets/img/portfolio/blog4.webp'
          ],
          featured: true,
          status: 'published',
          live_url: 'https://blog.bgasrdy.my.id',
          order: 3
        },
        {
          title: 'Deploy Nextcloud pada Home Server dengan CasaOS dan Docker',
          slug: 'nextcloud-docker-server',
          category: 'Server',
          client: 'Self Project',
          date: 'Januari 2025',
          excerpt: 'Cloud storage pribadi mandiri dengan sinkronisasi multi-device berbasis Docker.',
          content: 'Sistem ini mengimplementasikan Nextcloud sebagai layanan cloud storage pribadi yang berjalan di atas Docker container dan dikelola melalui CasaOS. Server menggunakan perangkat mini PC hemat daya. Nextcloud memungkinkan sinkronisasi file, berbagi dokumen, kalender, dan kolaborasi secara aman di jaringan lokal maupun publik.',
          features: [
            'Penyimpanan cloud mandiri berkecepatan tinggi.',
            'Sinkronisasi file otomatis lintas perangkat (Android, Windows, iOS).',
            'Database terpisah MariaDB untuk efisiensi indeks file.',
            'Manajemen hak akses pengguna dan folder kolaborasi.'
          ],
          tech_stack: ['Cloud', 'Docker', 'CasaOS', 'Nextcloud', 'Server'],
          thumbnail: '/assets/img/portfolio/Nextcloud1.webp',
          gallery: [
            '/assets/img/portfolio/Nextcloud1.webp',
            '/assets/img/portfolio/Nextcloud2.webp',
            '/assets/img/portfolio/Nextcloud3.webp'
          ],
          featured: false,
          status: 'published',
          live_url: 'https://cloud.bgasrdy.my.id/',
          order: 4
        },
        {
          title: 'Implementasi Captive Portal Menggunakan Mikrotik pada Wifi Kos Griya Indah',
          slug: 'mikrotik-captive-portal',
          category: 'Network',
          client: 'Self Project',
          date: '2025',
          excerpt: 'Otentikasi akses internet berbasis Captive Portal, voucher, dan limitasi bandwidth di jaringan kos.',
          content: 'Project ini merancang topologi dan konfigurasi jaringan internet pada kos Griya Indah dengan mengimplementasikan Captive Portal berbasis MikroTik RouterOS. Sistem ini mengatur pembagian bandwidth dinamis (Simple Queue), isolasi jaringan tamu dan penghuni (VLAN), serta autentikasi login terpusat melalui Hotspot/PPPoE.',
          features: [
            'Custom Hotspot Login Page & Form Registrasi Mandiri (PPPoE/Hotspot).',
            'Bandwidth Management dinamis menggunakan MikroTik Simple Queue.',
            'Segmentasi jaringan dan firewall filter untuk mencegah akses ilegal.',
            'Pencatatan user aktif dan DHCP server lease management.'
          ],
          tech_stack: ['Mikrotik', 'RouterOS', 'Captive Portal', 'Hotspot', 'Networking'],
          thumbnail: '/assets/img/portfolio/Mikrotik1.webp',
          gallery: [
            '/assets/img/portfolio/Mikrotik1.webp',
            '/assets/img/portfolio/Mikrotik2.webp',
            '/assets/img/portfolio/Mikrotik3.webp',
            '/assets/img/portfolio/Mikrotik4.webp'
          ],
          featured: false,
          status: 'published',
          order: 5
        },
        {
          title: 'Simulasi Setup Owncloud pada Ubuntu Menggunakan VirtualBox',
          slug: 'owncloud-virtualbox',
          category: 'Server',
          client: 'Linux Server Configuration Project - CCIT',
          date: 'Januari 2025',
          excerpt: 'Konfigurasi OwnCloud sebagai layanan penyimpanan awan lokal dengan LAMP stack.',
          content: 'Project ini bertujuan untuk mengonfigurasi OwnCloud sebagai layanan penyimpanan awan pribadi pada Ubuntu Linux dengan web server Apache, PHP, dan MySQL. Melalui simulasi di VirtualBox, sistem diuji untuk berbagi file dan manajemen otentikasi user dalam jaringan virtual.',
          features: [
            'Konfigurasi LAMP Stack (Linux, Apache, MySQL, PHP).',
            'Manajemen direktori penyimpanan dan perizinan file Linux.',
            'Pengujian upload, download, dan sharing URL file via browser.',
            'Konfigurasi virtual network host-only dan bridge.'
          ],
          tech_stack: ['Linux', 'Ubuntu', 'Apache', 'MySQL', 'VirtualBox'],
          thumbnail: '/assets/img/portfolio/Owncloud.webp',
          gallery: [
            '/assets/img/portfolio/Owncloud.webp',
            '/assets/img/portfolio/Owncloud1.webp',
            '/assets/img/portfolio/Owncloud2.webp'
          ],
          featured: false,
          status: 'published',
          github_url: 'https://github.com/dryuxxinn/Owncloud_Server_Configuration',
          order: 6
        },
        {
          title: 'Instalasi dan Konfigurasi Wazuh untuk Monitoring Server',
          slug: 'wazuh-server-monitoring',
          category: 'Security',
          client: 'Cyber Analyst Project - CCIT',
          date: 'Januari 2025',
          excerpt: 'Deteksi serangan SQL Injection dan anomali server Apache via SIEM Wazuh.',
          content: 'Project ini membahas implementasi deteksi serangan SQL Injection dengan memanfaatkan Wazuh sebagai platform SIEM untuk melakukan monitoring log secara real-time. Melalui konfigurasi Wazuh agent dan server, sistem dapat mengidentifikasi upaya serangan berbasis SQLi pada Apache Web Server, menganalisis aktivitas mencurigakan, serta memberikan notifikasi alert otomatis.',
          features: [
            'Monitoring log real-time dari Apache Web Server.',
            'Penerapan rule-based detection khusus untuk serangan SQL Injection.',
            'Analisis korelasi log event dan audit status port.',
            'Dasbor visualisasi insiden keamanan siber.'
          ],
          tech_stack: ['SQL Injection', 'SIEM', 'Log Monitoring', 'Cyber Security', 'Wazuh'],
          thumbnail: '/assets/img/portfolio/Wazuh.webp',
          gallery: [
            '/assets/img/portfolio/Wazuh.webp',
            '/assets/img/portfolio/Wazuh 1.webp',
            '/assets/img/portfolio/Wazuh2.webp'
          ],
          featured: false,
          status: 'published',
          live_url: 'https://documentation.wazuh.com/',
          order: 7
        }
      ];

      await Project.bulkCreate(projects);
      console.log(`[SEED] ${projects.length} Proyek berhasil di-seed ke PostgreSQL.`);
    }

    // 4. Seed Certificates
    const certCount = await Certificate.count();
    if (certCount === 0) {
      const certificates = [
        {
          title: 'Internship Certificate',
          issuer: 'PT Krakatau Sarana Properti',
          category: 'Academic',
          image: '/assets/Certificate/Academic/Internship Certificate.webp'
        },
        {
          title: 'CyberOps Associate',
          issuer: 'Cisco',
          category: 'Academic',
          image: '/assets/Certificate/Academic/Cyberops.webp'
        },
        {
          title: 'AWS Cloud Practitioner Essentials',
          issuer: 'Dicoding',
          category: 'Academic',
          image: '/assets/Certificate/Academic/AWS Cloud Practitioner Essentials.webp'
        },
        {
          title: 'Basic DevOps',
          issuer: 'Dicoding',
          category: 'Academic',
          image: '/assets/Certificate/Academic/Basic DevOps.webp'
        },
        {
          title: 'Basic Python',
          issuer: 'Dicoding',
          category: 'Academic',
          image: '/assets/Certificate/Academic/Basic Python.webp'
        },
        {
          title: 'Cyber Security Dasar',
          issuer: 'Dicoding',
          category: 'Academic',
          image: '/assets/Certificate/Academic/Cyber Security Dasar.webp'
        },
        {
          title: 'Introduction To Cloud Computing',
          issuer: 'Dicoding',
          category: 'Academic',
          image: '/assets/Certificate/Academic/Introduction To Cloud Computing.webp'
        },
        {
          title: 'Ethical Hacker For Dummies',
          issuer: 'Academic',
          category: 'Academic',
          image: '/assets/Certificate/Academic/Ethical Hacker For Dummies.webp'
        },
        {
          title: 'Volunteer DevFest Depok 2024',
          issuer: 'Google Developer Group Depok',
          category: 'Volunteer',
          image: '/assets/Certificate/Volunteer/Volunteer DevFest Depok 2024.webp'
        },
        {
          title: 'Panitia Kombyte',
          issuer: 'Komandro',
          category: 'Volunteer',
          image: '/assets/Certificate/Volunteer/Panitia Kombyte.webp'
        },
        {
          title: 'Open House Komandro',
          issuer: 'Komandro',
          category: 'Volunteer',
          image: '/assets/Certificate/Volunteer/Open House Komandro.webp'
        },
        {
          title: 'Cyber Hygiene',
          issuer: 'Workshop',
          category: 'Workshop',
          image: '/assets/Certificate/Workshop/Cyber Hygiene.webp'
        },
        {
          title: 'Cyber Security Fundamental',
          issuer: 'Workshop',
          category: 'Workshop',
          image: '/assets/Certificate/Workshop/Cyber Security Fundamental.webp'
        },
        {
          title: 'Penetration Testing Basic PRACTICAL',
          issuer: 'Workshop',
          category: 'Workshop',
          image: '/assets/Certificate/Workshop/Penetration Testing Basic PRACTICAL.webp'
        },
        {
          title: 'Profesi dan Keahlian Cyber Security',
          issuer: 'Workshop',
          category: 'Workshop',
          image: '/assets/Certificate/Workshop/Profesi dan Keahlian Cyber Security.webp'
        }
      ];

      await Certificate.bulkCreate(certificates);
      console.log(`[SEED] ${certificates.length} Sertifikat berhasil di-seed ke PostgreSQL.`);
    }

    console.log('[SEED] Seluruh data PostgreSQL berhasil diinisialisasi!');
    process.exit(0);
  } catch (error) {
    console.error('[SEED ERROR]', error);
    process.exit(1);
  }
};

seedData();
