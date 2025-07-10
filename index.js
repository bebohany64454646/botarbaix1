const mineflayer = require('mineflayer');

const bot = mineflayer.createBot({
  host: 'arabix.aternos.me', // غيرها لسيرفرك
  username: 'ArabixBot123',    // اسم نظيف وبسيط
  auth: 'offline',
  version: false
});

let movingForward = true;
let moveTicks = 0;
const moveLimit = 10; // 10 خطوات = 5 ثواني * 2 (قد تختلف حسب سرعة البوت)

bot.once('spawn', () => {
  console.log('✅ البوت دخل السيرفر وجاهز');

  // نستخدم setInterval للحركة بشكل مستمر
  setInterval(() => {
    if (movingForward) {
      bot.setControlState('forward', true);
      bot.setControlState('back', false);
    } else {
      bot.setControlState('forward', false);
      bot.setControlState('back', true);
    }

    moveTicks++;

    if (moveTicks >= moveLimit) {
      moveTicks = 0;
      movingForward = !movingForward; // قلب الاتجاه
    }
  }, 500); // كل نصف ثانية تتحرك
});

bot.on('end', () => {
  console.log('❌ تم فصل البوت، لن يعيد الدخول');
});

bot.on('error', err => {
  console.log('⚠️ خطأ:', err.message);
});
