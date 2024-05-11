import { useEffect, useState } from "react";

const SudokuSolver = () => {
    const calculateSubmatrixDimensions = (n) => {
        const m = Math.sqrt(n);
        if (Number.isInteger(m)) {
            return { n: m, m: m };
        } else {
            for (let k = 2; k <= n; k++) {
                if (n % k === 0) {
                    return { n: k, m: n / k };
                }
            }
        }
    };
    const [boardSize, setBoardSize] = useState(9);
    const initialBoard = Array.from({ length: boardSize }, () =>
        Array.from({ length: boardSize }, () => ""),
    );
    const [board, setBoard] = useState(initialBoard);

    const isValid = (board, row, col, c) => {
        const { n, m } = calculateSubmatrixDimensions(boardSize);
        for (let i = 0; i < boardSize; i++) {
            let rowValue = n * Math.floor(row / n) + Math.floor(i / m);
            let colValue = m * Math.floor(col / m) + (i % m);
            if (board[i][col] == c) return false;
            if (board[row][i] == c) return false;
            if (board[rowValue][colValue] == c) return false;
        }
        return true;
    };

    let solve = (board, skips = false) => {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                if (board[i][j] == "") {
                    const maxRange = boardSize.toString();
                    for (let c = "1"; c <= maxRange; c++) {
                        if (isValid(board, i, j, c)) {
                            board[i][j] = c;
                            // elements[i][j].style.background =
                            //     "rgb(0, 0, 139, 80%)";
                            // elements[i][j].style.color = "white";
                            if (solve(board)) {
                                if (skips) continue;
                                return true;
                            } else {
                                board[i][j] = "";
                                // elements[i][j].value = "";
                                // elements[i][j].style.background = "white";
                                // elements[i][j].style.color = "black";
                            }
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    };

    const verifyInputBoard = (board, row, col, c) => {
        const { n, m } = calculateSubmatrixDimensions(boardSize);
        for (let i = 0; i < board.length; i++) {
            let rowValue = n * Math.floor(row / n) + Math.floor(i / m);
            let colValue = m * Math.floor(col / m) + (i % m);
            if (i != row && board[i][col] == c) return false;
            if (i != col && board[row][i] == c) return false;
            if (
                rowValue != row &&
                colValue != col &&
                board[rowValue][colValue] == c
            )
                return false;
        }
        return true;
    };

    const solveSudoku = () => {
        const newBoard = [...board];
        for (let i = 0; i < newBoard.length; i++) {
            for (let j = 0; j < newBoard[0].length; j++) {
                if (newBoard[i][j] == "") continue;
                if (!verifyInputBoard(newBoard, i, j, newBoard[i][j])) {
                    alert("Invalid board");
                    return;
                }
            }
        }
        solve(newBoard);
        setBoard(newBoard);
    };
    //TODO:change min default value
    const randomGenerator = (min = 40, max = boardSize * boardSize) => {
        return Math.floor(Math.random() * max + min);
    };

    let regenerate = () => {
        const newBoard = [...board];
        let eraseNumbers = randomGenerator();
        const { n, m } = calculateSubmatrixDimensions(boardSize);
        for (let i = 0; i < newBoard.length; i++) {
            for (let j = 0; j < newBoard[0].length; j++) {
                // elements[i][j].value = "";
                newBoard[i][j] = "";
                // elements[i][j].style.background = "white";
                // elements[i][j].style.color = "black";
            }
        }
        solve(newBoard, true);
        for (let i = 0; i < newBoard.length; i++) {
            for (let j = 0; j < newBoard[0].length; j++) {
                // elements[i][j].style.background = "white";
                // elements[i][j].style.color = "black";
                if (randomGenerator(0, n) == 0 && eraseNumbers > 0) {
                    newBoard[i][j] = "";
                    eraseNumbers--;
                }
            }
        }
        setBoard(newBoard);
    };

    const handleCellChange = (event, i, j) => {
        event.preventDefault();
        setBoard((prevBoard) => {
            const newBoard = [...prevBoard];
            newBoard[i][j] = event.target.value;
            console.log(event.target.className);
            return newBoard;
        });
    };

    useEffect(() => {
        regenerate();
    }, []);

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
                        onClick={solveSudoku}
                    >
                        Solve
                    </button>
                    <button
                        className="rounded-md bg-blue-500 px-4 py-2 capitalize  text-white hover:bg-blue-700"
                        onClick={regenerate}
                    >
                        refresh
                    </button>
                    <button
                        className="rounded-md bg-red-500 px-4 py-2 capitalize  text-white hover:bg-red-700"
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
