import { useState } from "react";

const SudokuSolver = () => {
    const [boardSize, setBoardSize] = useState(9);
    const initialBoard = Array.from({ length: boardSize }, () =>
        Array.from({ length: boardSize }, () => ""),
    );
    const [board, setBoard] = useState([
        ["9", "5", "7", "", "1", "3", "", "8", "4"],
        ["4", "8", "3", "", "5", "7", "1", "", "6"],
        ["", "1", "2", "", "4", "9", "5", "3", "7"],
        ["1", "7", "", "3", "", "4", "9", "", "2"],
        ["5", "", "4", "9", "7", "", "3", "6", ""],
        ["3", "", "9", "5", "", "8", "7", "", "1"],
        ["8", "4", "5", "7", "9", "", "6", "1", "3"],
        ["", "9", "1", "", "3", "6", "", "7", "5"],
        ["7", "", "6", "1", "8", "5", "4", "", "9"],
    ]);

    const handleCellChange = (event, i, j) => {
        event.preventDefault();
        setBoard((prevBoard) => {
            const newBoard = [...prevBoard];
            newBoard[i][j] = event.target.value;
            console.log(event.target.className);
            return newBoard;
        });
    };

    const isValid = (board, row, col, c) => {
        for (let i = 0; i < boardSize; i++) {
            let rowValue = 3 * Math.floor(row / 3) + Math.floor(i / 3);
            let colValue = 3 * Math.floor(col / 3) + (i % 3);
            if (board[i][col] == c) return false;
            if (board[row][i] == c) return false;
            if (board[rowValue][colValue] == c) return false;
        }
        return true;
    };

    const solveSudoku = (board) => {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                if (board[i][j] == "") {
                    for (let c = "1"; c <= "9"; c++) {
                        if (isValid(board, i, j, c)) {
                            board[i][j] = c;
                            if (solveSudoku(board)) return true;
                            else board[i][j] = "";
                        }
                    }

                    return false;
                }
            }
        }
        return true;
    };

    const solveBoard = () => {
        const newBoard = [...board];
        let validBoard = true;
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (newBoard[i][j] == "") continue;
                if (!isValid(newBoard, i, j, newBoard[i][j])) {
                    validBoard = false;
                    break;
                }
            }
            if (!validBoard) break;
        }
        if (validBoard) {
            solveSudoku(newBoard);
            setBoard(newBoard);
        } else {
            alert("invalid board");
        }
    };

    const generateRandomBoard = () => {};

    const refreshBoard = () => {};
    return (
        <div className="flex min-h-screen flex-col font-app-font">
            <h1 className="my-4 text-center text-lg font-extrabold capitalize">
                Sudoku Solver
            </h1>
            <div className="flex grow flex-col justify-center gap-y-6">
                <ul className="flex flex-col">
                    {board.map((row, i) => (
                        <li key={i} className="flex self-center" id={i}>
                            {row.map((col, j) => (
                                <input
                                    id={`${i}${j}`}
                                    key={`${i}${j}`}
                                    type="number"
                                    min="1"
                                    value={row[j]}
                                    max={boardSize}
                                    onChange={(event) =>
                                        handleCellChange(event, i, j)
                                    }
                                    className="h-10 w-full min-w-11 max-w-12 grow border-2 border-gray-200 text-center"
                                />
                            ))}
                        </li>
                    ))}
                </ul>
                <div className="flex flex-wrap justify-center gap-4">
                    <button
                        className="rounded-md bg-blue-500 px-4 py-2 capitalize  text-white hover:bg-blue-700"
                        onClick={solveBoard}
                    >
                        Solve
                    </button>
                    <button
                        className="rounded-md bg-blue-500 px-4 py-2 capitalize  text-white hover:bg-blue-700"
                        onClick={refreshBoard}
                    >
                        refresh
                    </button>
                    <button
                        className="rounded-md bg-blue-500 px-4 py-2 capitalize  text-white hover:bg-blue-700"
                        onClick={() => setBoard(initialBoard)}
                    >
                        reset
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SudokuSolver;
