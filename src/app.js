const buttonsX = Array.from(document.querySelectorAll('.playerChoice'));
const buttonsO = buttonsX.splice(2);
const home = document.querySelector('.homeButton');
const gameScreen = document.querySelector('.gameActive');
const startScreen = document.querySelector('.startPage');

const selected = (...args) => {
  for (let i = 0; i < args.length; i++) {
    if (args[i].classList.contains('selected')) {
      return true;
    }
  }
  return false;
};

const handler = (buttons) => {
  buttons.forEach((currentButton) => {
    currentButton.addEventListener('click', () => {
      const otherButton = buttons.filter((opt) => opt !== currentButton)[0];

      // Ensure the hover effect is only applied when both buttons
      // are not pressed
      if (!selected(currentButton, otherButton)) {
        currentButton.classList.add('selected');
        otherButton.classList.remove('hover');
      } else if (selected(currentButton)) {
        currentButton.classList.remove('selected');
        currentButton.classList.add('hover');
        otherButton.classList.add('hover');
      } else {
        currentButton.classList.add('selected');
        otherButton.classList.remove('selected');
        otherButton.classList.remove('hover');
      }
    });
  });
};

handler(buttonsX);
handler(buttonsO);
