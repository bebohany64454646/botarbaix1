const mineflayer = require('mineflayer');
const fs = require('fs');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const { GoalBlock } = goals;

const POINTS_FILE = 'points.json';
let points = fs.existsSync(POINTS_FILE) ? JSON.parse(fs.readFileSync(POINTS_FILE)) : {};

function savePoints() {
  fs.writeFileSync(POINTS_FILE, JSON.stringify(points, null, 2));
}

function createBot() {
  const bot = mineflayer.createBot({
    host: 'arabix.aternos.me',
    port: 25565,
    username: 'bot_Arabix',
    auth: 'offline',
    version: false
  });

  bot.loadPlugin(pathfinder);

  bot.on('login', () => {
    console.log('✅ تم تسجيل دخول البوت!');
    bot.chat('🤖 | تم تفعيل bot_Arabix بنجاح! ✨');
  });

  bot.on('spawn', () => {
    const defaultMove = new Movements(bot);
    bot.pathfinder.setMovements(defaultMove);
    setTimeout(() => moveLoop(bot, defaultMove), 2000);

    setInterval(() => checkNearbyPlayers(bot), 5000); // فحص قرب اللاعبين
  });

  bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    const msg = message.toLowerCase();

    // نظام النقاط
    if (!points[username]) points[username] = 0;
    points[username]++;
    savePoints();

    if (msg === '/points') {
      bot.chat(`🎯 | @${username}، عدد نقاطك الحالي: ${points[username]} نقطة`);
    }

    if (msg === '/top') {
      const top = Object.entries(points)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name, pts], i) => `#${i + 1} ${name}: ${pts} نقطة`)
        .join(' | ');
      bot.chat(`🏆 | أفضل اللاعبين: ${top}`);
    }

    // تحيات وردود لطيفة
    const greetings = ['hi','hello','hey','هاي','هلا','هلا والله','السلام عليكم','gg','باك','رجعت','morning','صباح الخير','مساء الخير','wb','welcome back'];
    const replies = ['🌟 ياهلا!','✨ منور السيرفر','👋 أهلا وسهلا','😄 مرحباً بك','💫 welcome back','🤩 نورت','💪 كيفك؟'];

    if (greetings.includes(msg)) {
      const reply = replies[Math.floor(Math.random() * replies.length)];
      bot.chat(`💬 | @${username} ${reply}`);
    }

    // منع الشتايم
    const swears = ['كلب','غبي','fuck','shit','bitch','حمار','وسخ','زفت','منيك','انيك','قذر','شرموط','كس','يلعن','كسمك'];
    if (swears.some(w => msg.includes(w))) {
      bot.chat(`🚫 | @${username}، الرجاء عدم استخدام الألفاظ المسيئة.`);
    }

    // ردود ذكية (ذكاء اصطناعي بسيط بالكلمات المفتاحية)
    if (msg.includes('ميت') || msg.includes('جوعان') || msg.includes('زهقان')) {
      bot.chat(`😅 | @${username} شكلك محتاج مساعدة، جرب تستكشف الكهف أو ابني بيت!`);
    }

    if (msg.includes('ضعت') || msg.includes('وين') || msg.includes('فين')) {
      bot.chat(`🧭 | @${username} حاول تستخدم /sethome أو تكتب إحداثيات بيتك.`);
    }

    // الرد على أي سؤال عام
    if (msg.includes('?') || msg.includes('؟') || msg.startsWith('كيف') || msg.startsWith('ليش')) {
      bot.chat(`🤖 | @${username} سؤال ممتاز! لكن أنا بوت بسيط، جرب تسأل أحد الأونلاين.`);
    }
  });

  bot.on('playerJoined', (player) => {
    if (player.username !== bot.username) {
      bot.chat(`🎉 | مرحبًا بك @${player.username} في سيرفر Arabix! 🌍`);
    }
  });

  bot.on('kicked', reason => console.log('🚫 تم طرد البوت:\n', reason));
  bot.on('error', err => console.log('🚨 خطأ:', err.message));
  bot.on('end', () => {
    console.log('❌ تم فصل البوت. إعادة المحاولة بعد 5 ثوانٍ...');
    setTimeout(createBot, 5000);
  });
}

// الحركة المستمرة
function moveLoop(bot, defaultMove) {
  const pos = bot.entity.position;
  const forward = pos.offset(5, 0, 0);
  bot.setControlState('jump', true);
  bot.pathfinder.setGoal(new GoalBlock(forward.x, forward.y, forward.z));

  bot.once('goal_reached', () => {
    setTimeout(() => {
      const pos2 = bot.entity.position;
      const back = pos2.offset(-5, 0, 0);
      bot.setControlState('jump', true);
      bot.pathfinder.setGoal(new GoalBlock(back.x, back.y, back.z));

      bot.once('goal_reached', () => {
        setTimeout(() => moveLoop(bot, defaultMove), 1000);
      });
    }, 1000);
  });
}

// فحص قرب اللاعبين من البوت
function checkNearbyPlayers(bot) {
  const nearby = Object.values(bot.players).filter(player => {
    if (!player.entity || player.username === bot.username) return false;
    return bot.entity.position.distanceTo(player.entity.position) < 3;
  });

  nearby.forEach(player => {
    bot.chat(`👀 | @${player.username} تراك قريب مني... في شي؟ 😅`);
  });
}

createBot();
