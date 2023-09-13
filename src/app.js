const displayController = (() => {
  const startPage = document.querySelector('.startPage');
  const loader = document.querySelector('.loader');
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
      to.classList.add('fadeInButton');
      setTimeout(() => {
        to.classList.remove('fadeInButton');
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
    if (current.length > alreadyPicked.length) {
      startBtn(true);
    } else if (alreadyPicked.length > current.length) {
      startBtn(false);
    }
    return current;
  };

  const load = () => {
    let count = 3;
    const countDown = () => {
      const counter = document.createElement('div');
      counter.classList.add('count');
      counter.textContent = count;
      loader.appendChild(counter);

      setTimeout(() => {
        loader.removeChild(counter);
        count--;
        if (count > 0) {
          countDown();
        }
      }, 1000);
    };

    countDown();
  };

  const startGame = () => {
    pageSwitch(startPage, loader, 'flex');
    load();
    setTimeout(() => {
      // Allow for loading animation to finish before switching pages
      pageSwitch(loader, gamePage, 'flex');
    }, 3000);
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
    load,
    home,
    setPlayers,
    fill,
  };
})();

const GameBoard = (() => {
  let board = [];

  const gameWon = () => {};

  const initializeBoard = () => {
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
  let score = 0;

  return { type, letter, score };
};

const game = (() => {
  const buttons = Array.from(document.querySelectorAll('.playerChoice'));
  let selections = null;

  const start = () => {
    const player1 = Player(selections[0].textContent, 'X');
    const player2 = Player(selections[1].textContent, 'O');
    displayController.setPlayers(player1.type, player2.type);

    return { player1, player2 };
  };

  const active = (player1, player2) => {
    // Listener needs to be added this way so that the cell is always the element being interacted
    // with, not the div element added on click
    const cells = Array.from(document.querySelectorAll('.cell'));
    let turn = 0;

    cells.forEach((cell) => {
      cell.addEventListener('click', () => {
        if (turn === 0) {
          displayController.fill(cell, player1.letter);
          turn = 1;
        } else {
          displayController.fill(cell, player2.letter);
          turn = 0;
        }
      });
    });
  };

  const removeListeners = () => {
    // Remove all click listeners from cells to prevent multiple instances of the same listener
    // being added to the same cell
    const board = document.querySelector('.gameBoard');
    const newBoard = board.cloneNode(true);
    board.parentNode.replaceChild(newBoard, board);
  };

  const reset = () => {
    selections = null;
    displayController.home(buttons);
    removeListeners();
  };

  const init = () => {
    const startButton = document.querySelector('.vs a');
    const homeButton = document.querySelector('.homeButton');

    GameBoard.initializeBoard();

    buttons.forEach((button) => {
      button.addEventListener('click', (e) => {
        displayController.selectButton(e.target);
        selections = displayController.areBothPicked(selections);
      });
    });

    startButton.addEventListener('click', (e) => {
      e.preventDefault();
      displayController.startGame();
      const { player1, player2 } = start();
      active(player1, player2);
    });

    homeButton.addEventListener('click', reset);
  };

  return { init };
})();

game.init();
displayController.load();
