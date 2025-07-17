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

    return {getBoard, chooseCell}
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


    const playRound = (row, column) => {
        if (checkWinner()) return;

        const cellValue = board.getBoard()[row][column].getValue();
        if (cellValue !== '') {
            return
        } 
        board.chooseCell(row,column, getActivePlayer().value);

        // CHECK WINNER 
        const winner = checkWinner()
        if (winner === true) {
            return
        } else if (winner === 'DRAW') {
            return 
        }

        switchActivePlayer();
    }

    return {getActivePlayer, playRound, getBoard: board.getBoard, checkWinner}
}

const ScreenController = () => {
    let game = GameController('X', 'O');
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    const resetBtn = document.querySelector('#restart')
    resetBtn.addEventListener('click', () => resetGame())

    function resetGame() {
        game = GameController('X', 'O');  // crea nuevo juego
        updateScreen();
    }

    const updateScreen = () => {
        boardDiv.textContent = '';
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer().name
        const winner = game.checkWinner()
        if (winner === true) {
            playerTurnDiv.textContent = `${activePlayer} WINS!`
        } else if (winner === 'DRAW') {
            playerTurnDiv.textContent = 'DRAW'
        } else {
            playerTurnDiv.textContent = `${activePlayer}'s turn`
        }

        //render board squares
        board.forEach((row, rowIndex) => {

            row.forEach((cell, colIndex) => {
            const divButton = document.createElement('button');
            divButton.classList.add('cell')
            divButton.dataset.row = rowIndex
            divButton.dataset.col = colIndex
            divButton.textContent = cell.getValue()
            divButton.addEventListener('click', clickHandlerBoard)
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