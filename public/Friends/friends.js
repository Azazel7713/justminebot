// Загрузка балансов из localStorage
let redGems = parseInt(localStorage.getItem('redGems')) || 0;

// Элементы DOM
const referralLinkInput = document.getElementById('referral-link');
const copyReferralLinkButton = document.getElementById('copy-referral-link');
const invitedCountDisplay = document.getElementById('invited-count');
const activeCountDisplay = document.getElementById('active-count');
const friendsList = document.getElementById('friends-list-items');

// Генерация уникального реферального кода
function generateRefCode() {
    let refCode;
    do {
        refCode = Math.random().toString(36).substring(2, 10); // Генерируем случайный код
    } while (localStorage.getItem(`userRefCode_${refCode}`)); // Проверяем уникальность
    return refCode;
}

// Получение или создание реферального кода пользователя
const userRefCode = localStorage.getItem('userRefCode') || generateRefCode();
localStorage.setItem('userRefCode', userRefCode);

// Установка реферальной ссылки
referralLinkInput.value = `https://t.me/boxminecitybot?start=${userRefCode}`;

// Копирование реферальной ссылки
copyReferralLinkButton.addEventListener('click', () => {
    referralLinkInput.select();
    document.execCommand('copy');
    alert('Ссылка скопирована!');
});

// Инициализация данных о друзьях
let invitedFriends = JSON.parse(localStorage.getItem('invitedFriends')) || [];
updateFriendsUI();

// Функция для обновления интерфейса
function updateFriendsUI() {
    // Обновление счетчиков
    invitedCountDisplay.textContent = invitedFriends.length;
    const activeFriends = invitedFriends.filter(friend => friend.purpleGems >= 5).length;
    activeCountDisplay.textContent = activeFriends;

    // Обновление списка друзей
    friendsList.innerHTML = '';
    invitedFriends.forEach(friend => {
        const listItem = document.createElement('li');
        listItem.classList.add('friend-item');
        listItem.innerHTML = `
            <span class="friend-name">${friend.name}</span>
            <span class="friend-earnings">+${friend.earnings}<img src="images/gems/red-gem.png" alt="Красный кристалл" class="gem-icon"></span>
        `;
        friendsList.appendChild(listItem);
    });

    // Обновление баланса
    document.getElementById('red-gems').textContent = redGems;
}

// Логика начисления бонусов за приглашения
function addFriend(refCode, purpleGems) {
    const existingFriend = invitedFriends.find(friend => friend.refCode === refCode);

    if (existingFriend) {
        // Если друг уже есть, обновляем его количество фиолетовых кристаллов
        existingFriend.purpleGems += purpleGems;
    } else {
        // Если друг новый, добавляем его в список
        invitedFriends.push({
            refCode,
            name: `Игрок${invitedFriends.length + 1}`,
            purpleGems,
            earnings: 0
        });
    }

    // Начисление бонусов за активных друзей
    const friend = invitedFriends.find(f => f.refCode === refCode);
    if (purpleGems >= 5 && !friend.isBonusAwarded) {
        const bonus = purpleGems * 0.2; // 20% от красных кристаллов
        redGems += bonus;
        friend.earnings += bonus;
        friend.isBonusAwarded = true; // Отмечаем, что бонус уже начислен
    }

    // Сохранение данных
    saveData();
    updateFriendsUI();
}

// Функция для сохранения данных
function saveData() {
    localStorage.setItem('redGems', redGems);
    localStorage.setItem('invitedFriends', JSON.stringify(invitedFriends));
}

// Инициализация интерфейса при загрузке страницы
window.addEventListener('load', () => {
    updateFriendsUI(); // Обновляем интерфейс сразу после загрузки страницы
});