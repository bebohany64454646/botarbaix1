const mineflayer = require('mineflayer');
const fs = require('fs');

const POINTS_FILE = 'points.json';
let points = fs.existsSync(POINTS_FILE) ? JSON.parse(fs.readFileSync(POINTS_FILE)) : {};
let isBotOnline = false;

function savePoints() {
  fs.writeFileSync(POINTS_FILE, JSON.stringify(points, null, 2));
}

function createBot() {
  if (isBotOnline) return;

  const bot = mineflayer.createBot({
    host: 'arabix.aternos.me',
    username: 'ArabixBot123', // ✅ اسم نظيف بدون رموز
    auth: 'offline',
    version: false
  });

  bot.on('login', () => {
    isBotOnline = true;
    console.log('✅ تم دخول البوت');
    bot.chat('🤖 | ArabixBot أونلاين!');
  });

  bot.on('spawn', () => {
    // 🔒 منع الطرد بالقفز والتسلل
    bot.setControlState('sneak', true);
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 400);
    }, 10000);
  });

  bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    const msg = message.toLowerCase();

    // 🎯 نظام النقاط
    if (!points[username]) points[username] = 0;
    points[username]++;
    savePoints();

    if (msg === '/points') {
      bot.chat(`🎯 | @${username} نقاطك: ${points[username]} نقطة`);
    }

    if (msg === '/top') {
      const top = Object.entries(points)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name, pts], i) => `#${i + 1} ${name}: ${pts} نقطة`)
        .join(' | ');
      bot.chat(`🏆 | أفضل اللاعبين: ${top}`);
    }

    // 👋 تحيات وردود
    const greetings = ['hi','hello','hey','هاي','هلا','هلا والله','السلام عليكم','gg','باك','رجعت','morning','صباح الخير','مساء الخير','wb','welcome back'];
    const replies = ['🌟 ياهلا!','✨ منور السيرفر','👋 أهلا وسهلا','😄 مرحباً بك','💫 welcome back','🤩 نورت','💪 كيفك؟'];
    if (greetings.includes(msg)) {
      const reply = replies[Math.floor(Math.random() * replies.length)];
      bot.chat(`💬 | @${username} ${reply}`);
    }

    // 🚫 فلتر الشتايم
    const swears = ['كلب','غبي','fuck','shit','bitch','حمار','وسخ','زفت','منيك','انيك','قذر','شرموط','كس','يلعن','كسمك'];
    if (swears.some(w => msg.includes(w))) {
      bot.chat(`🚫 | @${username} الرجاء عدم استخدام ألفاظ مسيئة!`);
    }

    // 🤖 ردود ذكية
    if (msg.includes('ميت') || msg.includes('جوعان') || msg.includes('زهقان')) {
      bot.chat(`😅 | @${username} محتاج تلعب شوية، جرب تستكشف أو تصنع شيء جديد!`);
    }
    if (msg.includes('ضعت') || msg.includes('فين') || msg.includes('وين')) {
      bot.chat(`🧭 | @${username} حاول تستخدم /sethome أو اطلب مساعدة من اللاعبين.`);
    }
    if (msg.includes('?') || msg.includes('؟') || msg.startsWith('كيف') || msg.startsWith('ليش')) {
      bot.chat(`🤖 | @${username} سؤال ممتاز! اسأل أصحابك كمان 😉`);
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
    isBotOnline = false;
    console.log('❌ تم فصل البوت. إعادة الاتصال بعد 5 ثوانٍ...');
    setTimeout(createBot, 5000);
  });
}

createBot();
