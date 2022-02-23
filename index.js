const gameField = document.querySelector('.game__field');
gameField.addEventListener('click', makeStep);

let step = 1;

function makeStep(event) {
  const gameFieldElement = event.target;
  const isGameFieldElementCell = gameFieldElement.classList.contains('game__field-cell');
  if (isGameFieldElementCell) {
    const gameFieldCell = gameFieldElement;
    const isStepPossible = gameFieldCell.classList.length === 1;
    if (isStepPossible) {
      const isFirstPlayer = step % 2 !== 0;
      gameFieldCell.classList.add(`game__field-cell--${isFirstPlayer ? 'astronaut' : 'alien'}`);
      step++;
    }
  }
}
