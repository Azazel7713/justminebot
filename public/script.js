// Получаем элемент полосы прогресса
const progressBar = document.getElementById('progress-bar');

// Функция для заполнения полосы прогресса
function fillProgressBar() {
    let progress = 0;
    const interval = 50; // Интервал обновления (в миллисекундах)
    const step = 100 / (5000 / interval); // Шаг увеличения (5 секунд = 5000 мс)

    const timer = setInterval(() => {
        progress += step;
        progressBar.style.width = `${progress}%`;

        // Останавливаем таймер, когда прогресс достигает 100%
        if (progress >= 100) {
            clearInterval(timer);
            progressBar.style.width = '100%'; // Убедимся, что полоса полностью заполнена

            // После завершения загрузки можно перенаправить пользователя на другую страницу
            setTimeout(() => {
                window.location.href = 'public/Home/home.html'; // Переход на страницу города
            }, 500); // Задержка перед переходом (опционально)
        }
    }, interval);
}

// Запускаем заполнение полосы прогресса
fillProgressBar();
