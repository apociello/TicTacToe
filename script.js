function GameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i=0; i<rows; i++) {
        board[i] = [];
        for (let j=0; j<columns; j++) {
            board[i].push(Cell())
        }
    }

    const getBoard = () => board;

    const chooseCell = (row, column, player) => {
        const cell = board[row][column];
        if (cell.getValue() !== '') return;
        cell.addValue(player)
    }
    
    const printBoard = () => {
        const boardWithBoxValues = board.map(row => row.map(cell => cell.getValue()))
        console.log(boardWithBoxValues)
    }

    return {getBoard, chooseCell, printBoard}
}

function Cell() {
    let value = '';

    const addValue = (player) => {
        value = player;
    }

    const getValue = () => value;

    return {getValue, addValue}
}


function GameController(player1, player2) {
    const board = GameBoard();

    const players = [
        {
            name: player1,
            value: 'X'
        },

        {
            name: player2,
            value: 'O'
        }
    ]

    let activePlayer = players[0];

    const getActivePlayer = () => activePlayer;

    const switchActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const checkWinner = () => {
        const boardWithBoxValues = board.getBoard().map(row => row.map(cell => cell.getValue()))
        
        //rows
        for (const row of boardWithBoxValues) {
            const equalRow = row.every(val => val === getActivePlayer().value);
            if (equalRow) return true;
        }

        //columns
        for (let col=0; col<3; col++){
            let columnArray = boardWithBoxValues.map(row => row[col])
            const equalColumn = columnArray.every(val => val === getActivePlayer().value)
            if (equalColumn) return true;
        }

        //diagonal left-rigt
        const diagonalArrayLr = [];
        for (let i=0; i<3; i++) {
            diagonalArrayLr.push(boardWithBoxValues[i][i])
        }
        const equalDiagonalLr = diagonalArrayLr.every(val => val === getActivePlayer().value)
        if (equalDiagonalLr) return true;
        
        //diagonal rigt-left
        const diagonalArrayRl = [boardWithBoxValues[0][2], boardWithBoxValues[1][1], boardWithBoxValues[2][0]];
        const equalDiagonalRl = diagonalArrayRl.every(val => val === getActivePlayer().value)
        if (equalDiagonalRl) return true;

        //draw 
        for (const row of boardWithBoxValues) {
            for (const cell of row) {
                if (cell === '') return false
            }
        }

        return 'DRAW'
    }

    const printNewRound = () => {
        board.printBoard();
        console.log(`${activePlayer.name}'s turn`)
    }

    const playRound = (row, column) => {
        if (checkWinner()) return;

        const cellValue = board.getBoard()[row][column].getValue();
        if (cellValue !== '') {
            console.log('THAT BOX IS ALREADY CHOSEN!');
            return
        } 
        board.chooseCell(row,column, getActivePlayer().value);

        // CHECK WINNER 
        if (checkWinner() === true) {
            console.log(board.printBoard())
            console.log(`${getActivePlayer().name} WINS!`);
            return
        } else if (checkWinner() === 'DRAW') {
            console.log(board.printBoard())
            console.log('DRAW')
            return 
        }

        switchActivePlayer();
        printNewRound();
    }

    printNewRound()

    return {getActivePlayer, playRound, getBoard: board.getBoard}
}


const ScreenController = () => {
    const game = GameController('X', 'O');
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    const resetBtn = document.querySelector('#restart')
    resetBtn.addEventListener('click', () => ScreenController())


    const updateScreen = () => {
        boardDiv.textContent = '';
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer().name

        playerTurnDiv.textContent = `${activePlayer}'s turn`

        //render board squares
        board.forEach((row, rowIndex) => {

            row.forEach((cell, colIndex) => {
            const divButton = document.createElement('button');
            divButton.textContent = cell.getValue()
            divButton.addEventListener('click', clickHandlerBoard)
            divButton.classList.add('cell')
            divButton.dataset.row = rowIndex
            divButton.dataset.col = colIndex
            boardDiv.append(divButton)
        })
        })
    }

    function clickHandlerBoard(e){
        const row = e.target.dataset.row;
        const col = e.target.dataset.col;
        game.playRound(row, col);
        updateScreen()
    }

    updateScreen()
}


ScreenController()