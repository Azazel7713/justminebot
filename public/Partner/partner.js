// Загрузка балансов из localStorage
let blueGems = parseInt(localStorage.getItem('blueGems')) || 0;

// Элементы DOM
const taskButtons = document.querySelectorAll('.task-button');
const blueGemsDisplay = document.getElementById('blue-gems');

// Функция для сохранения балансов
function saveBalances() {
    localStorage.setItem('blueGems', blueGems);
}

// Функция для обновления интерфейса
function updateUI() {
    blueGemsDisplay.textContent = blueGems;
}

// Обработка кликов по кнопкам
taskButtons.forEach(button => {
    button.addEventListener('click', () => {
        const url = button.getAttribute('data-url');
        if (!url) return;

        // Открываем ссылку в новой вкладке
        window.open(url, '_blank');

        // Меняем состояние кнопки на "Загрузка"
        button.classList.add('loading');
        button.textContent = 'Загрузка...';
        button.disabled = true;

        // Через 30 секунд завершаем задание
        setTimeout(() => {
            button.classList.remove('loading');
            button.classList.add('completed');
            button.textContent = 'Выполнено';
            button.disabled = true;

            // Начисляем голубые кристаллы
            blueGems += 20;
            saveBalances();
            updateUI();
        }, 30000); // 30 секунд
    });
});

// Инициализация интерфейса при загрузке страницы
window.addEventListener('load', () => {
    updateUI(); // Обновляем интерфейс сразу после загрузки страницы
});