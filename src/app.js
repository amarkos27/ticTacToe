const displayController = (() => {
  const startPage = document.querySelector('.startPage');
  const gamePage = document.querySelector('.gamePage');
  const startButton = document.querySelector('.vs a');
  const vs = document.querySelector('.text');

  const resetButtons = (buttons) => {
    buttons.forEach((button) => {
      button.classList.remove('selected');
      button.classList.add('hover');
    });
    startButton.style.display = 'none';
    vs.style.display = 'block';
  };

  const fade = (from, to) => {
    from.classList.add('fadeOut');
    setTimeout(() => {
      from.style.display = 'none';
      from.classList.remove('fadeOut');
      to.style.display = 'block';
      to.classList.add('fadeIn');
      setTimeout(() => {
        to.classList.remove('fadeIn');
      }, 250);
    }, 250);
  };

  const pageSwitch = (from, to, display) => {
    from.classList.add('pageLeave');
    setTimeout(() => {
      from.style.display = 'none';
      from.classList.remove('pageLeave');
      to.style.display = display;
      to.classList.add('pageOpen');
      setTimeout(() => {
        to.classList.remove('pageOpen');
      }, 250);
    }, 250);
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

  const startBtn = (ready) => {
    if (ready) {
      fade(vs, startButton);
    } else {
      fade(startButton, vs);
    }
  };

  const bothPicked = (alreadyPicked) => {
    const current = document.querySelectorAll('.selected');
    if (!alreadyPicked) {
      return current;
    }
    if (current.length === 0) {
      return null;
    }
    if (current.length === 2) {
      startBtn(true);
    }
    if (alreadyPicked.length > current.length) {
      startBtn(false);
    }
    return current;
  };

  const startGame = () => {
    pageSwitch(startPage, gamePage, 'flex');
  };

  const home = (buttons) => {
    resetButtons(buttons);
    pageSwitch(gamePage, startPage, 'grid');
  };

  const fill = (cell) => {
    if (!cell.hasChildNodes()) {
      const choice = document.createElement('div');
      choice.classList.add('fill');
      choice.textContent = 'X';
      cell.appendChild(choice);
      cell.classList.remove('hover');
    } else {
      cell.classList.add('alreadyPicked');
      setTimeout(() => {
        cell.classList.remove('alreadyPicked');
      }, 500);
    }
  };

  return { selectButton, bothPicked, startBtn, startGame, home, fill };
})();

const game = (() => {
  const start = (selections) => {
    const cells = Array.from(document.querySelectorAll('.cell'));
    cells.forEach((cell) => {
      cell.addEventListener('click', () => {
        displayController.fill(cell);
      });
    });
  };

  const playerChoices = () => {
    const buttons = Array.from(document.querySelectorAll('.playerChoice'));
    const startButton = document.querySelector('.vs a');
    const homeButton = document.querySelector('.homeButton');
    let selections = null;

    buttons.forEach((button) => {
      button.addEventListener('click', (e) => {
        displayController.selectButton(e.target);
        selections = displayController.bothPicked(selections);
      });
    });

    startButton.addEventListener('click', () => {
      displayController.startGame();
      start(selections);
    });

    homeButton.addEventListener('click', () => {
      displayController.home(buttons);
      selections = null;
    });
  };

  return { playerChoices };
})();

game.playerChoices();
