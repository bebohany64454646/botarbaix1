const mineflayer = require('mineflayer');

function createBot() {
  const bot = mineflayer.createBot({
    host: 'arabix.aternos.me',
    username: 'ArabixBot123',
    auth: 'offline',
    version: false
  });

  // قائمة الشتائم
  const swears = [
    'احا', 'يلعن', 'كلب', 'غبي', 'fuck', 'shit', 'bitch',
    'حمار', 'وسخ', 'زفت', 'منيك', 'انيك', 'قذر', 'شرموط',
    'كس', 'كسمك', 'ابن الكلب', 'حيوان'
  ];

  // تحيات وردود
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

  // عدد الشتائم لكل لاعب
  const warnings = {};
  const muted = new Set(); // اللاعبين الممنوعين من الكتابة

  // التحكم بالحركة
  let movingForward = true;
  let moveTicks = 0;
  const moveLimit = 5; // عدد الخطوات لكل اتجاه

  // عند الدخول
  bot.once('spawn', () => {
    console.log('✅ البوت دخل السيرفر وجاهز');

    // حركة مستمرة للأمام والخلف
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

  // ترحيب باللاعبين
  bot.on('playerJoined', (player) => {
    if (player.username !== bot.username) {
      bot.chat(`🎉 أهلًا وسهلًا @${player.username}! نتمنى لك وقتًا ممتعًا في سيرفرنا 💎`);
    }
  });

  // فلترة الدردشة
  bot.on('chat', (username, message) => {
    if (username === bot.username) return;

    const msg = message.toLowerCase();

    // إذا اللاعب ميوت، تجاهل كلامه
    if (muted.has(username)) return;

    // شتائم؟
    if (swears.some(word => msg.includes(word))) {
      warnings[username] = (warnings[username] || 0) + 1;

      if (warnings[username] >= 3) {
        muted.add(username);
        bot.chat(`⛔ @${username} تم كتمك بعد تكرار الألفاظ المسيئة.`);
      } else {
        const remaining = 3 - warnings[username];
        bot.chat(`⚠️ @${username} الرجاء عدم استخدام ألفاظ مسيئة. (${remaining} تحذير متبقٍ قبل الميوت)`);
      }

      return;
    }

    // تحية؟
    for (const key in greetings) {
      if (msg.includes(key)) {
        bot.chat(`💬 @${username} ${greetings[key]}`);
        return;
      }
    }
  });

  // إذا حصل خطأ
  bot.on('error', err => {
    console.log('⚠️ خطأ:', err.message);
  });

  // إذا طُرد أو خرج يعيد الاتصال
  bot.on('end', () => {
    console.log('❌ تم طرد البوت، سيحاول الدخول مجددًا خلال 5 ثوانٍ...');
    setTimeout(createBot, 5000); // إعادة تشغيل
  });
}

// شغل البوت أول مرة
createBot();
