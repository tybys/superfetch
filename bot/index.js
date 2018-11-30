// TODO: подумать о — awwwards Site of the day, отсылать альбомом с ссылкой на работу

const bot = require('../bot');
const Dribbble = require('../models/dribbble');
const Awwwards = require('../models/awwwards');
const Behance = require('../models/behance');
const Uplabs = require('../models/uplabs');

var CronJob = require('cron').CronJob;

/**
 * Start all CRON jobs
 */
bot.onText(/\/startall/, (msg, match) => {

});
/**
 * Stop all CRON jobs
 */
bot.onText(/\/stopall/, (msg, match) => {

});
/**
 * Start only Dribbble
 * each hour between 10am-22pm
 */
bot.onText(/\/dribbble/, (msg, match) => {
  new CronJob('*/1 * * * *', function() {
    //console.log('You will see this message every second');
    new Dribbble();
  }, null, true, 'Europe/Moscow');
});
/**
 * Start only Awwwards
 * each day at 12am
 */
bot.onText(/\/awwwards/, (msg, match) => {
  new CronJob('*/2 * * * *', function() {
    //console.log('You will see this message every second');
    new Awwwards();
  }, null, true, 'Europe/Moscow');
});
/**
 * Start only Uplabs
 * each hour between 10am-22pm
 */
bot.onText(/\/uplabs/, (msg, match) => {
  new CronJob('*/1 * * * *', function() {
    //console.log('You will see this message every second');
    new Uplabs();
  }, null, true, 'Europe/Moscow');
});

bot.onText(/\/start/, (msg, match) => {
  //bot.sendMessage(msg.chat.id, 'dribbble fetching started');
});
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Received your message');
});

// new Dribbble();
//new Awwwards();
// new Behance();
//new Uplabs();

