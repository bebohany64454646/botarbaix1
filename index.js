const mineflayer = require('mineflayer');

const bot = mineflayer.createBot({
  host: 'arabix.aternos.me',  // غيّر حسب سيرفرك
  username: 'ArabixBot123',    // اسم نظيف
  auth: 'offline',
  version: false
});

// كلمات شتائم شاملة (تقدر تزيد أو تعدل حسب الحاجة)
const swears = [
  'احا', 'يلعن', 'كلب', 'غبي', 'fuck', 'shit', 'bitch',
  'حمار', 'وسخ', 'زفت', 'منيك', 'انيك', 'قذر', 'شرموط',
  'كس', 'يلعن', 'كسمك', 'ابن الكلب', 'حيوان'
];

// تحيات شائعة مع ردودها
const greetings = {
  'هاي': '🌟 أهلًا وسهلًا بك!',
  'هلا': '✨ نور السيرفر بوجودك!',
  'هلا والله': '👋 ياهلا فيك!',
  'مرحبا': '😄 مرحبًا بك في عالمنا!',
  'سلام': '☀️ السلام عليك ورحمة الله!',
  'باي': '👋 مع السلامة ونراك قريبًا!',
  'ياهلا': '💫 نورتنا والله!',
  'الف مبروك': '🎉 ألف مبروك لك! 🎊',
  'باك': '🎉 مرحبًا بعودتك!',
  'رجعت': '🤗 رجعت وعزتنا زادت!'
};

let movingForward = true;
let moveTicks = 0;
const moveLimit = 10; // عدد خطوات الحركة للأمام أو الخلف

bot.once('spawn', () => {
  console.log('✅ البوت دخل السيرفر وجاهز');

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
      movingForward = !movingForward;
    }
  }, 500);
});

// ترحيب عند دخول لاعب جديد
bot.on('playerJoined', (player) => {
  if (player.username !== bot.username) {
    bot.chat(`🎉 أهلًا وسهلًا @${player.username}! نتمنى لك وقت ممتع في سيرفرنا.`);
  }
});

bot.on('chat', (username, message) => {
  if (username === bot.username) return; // تجاهل رسائل البوت نفسه

  const msg = message.toLowerCase();

  // فلتر شتائم: إذا وجد أي كلمة من الكلمات في الرسالة
  if (swears.some(swear => msg.includes(swear))) {
    bot.chat(`⚠️ @${username} الرجاء الالتزام بالأدب وعدم استخدام كلمات مسيئة، هذا تحذير!`);
    return;
  }

  // الرد على تحيات شائعة
  for (const greet in greetings) {
    if (msg.includes(greet)) {
      bot.chat(`💬 @${username} ${greetings[greet]}`);
      return;
    }
  }
});

bot.on('end', () => {
  console.log('❌ تم فصل البوت، لن يعيد الدخول تلقائيًا');
});

bot.on('error', (err) => {
  console.log('⚠️ خطأ:', err.message);
});
