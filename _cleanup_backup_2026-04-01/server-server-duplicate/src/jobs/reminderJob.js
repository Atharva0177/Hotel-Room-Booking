const cron = require('node-cron');

const startReminderJob = () => {
  cron.schedule('0 9 * * *', () => {
    console.log('Running booking reminder cron job');
  });
};

module.exports = { startReminderJob };
