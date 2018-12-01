// TODO: подумать о — awwwards Site of the day, отсылать альбомом с ссылкой на работу

const bot = require('../bot');
const Dribbble = require('../models/dribbble');
const Awwwards = require('../models/awwwards');
const Behance = require('../models/behance');
const Uplabs = require('../models/uplabs');
const cron = require('node-cron');

const Nexmo = require('nexmo')

const tasks = [
 // {id: "Test", mask: "* * * * * *", process: sendMessage, pid: null},
  {id: "Dribbble", mask: "*/2 * * * *", process: dribbbleJob, pid: null},
  {id: "Awwwards", mask: "*/1 * * * *", process: awwwardsJob, pid: null},
  {id: "Uplabs", mask: "*/3 * * * *", process: uplabsJob, pid: null}
];

function sendMessage() {
  console.log("Message was send...");
}
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

/**
 * Start all CRON jobs
 */
bot.onText(/\/startall/, (msg, match) => {
  tasks.forEach(task => {
    console.log("Lunching: " + task.id + " (" + task.mask + ")");
    task.pid = cron.schedule(task.mask, task.process, { scheduled: true });
    task.pid.start();
  });
});
/**
 * Stop all CRON jobs
 */
bot.onText(/\/stopall/, (msg, match) => {
  tasks.forEach(task => {
    //console.log("Lunching: " + task.id + " (" + task.mask + ")");
    //task.pid = cron.schedule(task.mask, task.process, { scheduled: true });
    task.pid.stop();
  });
});
/**
 * Start only Dribbble
 * each hour between 10am-22pm
 */
bot.onText(/\/dribbble/, (msg, match) => {
  //tasks[0].pid = cron.schedule(tasks[0].mask, tasks[0].process, { scheduled: true })
  /*cron.schedule(tasks.id['Dribbble'], () => {
    console.log('running a task every minute');
  });*/
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

// new Dribbble();
//new Awwwards();
// new Behance();
//new Uplabs();


/*
const nexmo = new Nexmo({
  apiKey: process.env.NEXMOAPIKEY,
  apiSecret: process.env.NEXMOSECRET
});

nexmo.message.sendSms('multifetch', '', text)*/