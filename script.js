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

const board = GameBoard();
board.printBoard()