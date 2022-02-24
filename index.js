const gameField = document.querySelector('.game__field');
const gameFieldCells = gameField.querySelectorAll('.game__field-cell');
const gameBtnRestart = document.querySelector('.game__btn-restart')
const gameBtnRecords = document.querySelector('.game__btn-records');
const gameBtnSettings = document.querySelector('.game__btn-settings');
const modal = document.querySelector('.modal');
const modalBtnClose = modal.querySelector('.modal__btn-close');
const modalTitle = modal.querySelector('.modal__title');
const modalBody = modal.querySelector('.modal__body');

gameField.addEventListener('click', makeStep);
gameBtnRestart.addEventListener('click', restart);
modalBtnClose.addEventListener('click', closeModal);
gameBtnRecords.addEventListener('click', showRecords);
gameBtnSettings.addEventListener('click', showSettings);
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

const planets = ['Sun', 'Mercury', 'Venus', 'Earth', 'Moon', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
const PLANET_TEXT = 'Planet';

const players = ['Astronaut', 'Alien'];
const PLAYER_TEXT = 'Player';

setGameFieldPlanet();

let step = 1;

function makeStep(event) {
  const gameFieldElement = event.target;
  const isGameFieldElementCell = gameFieldElement.classList.contains(GAME_FIELD_CELL_CLASSES.BASIC);
  if (isGameFieldElementCell) {
    const gameFieldCell = gameFieldElement;
    const isStepPossible = gameFieldCell.classList.length === 1;
    if (isStepPossible) {
      if (getPlayer() === 'Astronaut') {
        gameFieldCell.classList.add(isFirstPlayer() ? GAME_FIELD_CELL_CLASSES.ASTRONAUT : GAME_FIELD_CELL_CLASSES.ALIEN);
      } else {
        gameFieldCell.classList.add(isFirstPlayer() ? GAME_FIELD_CELL_CLASSES.ALIEN : GAME_FIELD_CELL_CLASSES.ASTRONAUT);
      }

      if (isWinCombinationExists() || step === 9) {
        modalTitle.textContent = 'End game';
        modalBody.textContent = '';

        const p = document.createElement('p');
        p.classList.add('modal__text');

        let recordText = '';
        if (isWinCombinationExists()) {
          if (getPlayer() === 'Astronaut') {
            p.textContent = `${isFirstPlayer() ? 'Astrounauts' : 'Aliens'} win!`;
            p.classList.add(isFirstPlayer() ? MODAL_TEXT_ICON_CLASSES.ASTRONAUT : MODAL_TEXT_ICON_CLASSES.ALIEN);
            recordText += `${isFirstPlayer() ? 'Astrounauts' : 'Aliens'}: `;
          } else {
            p.textContent = `${isFirstPlayer() ? 'Aliens' : 'Astronauts'} win!`;
            p.classList.add(isFirstPlayer() ? MODAL_TEXT_ICON_CLASSES.ALIEN : MODAL_TEXT_ICON_CLASSES.ASTRONAUT);
            recordText += `${isFirstPlayer() ? 'Aliens' : 'Astronauts'}: `;
          }
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
  const isFillGameFieldCell = gameFieldCell => {
    if (getPlayer() === 'Astronaut') {
      return gameFieldCell.classList.contains(isFirstPlayer() ? GAME_FIELD_CELL_CLASSES.ASTRONAUT : GAME_FIELD_CELL_CLASSES.ALIEN);
    }

    return gameFieldCell.classList.contains(isFirstPlayer() ? GAME_FIELD_CELL_CLASSES.ALIEN : GAME_FIELD_CELL_CLASSES.ASTRONAUT);
  };

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
  ol.classList.add('modal__records-list');

  const records = getRecords();
  records.forEach(recordText => {
    const li = document.createElement('li');
    li.classList.add('modal__records-item');
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

function showSettings() {
  modalBody.textContent = '';
  modalTitle.textContent = 'Settings';

  restart();

  const form = document.createElement('form');
  form.classList.add('modal__settings-form', 'settings-form');
  form.append(createSettingsPlayerElement());
  form.append(createSettingsPlanetElement());
  form.insertAdjacentHTML('beforeend', '<input class="btn settings-form__btn-save" type="submit" value="Save">');

  form.addEventListener('submit', saveSettings);

  modalBody.append(form);

  openModal();
}

function createSettingsPlanetElement() {
  const fieldset = document.createElement('fieldset');
  fieldset.classList.add('settings-form__planet');

  const legend = document.createElement('legend');
  legend.classList.add('settings-form__planet-title');
  legend.textContent = PLANET_TEXT;
  fieldset.append(legend);

  planets.forEach(planet => {
    const label = document.createElement('label');
    label.classList.add('settings-form__planet-item', 'settings-form__planet-item--' + planet.toLowerCase());
    label.textContent = planet;

    const input = document.createElement('input');
    input.classList.add('settings-form__planet-input');
    input.type = 'radio';
    input.checked = (getPlanet() === planet);
    input.name = PLANET_TEXT;
    input.value = planet;
    label.append(input);

    const span = document.createElement('span');
    span.classList.add('settings-form__planet-checkmark');
    label.append(span);
  
    fieldset.append(label);
  });

  return fieldset;
}

function createSettingsPlayerElement() {
  const fieldset = document.createElement('fieldset');
  fieldset.classList.add('settings-form__player');

  const legend = document.createElement('legend');
  legend.classList.add('settings-form__player-title');
  legend.textContent = PLAYER_TEXT;
  fieldset.append(legend);

  players.forEach(player => {
    const label = document.createElement('label');
    label.classList.add('settings-form__player-item', 'settings-form__player-item--' + player.toLowerCase());
    label.textContent = player;

    const input = document.createElement('input');
    input.classList.add('settings-form__player-input');
    input.type = 'radio';
    input.checked = (getPlayer() === player);
    input.name = PLAYER_TEXT;
    input.value = player;
    label.append(input);

    const span = document.createElement('span');
    span.classList.add('settings-form__player-checkmark');
    label.append(span);
  
    fieldset.append(label);
  });

  return fieldset;
}

function saveSettings(event) {
  event.preventDefault();

  const planet = event.target[PLANET_TEXT].value;
  if (planets.includes(planet)) {
    savePlanet(planet);
  }

  const player = event.target[PLAYER_TEXT].value;
  if (players.includes(player)) {
    savePlayer(player);
  }

  setGameFieldPlanet();

  closeModal();
}

function savePlanet(planetName) {
  localStorage.setItem(PLANET_TEXT, planetName);
}

function getPlanet() {
  const planet = localStorage.getItem(PLANET_TEXT);

  if (planet !== null && planet !== undefined) {
    return planet;
  }

  return 'Moon';
}

function savePlayer(playerName) {
  localStorage.setItem(PLAYER_TEXT, playerName);
}

function getPlayer() {
  const player = localStorage.getItem(PLAYER_TEXT);

  if (player !== null && player !== undefined) {
    return player;
  }

  return 'Astronaut';
}

function setGameFieldPlanet() {
  gameField.style.backgroundImage = `url('./assets/img/svg/${getPlanet().toLowerCase()}.svg')`;
}