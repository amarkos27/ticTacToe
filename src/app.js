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
    // Allow for there to be a delay in the recursive loop to simulate a countdown
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

    if (type1 === type2) {
      players[0].textContent = `${type1} 1`;
      players[1].textContent = `${type2} 2`;
    } else {
      players[0].textContent = type1;
      players[1].textContent = type2;
    }
  };

  const fill = (cell, letter) => {
    // Return 1 if successfully filled, 0 if the cell was already filled in order to ensure
    // proper turn management
    if (!cell.hasChildNodes()) {
      const choice = document.createElement('div');
      choice.classList.add('fill');
      choice.textContent = letter;
      cell.appendChild(choice);
      cell.classList.remove('hover');

      return 1;
    }
    cell.classList.add('alreadyPicked');
    setTimeout(() => {
      cell.classList.remove('alreadyPicked');
    }, 500);

    return 0;
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
  const board = [];

  const initializeBoard = () => {
    // Fill cells with objects containing cell number and claimed property for which player
    // selected it
    let cellNum = 1;
    for (let i = 0; i < 3; i++) {
      const row = [];
      board.push(row);

      for (let j = 0; j < 3; j++) {
        const cell = {
          // Number the cells 1 - 9
          num: cellNum,
          claimed: null,
        };
        row.push(cell);
        cellNum++;
      }
    }
  };

  const findCell = (find) => {
    // Find cell with the corresponding number
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (find === board[i][j].num) {
          return [i, j];
        }
      }
    }

    return -1;
  };

  const fill = (clicked, letter) => {
    const [row, col] = findCell(clicked);
    board[row][col].claimed = letter;
  };

  const findClaimed = (i, j) => {
    // Find all adjacent cells claimed by the same letter
    const claimed = [];
    for (let dx = i > 0 ? -1 : 0; dx <= (i < board.length - 1 ? 1 : 0); ++dx) {
      for (
        let dy = j > 0 ? -1 : 0;
        dy <= (j < board[0].length - 1 ? 1 : 0);
        ++dy
      ) {
        if (
          (dx !== 0 || dy !== 0) &&
          board[i + dx][j + dy].claimed === board[i][j].claimed
        ) {
          claimed.push([i + dx, j + dy]);
        }
      }
    }

    return claimed;
  };

  const isInBetween = (i, j, claimed) => {
    // Check if clicked element is in between two elements that it are also claimed
    let k = null;
    let l = null;
    let m = null;
    let n = null;
    for (let index = 0; index < claimed.length / 2 + 1; index++) {
      for (let second = index + 1; second < claimed.length; second++) {
        [k, l] = claimed[index];
        [m, n] = claimed[second];
        const diff1 = [i - k, j - l];
        const diff2 = [i - m, j - n];

        // If the deviation of both elements from i and j are both 0, the clicked element is
        // in the middle
        if (diff1[0] + diff2[0] === 0 && diff1[1] + diff2[1] === 0) {
          return true;
        }
      }
    }

    return false;
  };

  const checkWin = (clicked) => {
    const [i, j] = findCell(clicked);
    const claimed = findClaimed(i, j);
    let k = null;
    let l = null;
    let diffI = null;
    let diffJ = null;
    let won = false;
    won = isInBetween(i, j, claimed);

    for (let index = 0; index < claimed.length; index++) {
      [k, l] = claimed[index];
      diffI = k - i;
      diffJ = l - j;

      // Check if going out of bounds before accessing element
      if (k + diffI > 2 || k + diffI < 0 || l + diffJ > 2 || l + diffJ < 0) {
        continue;
      }
      if (board[i][j].claimed === board[k + diffI][l + diffJ].claimed) {
        won = true;
      }
    }

    return won;
  };

  return { initializeBoard, fill, checkWin };
})();

const Player = (type, letter) => {
  let score = 0;

  return { type, letter, score };
};

const game = (() => {
  const buttons = Array.from(document.querySelectorAll('.playerChoice'));
  let selections = null;

  const start = () => {
    displayController.startGame();
    const player1 = Player(selections[0].textContent, 'X');
    const player2 = Player(selections[1].textContent, 'O');
    displayController.setPlayers(player1.type, player2.type);

    return { player1, player2 };
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

  const active = (player1, player2) => {
    // Listener needs to be added this way so that the cell is always the element being interacted
    // with, not the div element added on click
    const cells = Array.from(document.querySelectorAll('.cell'));
    let xTurn = true;
    let count = 0;
    let gameWon = false;
    let currentPlayer = null;

    cells.forEach((cell, i) => {
      // User inputs drive the program forward
      const cellNum = i + 1;
      cell.addEventListener('click', () => {
        currentPlayer = xTurn ? player1 : player2;
        const success = displayController.fill(cell, currentPlayer.letter);

        if (success) {
          GameBoard.fill(cellNum, currentPlayer.letter);
          xTurn = !xTurn;
          count++;

          if (count > 4) {
            gameWon = GameBoard.checkWin(cellNum);
            console.log(gameWon);
            // if gameWon
            // currentPlayer.score += 1;
            // displayController.addPoint(currentPlayer); -- player needs to store scoreBlock
            // if currentPlayer.score === 2
            // endGame()
            // else
            // GameBoard.reset()
          }
        }
      });
    });
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
      const { player1, player2 } = start();
      active(player1, player2);
    });

    homeButton.addEventListener('click', reset);
  };

  return { init };
})();

game.init();
