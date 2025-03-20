const cron = require('node-cron');
const reminderService = require('./reminderService');

// Khởi tạo các cron job
const initCronJobs = () => {
    // Chạy mỗi ngày vào lúc 8h sáng (gửi nhắc nhở cho lịch hẹn ngày hôm sau)
    cron.schedule('0 8 * * *', async () => {
        console.log('Đang chạy cron job gửi nhắc nhở lịch hẹn...');
        try {
            const sentCount = await reminderService.sendDailyReminders();
            console.log(`Đã gửi ${sentCount} email nhắc nhở lịch hẹn`);
        } catch (error) {
            console.error('Lỗi khi chạy cron job gửi nhắc nhở:', error);
        }
    });

    console.log('Đã khởi tạo cron jobs');
};

module.exports = { initCronJobs };