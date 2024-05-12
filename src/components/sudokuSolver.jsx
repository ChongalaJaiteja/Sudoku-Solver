import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

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
    const [solvedCells, setSolvedCells] = useState([]);
    const [board, setBoard] = useState(initialBoard);
    const { n, m } = calculateSubmatrixDimensions(boardSize);

    const isValid = (board, row, col, c) => {
        for (let i = 0; i < boardSize; i++) {
            let rowValue = n * Math.floor(row / n) + Math.floor(i / m);
            let colValue = m * Math.floor(col / m) + (i % m);
            if (board[i][col] == c) return false;
            if (board[row][i] == c) return false;
            if (board[rowValue][colValue] == c) return false;
        }
        return true;
    };

    const solve = (board, skips = false) => {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                if (board[i][j] == "") {
                    // setSolvedCells((prev) => [...prev, `${i}${j}`]);
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

    const regenerate = () => {
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
            // console.log(event.target.className);
            return newBoard;
        });
    };

    useEffect(() => {
        regenerate();
        console.log(board);
        const emptyCells = board
            .map((row, i) =>
                row
                    .map((col, j) => (col == "" ? `${i}${j}` : ""))
                    .filter((val) => val != ""),
            )
            .flat();
        setSolvedCells(emptyCells);
    }, []);

    return (
        <div className="min-h-screen font-app-font outline">
            <nav>
                <h1 className="text-center text-lg font-extrabold capitalize outline">
                    Sudoku Solver
                </h1>
            </nav>
            <div className="my-24 flex flex-col justify-center gap-y-8 outline">
                <ul className="flex flex-col self-center">
                    {board.map((row, i) => (
                        <li key={i} className="flex" id={i}>
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
                                    className={`xs:w-12 h-10 min-w-9 border-[1px] border-gray-200 text-center sm:h-12 sm:w-14 md:h-14 md:w-16  ${(i + 1) % n == 0 && i != boardSize - 1 && "border-b-2 border-b-gray-300"}  ${(j + 1) % m == 0 && j != boardSize - 1 && "border-r-2 border-r-gray-300"} ${solvedCells.includes(`${i}${j}`) && "bg-blue-500 text-white"} `}
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
