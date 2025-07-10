const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const { GoalBlock } = goals;

function createBot() {
  const bot = mineflayer.createBot({
    host: 'arabix.aternos.me',
    port: 25565, // أو البورت الخاص بسيرفرك (مثلاً: 63087)
    username: 'bot_Arabix', // ✅ بدون مسافات
    auth: 'offline',        // للسيرفرات المكركة
    version: false          // لدعم جميع الإصدارات
  });

  bot.loadPlugin(pathfinder);

  bot.on('login', () => {
    console.log('✅ تم تسجيل دخول البوت!');
    bot.chat('🤖 bot Arabix شغال الآن! ✨');
  });

  bot.on('spawn', () => {
    const defaultMove = new Movements(bot);
    bot.pathfinder.setMovements(defaultMove);
    setTimeout(() => moveLoop(bot, defaultMove), 2000);
  });

  const greetings = ['hi','hello','hey','هاي','هلا','هلا والله','السلام عليكم','gg','باك','رجعت','morning','صباح الخير','مساء الخير','wb','welcome back'];
  const greetingReplies = ['ياهلا بالغالي 🌟','منور السيرفر ✨','هلا بيك 👋','مرحبا بك! 😄','welcome back 💫','نورتنا والله 🤩','كيفك يا بطل؟ 💪'];

  const swearWords = [
    'كلب','غبي','حقير','قذر','حيوان','تافه','وسخ','ابن كذا','متخلف','سافل',
    'fuck','shit','bitch','bastard','asshole','dumb','idiot','retard','wtf',
    'whore','mf','slut','crap','damn','لعنك','يلعن','شرموط','قحبة','زفت','ابله',
    'ياحمار','ياكلب','حمار','كس امك','يا زفت','يا وسخ','كسمك','كس','منيك','انيك',
    'نايك','بيضان','تف عليك','استغفر الله'
  ];

  bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    const msg = message.toLowerCase();

    if (greetings.includes(msg)) {
      const reply = greetingReplies[Math.floor(Math.random() * greetingReplies.length)];
      bot.chat(`@${username} ${reply}`);
    }

    for (let word of swearWords) {
      if (msg.includes(word)) {
        bot.chat(`⚠️ @${username} الرجاء احترام الآخرين وعدم استخدام الألفاظ المسيئة!`);
        break;
      }
    }
  });

  bot.on('playerJoined', (player) => {
    if (player.username !== bot.username) {
      bot.chat(`🎉 مرحبًا بك @${player.username} في سيرفر Arabix!`);
    }
  });

  bot.on('kicked', (reason) => {
    console.log('🚫 تم طرد البوت:\n', reason);
  });

  bot.on('end', () => {
    console.log('❌ تم فصل البوت. إعادة المحاولة بعد 5 ثوانٍ...');
    setTimeout(createBot, 5000);
  });

  bot.on('error', (err) => {
    console.log('🚨 خطأ:', err.message);
  });
}

// حركة أمام وخلف + قفز
function moveLoop(bot, defaultMove) {
  const pos = bot.entity.position;
  const forward = pos.offset(5, 0, 0);
  bot.setControlState('jump', true);
  bot.pathfinder.setGoal(new GoalBlock(forward.x, forward.y, forward.z));

  bot.once('goal_reached', () => {
    setTimeout(() => {
      const back = pos.offset(-5, 0, 0);
      bot.pathfinder.setGoal(new GoalBlock(back.x, back.y, back.z));

      bot.once('goal_reached', () => {
        setTimeout(() => moveLoop(bot, defaultMove), 1000);
      });
    }, 1000);
  });
}

createBot();
