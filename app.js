// // Configurable variables
// let lives = 3; // Number of lives
// let targetTime = 2.0; // Countdown in seconds
// let targetSize = 100; // Diameter of the target in pixels
// let spawnDecoy = true; // Boolean for spawning decoys
// let spawnIntervalRange = [1, 3]; // Range for random spawn intervals in seconds
// let streak = 0; // Streak counter
// let paused = false // Pause boolean

// const gameArea = document.getElementById('game-area');
// const info = document.getElementById('info');
// const livesSpan = document.getElementById('lives');
// const streakSpan = document.getElementById('streak');

// function updateLivesDisplay() {
//     livesSpan.innerHTML = '';
//     for (let i = 0; i < 3; i++) {
//         const life = document.createElement('span');
//         life.className = 'life';
//         if (i < lives) {
//             life.textContent = '❤️';
//         } else {
//             life.textContent = '💔';
//             life.classList.add('lost');
//         }
//         livesSpan.appendChild(life);
//     }
// }

// updateLivesDisplay();
// streakSpan.textContent = streak;

// function spawnTarget() {
//     if (paused) {
//         return
//     }

//     const isDecoy = spawnDecoy && Math.random() < 0.3; // 30% chance of a decoy
//     const target = document.createElement('div');
//     target.className = isDecoy ? 'decoy' : 'target';
//     target.style.width = `${targetSize}px`;
//     target.style.height = `${targetSize}px`;
//     target.classList.add('game-object')

//     // Random position within the game area
//     const x = Math.random() * (gameArea.clientWidth - targetSize);
//     const y = Math.random() * (gameArea.clientHeight - targetSize);

//     target.style.left = `${x}px`;
//     target.style.top = `${y}px`;

//     let countdownTime = targetTime;

//     target.classList.add('fadeIn');

//     setTimeout(() => {
//         target.classList.remove('fadeIn');
//     }, 100);

//     // Add shrinkOutline animation with dynamic duration
//     target.style.animation = `shrinkOutline ${targetTime}s linear, fadeIn 0.3s`;

//     if (!isDecoy) {
//         target.textContent = countdownTime.toFixed(1);
//         const countdownInterval = setInterval(() => {
//             countdownTime -= 0.1;
//             target.textContent = countdownTime <= 0 ? '0' : countdownTime.toFixed(1);
//         }, 100);

//         setTimeout(() => {
//             clearInterval(countdownInterval);
//             if (!target.getAttribute('clicked')) {
//                 // Deduct a life if missed
//                 if (!paused) {
//                     lives -= 1;
//                     streak = 0; // Reset streak
//                     updateLivesDisplay();
//                     streakSpan.textContent = streak;
//                     document.getElementById('game-area').classList.add('lost-life');
//                     setTimeout(() => {
//                         document.getElementById('game-area').classList.remove('lost-life');
//                     }, 500);
//                     if (lives <= 0) {
//                         alert('Game Over!');
//                         resetGame();
//                     }
//                     target.classList.add('fadeOut');
//                     setTimeout(() => {
//                         if (!target.getAttribute('clicked')) {
//                             if (gameArea.contains(target)) {
//                                 gameArea.removeChild(target);
//                             }
//                         }
//                     }, 300);
//                 }
//             }
//         }, targetTime * 1000);
//     } else {
//         target.textContent = "💀";

//         setTimeout(() => {
//             if (gameArea.contains(target)) {
//                 target.classList.add('fadeOut');
//                 setTimeout(() => {
//                     if (gameArea.contains(target)) {
//                         gameArea.removeChild(target);
//                     }
//                 }, 300);
//             }
//         }, targetTime * 1000);
//     }

//     gameArea.appendChild(target);

//     // Event listener for clicking the target or decoy
//     target.addEventListener('click', () => {
//         target.setAttribute('clicked', true);
//         if (!isDecoy) {
//             streak += 1; // Increment streak
//             streakSpan.textContent = streak;
//             target.classList.add('fadeOut');
//             setTimeout(() => {
//     if (gameArea.contains(target)) {
//         gameArea.removeChild(target);
//     }
// }, 300);
//         } else {
//             // Penalise for clicking a red target
//             if (!paused) {
//                 lives -= 1;
//                 streak = 0; // Reset streak
//                 document.getElementById('game-area').classList.add('lost-life');
//                 setTimeout(() => {
//                         document.getElementById('game-area').classList.remove('lost-life');
//                     }, 500);
//                 updateLivesDisplay();
//                 streakSpan.textContent = streak;
//                 if (lives <= 0) {
//                     alert('Game Over!');
//                     resetGame();
//                 }
//                 target.classList.add('fadeOut');
//                 setTimeout(() => {
//                 if (gameArea.contains(target)) {
//                         gameArea.removeChild(target);
//                     }
//                 }, 300);
//             }
//         }
//     });
// }

// function resetGame() {
//     lives = 3;
//     streak = 0;
//     updateLivesDisplay();
//     streakSpan.textContent = streak;
// }

// function getRandomInterval() {
//     const [min, max] = spawnIntervalRange;
//     return Math.random() * (max - min) + min;
// }

// function startSpawning() {
//     function spawnLoop() {
//         if (paused) {
//             return; // Exit the loop if paused is true
//         }
//         spawnTarget();
//         setTimeout(spawnLoop, getRandomInterval() * 1000);
//     }
//     spawnLoop();
// }

// // Start spawning targets
// startSpawning();

// function showExitConf() {
//     const wrapper = document.getElementById('exit-conf')
//     wrapper.style.opacity = '1'
//     wrapper.style.pointerEvents = 'all'
//     paused = true

//     document.querySelectorAll('.game-object').forEach(element => {
//         element.classList.add('fadeOut');
//         setTimeout(() => {
//             element.remove();
//         }, 300);
//     });
// }

// function hideExitConf() {
//     const wrapper = document.getElementById('exit-conf')
//     wrapper.style.opacity = '0'
//     wrapper.style.pointerEvents = 'none'
//     paused = false
//     startSpawning()
// }

// function showMainMenu() {
//     const mainMenu = document.getElementById('main-menu');
//     mainMenu.style.opacity = '1'
//     mainMenu.style.pointerEvents = 'all'
//     mainMenu.style.scale = '1'
// }