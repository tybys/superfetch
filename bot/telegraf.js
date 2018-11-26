const Telegraf = require('telegraf')

//const bot = new Telegraf(process.env.BOT_TOKEN)
const bot = new Telegraf('703247972:AAEawkW_j-e2frFjGj6KeBKIZRqqBBY2Fj0');
bot.start((ctx) => ctx.reply('Welcome!'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.startPolling();