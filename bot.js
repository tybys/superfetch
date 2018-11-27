require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');
const Agent = require('socks5-https-client/lib/Agent');

//const token = process.env.TOKEN;
const socksConfig = {
  host: `${process.env.SOCKSHOST}`,
  port: parseInt(process.env.SOCKSPORT),
  user: `${process.env.SOCKSUSERNAME}`,
  pass: `${process.env.SOCKSPASSWORD}`
};
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(`${process.env.TOKEN}`, {
  polling: true,
  request: {
    agentClass: Agent,
    agentOptions: {
      socksHost: socksConfig.host,
      socksPort: socksConfig.port,
      socksUsername: socksConfig.user,
      socksPassword: socksConfig.pass
    }
  }
});

module.exports = bot;