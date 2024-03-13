const displayController = (() => {
  const startPage = document.querySelector('.startPage');
  const loader = document.querySelector('.loader');
  const gamePage = document.querySelector('.gamePage');
  const startButton = document.querySelector('.vs a');
  const vs = document.querySelector('.text');

  const clearBoard = (gameWon = false) => {
    const cells = document.querySelectorAll('.cell');

    // If the function is called when the game is won, play clear animation. Otherwise, simply
    // clear the board
    cells.forEach((cell) => {
      if (cell.children.length) {
        if (gameWon) {
          cell.children[0].classList.add('clear');
          setTimeout(() => {
            cell.removeChild(cell.children[0]);
          }, 250);
        } else {
          cell.removeChild(cell.children[0]);
        }
        cell.classList = 'cell hover';
      }
    });
  };

  const homeReset = (buttons) => {
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
    homeReset(buttons);
    pageSwitch(gamePage, startPage, 'grid');
  };

  const setPlayers = (type1, type2) => {
    const players = document.querySelectorAll('.player');
    players[0].textContent = type1;
    players[1].textContent = type2;
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

  const addPoint = (index) => {
    // Animation for adding the score when a player wins
    const btns = document.querySelectorAll('.addScore');
    const addBtn = btns[index];

    addBtn.style.display = 'block';
    setTimeout(() => {
      addBtn.style.display = 'none';
    }, 2500);
  };

  const updateScore = (player, roundWin = false) => {
    const scores = document.querySelectorAll('.number');
    let index = null;

    if (player.letter === 'X') {
      index = 0;
    } else {
      index = 1;
    }

    if (roundWin) {
      addPoint(index);
    }
    scores[index].textContent = player.score;
  };

  const highlightRow = (row, cells) => {
    row.forEach((num) => cells[num - 1].classList.add('won'));
  };

  const setTurn = (player, won = false) => {
    const turnDisplay = document.querySelector('.playerTurn');
    if (won) {
      turnDisplay.textContent = ' ';

      // SetTimeout set to 2.7s to account for the win animations
      // before the turn is displayed again
      setTimeout(() => {
        turnDisplay.textContent = `${player.type}'s turn`;
      }, 2700);
    } else {
      turnDisplay.textContent = `${player.type}'s turn`;
    }
  };

  const win = (row, player, gameBoard, cells) => {
    gameBoard.classList.add('noClick');

    updateScore(player, true);
    highlightRow(row, cells);

    setTimeout(() => {
      clearBoard(true);
      gameBoard.classList.remove('noClick');
    }, 2500);
  };

  const draw = (gameBoard, cells) => {
    gameBoard.classList.add('noClick');

    cells.forEach((cell) => cell.classList.add('draw'));

    setTimeout(() => {
      clearBoard(true);
      gameBoard.classList.remove('noClick');
    }, 2500);
  };

  const modalController = (() => {
    const modalOverlay = document.querySelector('.modal-overlay');
    const modal = document.querySelector('.closeModal');

    const openModal = (player) => {
      const winner = document.querySelector('.gameOver');

      winner.textContent = `${player} wins!`;
      modalOverlay.classList.add('show');
      modal.classList.remove('closeModal');
      modal.classList.add('modal');
    };

    const closeModal = () => {
      modal.classList.add('closeModal');
      setTimeout(() => {
        modal.classList.remove('modal');
        modalOverlay.classList.remove('show');
      }, 200);
    };

    const removeListeners = () => {
      const buttons = Array.from(
        document.querySelector('.modal-buttons').children
      );

      buttons.forEach((button) => {
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
      });
    };

    return { openModal, closeModal, removeListeners };
  })();

  return {
    clearBoard,
    selectButton,
    areBothPicked,
    startBtn,
    startGame,
    home,
    setPlayers,
    updateScore,
    fill,
    setTurn,
    win,
    draw,
    modalController,
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

    // This for loop combines all viable combinations of i, i+1, and i-1 in order to find adjacent cells
    // Then the cell is checked if it is claimed by the same letter and pushed to the array if so
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
    // Check if clicked element is in between two elements that are also claimed
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
          return [board[i][j].num, board[k][l].num, board[m][n].num];
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

    if (!won) {
      for (let index = 0; index < claimed.length; index++) {
        [k, l] = claimed[index];
        diffI = k - i;
        diffJ = l - j;

        // Check if going out of bounds before accessing element
        if (k + diffI > 2 || k + diffI < 0 || l + diffJ > 2 || l + diffJ < 0) {
          continue;
        }
        if (board[i][j].claimed === board[k + diffI][l + diffJ].claimed) {
          return [
            board[i][j].num,
            board[k][l].num,
            board[k + diffI][l + diffJ].num,
          ];
        }
      }
    }

    return won;
  };

  const reset = () => {
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        board[row][col].claimed = '';
      }
    }
  };

  return { initializeBoard, fill, checkWin, reset };
})();

const Player = (type, letter) => {
  const score = 0;

  return { type, letter, score };
};

const Bot = (botType, botLetter) => {
  const { type, letter, score } = Player(botType, botLetter);

  const move = (cells, gameBoard) => {
    const availableCells = cells.filter((cell) => !cell.children.length);
    const selectedIndex = Math.floor(Math.random() * availableCells.length);

    gameBoard.classList.add('noClick');
    setTimeout(() => {
      availableCells[selectedIndex].click();
      gameBoard.classList.remove('noClick');
    }, 1000);
  };

  return { type, letter, score, move };
};

const Game = (() => {
  const buttons = Array.from(document.querySelectorAll('.playerChoice'));
  let selections = null;

  const start = () => {
    let type1 = null;
    let type2 = null;
    displayController.startGame();

    // If the player types are the same, number them
    if (selections[0].textContent === selections[1].textContent) {
      type1 = `${selections[0].textContent} 1`;
      type2 = `${selections[1].textContent} 2`;
    } else {
      type1 = selections[0].textContent;
      type2 = selections[1].textContent;
    }

    const player1 = type1.includes('Bot')
      ? Bot(type1, 'X')
      : Player(type1, 'X');
    const player2 = type2.includes('Bot')
      ? Bot(type2, 'O')
      : Player(type2, 'O');
    displayController.setPlayers(player1.type, player2.type);
    displayController.setTurn(player1);

    return { player1, player2 };
  };

  const removeListeners = () => {
    // Remove all click listeners from cells to prevent multiple instances of the same listener
    // being added to the same cell
    const board = document.querySelector('.gameBoard');
    const newBoard = board.cloneNode(true);
    board.parentNode.replaceChild(newBoard, board);
  };

  const home = () => {
    selections = null;
    displayController.clearBoard();
    GameBoard.reset();
    displayController.home(buttons);
    removeListeners();
  };

  const draw = (gameBoard, cells, player1) => {
    displayController.draw(gameBoard, cells);
    displayController.setTurn(player1, true);
    GameBoard.reset();
  };

  const newGame = (player1, player2, cells, gameBoard, time) => {
    player1.score = 0;
    player2.score = 0;

    displayController.updateScore(player1);
    displayController.updateScore(player2);

    // Have bot make a move after 3.1s only on the first move so that the loading animation
    // can finish
    if (player1.type.includes('Bot')) {
      setTimeout(() => {
        player1.move(cells, gameBoard);
      }, time);
    }
  };

  const modal = (winner, player1, player2, cells, gameBoard) => {
    const rematch = document.querySelector('.rematch');
    const exit = document.querySelector('.exit');

    rematch.addEventListener(
      'click',
      () => {
        newGame(player1, player2, cells, gameBoard, 220);
        displayController.modalController.closeModal();
        displayController.modalController.removeListeners();
      },
      { once: true }
    );

    exit.addEventListener(
      'click',
      () => {
        displayController.modalController.closeModal();
        setTimeout(() => {
          home();
          displayController.modalController.removeListeners();
        }, 210);
      },
      { once: true }
    );

    displayController.modalController.openModal(winner);
  };

  const active = (player1, player2) => {
    let xTurn = true;
    let count = 0;
    let gameWon = false;
    let currentPlayer = player1;
    let nextPlayer = player2;

    // Cells MUST be defined here so that new listeners are added to the newly cloned cells if the home
    // button was pressed
    const cells = Array.from(document.querySelectorAll('.cell'));
    const gameBoard = document.querySelector('.gameBoard');

    newGame(player1, player2, cells, gameBoard, 3100);

    cells.forEach((cell, i) => {
      // User inputs drive the program forward
      const cellNum = i + 1;

      cell.addEventListener('click', () => {
        if (xTurn) {
          currentPlayer = player1;
          nextPlayer = player2;
        } else {
          currentPlayer = player2;
          nextPlayer = player1;
        }

        const success = displayController.fill(cell, currentPlayer.letter);

        if (success) {
          GameBoard.fill(cellNum, currentPlayer.letter);
          displayController.setTurn(nextPlayer);
          xTurn = !xTurn;
          count++;

          // Game win only needs to be checked after 4 turns
          if (count > 4) {
            gameWon = GameBoard.checkWin(cellNum);

            // If game is a draw
            if (count === 9 && !gameWon) {
              draw(gameBoard, cells, player1);
              count = 0;
              xTurn = true;

              if (player1.type.includes('Bot')) {
                // Wait for board to be cleared before going
                setTimeout(() => {
                  player1.move(cells, gameBoard);
                }, 3100);
                return;
              }
            }
          }

          if (gameWon) {
            currentPlayer.score += 1;
            displayController.win(gameWon, currentPlayer, gameBoard, cells);
            displayController.setTurn(player1, true);
            GameBoard.reset();

            count = 0;
            xTurn = true;
            gameWon = false;

            if (currentPlayer.score === 3) {
              // Wait 2.7s for win animations to finish before opening
              setTimeout(() => {
                modal(currentPlayer.type, player1, player2, cells, gameBoard);
              }, 2700);

              // Return statement prevents bots from continuing game after it is over
              return;
            }

            if (player1.type.includes('Bot')) {
              setTimeout(() => {
                player1.move(cells, gameBoard);
              }, 3100);
            }
          } else {
            displayController.setTurn(nextPlayer);

            if (nextPlayer.type.includes('Bot')) {
              nextPlayer.move(cells, gameBoard);
            }
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

    homeButton.addEventListener('click', home);
  };

  return { init };
})();

Game.init();

// AGENDA
/*
- Add bot functionality
*/
