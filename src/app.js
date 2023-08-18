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
    gamePage.style.display = 'none';
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

  const fade = (type, element) => {
    if (type === 'out') {
      element.classList.add('fadeOut');
      element.style.display = 'none';
      setTimeout(() => {
        element.classList.remove('fadeOut');
      }, 500);
    } else if (type === 'in') {
      element.style.display = 'block';
      element.classList.add('fadeIn');
      setTimeout(() => {
        element.classList.remove('fadeIn');
      }, 500);
    }
  };

  const startBtn = (picked) => {
    if (picked) {
      fade('out', vs);
      fade('in', startButton);
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
    gamePage.style.display = 'flex';
  };

  const home = (buttons) => {
    resetButtons(buttons);
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
