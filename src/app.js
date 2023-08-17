const displayController = (() => {
  const startPage = document.querySelector('.startPage');
  const gameScreen = document.querySelector('.gamePage');
  const startButton = document.querySelector('.vs a');
  const vs = document.querySelector('.text');

  const resetButtons = (buttons) => {
    buttons.forEach((button) => {
      button.classList.remove('selected');
      button.classList.add('hover');
    });
    startButton.style.display = 'none';
    vs.style.display = 'block';
    gameScreen.style.display = 'none';
    startPage.style.display = 'grid';
  };

  const selectButton = (clicked) => {
    const parent = clicked.parentNode;
    const otherButton = Array.from(parent.children).filter(
      (button) => button !== clicked
    )[0];
    otherButton.classList.remove('hover');
    if (!clicked.classList.contains('selected')) {
      if (otherButton.classList.contains('selected')) {
        clicked.classList.add('selected');
        otherButton.classList.remove('selected');
      } else {
        clicked.classList.add('selected');
      }
    } else {
      clicked.classList.remove('selected');
      clicked.classList.add('hover');
      otherButton.classList.add('hover');
    }
  };

  const startBtn = (picked) => {
    if (picked) {
      vs.style.display = 'none';
      startButton.style.display = 'block';
    } else {
      vs.style.display = 'block';
      startButton.style.display = 'none';
    }
  };

  const bothPicked = (buttons) => {
    const picked = buttons.filter((button) =>
      button.classList.contains('selected')
    );
    if (picked.length === 2) {
      startBtn(true);
    } else {
      startBtn(false);
    }
    return picked;
  };

  const startGame = () => {
    startPage.style.display = 'none';
    gameScreen.style.display = 'flex';
  };

  const home = (buttons) => {
    resetButtons(buttons);
  };

  return { selectButton, bothPicked, startBtn, startGame, home };
})();

const game = (() => {
  const start = (selections) => {};

  const playerChoices = () => {
    const buttons = Array.from(document.querySelectorAll('.playerChoice'));
    const startButton = document.querySelector('.vs a');
    const homeButton = document.querySelector('.homeButton');
    let selections = null;

    buttons.forEach((button) => {
      button.addEventListener('click', (e) => {
        displayController.selectButton(e.target);
        selections = displayController.bothPicked(buttons);
      });
    });

    startButton.addEventListener('click', () => {
      displayController.startGame();
      start(selections);
    });

    homeButton.addEventListener('click', () => {
      displayController.home(buttons);
    });
  };

  return { playerChoices };
})();

game.playerChoices();
