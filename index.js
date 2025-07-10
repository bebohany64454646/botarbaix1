const mineflayer = require('mineflayer');
const fs = require('fs');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const { GoalNear } = goals;

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
    bot.chat('🤖 | bot_Arabix أونلاين!');
  });

  bot.on('spawn', () => {
    const defaultMove = new Movements(bot);
    bot.pathfinder.setMovements(defaultMove);
    setTimeout(() => moveCycle(bot, defaultMove), 2000);
    setInterval(() => checkNearbyPlayers(bot), 5000);
  });

  bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    const msg = message.toLowerCase();

    // نظام النقاط
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

    // تحيات وردود
    const greetings = ['hi','hello','hey','هاي','هلا','هلا والله','السلام عليكم','gg','باك','رجعت','morning','صباح الخير','مساء الخير','wb','welcome back'];
    const replies = ['🌟 ياهلا!','✨ منور السيرفر','👋 أهلا وسهلا','😄 مرحباً بك','💫 welcome back','🤩 نورت','💪 كيفك؟'];
    if (greetings.includes(msg)) {
      const reply = replies[Math.floor(Math.random() * replies.length)];
      bot.chat(`💬 | @${username} ${reply}`);
    }

    // الشتايم
    const swears = ['كلب','غبي','fuck','shit','bitch','حمار','وسخ','زفت','منيك','انيك','قذر','شرموط','كس','يلعن','كسمك'];
    if (swears.some(w => msg.includes(w))) {
      bot.chat(`🚫 | @${username} الرجاء عدم استخدام ألفاظ مسيئة!`);
    }

    // ذكاء اصطناعي بسيط
    if (msg.includes('ميت') || msg.includes('جوعان') || msg.includes('زهقان')) {
      bot.chat(`😅 | @${username} شكلك محتاج تلعب شوي، جرب تستكشف كهف!`);
    }
    if (msg.includes('ضعت') || msg.includes('وين') || msg.includes('فين')) {
      bot.chat(`🧭 | @${username} تأكد من مكانك أو استخدم /sethome لو موجود.`);
    }
    if (msg.includes('?') || msg.includes('؟') || msg.startsWith('كيف') || msg.startsWith('ليش')) {
      bot.chat(`🤖 | @${username} سؤال جميل! اسأل أصحابك في السيرفر كمان 😉`);
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
    console.log('🔁 تم فصل البوت. إعادة الاتصال خلال 5 ثوانٍ...');
    setTimeout(createBot, 5000);
  });
}

// 🔁 الحركة المستمرة: 5 بلوكات للأمام ثم 5 للخلف
function moveCycle(bot, defaultMove) {
  const pos = bot.entity.position.clone();
  const forward = pos.offset(5, 0, 0);
  bot.pathfinder.setGoal(new GoalNear(forward.x, forward.y, forward.z, 1));

  bot.once('goal_reached', () => {
    setTimeout(() => {
      const back = bot.entity.position.offset(-5, 0, 0);
      bot.pathfinder.setGoal(new GoalNear(back.x, back.y, back.z, 1));

      bot.once('goal_reached', () => {
        setTimeout(() => moveCycle(bot, defaultMove), 1000);
      });
    }, 1000);
  });
}

// 👀 تنبيه عند اقتراب لاعب
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
