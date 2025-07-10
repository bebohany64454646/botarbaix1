const mineflayer = require('mineflayer');

let bot = null;
let reconnectTimeout = null;

function startBot() {
  if (bot) return;

  bot = mineflayer.createBot({
    host: 'arabix.aternos.me',
    username: 'ArabixBot123', // اسم بسيط وآمن
    auth: 'offline',
    version: false
  });

  bot.on('login', () => {
    console.log('✅ دخل السيرفر');
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }
  });

  bot.on('spawn', () => {
    // يمكن تضيف حركات بسيطة هنا لو تحب
  });

  bot.on('end', () => {
    console.log('❌ تم فصل البوت');
    bot = null;
    if (!reconnectTimeout) {
      reconnectTimeout = setTimeout(() => {
        reconnectTimeout = null;
        startBot();
      }, 5000);
    }
  });

  bot.on('error', err => {
    console.log('⚠️ خطأ:', err.message);
  });

  bot.on('kicked', reason => {
    console.log('🚫 تم طرد البوت:', reason);
  });
}

startBot();
