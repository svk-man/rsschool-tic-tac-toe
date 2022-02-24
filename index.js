const gameField = document.querySelector('.game__field');
const gameFieldCells = gameField.querySelectorAll('.game__field-cell');
gameField.addEventListener('click', makeStep);

const GAME_FIELD_CELL_CLASSES = {
  'BASIC': 'game__field-cell',
  'ASTRONAUT': 'game__field-cell--astronaut',
  'ALIEN': 'game__field-cell--alien',
};

let step = 1;

function makeStep(event) {
  const gameFieldElement = event.target;
  const isGameFieldElementCell = gameFieldElement.classList.contains(GAME_FIELD_CELL_CLASSES.BASIC);
  if (isGameFieldElementCell) {
    const gameFieldCell = gameFieldElement;
    const isStepPossible = gameFieldCell.classList.length === 1;
    if (isStepPossible) {
      gameFieldCell.classList.add(isFirstPlayer() ? GAME_FIELD_CELL_CLASSES.ASTRONAUT : GAME_FIELD_CELL_CLASSES.ALIEN);
      if (isWinCombinationExists()) {
        restart();
        alert('It\'s winning combination! ' + (`${isFirstPlayer() ? 'Astrounauts' : 'Aliens'} win!`));
      } else if (step === 9) {
        restart();
        alert('It\'s draw!');
      } else {
        step++;
      }
    }
  }
}

function isFirstPlayer() {
  return step % 2 !== 0;
}

function isWinCombinationExists() {
  const winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  return winCombinations.findIndex(isWinCombination) !== -1;
}

function isWinCombination(winCombination) {
  const isFillGameFieldCell = gameFieldCell => gameFieldCell.classList.contains(isFirstPlayer() ? GAME_FIELD_CELL_CLASSES.ASTRONAUT : GAME_FIELD_CELL_CLASSES.ALIEN);

  return isFillGameFieldCell(gameFieldCells[winCombination[0]]) &&
    isFillGameFieldCell(gameFieldCells[winCombination[1]]) &&
    isFillGameFieldCell(gameFieldCells[winCombination[2]]);
}

function restart() {
  gameFieldCells.forEach(gameFieldCell => {
    gameFieldCell.classList.remove(GAME_FIELD_CELL_CLASSES.ASTRONAUT, GAME_FIELD_CELL_CLASSES.ALIEN);
    step = 1;
  });
}