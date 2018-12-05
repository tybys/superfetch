const bot = require('../bot');
const Dribbble = require('../models/dribbble');
const Awwwards = require('../models/awwwards');
const Behance = require('../models/behance');
const Uplabs = require('../models/uplabs');
const cron = require('node-cron');

const Nexmo = require('nexmo')
var schedule = require('node-schedule');

/*const tasks = [
  {name: "dribbble", mask: "* * 10-23 * * *", process: dribbbleJob},
  {name: "uplabs", mask: "* * 10-23 * * *", process: uplabsJob},
  {name: "uplabs", mask: "* 30 14 * * *", process: awwwardsJob}
];*/

const tasks = [
  {name: "dribbble", mask: "10 * 10-23 * * *", process: one},
  {name: "uplabs", mask: "20 * 10-23 * * *", process: two},
  {name: "uplabs", mask: "0 30 14 * * *", process: three}
];

function dribbbleJob() {
  try {
    new Dribbble();
  } catch (e) {
    bot.sendMessage(process.env.BOTID, 'Проблемы с Дриблом!');
    throw e;
  }
}
function awwwardsJob() {
  try {
    new Awwwards();
  } catch (e) {
    bot.sendMessage(process.env.BOTID, 'Проблемы с Эвордс!');
    throw e;
  }
}
function uplabsJob() {
  try {
    new Uplabs();
  } catch (e) {
    bot.sendMessage(process.env.BOTID, 'Проблемы с Аплабс!');
    throw e;
  }
}

function one() {
  console.log('every 10s\none')
}
function two() {
  console.log('every 20s\ntwo')
}
function three() {
  console.log('once time\nthree')
}

/**
 * Start all tasks
 */
bot.onText(/\/startall/, (msg, match) => {
  tasks.forEach(task => {
    schedule.scheduleJob(task.mask, task.process)
  });
});
/**
 * Stop all tasks
 */
bot.onText(/\/stopall/, (msg, match) => {

});
/**
 * Start only Dribbble
 * each hour between 10am-22pm
 */
bot.onText(/\/dribbble/, (msg, match) => {

});
/**
 * Start only Awwwards
 * each day at 12am
 */
bot.onText(/\/awwwards/, (msg, match) => {

});
/**
 * Start only Uplabs
 * each hour between 10am-22pm
 */
bot.onText(/\/uplabs/, (msg, match) => {

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

//new Dribbble();
//new Awwwards();
// new Behance();
//new Uplabs();


/*
const nexmo = new Nexmo({
  apiKey: process.env.NEXMOAPIKEY,
  apiSecret: process.env.NEXMOSECRET
});

nexmo.message.sendSms('multifetch', '', text)*/