const gameField = document.querySelector('.game__field');
gameField.addEventListener('click', makeStep);

let step = 1;

function makeStep(event) {
  const gameFieldElement = event.target;
  const isGameFieldElementCeil = gameFieldElement.classList.contains('game__field-ceil');
  if (isGameFieldElementCeil) {
    const gameFieldCeil = gameFieldElement;
    const isStepPossible = gameFieldCeil.classList.length === 1;
    if (isStepPossible) {
      const isFirstPlayer = step % 2 !== 0;
      gameFieldCeil.classList.add(`game__field-ceil--${isFirstPlayer ? 'astronaut' : 'alien'}`);
      step++;
    }
  }
}