const axios = require('axios');

class MikrotikService {
  constructor() {
    this.host = process.env.MIKROTIK_HOST || '192.168.88.1';
    this.user = process.env.MIKROTIK_USER || 'admin';
    this.password = process.env.MIKROTIK_PASSWORD || '';
    this.apiPort = process.env.MIKROTIK_REST_PORT || 80;
  }

  // Sync to MikroTik Hotspot User (RouterOS v7 REST API)
  async syncHotspotUser({ username, password, profile = 'default', comment = 'Registered via Port-Sin' }) {
    if (!process.env.MIKROTIK_HOST || process.env.MIKROTIK_HOST === '192.168.88.1') {
      console.log(`[MIKROTIK MOCK] Hotspot user "${username}" disimulasikan sukses disinkronkan ke MikroTik.`);
      return { success: true, simulated: true, message: 'User berhasil dicatat (Mode Simulasi MikroTik Aktif).' };
    }

    try {
      const url = `http://${this.host}:${this.apiPort}/rest/ip/hotspot/user`;
      const response = await axios.put(
        url,
        {
          name: username,
          password: password,
          profile: profile,
          comment: comment
        },
        {
          auth: {
            username: this.user,
            password: this.password
          },
          timeout: 5000
        }
      );
      return { success: true, data: response.data, message: 'Berhasil sync ke RouterOS Hotspot' };
    } catch (error) {
      console.error('[MIKROTIK ERROR]', error.response?.data || error.message);
      return { success: false, error: error.response?.data?.detail || error.message };
    }
  }

  // Sync to MikroTik PPPoE Secret
  async syncPppoeSecret({ username, password, profile = 'default', service = 'pppoe', comment = 'Registered via Port-Sin' }) {
    if (!process.env.MIKROTIK_HOST || process.env.MIKROTIK_HOST === '192.168.88.1') {
      console.log(`[MIKROTIK MOCK] PPPoE secret "${username}" disimulasikan sukses disinkronkan ke MikroTik.`);
      return { success: true, simulated: true, message: 'User PPPoE berhasil dicatat (Mode Simulasi MikroTik Aktif).' };
    }

    try {
      const url = `http://${this.host}:${this.apiPort}/rest/ppp/secret`;
      const response = await axios.put(
        url,
        {
          name: username,
          password: password,
          profile: profile,
          service: service,
          comment: comment
        },
        {
          auth: {
            username: this.user,
            password: this.password
          },
          timeout: 5000
        }
      );
      return { success: true, data: response.data, message: 'Berhasil sync ke RouterOS PPP Secret' };
    } catch (error) {
      console.error('[MIKROTIK ERROR]', error.response?.data || error.message);
      return { success: false, error: error.response?.data?.detail || error.message };
    }
  }
}

module.exports = new MikrotikService();

