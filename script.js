function GameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i=0; i<rows; i++) {
        board[i] = [];
        for (let j=0; j<columns; j++) {
            board[i].push(Box())
        }
    }

    const getBoard = () => board;

    const chooseBox = (row, column, player) => {
        const box = board[row - 1][column - 1];
        if (box.getValue() !== '') return;
        box.addValue(player)
    }
    
    const printBoard = () => {
        const boardWithBoxValues = board.map(row => row.map(cell => cell.getValue()))
        console.log(boardWithBoxValues)
    }

    return {getBoard, chooseBox, printBoard}
}

function Box() {
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

    const printNewRound = () => {
        board.printBoard();
        console.log(`${activePlayer.name}'s turn`)
    }

    console.log(printNewRound())

    const playRound = (row, column) => {
        board.chooseBox(row,column, getActivePlayer().value);
        switchActivePlayer();
        printNewRound();
    }

    return {playRound}
}
