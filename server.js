const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Папка для сохранений
const SAVE_DIR = path.join(__dirname, 'saves');
if (!fs.existsSync(SAVE_DIR)) {
    fs.mkdirSync(SAVE_DIR);
}

// Middleware для обработки JSON и статических файлов
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Эндпоинт для сохранения прогресса
app.post('/save', (req, res) => {
    const { userId, data } = req.body;

    if (!userId || !data) {
        return res.status(400).send('Недостаточно данных');
    }

    const filePath = path.join(SAVE_DIR, `${userId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data));

    res.send('Прогресс сохранен');
});

// Эндпоинт для загрузки прогресса
app.get('/load/:userId', (req, res) => {
    const { userId } = req.params;

    const filePath = path.join(SAVE_DIR, `${userId}.json`);
    if (!fs.existsSync(filePath)) {
        return res.status(404).send('Сохранений не найдено');
    }

    const data = fs.readFileSync(filePath, 'utf8');
    res.send(JSON.parse(data));
});

// Главная страница (для Web App)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Запуск сервера
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});