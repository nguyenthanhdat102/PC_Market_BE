import telegramService from "../services/telegram/telegrambot.service.js";
import mainService from "../services/main/main.service.js";

class TelegramControler {
  // khởi tạo contructor fix lỗi this không trỏ về TelegramControler
  constructor() {
    this.handleWebhook = this.handleWebhook.bind(this);
    this.handleStartCommand = this.handleStartCommand.bind(this);
    this.handleRunCommand = this.handleRunCommand.bind(this);
    this.handleStatusCommand = this.handleStatusCommand.bind(this);
    this.handleHelpCommand = this.handleHelpCommand.bind(this);
    this.setupCommands = this.setupCommands.bind(this);
    this.setupWebhook = this.setupWebhook.bind(this);
    this.getWebhookInfo = this.getWebhookInfo.bind(this);
  }

  async handleWebhook(req, res) {
    try {
      const { message } = req.body;
      if (message?.text) {
        const chatId = message.chat.id;
        const text = message.text.trim();
        const username = message.from.username || message.from.first_name;

        console.log(`Message from ${username} (${chatId}): ${text}`);

        // Chỉ admin mới có thể điều khiển
        const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;
        if (ADMIN_CHAT_ID && chatId.toString() !== ADMIN_CHAT_ID.toString()) {
          await telegramService.sendMessage(
            chatId,
            "⛔ Bạn không có quyền sử dụng bot này."
          );
          return res.status(200).json({ ok: true });
        }

        // Xử lý commands
        switch (text) {
          case "/start":
            await this.handleStartCommand(chatId);
            break;

          case "/run":
            await this.handleRunCommand(chatId);
            break;

          case "/status":
            await this.handleStatusCommand(chatId);
            break;

          case "/help":
            await this.handleHelpCommand(chatId);
            break;

          default:
            await telegramService.sendMessage(
              chatId,
              "❓ Lệnh không hợp lệ. Gửi /help để xem danh sách lệnh."
            );
        }
      }

      return res.status(200).json({ ok: true });
    } catch (error) {
      console.error("Webhook handler error:", error.message);
      return res.status(200).json({ ok: true });
    }
  }

  async handleStartCommand(chatId) {
    await telegramService.sendMessage(
      chatId,
      `👋 <b>Xin chào! Bot quản lý hệ thống</b>\n\n` +
        `🤖 Bot này giúp bạn:\n` +
        `• Theo dõi trạng thái hệ thống\n` +
        `• Chạy hàm main() thủ công\n` +
        `• Nhận thông báo tự động\n\n` +
        `📝 Gửi /help để xem danh sách lệnh`
    );
  }

  async handleRunCommand(chatId) {
    try {
      await telegramService.sendMessage(chatId, "⏳ Đang chạy hàm main()...");

      // Chạy hàm main trong background
      mainService.main().catch((err) => {
        console.error("Main service error:", err);
      });

      await telegramService.sendMessage(
        chatId,
        "✅ Đã bắt đầu chạy! Bạn sẽ nhận được thông báo khi hoàn thành."
      );
    } catch (error) {
      await telegramService.sendMessage(
        chatId,
        `❌ Lỗi khi chạy: ${error.message}`
      );
    }
  }
  async handleStatusCommand(chatId) {
    const time = new Date().toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
    });

    await telegramService.sendMessage(
      chatId,
      `📊 <b>Trạng thái hệ thống</b>\n\n` +
        `⏰ Thời gian hiện tại: ${time}\n` +
        `✅ Bot đang hoạt động bình thường\n` +
        `🔄 Cron job: Chạy tự động lúc 1h sáng hàng ngày\n\n` +
        `💡 Gửi /run để chạy thủ công`
    );
  }

  async handleHelpCommand(chatId) {
    await telegramService.sendMessage(
      chatId,
      `📖 <b>Danh sách lệnh</b>\n\n` +
        `/start - Khởi động bot\n` +
        `/run - Chạy hàm main() ngay lập tức\n` +
        `/status - Xem trạng thái hệ thống\n` +
        `/help - Xem danh sách lệnh\n\n` +
        `ℹ️ Bot sẽ tự động chạy lúc 1h sáng hàng ngày`
    );
  }

  async setupCommands(req, res) {
    try {
      const result = await telegramService.setCommands();
      
      return res.json({
        success: true,
        message: 'Bot commands menu đã được cập nhật',
        result: result
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async setupWebhook(req, res) {
    try {
      const baseUrl = process.env.PUBLIC_URL
        ? `https://${process.env.PUBLIC_URL}`
        : `https://${req.get("host")}`;

      const webhookUrl = `${baseUrl}/api/telegram/webhook`;
      const result = await telegramService.setWebhook(webhookUrl);
      // Set bot commands menu
      const commandsResult = await telegramService.setCommands();

      return res.json({
        success: true,
        webhook_url: webhookUrl,
        result: result,
        commands_result: commandsResult
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getWebhookInfo(req, res) {
    try {
      const info = await telegramService.getWebhookInfo();
      return res.json(info);
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }
}
export default new TelegramControler();
