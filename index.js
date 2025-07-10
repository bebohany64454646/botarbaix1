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
    port: 25565,
    username: 'bot_Arabix',
    auth: 'offline',
    version: false
  });

  bot.on('login', () => {
    isBotOnline = true;
    console.log('✅ تم تسجيل دخول البوت!');
    bot.chat('🤖 | bot_Arabix أونلاين!');
  });

  bot.on('spawn', () => {
    // 👟 منع الطرد بالحركة البسيطة:
    bot.setControlState('sneak', true); // يفضل متسلل دائمًا
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 400);
    }, 10000); // يقفز كل 10 ثواني
  });

  bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    const msg = message.toLowerCase();

    // 🎯 النقاط
    if (!points[username]) points[username] = 0;
    points[username]++;
    savePoints();

    if (msg === '/points') {
      bot.chat(`🎯 | @${username}، نقاطك: ${points[username]} نقطة`);
    }

    if (msg === '/top') {
      const top = Object.entries(points)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name, pts], i) => `#${i + 1} ${name}: ${pts} نقطة`)
        .join(' | ');
      bot.chat(`🏆 | أفضل اللاعبين: ${top}`);
    }

    // 👋 ردود التحية
    const greetings = ['hi','hello','hey','هاي','هلا','هلا والله','السلام عليكم','gg','باك','رجعت','morning','صباح الخير','مساء الخير','wb','welcome back'];
    const replies = ['🌟 ياهلا!','✨ منور السيرفر','👋 أهلا وسهلا','😄 مرحباً بك','💫 welcome back','🤩 نورت','💪 كيفك؟'];
    if (greetings.includes(msg)) {
      const reply = replies[Math.floor(Math.random() * replies.length)];
      bot.chat(`💬 | @${username} ${reply}`);
    }

    // 🚫 الشتايم
    const swears = ['كلب','غبي','fuck','shit','bitch','حمار','وسخ','زفت','منيك','انيك','قذر','شرموط','كس','يلعن','كسمك'];
    if (swears.some(w => msg.includes(w))) {
      bot.chat(`🚫 | @${username} الرجاء عدم استخدام ألفاظ مسيئة!`);
    }

    // 🤖 ردود ذكية
    if (msg.includes('ميت') || msg.includes('جوعان') || msg.includes('زهقان')) {
      bot.chat(`😅 | @${username} محتاج تلعب شوية، جرب تستكشف كهف!`);
    }
    if (msg.includes('ضعت') || msg.includes('وين') || msg.includes('فين')) {
      bot.chat(`🧭 | @${username} تأكد من مكانك أو استخدم /sethome.`);
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
    console.log('❌ خطأ:', err.message);
  });

  bot.on('end', () => {
    isBotOnline = false;
    console.log('🔁 تم فصل البوت. إعادة الاتصال خلال 5 ثوانٍ...');
    setTimeout(createBot, 5000);
  });
}

createBot();
