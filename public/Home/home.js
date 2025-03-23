// Получаем кнопку
const goToCityButton = document.getElementById('go-to-city');

// Добавляем обработчик клика
goToCityButton.addEventListener('click', () => {
    // Воспроизводим звук (если есть)
    const clickSound = new Audio('../assets/sounds/click-sound.mp3');
    clickSound.play();
});

// Получаем все элементы меню
const menuItems = document.querySelectorAll('.menu-item');

// Получаем текущий URL
const currentUrl = window.location.href;

// Проверяем, какой элемент является активным
menuItems.forEach(item => {
    if (item.href === currentUrl) {
        item.classList.add('active'); // Добавляем класс active
    } else {
        item.classList.remove('active'); // Удаляем класс active
    }
});

// Генерация случайного ID игрока (5 цифр)
const playerId = Math.floor(10000 + Math.random() * 90000);
document.getElementById('player-id').textContent = playerId;

// Загрузка балансов из localStorage
let redGems = parseInt(localStorage.getItem('redGems')) || 0;
let yellowGems = parseInt(localStorage.getItem('yellowGems')) || 0;
let blueGems = parseInt(localStorage.getItem('blueGems')) || 0;
let purpleGems = parseInt(localStorage.getItem('purpleGems')) || 0;
let moneyBalance = parseFloat(localStorage.getItem('moneyBalance')) || 0;

// Обновление UI
function updateUI() {
    document.getElementById('red-gems').textContent = redGems;
    document.getElementById('yellow-gems').textContent = yellowGems;
    document.getElementById('blue-gems').textContent = blueGems;
    document.getElementById('purple-gems').textContent = purpleGems;
    document.getElementById('money-balance').textContent = moneyBalance.toFixed(2); // Два знака после запятой
}

// Функция для сохранения данных в localStorage
function saveToLocalStorage() {
    localStorage.setItem('redGems', redGems);
    localStorage.setItem('yellowGems', yellowGems);
    localStorage.setItem('blueGems', blueGems);
    localStorage.setItem('purpleGems', purpleGems);
    localStorage.setItem('moneyBalance', moneyBalance);
}

// Пример функции для добавления самоцветов или денег
function addGems(type, amount) {
    switch (type) {
        case 'red':
            redGems += amount;
            break;
        case 'yellow':
            yellowGems += amount;
            break;
        case 'blue':
            blueGems += amount;
            break;
        case 'purple':
            purpleGems += amount;
            break;
        case 'money':
            moneyBalance += amount;
            break;
    }
    saveToLocalStorage();
    updateUI();
}

// Инициализация UI при загрузке страницы
updateUI();