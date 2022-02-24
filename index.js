const gameField = document.querySelector('.game__field');
const gameFieldCells = gameField.querySelectorAll('.game__field-cell');
const gameBtnRestart = document.querySelector('.game__btn-restart')
const gameBtnRecords = document.querySelector('.game__btn-records');
const modal = document.querySelector('.modal');
const modalBtnClose = modal.querySelector('.modal__btn-close');
const modalTitle = modal.querySelector('.modal__title');
const modalBody = modal.querySelector('.modal__body');

gameField.addEventListener('click', makeStep);
gameBtnRestart.addEventListener('click', restart);
modalBtnClose.addEventListener('click', closeModal);
gameBtnRecords.addEventListener('click', showRecords);
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
        modalTitle.textContent = 'End game';
        modalBody.textContent = '';

        const p = document.createElement('p');
        p.classList.add('modal__text');

        let recordText = '';
        if (step !== 9) {
          p.textContent = `${isFirstPlayer() ? 'Astrounauts' : 'Aliens'} win!`;
          p.classList.add(isFirstPlayer() ? MODAL_TEXT_ICON_CLASSES.ASTRONAUT : MODAL_TEXT_ICON_CLASSES.ALIEN);
          recordText += `${isFirstPlayer() ? 'Astrounauts' : 'Aliens'}: `;
        } else {
          p.textContent = 'It\'s draw!';
          p.classList.add(MODAL_TEXT_ICON_CLASSES.DRAW);
          recordText += 'Draw: ';
        }

        const span = document.createElement('span');
        span.classList.add('modal__text-span');
        span.textContent = `${step} steps`;
        recordText += `${step} steps`;
        p.append(span);

        modalBody.append(p);
        saveRecord(recordText);
        restart();
        openModal();
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

function openModal() {
  modal.style.display = "flex";
}

function closeModal() {
  modal.style.display = "none";
}

function showRecords() {
  openModal();
  modalTitle.textContent = 'Records';
  modalBody.textContent = '';

  const ol = document.createElement('ol');
  ol.classList.add('modal__list');

  const records = getRecords();
  records.forEach(recordText => {
    const li = document.createElement('li');
    li.classList.add('modal__list-item');
    li.textContent = recordText;
    ol.append(li);
  });

  modalBody.append(ol);
}

function saveRecord(recordText) {
  const records = getRecords();
  const lastGameText = ' - last game';

  if (records.length) {
    records.push(recordText);
    if (records.length > 10) {
      records.shift();
    }

    localStorage.setItem('records', records.join(';').replace(lastGameText, '') + lastGameText);
  } else {
    localStorage.setItem('records', [recordText + lastGameText]);
  }
}

function getRecords() {
  const records = localStorage.getItem('records');

  if (records !== null && records !== undefined) {
    return records.split(';');
  }
  
  return [];
}
