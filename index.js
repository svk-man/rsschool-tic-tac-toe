const gameField = document.querySelector('.game__field');
const gameFieldCells = gameField.querySelectorAll('.game__field-cell');
const gameBtnRestart = document.querySelector('.game__btn-restart');
const modal = document.querySelector('.modal');
const modalBtnClose = modal.querySelector('.modal__btn-close');
const modalSteps = modal.querySelector('.modal__steps');
const modalText = modal.querySelector('.modal__text');

gameField.addEventListener('click', makeStep);
gameBtnRestart.addEventListener('click', restart);
modalBtnClose.addEventListener('click', closeModal);
window.addEventListener('click', (event) => {
  if (event.target == modal) {
    closeModal();
  }
});

const GAME_FIELD_CELL_CLASSES = {
  'BASIC': 'game__field-cell',
  'ASTRONAUT': 'game__field-cell--astronaut',
  'ALIEN': 'game__field-cell--alien',
};

const MODAL_TEXT_ICON_CLASSES = {
  'ASTRONAUT': 'modal__text--astronaut',
  'ALIEN': 'modal__text--alien',
  'DRAW': 'modal__text--draw',
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
      if (isWinCombinationExists() || step === 9) {
        const stepsElement = document.createElement('span');
        stepsElement.classList.add('modal__text-span');
        stepsElement.textContent = `${step} steps`;

        if (step !== 9) {
          modalText.textContent = `${isFirstPlayer() ? 'Astrounauts' : 'Aliens'} win!`;
          setModalTextIcon(isFirstPlayer() ? MODAL_TEXT_ICON_CLASSES.ASTRONAUT : MODAL_TEXT_ICON_CLASSES.ALIEN);
        } else {
          modalText.textContent = 'It\'s draw!';
          setModalTextIcon(MODAL_TEXT_ICON_CLASSES.DRAW);
        }

        modalText.append(stepsElement);
        restart();
        openModal();
      } else {
        step++;
      }
    }
  }
}

function setModalTextIcon(modalTextIconClass) {
  modalText.classList.remove(MODAL_TEXT_ICON_CLASSES.ASTRONAUT, MODAL_TEXT_ICON_CLASSES.ALIEN, MODAL_TEXT_ICON_CLASSES.DRAW);
  modalText.classList.add(modalTextIconClass);
};

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

function openModal() {
  modal.style.display = "flex";
}

function closeModal() {
  modal.style.display = "none";
}
