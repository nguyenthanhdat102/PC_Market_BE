import mainService from '../services/main/main.service.js';

class CronController {
  // Endpoint cho Vercel Cron
  async runScheduledTask(req, res) {
    try {
      console.log("🕐 Cron job triggered");

      // Chạy main function trong background
      await mainService.main().catch((err) => {
        console.error("Scheduled task error:", err);
      });

      return res.status(200).json({
        success: true,
        message: "Cron job started",
        time: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Cron controller error:", error);
      return res.status(500).json({
        error: error.message,
      });
    }
  }

  // Endpoint để test thủ công
  async runManualTask(req, res) {
    try {
      console.log("👨‍💻 Manual task triggered");

      // Chạy main function
      const result = await mainService.main();

      return res.status(200).json({
        success: true,
        message: "Task completed",
        result: result,
      });
    } catch (error) {
      console.error("Manual task error:", error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

export default new CronController()
