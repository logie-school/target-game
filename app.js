let lives = 3; // number of lives
let targetTime = 2.0; // countdown in seconds
let targetSize = 100; // diameter of the target in pixels
let spawnDecoy = true; // boolean for spawning decoys
let spawnIntervalRange = [1, 3]; // range for random spawn intervals in seconds
let score = 0; // score counter
let paused = false // pause boolean
let playing = false // playing boolean
let showCountdown = true // show countdown boolean
let gameDuration = false; // game duration in seconds, false for infinite
let easy; // difficulty boolean

let currentPlayerName;

const gameArea = document.getElementById('game-area');
const info = document.getElementById('info');
const livesSpan = document.getElementById('lives');
const scoreSpan = document.getElementById('score');
const timeSpan = document.getElementById('time');

function updateLivesDisplay() {
    livesSpan.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const life = document.createElement('span');
        life.className = 'life';
        if (i < lives) {
            life.textContent = '❤️';
        } else {
            life.textContent = '💔';
            life.classList.add('lost');
        }
        livesSpan.appendChild(life);
    }
}

function updateTimeDisplay() {
    if (gameDuration === false) {
        timeSpan.textContent = '∞';
    } else {
        timeSpan.textContent = gameDuration;
    }
}

function startGameTimer() {
    if (gameDuration === false) return;

    const timerInterval = setInterval(() => {
        if (paused) return;

        gameDuration -= 1;
        updateTimeDisplay();

        if (gameDuration <= 0) {
            clearInterval(timerInterval);
            updateLeaderboard(currentPlayerName, score);
            showNotification('Time\'s up! Game over', 'error', 3000);
            backToMenu();
            resetGame();
        }
    }, 1000);
}

updateLivesDisplay();
scoreSpan.textContent = score;
updateTimeDisplay();

function spawnTarget() {
    if (paused) {
        return;
    }

    const isDecoy = spawnDecoy && Math.random() < 0.3; // 30% chance of a decoy
    const target = document.createElement('div');
    target.className = isDecoy ? 'decoy' : 'target';
    target.style.width = `${targetSize}px`;
    target.style.height = `${targetSize}px`;
    target.classList.add('game-object');

    const x = Math.random() * (gameArea.clientWidth - targetSize);
    const y = Math.random() * (gameArea.clientHeight - targetSize);

    target.style.left = `${x}px`;
    target.style.top = `${y}px`;

    let countdownTime = targetTime;

    target.classList.add('fadeIn');

    setTimeout(() => {
        target.classList.remove('fadeIn');
    }, 100);

    target.style.animation = `shrinkOutline ${targetTime}s linear, fadeIn 0.3s`;

    if (!isDecoy) {
        target.textContent = countdownTime.toFixed(1);
        const countdownInterval = setInterval(() => {
            countdownTime -= 0.1;
            target.textContent = countdownTime <= 0 ? '0' : countdownTime.toFixed(1);
        }, 100);

        setTimeout(() => {
            clearInterval(countdownInterval);
            if (!target.getAttribute('clicked')) {
                // Deduct a life if missed
                if (!paused) {
                    lives -= 1;
                    updateLivesDisplay();
                    scoreSpan.textContent = score;
                    document.getElementById('game-area').classList.add('lost-life');
                    setTimeout(() => {
                        document.getElementById('game-area').classList.remove('lost-life');
                    }, 500);
                    if (lives <= 0) {
                        updateLeaderboard(currentPlayerName, score);
                        showNotification('Game over', 'error', 3000);
                        backToMenu();
                        resetGame();
                    }
                    target.classList.add('fadeOut');
                    setTimeout(() => {
                        if (!target.getAttribute('clicked')) {
                            if (gameArea.contains(target)) {
                                gameArea.removeChild(target);
                            }
                        }
                    }, 300);
                }
            }
        }, targetTime * 1000);
    } else {
        target.textContent = "💀";

        setTimeout(() => {
            if (gameArea.contains(target)) {
                target.classList.add('fadeOut');
                setTimeout(() => {
                    if (gameArea.contains(target)) {
                        gameArea.removeChild(target);
                    }
                }, 300);
            }
        }, targetTime * 1000);
    }

    gameArea.appendChild(target);

    target.addEventListener('click', () => {
        target.setAttribute('clicked', true);
        if (!isDecoy) {
            score += 1;
            scoreSpan.textContent = score;
            target.classList.add('fadeOut');
            setTimeout(() => {
                if (gameArea.contains(target)) {
                    gameArea.removeChild(target);
                }
            }, 300);
        } else {
            if (!paused) {
                lives -= 1;
                document.getElementById('game-area').classList.add('lost-life');
                setTimeout(() => {
                    document.getElementById('game-area').classList.remove('lost-life');
                }, 500);
                updateLivesDisplay();
                scoreSpan.textContent = score;
                if (lives <= 0) {
                    updateLeaderboard(currentPlayerName, score);
                    showNotification('Game over', 'error', 3000);
                    backToMenu();
                    resetGame();
                }
                target.classList.add('fadeOut');
                setTimeout(() => {
                    if (gameArea.contains(target)) {
                        gameArea.removeChild(target);
                    }
                }, 300);
            }
        }
    });
}

function resetGame() {
    lives = 3;
    score = 0;
    gameDuration = false;
    updateLivesDisplay();
    scoreSpan.textContent = score;
    updateTimeDisplay();
}

function getRandomInterval() {
    const [min, max] = spawnIntervalRange;
    return Math.random() * (max - min) + min;
}

function startSpawning() {
    function spawnLoop() {
        if (!paused) {
            spawnTarget();
            setTimeout(spawnLoop, getRandomInterval() * 1000);
        } else {
            console.log('Paused');
            setTimeout(spawnLoop, getRandomInterval() * 1000);
        }
    }
    spawnLoop();
}

function showExitConf() {
    if (!showCountdown) {
        const wrapper = document.getElementById('exit-conf');
        wrapper.style.opacity = '1';
        wrapper.style.pointerEvents = 'all';
        paused = true;
        showCountdown = false;

        const element = document.getElementById('countdown');
        element.style.opacity = '0';
        element.textContent = '';

        document.querySelectorAll('.game-object').forEach(element => {
            element.classList.add('fadeOut');
            setTimeout(() => {
                element.remove();
            }, 300);
        });
    } else {
        showNotification('Please wait for the countdown to finish before exiting', 'warning', 3000);
    }
}

function hideExitConf() {
    const wrapper = document.getElementById('exit-conf');
    wrapper.style.opacity = '0';
    wrapper.style.pointerEvents = 'none';
    paused = false;
}

function showMainMenu() {
    const mainMenu = document.getElementById('main-menu');
    mainMenu.style.opacity = '1';
    mainMenu.style.pointerEvents = 'all';
    mainMenu.style.scale = '1';
    hideExitConf();

    paused = true;

    showNotification('Returned to menu', 'info', 2000);

    document.querySelectorAll('.game-object').forEach(element => {
        element.classList.add('fadeOut');
        setTimeout(() => {
            element.remove();
        }, 300);
    });
}

function backToMenu() {
    paused = true;
    document.querySelectorAll('.game-object').forEach(element => {
        element.classList.add('fadeOut');
        setTimeout(() => {
            element.remove();
        }, 300);
    });

    const mainMenu = document.getElementById('main-menu');
    mainMenu.style.opacity = '1';
    mainMenu.style.pointerEvents = 'all';
    mainMenu.style.scale = '1';
}

document.querySelectorAll('.play-options-wrapper').forEach(wrapper => {
    wrapper.addEventListener('click', function(event) {
        if (event.target.closest('.radio-button-wrapper')) {
            const activeButton = this.querySelector('.active-radio-button');
            if (activeButton) {
                activeButton.classList.remove('active-radio-button');
            }
            event.target.closest('.radio-button-wrapper').querySelector('.radio-button').classList.add('active-radio-button');
        }
    });
});

document.querySelectorAll('.check-button-wrapper').forEach(wrapper => {
    wrapper.addEventListener('click', function() {
        const checkButton = this.querySelector('.check-button');
        checkButton.classList.toggle('active-check-button');
    });
});

function toggleDropdown(button) {
    const dropdownContent = button.nextElementSibling;
    const arrow = button.querySelector('.dropdown-arrow');

    dropdownContent.classList.toggle("show");
    arrow.classList.toggle("rotated");
}

function selectOption(option, type, value) {
    const dropdown = option.closest('.dropdown');
    const button = dropdown.querySelector('.dropbtn');

    gameDuration = value;

    button.innerHTML = option.innerHTML + '<span class="material-symbols-outlined dropdown-arrow">keyboard_arrow_down</span>';

    dropdown.querySelector('.dropdown-content').classList.remove("show");

    const arrow = button.querySelector('.dropdown-arrow');
    arrow.classList.remove("rotated");
}

window.onclick = function(event) {
    if (!event.target.closest('.dropdown')) {
        const dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
                const arrow = openDropdown.previousElementSibling.querySelector('.dropdown-arrow');
                arrow.classList.remove("rotated");
            }
        }
    }
};

function startCountdown(seconds) {
    console.log('Starting countdown', seconds);

    let countdown = seconds;
    const element = document.getElementById('countdown');

    if (countdown > 0) {
        element.style.opacity = '1';
        element.textContent = countdown;
        countdown -= 1;
    } else {
        element.style.opacity = '0';
        element.textContent = '';
        clearInterval(intervalId);
        showCountdown = false;
    }

    const intervalId = setInterval(() => {
        if (countdown > 0 && showCountdown) {
            element.style.opacity = '1';
            element.textContent = countdown;
            countdown -= 1;
        } else {
            element.style.opacity = '0';
            element.textContent = '';
            clearInterval(intervalId);
            showCountdown = false;
        }
    }, 1000);
}

function areOptionsFilled() {
    const name = document.querySelector('.play-name').value.trim();
    const difficulty = document.querySelector('.radio-button.active-radio-button + .radio-button-text').textContent.trim();
    const durationButton = document.querySelector('#durationDropdown .dropbtn');
    const durationText = durationButton.querySelector('.dropdown-item-name');
    const duration = durationText ? durationText.textContent.trim() : '';
    const saveOptions = document.querySelector('.check-button.active-check-button') ? true : false;

    currentPlayerName = name;

    if (!name || !difficulty || duration === '') {
        return false;
    }

    if (difficulty == 'Easy') {
        easy = true;
    }

    if (difficulty == 'Hard') {
        easy = false;
    }

    return {
        name,
        difficulty,
        duration,
        saveOptions
    };
}

function play() {
    const options = areOptionsFilled();
    if (!options) {
        showNotification('Please fill out all options before playing', 'error', 3000);
        return;
    }

    console.log(JSON.stringify(options));

    if (options.saveOptions) {
        localStorage.setItem('gameOptions', JSON.stringify(options));
    }

    const mainMenu = document.getElementById('main-menu');
    mainMenu.style.opacity = '0';
    mainMenu.style.pointerEvents = 'none';
    startCountdown(3);
    lives = 3;
    score = 0;
    gameDuration = options.duration === 'Infinite' ? false : parseInt(options.duration);
    scoreSpan.textContent = score;
    showCountdown = true;
    updateLivesDisplay();
    updateTimeDisplay();

    if(easy) {
        targetTime = 3.0;
        targetSize = 150;
        spawnIntervalRange = [1, 3];
    }

    if(!easy) {
        targetTime = 1.5;
        targetSize = 75;
        spawnIntervalRange = [0.5, 1.5];
    }

    setTimeout(() => {
        if (!playing) {
            startSpawning();
            if (gameDuration !== false) {
                startGameTimer();
            }
            playing = true;
        } else {
            paused = false;
        }
    }, 3000);
}

function clearCache() {
    if (localStorage.getItem('gameOptions')) {
        localStorage.removeItem('gameOptions');
        showNotification('Saved options have been cleared', 'success', 3000);
        location.reload();
    } else {
        showNotification('No saved options to clear', 'warning', 3000);
    }
}

// my custom notif library that expects a message, type, and duration for its args
function showNotification(message, type = 'info', duration = 5000) {
    actualDuration = duration + 500;

    const notificationContainer = document.getElementById('notificationContainer');

    let color, colorLight, timerColor;

    const notification = document.createElement('div');
    notification.className = 'notification';

    const messageElem = document.createElement('span');
    messageElem.className = 'message';
    messageElem.textContent = message;

    const iconElem = document.createElement('i');
    switch (type) {
        case 'warning':
            color = '#fff';
            colorLight = '#FFA500';
            timerColor = '#fff';
            iconElem.className = 'fi fi-rr-triangle-warning';
            break;
        case 'success':
            color = '#fff';
            colorLight = '#28a745';
            timerColor = '#fff';
            iconElem.className = 'fi fi-rr-check';
            break;
        case 'error':
            color = '#fff';
            colorLight = '#FF0000';
            timerColor = '#fff';
            iconElem.className = 'fi fi-rr-octagon-xmark';
            break;
        case 'info':
        default:
            color = '#fff';
            colorLight = '#007bff';
            timerColor = '#fff';
            iconElem.className = 'fi fi-rr-info';
            break;
    }

    iconElem.style.color = color;
    notification.style.color = color;
    notification.style.backgroundColor = colorLight;
    notification.style.setProperty('--timer-color', timerColor);
    notification.style.setProperty('--timer-time', `${duration}ms`);

    notification.appendChild(iconElem);
    notification.appendChild(messageElem);
    notificationContainer.appendChild(notification);

    setTimeout(() => {
        notification.className = 'notification-fadein notification';
    }, 10);

    setTimeout(() => {
        notification.className = 'notification-fadeout notification';
    }, actualDuration - 500);

    setTimeout(() => {
        notificationContainer.removeChild(notification);
    }, actualDuration);
}

document.addEventListener('DOMContentLoaded', () => {
    loadSavedOptions();
    loadLeaderboard();
});

function loadSavedOptions() {
    const savedOptions = localStorage.getItem('gameOptions');
    if (savedOptions) {
        const options = JSON.parse(savedOptions);

        document.querySelector('.play-name').value = options.name;

        const difficultyButtons = document.querySelectorAll('.radio-button-wrapper');
        difficultyButtons.forEach(button => {
            const text = button.querySelector('.radio-button-text').textContent.trim();
            if (text === options.difficulty) {
                button.querySelector('.radio-button').classList.add('active-radio-button');
            } else {
                button.querySelector('.radio-button').classList.remove('active-radio-button');
            }
        });

        const durationDropdownItems = document.querySelectorAll('#durationDropdown .dropdown-item');
        durationDropdownItems.forEach(item => {
            const itemValue = item.querySelector('.dropdown-item-name').textContent.trim();
            if (itemValue === options.duration) {
                selectOption(item, 'duration', options.duration);
            }
        });

        if (options.saveOptions) {
            document.querySelector('.check-button').classList.add('active-check-button');
        } else {
            document.querySelector('.check-button').classList.remove('active-check-button');
        }

        showNotification('Saved options have been loaded', 'success', 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const notificationContainer = document.getElementById('notificationContainer');
    if (notificationContainer) {
        notificationContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('notification')) {
                console.log('Clicked notification');
                event.target.classList.add('notification-fadeout');
            }
        });
    }
});

function updateLeaderboard(name, score) {
    let leaderboardData = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboardData.push({ name, score });

    leaderboardData.sort((a, b) => b.score - a.score);

    localStorage.setItem('leaderboard', JSON.stringify(leaderboardData));

    renderLeaderboard(leaderboardData);
}

function loadLeaderboard() {
    const leaderboardData = JSON.parse(localStorage.getItem('leaderboard')) || [];

    leaderboardData.sort((a, b) => b.score - a.score);

    renderLeaderboard(leaderboardData);
}

function renderLeaderboard(leaderboardData) {
    const leaderboard = document.querySelector('.leaderboard-scores');
    leaderboard.innerHTML = '';

    leaderboardData.forEach(entry => {
        const scoreEntry = document.createElement('div');
        scoreEntry.className = 'leaderboard-score';

        const nameDiv = document.createElement('div');
        nameDiv.className = 'leaderboard-score-name';
        nameDiv.textContent = entry.name;

        const scoreDiv = document.createElement('div');
        scoreDiv.className = 'leaderboard-score-score';
        scoreDiv.textContent = entry.score;

        scoreEntry.appendChild(nameDiv);
        scoreEntry.appendChild(scoreDiv);
        leaderboard.appendChild(scoreEntry);
    });
}