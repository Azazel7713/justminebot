// Загрузка балансов из localStorage
let redGems = parseInt(localStorage.getItem('redGems')) || 0;
let blueGems = parseInt(localStorage.getItem('blueGems')) || 0;
let purpleGems = parseInt(localStorage.getItem('purpleGems')) || 0;
let yellowGems = parseInt(localStorage.getItem('yellowGems')) || 0;
let usdtBalance = parseFloat(localStorage.getItem('usdtBalance')) || 0;

// Элементы DOM
const redGemsDisplay = document.getElementById('red-gems');
const blueGemsDisplay = document.getElementById('blue-gems');
const purpleGemsDisplay = document.getElementById('purple-gems');
const yellowGemsDisplay = document.getElementById('purple-gems');
const usdtBalanceDisplay = document.getElementById('usdt-balance');

const exchangeFrom = document.getElementById('exchange-from'); // Тип кристалла для обмена
const exchangeAmount = document.getElementById('exchange-amount'); // Количество кристаллов
const exchangeButton = document.getElementById('exchange-button');
const exchangeError = document.getElementById('exchange-error');

const withdrawAddress = document.getElementById('withdraw-address');
const withdrawAmount = document.getElementById('withdraw-amount');
const withdrawButton = document.getElementById('withdraw-button');
const withdrawError = document.getElementById('withdraw-error');

// Обновление интерфейса
function updateUI() {
    redGemsDisplay.textContent = redGems;
    blueGemsDisplay.textContent = blueGems;
    purpleGemsDisplay.textContent = purpleGems;
    yellowGemsDisplay.textContent = yellowGems;
    usdtBalanceDisplay.textContent = usdtBalance.toFixed(2);

    // Сохранение данных
    saveData();
}

// Сохранение данных
function saveData() {
    localStorage.setItem('redGems', redGems);
    localStorage.setItem('blueGems', blueGems);
    localStorage.setItem('purpleGems', purpleGems);
    localStorage.setItem('yellowGems', purpleGems);
    localStorage.setItem('usdtBalance', usdtBalance);
}

// Обмен
exchangeButton.addEventListener('click', () => {
    const from = exchangeFrom.value; // Тип кристалла для обмена
    const amount = parseFloat(exchangeAmount.value); // Количество кристаллов

    if (!amount || amount <= 0) {
        exchangeError.textContent = 'Введите корректное количество.';
        return;
    }

    // Коэффициенты обмена
    const EXCHANGE_RATES = {
        red: 0.0001,
        yellow: 0.001,   // 1000 красных = 0.1 USDT
        blue: 0.002,    // 500 синих = 1 USDT
        purple: 0.01    // 100 фиолетовых = 1 USDT
    };

    const commission = 0.1; // Комиссия 10%

    // Проверка доступного баланса
    if (from === 'red' && redGems < amount) {
        exchangeError.textContent = 'Недостаточно красных кристаллов.';
        return;
    }
    if (from === 'blue' && blueGems < amount) {
        exchangeError.textContent = 'Недостаточно синих кристаллов.';
        return;
    }
    if (from === 'purple' && purpleGems < amount) {
        exchangeError.textContent = 'Недостаточно фиолетовых кристаллов.';
        return;
    }
    if (from === 'yellow' && yellowGems < amount) {
        exchangeError.textContent = 'Недостаточно желтых кристаллов.';
        return;
    }

    // Расчет получаемого USDT с учетом комиссии
    const rate = EXCHANGE_RATES[from];
    const receivedAmount = amount * rate * (1 - commission);

    // Обновление балансов
    if (from === 'red') redGems -= amount;
    if (from === 'yellow') yellowGems -= amount;
    if (from === 'blue') blueGems -= amount;
    if (from === 'purple') purpleGems -= amount;

    usdtBalance += receivedAmount;

    exchangeError.textContent = '';
    updateUI();
});

// Вывод
withdrawButton.addEventListener('click', () => {
    const address = withdrawAddress.value.trim();
    const amount = parseFloat(withdrawAmount.value);

    if (!address || !/^T[a-zA-Z0-9]{33}$/.test(address)) {
        withdrawError.textContent = 'Введите корректный TRC20 адрес.';
        return;
    }

    if (!amount || amount <= 0 || amount > usdtBalance) {
        withdrawError.textContent = 'Введите корректную сумму.';
        return;
    }

    const commission = 0.2; // Комиссия 20%
    const withdrawAmountAfterFee = amount * (1 - commission);

    // Уменьшение баланса USDT
    usdtBalance -= amount;

    // Отправка уведомления в Telegram
    const message = `Новый запрос на вывод:
Игрок: ${localStorage.getItem('userName') || 'Неизвестный'}
Баланс USDT: ${usdtBalance.toFixed(2)}
Сумма вывода: ${amount} USDT
Комиссия: ${commission * 100}%
Получит: ${withdrawAmountAfterFee.toFixed(2)} USDT
Адрес: ${address}`;

    // Отправляем сообщение в Telegram
    fetch(`https://api.telegram.org/bot7401273479:AAEIUcrSZY9ShbAwEtrr69B6BCRKPc8UlbI/sendMessage?chat_id=@budgesizmarketing&text=${encodeURIComponent(message)}`)
        .then(response => {
            if (response.ok) {
                alert('Запрос на вывод отправлен!');
                updateUI();
            } else {
                withdrawError.textContent = 'Ошибка при отправке запроса на вывод.';
            }
        })
        .catch(() => {
            withdrawError.textContent = 'Ошибка при отправке запроса на вывод.';
        });
});

// Инициализация интерфейса при загрузке страницы
window.addEventListener('load', () => {
    updateUI(); // Обновляем интерфейс сразу после загрузки страницы
});