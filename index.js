const mineflayer = require('mineflayer');

const bot = mineflayer.createBot({
  host: 'arabix.aternos.me', // غيّرها لسيرفرك
  username: 'ArabixBot123',    // اسم نظيف بدون رموز
  auth: 'offline',
  version: false
});

let movingForward = true;
let distanceMoved = 0;
const stepDistance = 5; // عدد البلوكات اللي يتحركها في كل اتجاه

bot.once('spawn', () => {
  console.log('✅ البوت دخل السيرفر');

  // تحكم بالحركة كل 500 مللي ثانية (0.5 ثانية)
  setInterval(() => {
    if (movingForward) {
      bot.setControlState('forward', true);
      bot.setControlState('back', false);
    } else {
      bot.setControlState('forward', false);
      bot.setControlState('back', true);
    }

    distanceMoved++;

    if (distanceMoved >= stepDistance * 2) {
      distanceMoved = 0;
      movingForward = !movingForward; // غيّر الاتجاه
    }
  }, 500);
});

bot.on('error', err => {
  console.log('⚠️ خطأ:', err.message);
});

bot.on('end', () => {
  console.log('❌ تم فصل البوت، يحاول إعادة الاتصال بعد 5 ثوانٍ');
  setTimeout(() => {
    bot.quit();
    process.exit(); // أغلق العملية - ممكن تعدلها حسب الحاجة
  }, 5000);
});
