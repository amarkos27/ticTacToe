const displayController = (() => {
  const startPage = document.querySelector('.startPage');
  const gamePage = document.querySelector('.gamePage');
  const startButton = document.querySelector('.vs a');
  const vs = document.querySelector('.text');

  const reset = (buttons) => {
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

  // Only one button can be selected at a time. If one is selected,
  // remove the hover effect for the other button.
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

  const areBothPicked = (alreadyPicked) => {
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
    reset(buttons);
    pageSwitch(gamePage, startPage, 'grid');
  };

  const setPlayers = (type1, type2) => {
    const players = document.querySelectorAll('.player');
    players[0].textContent = type1;
    players[1].textContent = type2;
  };

  const fill = (cell, letter) => {
    if (!cell.hasChildNodes()) {
      const choice = document.createElement('div');
      choice.classList.add('fill');
      choice.textContent = letter;
      cell.appendChild(choice);
      cell.classList.remove('hover');
    } else {
      cell.classList.add('alreadyPicked');
      setTimeout(() => {
        cell.classList.remove('alreadyPicked');
      }, 500);
    }
  };

  return {
    selectButton,
    areBothPicked,
    startBtn,
    startGame,
    home,
    setPlayers,
    fill,
  };
})();

const GameBoard = (() => {
  let board = [];

  const gameWon = () => {};

  const initializeBoard = () => {
    board = [];

    // Fill cells with objects containing cell number and claimed property for which player
    // selected it
    for (let i = 0; i < 3; i++) {
      const row = [];
      board.push(row);

      for (let j = 0; j < 3; j++) {
        const cellNum = 3 * i + (j + 1);
        const cell = {
          // Number the cells 1 - 9
          num: cellNum,
          claimed: null,
        };
        row.push(cell);
      }
    }
  };

  return { gameWon, initializeBoard };
})();

const Player = (type, letter) => {
  console.log(type, letter);
  return { type };
};

const game = (() => {
  let selections = null;
  const buttons = Array.from(document.querySelectorAll('.playerChoice'));
  const startButton = document.querySelector('.vs a');
  const homeButton = document.querySelector('.homeButton');

  const active = () => {};

  const start = () => {
    const player1 = Player(selections[0].textContent, 'X');
    const player2 = Player(selections[1].textContent, 'O');
    displayController.setPlayers(player1.type, player2.type);
    active(player1, player2);
  };

  const reset = () => {
    selections = null;
    displayController.home(buttons);
  };

  const init = () => {
    GameBoard.initializeBoard();

    buttons.forEach((button) => {
      button.addEventListener('click', (e) => {
        displayController.selectButton(e.target);
        selections = displayController.areBothPicked(selections);
      });
    });

    startButton.addEventListener('click', () => {
      displayController.startGame();
      start();
    });

    homeButton.addEventListener('click', reset);
  };

  return { init };
})();

game.init();
