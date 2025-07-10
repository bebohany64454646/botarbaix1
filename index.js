const mineflayer = require('mineflayer');

const bot = mineflayer.createBot({
  host: 'arabix.aternos.me',
  username: 'ArabixBot123', // اسم نظيف
  auth: 'offline',
  version: false
});

bot.on('login', () => {
  console.log('✅ البوت دخل السيرفر');
});

bot.on('spawn', () => {
  console.log('🚀 البوت جاهز للعمل داخل السيرفر');
});

bot.on('kicked', reason => {
  console.log('🚫 تم طرد البوت:', reason);
});

bot.on('end', () => {
  console.log('❌ تم فصل البوت - لن يعيد الدخول تلقائيًا');
});

bot.on('error', err => {
  console.log('⚠️ خطأ:', err.message);
});
