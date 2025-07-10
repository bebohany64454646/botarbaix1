const mineflayer = require('mineflayer');
const fs = require('fs');

const POINTS_FILE = 'points.json';
let points = fs.existsSync(POINTS_FILE) ? JSON.parse(fs.readFileSync(POINTS_FILE)) : {};

let bot = null;
let reconnectTimeout = null;

function savePoints() {
  fs.writeFileSync(POINTS_FILE, JSON.stringify(points, null, 2));
}

function startBot() {
  if (bot) {
    console.log('⚠️ البوت شغال بالفعل، لن يتم تشغيله مرتين');
    return;
  }

  bot = mineflayer.createBot({
    host: 'arabix.aternos.me',
    username: 'ArabixBot123', // اسم نظيف بدون رموز
    auth: 'offline',
    version: false
  });

  bot.on('login', () => {
    console.log('✅ البوت دخل السيرفر');
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }
    bot.chat('🤖 | ArabixBot أونلاين!');
  });

  bot.on('spawn', () => {
    // منع الطرد بالقفز والتسلل
    bot.setControlState('sneak', true);
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 400);
    }, 10000);
  });

  bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    const msg = message.toLowerCase();

    // كلمات الشتايم الشائعة
    const swears = [
      'احا', 'يلعن', 'كلب', 'غبي', 'fuck', 'shit', 'bitch', 'حمار', 'وسخ', 
      'زفت', 'منيك', 'انيك', 'قذر', 'شرموط', 'كس', 'يلعن', 'كسمك'
    ];

    // إضافة النقاط لكل لاعب
    if (!points[username]) points[username] = 0;
    points[username]++;
    savePoints();

    // فلتر الشتايم داخل النص
    if (swears.some(swear => msg.includes(swear))) {
      bot.chat(`🚫 | @${username} الرجاء عدم استخدام ألفاظ مسيئة!`);
      return;
    }

    // أوامر النقاط
    if (msg === '/points') {
      bot.chat(`🎯 | @${username} نقاطك: ${points[username]} نقطة`);
      return;
    }

    if (msg === '/top') {
      const top = Object.entries(points)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name, pts], i) => `#${i + 1} ${name}: ${pts} نقطة`)
        .join(' | ');
      bot.chat(`🏆 | أفضل اللاعبين: ${top}`);
      return;
    }

    // ردود التحية
    const greetings = ['hi','hello','hey','هاي','هلا','هلا والله','السلام عليكم','gg','باك','رجعت','morning','صباح الخير','مساء الخير','wb','welcome back'];
    const replies = ['🌟 ياهلا!','✨ منور السيرفر','👋 أهلا وسهلا','😄 مرحباً بك','💫 welcome back','🤩 نورت','💪 كيفك؟'];

    if (greetings.some(greet => msg.includes(greet))) {
      const reply = replies[Math.floor(Math.random() * replies.length)];
      bot.chat(`💬 | @${username} ${reply}`);
      return;
    }

    // ردود ذكية بسيطة
    if (msg.includes('ميت') || msg.includes('جوعان') || msg.includes('زهقان')) {
      bot.chat(`😅 | @${username} محتاج تلعب شوية، جرب تستكشف أو تصنع شيء جديد!`);
      return;
    }

    if (msg.includes('ضعت') || msg.includes('فين') || msg.includes('وين')) {
      bot.chat(`🧭 | @${username} حاول تستخدم /sethome أو اطلب مساعدة من اللاعبين.`);
      return;
    }

    if (msg.includes('?') || msg.includes('؟') || msg.startsWith('كيف') || msg.startsWith('ليش')) {
      bot.chat(`🤖 | @${username} سؤال ممتاز! اسأل أصحابك كمان 😉`);
      return;
    }
  });

  bot.on('playerJoined', (player) => {
    if (player.username !== bot.username) {
      bot.chat(`🎉 | أهلاً @${player.username} في سيرفر Arabix!`);
    }
  });

  bot.on('kicked', reason => {
    console.log('🚫 طُرد البوت:', reason);
  });

  bot.on('error', err => {
    console.log('⚠️ خطأ:', err.message);
  });

  bot.on('end', () => {
    console.log('❌ تم فصل البوت من السيرفر');
    bot = null;
    if (!reconnectTimeout) {
      reconnectTimeout = setTimeout(() => {
        reconnectTimeout = null;
        startBot();
      }, 5000);
    }
  });
}

startBot();
