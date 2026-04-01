require('dotenv').config();
const app = require('./src/app');
const { startReminderJob } = require('./src/jobs/reminderJob');

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Aurelia API running on http://localhost:${port}`);
  startReminderJob();
});
