let currentPlayer = 'X';
let gameBoard = [];
let gameOver = false;
let whoStartedFirst = 'X';
const rows = 10;
const cols = 10;
const winCondition = 5;

// Инициализация игрового поля
function createBoard() {
  gameBoard = Array.from({ length: rows }, () => Array(cols).fill(''));
  const board = document.getElementById('game-board');
  board.innerHTML = '';

  // Добавляем класс для 10x10
  board.classList.add('tenxten');

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener('click', handleMove);
      board.appendChild(cell);
    }
  }
  updateCurrentPlayerDisplay();
}

// Обработка хода игрока
function handleMove(event) {
  if (gameOver) return;

  const cell = event.target;
  const row = parseInt(cell.dataset.row, 10);
  const col = parseInt(cell.dataset.col, 10);

  if (gameBoard[row][col] === '') {
    gameBoard[row][col] = currentPlayer;
    cell.textContent = currentPlayer;

    const winnerCells = checkWinner(row, col);
    if (winnerCells) {
      gameOver = true;
      highlightWinner(winnerCells);
      document.getElementById(
        'result'
      ).textContent = `Игрок ${currentPlayer} выиграл!`;

      setTimeout(resetGame, 2000);
    } else if (gameBoard.flat().every((cell) => cell !== '')) {
      gameOver = true;
      document.getElementById('result').textContent = 'Ничья!';
      setTimeout(resetGame, 2000);
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      updateCurrentPlayerDisplay();
    }
  }
}

// Проверка победителя
function checkWinner(row, col) {
  const directions = [
    { dr: 0, dc: 1 }, // Горизонталь
    { dr: 1, dc: 0 }, // Вертикаль
    { dr: 1, dc: 1 }, // Главная диагональ
    { dr: 1, dc: -1 }, // Побочная диагональ
  ];

  for (let { dr, dc } of directions) {
    let count = 1;
    let cells = [[row, col]];

    // Проверяем в одну сторону
    for (let i = 1; i < winCondition; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      if (
        r >= 0 &&
        r < rows &&
        c >= 0 &&
        c < cols &&
        gameBoard[r][c] === currentPlayer
      ) {
        count++;
        cells.push([r, c]);
      } else {
        break;
      }
    }

    // Проверяем в другую сторону
    for (let i = 1; i < winCondition; i++) {
      const r = row - dr * i;
      const c = col - dc * i;
      if (
        r >= 0 &&
        r < rows &&
        c >= 0 &&
        c < cols &&
        gameBoard[r][c] === currentPlayer
      ) {
        count++;
        cells.push([r, c]);
      } else {
        break;
      }
    }

    if (count >= winCondition) {
      return cells;
    }
  }
  return null;
}

// Подсветка выигрышных ячеек
function highlightWinner(winnerCells) {
  winnerCells.forEach(([row, col]) => {
    const cell = document.querySelector(
      `[data-row="${row}"][data-col="${col}"]`
    );
    cell.classList.add('highlight');
  });
}

// Обновление текущего игрока
function updateCurrentPlayerDisplay() {
  document.getElementById(
    'current-player'
  ).textContent = `Ход игрока: ${currentPlayer}`;
}

// Сброс игры
function resetGame() {
  gameOver = false;
  document.getElementById('result').textContent = '';
  createBoard();

  // Меняем того, кто начинает
  currentPlayer = whoStartedFirst === 'X' ? 'O' : 'X';
  whoStartedFirst = currentPlayer;
  updateCurrentPlayerDisplay();
}

// Начало игры
createBoard();
