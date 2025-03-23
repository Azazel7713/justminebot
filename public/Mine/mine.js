// Загрузка балансов из localStorage
let redGems = parseInt(localStorage.getItem('redGems')) || 0;
let yellowGems = parseInt(localStorage.getItem('yellowGems')) || 0;
let blueGems = parseInt(localStorage.getItem('blueGems')) || 0;
let purpleGems = parseInt(localStorage.getItem('purpleGems')) || 0;

// Лимит кликов
const MAX_CLICKS_PER_DAY = 1000; // Максимум 10000 кликов в день
let clicksToday = parseInt(localStorage.getItem('clicksToday')) || 0; // Загружаем значение clicksToday
let lastClickTime = parseInt(localStorage.getItem('lastClickTime')) || Date.now(); // Загружаем время последнего клика
let pickaxeCount = parseInt(localStorage.getItem('pickaxeCount')) || MAX_CLICKS_PER_DAY; // Количество кирок

// Элементы DOM
const mineArea = document.getElementById('mine-area');
const pickaxe = document.getElementById('pickaxe');
const clickSound = document.getElementById('click-sound');
const buyClicksButton = document.getElementById('buy-clicks-button');
const pickaxeCountDisplay = document.getElementById('clicks-count'); // Новый элемент для отображения количества кирок

// Функция для сохранения балансов
function saveBalances() {
    localStorage.setItem('redGems', redGems);
    localStorage.setItem('yellowGems', yellowGems);
    localStorage.setItem('blueGems', blueGems);
    localStorage.setItem('purpleGems', purpleGems);
    localStorage.setItem('clicksToday', clicksToday); // Сохраняем clicksToday
    localStorage.setItem('lastClickTime', lastClickTime); // Сохраняем время последнего клика
    localStorage.setItem('pickaxeCount', pickaxeCount); // Сохраняем количество кирок
}

// Функция для обновления баланса в долларах
function updateMoneyBalance() {
    const EXCHANGE_RATES = {
        red: 1000, // 1000 красных = 0.1 доллара
        yellow: 1000, // 1000 желтых = 1 доллар
        blue: 500, // 500 синих = 1 доллар
        purple: 100 // 100 фиолетовых = 1 доллар
    };

    const redValue = redGems / EXCHANGE_RATES.red;
    const yellowValue = yellowGems / EXCHANGE_RATES.yellow;
    const blueValue = blueGems / EXCHANGE_RATES.blue;
    const purpleValue = purpleGems / EXCHANGE_RATES.purple;

    const totalDollars = redValue + yellowValue + blueValue + purpleValue;
    document.getElementById('money-balance').textContent = totalDollars.toFixed(2); // Округляем до 2 знаков
}

// Функция для рандомной генерации самоцветов
function getRandomGem() {
    const random = Math.random() * 100;
    if (random < 90) return 'red';
    if (random < 95) return 'yellow';
    if (random < 99) return 'blue';
    return 'purple';
}

// Проверка, можно ли кликать
function canClick() {
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTime;

    // Если прошло больше 24 часов, сбросить счетчик кликов
    if (timeSinceLastClick >= 24 * 60 * 60 * 1000) {
        clicksToday = 0;
        pickaxeCount = MAX_CLICKS_PER_DAY; // Сбрасываем количество кирок
        lastClickTime = now; // Обновляем время последнего клика
        saveBalances(); // Сохраняем изменения в localStorage
    }

    // Проверка лимита кликов
    if (pickaxeCount <= 0) {
        console.log(`Кирки закончились: pickaxeCount = ${pickaxeCount}`);
        alert('Кирки закончились! Купите дополнительные клики.');
        return false;
    }

    return true;
}

// Обработка кликов
mineArea.addEventListener('click', (event) => {
    if (!canClick()) return;

    // Позиция клика
    const x = event.clientX;
    const y = event.clientY;

    // Анимация кирки
    pickaxe.style.left = `${x}px`;
    pickaxe.style.top = `${y}px`;
    pickaxe.classList.add('visible');
    setTimeout(() => pickaxe.classList.remove('visible'), 300);

    // Воспроизведение звука
    clickSound.currentTime = 0;
    clickSound.play();

    // Генерация самоцвета
    const gemType = getRandomGem();
    let gemImagePath = '';
    switch (gemType) {
        case 'red':
            redGems++;
            gemImagePath = 'images/gems/red-gem.png'; // Путь к картинке красного самоцвета
            break;
        case 'yellow':
            yellowGems++;
            gemImagePath = 'images/gems/yellow-gem.png'; // Путь к картинке желтого самоцвета
            break;
        case 'blue':
            blueGems++;
            gemImagePath = 'images/gems/blue-gem.png'; // Путь к картинке синего самоцвета
            break;
        case 'purple':
            purpleGems++;
            gemImagePath = 'images/gems/purple-gem.png'; // Путь к картинке фиолетового самоцвета
            break;
    }

    // Создание нового элемента для самоцвета
    const gemElement = document.createElement('img');
    gemElement.src = gemImagePath; // Устанавливаем путь к картинке
    gemElement.alt = 'Самоцвет';
    gemElement.classList.add('gem-image'); // Добавляем базовый класс

    // Размещение самоцвета в точке клика
    gemElement.style.position = 'absolute';
    gemElement.style.left = `${x - 100}px`; // Центрируем по клику (ширина/2)
    gemElement.style.top = `${y - 100}px`; // Центрируем по клику (высота/2)

    // Добавление самоцвета в область майнинга
    mineArea.appendChild(gemElement);

    // Делаем самоцвет видимым через добавление класса
    setTimeout(() => {
        gemElement.classList.add('visible');
    }, 10); // Небольшая задержка для корректной анимации

    // Удаление самоцвета через 1 секунду с плавным исчезновением
    setTimeout(() => {
        gemElement.classList.remove('visible'); // Убираем видимость
        setTimeout(() => {
            gemElement.remove(); // Удаляем элемент после завершения анимации
        }, 250); // Время, равное длительности анимации (transition)
    }, 500);

    // Обновляем счетчики
    clicksToday++;
    pickaxeCount--; // Уменьшаем количество кирок
    lastClickTime = Date.now(); // Обновляем время последнего клика
    saveBalances(); // Сохраняем изменения в localStorage

    // Обновление интерфейса
    updateUI();
});

// Функция для покупки дополнительных кликов
function buyAdditionalClicks() {
    const costInPurpleGems = 1; // 1 фиолетовый кристалл = 100 кликов
    if (purpleGems >= costInPurpleGems) {
        purpleGems -= costInPurpleGems;
        pickaxeCount += 100; // Добавляем 100 кирок
        console.log(`Куплено 100 кирок. Новое значение pickaxeCount: ${pickaxeCount}`);
        alert('Вы купили 100 дополнительных кирок!');
    } else {
        alert('Недостаточно фиолетовых кристаллов!');
    }

    // Сохранение балансов
    saveBalances();

    // Обновление интерфейса
    updateUI();
}

// Обработчик кнопки покупки кликов
buyClicksButton.addEventListener('click', () => {
    buyAdditionalClicks();
});

// Функция для обновления интерфейса
function updateUI() {
    // Обновление количества самоцветов
    document.getElementById('red-gems').textContent = redGems;
    document.getElementById('yellow-gems').textContent = yellowGems;
    document.getElementById('blue-gems').textContent = blueGems;
    document.getElementById('purple-gems').textContent = purpleGems;

    // Обновление баланса в долларах
    updateMoneyBalance();

    // Обновление количества кирок
    pickaxeCountDisplay.textContent = `(${pickaxeCount} кирок осталось)`;
}

// Инициализация интерфейса при загрузке страницы
window.addEventListener('load', () => {
    updateUI(); // Обновляем интерфейс сразу после загрузки страницы
});