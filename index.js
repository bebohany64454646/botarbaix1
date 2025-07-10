const mineflayer = require('mineflayer');

let bot;

function startBot() {
  bot = mineflayer.createBot({
    host: 'arabix.aternos.me',  // غيّرها لسيرفرك
    username: 'ArabixBot1235',    // اسم نظيف بدون رموز ومسافات
    auth: 'offline',             // إذا السيرفر offline mode، غيرها حسب نوع السيرفر
    version: false               // يخلي المكتبة تحدد النسخة تلقائيًا
  });

  bot.on('login', () => {
    console.log('✅ تم الدخول للسيرفر بنجاح');
  });

  bot.on('spawn', () => {
    console.log('🚀 البوت جاهز الآن داخل السيرفر');
  });

  bot.on('end', () => {
    console.log('❌ تم فصل البوت. إعادة المحاولة خلال 5 ثواني...');
    setTimeout(() => {
      startBot();
    }, 5000);
  });

  bot.on('error', (err) => {
    console.log('⚠️ خطأ:', err.message);
  });

  bot.on('kicked', (reason) => {
    console.log('🚫 تم طرد البوت من السيرفر:', reason);
  });
}

startBot();
