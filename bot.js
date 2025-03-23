const { Telegraf } = require('telegraf');

// Токен бота (замените на ваш токен)
const BOT_TOKEN = '7401273479:AAEIUcrSZY9ShbAwEtrr69B6BCRKPc8UlbI';

// ngrok-ссылка (замените на вашу)
const webAppUrl = 'https://fafa-185-146-113-176.ngrok-free.app';

// Инициализация бота
const bot = new Telegraf(BOT_TOKEN);

// Команда /start
bot.start((ctx) => {
    ctx.reply(
        'Добро пожаловать в Build & Earn!\nНажмите кнопку ниже, чтобы начать игру:',
        {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Открыть игру',
                            web_app: { url: webAppUrl }
                        }
                    ]
                ]
            }
        }
    );
});

// Команда /getid для получения ID пользователя
bot.command('getid', (ctx) => {
    const userId = ctx.from.id;
    ctx.reply(`Ваш ID: ${userId}\nИспользуйте его в игре.`);
});

// Запуск бота
bot.launch();

console.log("Бот запущен!");