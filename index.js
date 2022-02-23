const gameField = document.querySelector('.game__field');
gameField.addEventListener('click', makeStep);

let step = 1;

function makeStep(event) {
  const gameFieldElement = event.target;
  const isGameFieldElementcell = gameFieldElement.classList.contains('game__field-cell');
  if (isGameFieldElementcell) {
    const gameFieldcell = gameFieldElement;
    const isStepPossible = gameFieldcell.classList.length === 1;
    if (isStepPossible) {
      const isFirstPlayer = step % 2 !== 0;
      gameFieldcell.classList.add(`game__field-cell--${isFirstPlayer ? 'astronaut' : 'alien'}`);
      step++;
    }
  }
}