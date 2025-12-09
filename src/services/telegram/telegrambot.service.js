import axios from "axios";

const BOT_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;
const ADMIN_CHAT_ID = process.env.CHAT_ID;

class telegramService {
  async sendMessage(chatId, text, options = {}) {
    const res = await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text: text,
      parse_mode: "HTML",
      ...options,
    });
    return res.data;
  }
  catch(error) {
    console.error(
      "Telegram send message error:",
      error.response?.data || error.message
    );
    throw error;
  }

  // Gửi thông báo cho admin
  async notifyAdmin(message, options = {}) {
    if (!ADMIN_CHAT_ID) {
      console.error("ADMIN_CHAT_ID not set");
      return;
    }
    return this.sendMessage(ADMIN_CHAT_ID, message, options);
  }

  // Gửi thông báo bắt đầu
  async notifyStart() {
    const time = new Date().toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
    });
    return this.notifyAdmin(
      `🚀 <b>Hệ thống bắt đầu chạy</b>\n` +
        `⏰ Thời gian: ${time}\n` +
        `📊 Trạng thái: Đang xử lý...`
    );
  }

  // Gửi thông báo thành công
  async notifySuccess(details = {}) {
    const time = new Date().toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
    });
    const duration = details.duration ? `${details.duration}s` : "N/A";

    let message = `✅ <b>Hệ thống hoàn thành thành công</b>\n`;
    message += `⏰ Thời gian: ${time}\n`;
    message += `⏱ Thời gian xử lý: ${duration}\n`;

    if (details.processed) {
      message += `📦 Đã xử lý: ${details.processed} items\n`;
    }
    if (details.success) {
      message += `✅ Thành công: ${details.success}\n`;
    }
    if (details.failed) {
      message += `❌ Thất bại: ${details.failed}\n`;
    }
    if (details.message) {
      message += `\n📝 ${details.message}`;
    }

    return this.notifyAdmin(message);
  }

  // Gửi thông báo lỗi
  async notifyError(error, context = "") {
    const time = new Date().toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
    });
    const errorMessage = error.message || error.toString();

    let message = `❌ <b>Hệ thống gặp lỗi</b>\n`;
    message += `⏰ Thời gian: ${time}\n`;
    if (context) {
      message += `📍 Vị trí: ${context}\n`;
    }
    message += `\n⚠️ Lỗi: <code>${errorMessage}</code>`;

    return this.notifyAdmin(message);
  }

  // Gửi thông báo cảnh báo
  async notifyWarning(message, details = "") {
    const time = new Date().toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
    });

    let text = `⚠️ <b>Cảnh báo hệ thống</b>\n`;
    text += `⏰ Thời gian: ${time}\n`;
    text += `\n${message}`;
    if (details) {
      text += `\n\n📝 Chi tiết: ${details}`;
    }

    return this.notifyAdmin(text);
  }

  // Tạo menu commands
  async setCommands() {
    try {
      const commands = [
        { command: 'start', description: '🚀 Khởi động bot' },
        { command: 'run', description: '▶️ Chạy hàm main() ngay' },
        { command: 'status', description: '📊 Xem trạng thái hệ thống' },
        { command: 'help', description: '❓ Danh sách lệnh' }
      ];
      
      const response = await axios.post(`${TELEGRAM_API}/setMyCommands`, {
        commands: commands
      });
      return response.data;
    } catch (error) {
      console.error('Set commands error:', error.response?.data || error.message);
      throw error;
    }
  }

  async setWebhook(webhookUrl) {
    try {
      const response = await axios.post(`${TELEGRAM_API}/setWebhook`, {
        url: webhookUrl,
        drop_pending_updates: true,
      });
      return response.data;
    } catch (error) {
      console.error(
        "Set webhook error:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async getWebhookInfo() {
    try {
      const response = await axios.get(`${TELEGRAM_API}/getWebhookInfo`);
      return response.data;
    } catch (error) {
      console.error(
        "Get webhook info error:",
        error.response?.data || error.message
      );
      throw error;
    }
  }
}

export default new telegramService();
