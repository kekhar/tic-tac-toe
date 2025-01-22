let currentPlayer = 'X';
let gameBoard = [];
let gameOver = false;

// Инициализация игрового поля
function createBoard(rows = 3, cols = 3) {
  gameBoard = Array.from({ length: rows }, () => Array(cols).fill(''));
  const board = document.getElementById('game-board');
  board.innerHTML = '';

  // Применяем стили в зависимости от размеров поля
  board.style.gridTemplateColumns = `repeat(${cols}, 100px)`;
  board.style.gridTemplateRows = `repeat(${rows}, 100px)`;

  // Генерируем клетки поля
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
  const row = cell.dataset.row;
  const col = cell.dataset.col;

  if (gameBoard[row][col] === '') {
    gameBoard[row][col] = currentPlayer;
    cell.textContent = currentPlayer;

    const winnerCells = checkWinner();
    if (winnerCells) {
      gameOver = true;
      highlightWinner(winnerCells);
      document.getElementById(
        'result'
      ).textContent = `Игрок ${currentPlayer} выиграл!`;
      setTimeout(switchPlayer, 2000);
    } else if (gameBoard.flat().every((cell) => cell !== '')) {
      gameOver = true;
      document.getElementById('result').textContent = 'Ничья!';
      setTimeout(switchPlayer, 2000);
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      updateCurrentPlayerDisplay();
    }
  }
}

// Проверка победителя
function checkWinner() {
  const rows = gameBoard.length;
  const cols = gameBoard[0].length;

  // Проверка строк
  for (let i = 0; i < rows; i++) {
    if (gameBoard[i].every((cell) => cell === currentPlayer)) {
      return gameBoard[i].map((_, col) => [i, col]);
    }
  }

  // Проверка столбцов
  for (let j = 0; j < cols; j++) {
    if (gameBoard.every((row) => row[j] === currentPlayer)) {
      return gameBoard.map((_, row) => [row, j]);
    }
  }

  // Проверка главной диагонали
  if (gameBoard.every((row, idx) => row[idx] === currentPlayer)) {
    return gameBoard.map((_, idx) => [idx, idx]);
  }

  // Проверка побочной диагонали
  if (gameBoard.every((row, idx) => row[cols - 1 - idx] === currentPlayer)) {
    return gameBoard.map((_, idx) => [idx, cols - 1 - idx]);
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

// Смена игрока
function switchPlayer() {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  gameOver = false;
  document.getElementById('result').textContent = '';
  createBoard(3, 3);
}

// Обновление текущего игрока
function updateCurrentPlayerDisplay() {
  document.getElementById(
    'current-player'
  ).textContent = `Ход игрока: ${currentPlayer}`;
}

// Инициализация
createBoard(3, 3);
