let currentPlayer = 'X';
let gameBoard = [];
let gameOver = false;
let winCondition;
let scoreX = 0;
let scoreO = 0;
let whoStartedFirst = 'X';

// Инициализация игрового поля
function createBoard(rows = 3, cols = 3) {
  gameBoard = Array.from({ length: rows }, () => Array(cols).fill(''));
  const board = document.getElementById('game-board');
  board.innerHTML = '';
  board.style.gridTemplateColumns = `repeat(${cols}, 100px)`;
  board.style.gridTemplateRows = `repeat(${rows}, 100px)`;

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

    const winnerCells = checkWinner();
    if (winnerCells) {
      gameOver = true;
      highlightWinner(winnerCells);

      if (currentPlayer === 'X') scoreX++;
      else scoreO++;

      updateScores();
      document.getElementById(
        'result'
      ).textContent = `Игрок ${currentPlayer} выиграл раунд!`;

      if (scoreX >= winCondition || scoreO >= winCondition) {
        document.getElementById(
          'result'
        ).textContent = `Игрок ${currentPlayer} выиграл турнир!`;
        document.getElementById('restart-game').style.display = 'block';
      } else {
        whoStartedFirst = whoStartedFirst === 'X' ? 'O' : 'X';
        setTimeout(resetRound, 2000);
      }
    } else if (gameBoard.flat().every((cell) => cell !== '')) {
      gameOver = true;
      document.getElementById('result').textContent = 'Ничья!';
      whoStartedFirst = whoStartedFirst === 'X' ? 'O' : 'X';
      setTimeout(resetRound, 2000);
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

// Сброс раунда
function resetRound() {
  gameOver = false;
  document.getElementById('result').textContent = '';
  createBoard(3, 3);

  // Следующий раунд начинает игрок, противоположный тому, кто начинал предыдущий раунд
  currentPlayer = whoStartedFirst;
  updateCurrentPlayerDisplay();
}

// Обновление текущего игрока
function updateCurrentPlayerDisplay() {
  document.getElementById(
    'current-player'
  ).textContent = `Ход игрока: ${currentPlayer}`;
}

// Обновление счёта
function updateScores() {
  document.getElementById('score-x').textContent = scoreX;
  document.getElementById('score-o').textContent = scoreO;
}

// Начало игры
document.getElementById('start-game').addEventListener('click', () => {
  const inputWinCount = parseInt(
    document.getElementById('win-count').value,
    10
  );

  if (isNaN(inputWinCount) || inputWinCount <= 0) {
    alert('Введите корректное количество побед!');
    return;
  }

  winCondition = inputWinCount;
  scoreX = 0;
  scoreO = 0;
  currentPlayer = 'X';
  whoStartedFirst = 'X';
  updateScores();
  document.getElementById('result').textContent = '';

  document.getElementById('setup').style.display = 'none';
  document.getElementById('status').style.display = 'block';
  document.getElementById('game-board').style.display = 'grid';
  document.getElementById('restart-game').style.display = 'none';
  createBoard(3, 3);
});

// Перезапуск игры
document.getElementById('restart-game').addEventListener('click', () => {
  location.reload(); // Перезапуск страницы
});
