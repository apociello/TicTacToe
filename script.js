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

    const checkWinner = () => {
        const boardWithBoxValues = board.getBoard().map(row => row.map(cell => cell.getValue()))
        
        //rows
        for (const row of boardWithBoxValues) {
            const equalRow = row.every(val => val === getActivePlayer().value);
            if (equalRow) return 'yes'
        }

        //columns
        for (let column=0; column<3; column++){
            let columnArray = []
            for (const row of boardWithBoxValues) {
                columnArray.push(row[column])
            }

            const equalColumn = columnArray.every(val => val === getActivePlayer().value)
            if (equalColumn) return 'yes'
        }

        //diagonal left-rigt
        const diagonalArrayLr = [];
        for (let i=0; i<3; i++) {
            diagonalArrayLr.push(boardWithBoxValues[i][i])
        }

        const equalDiagonalLr = diagonalArrayLr.every(val => val === getActivePlayer().value)
            if (equalDiagonalLr) return 'yes'
        
         //diagonal rigt-left
        const diagonalArrayRl = [];
        diagonalArrayRl.push(boardWithBoxValues[0][2]);
        diagonalArrayRl.push(boardWithBoxValues[1][1]);
        diagonalArrayRl.push(boardWithBoxValues[2][0]);
        
        const equalDiagonalRl = diagonalArrayRl.every(val => val === getActivePlayer().value)
        if (equalDiagonalRl) return 'yes'
    
        
        return 'no'
    }

    const printNewRound = () => {
        board.printBoard();
        console.log(`${activePlayer.name}'s turn`)
    }

    const playRound = (row, column) => {
        if (checkWinner() === 'yes') return;

        const boxValue = board.getBoard()[row-1][column-1].getValue();
        if (boxValue !== '') return 'THAT BOX IS ALREADY CHOSEN!';

        board.chooseBox(row,column, getActivePlayer().value);

        // CHECK WINNER 
        const winner = checkWinner()

        if (winner === 'yes') {
            console.log(board.printBoard())
            
            return `${getActivePlayer().name} WINS!`
        };


        switchActivePlayer();
        printNewRound();
    }

    console.log(printNewRound())

    return {getActivePlayer, playRound}
}


const game = GameController('POCI', 'ALE');