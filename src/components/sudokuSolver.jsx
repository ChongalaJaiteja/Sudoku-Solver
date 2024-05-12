import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import SideBar from "./sidebar";

const SudokuSolver = () => {
    const [boardSize, setBoardSize] = useState(9);
    const boardSizes = [4, 6, 8, 9, 10, 12, 14, 15, 16];
    const initialBoard = Array.from({ length: boardSize }, () =>
        Array.from({ length: boardSize }, () => ""),
    );
    const [solvedCells, setSolvedCells] = useState([]);
    const [isBoardSolved, setIsBoardSolved] = useState(false);
    const [board, setBoard] = useState(initialBoard);

    // Function to calculate the submatrix dimensions
    const calculateSubmatrixDimensions = (n) => {
        const m = Math.sqrt(n);
        if (Number.isInteger(m)) {
            return { n: m, m: m };
        } else {
            for (let k = 2; k * k <= n; k++) {
                if (n % k === 0) {
                    return { n: k, m: n / k };
                }
            }
        }
    };

    // Get the submatrix dimensions
    const { n, m } = calculateSubmatrixDimensions(boardSize);

    // Function to check if the number is valid
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

    // Function to solve the sudoku
    const solve = (board, skips = false) => {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                if (board[i][j] == "") {
                    const maxRange = boardSize.toString();
                    for (let c = "1"; c <= maxRange; c++) {
                        if (isValid(board, i, j, c)) {
                            board[i][j] = c;
                            if (solve(board)) {
                                if (skips) continue;
                                return true;
                            } else {
                                board[i][j] = "";
                            }
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    };

    // Function to verify the input board
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

    // Function to solve the sudoku
    const solveSudoku = () => {
        const newBoard = [...board];
        const emptyCells = newBoard
            .map((row, i) =>
                row
                    .map((col, j) => (col == "" ? `${i}${j}` : ""))
                    .filter((val) => val != ""),
            )
            .flat();
        setSolvedCells(emptyCells);
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
        setIsBoardSolved(true);
    };

    // Function to generate a random number
    //TODO:change min default value
    const randomGenerator = (min = 40, max = boardSize * boardSize) => {
        return Math.floor(Math.random() * max + min);
    };

    // Function to regenerate the board
    const handleRegenerate = () => {
        setSolvedCells([]);
        setIsBoardSolved(false);
        let eraseNumbers = randomGenerator();
        const newBoard = initialBoard;
        solve(newBoard, true);
        for (let i = 0; i < newBoard.length; i++) {
            for (let j = 0; j < newBoard[0].length; j++) {
                if (randomGenerator(0, n) == 0 && eraseNumbers > 0) {
                    newBoard[i][j] = "";
                    eraseNumbers--;
                }
            }
        }
        setBoard(newBoard);
    };

    // Function to handle cell change
    const handleCellChange = (event, i, j) => {
        event.preventDefault();
        setBoard((prevBoard) => {
            const newBoard = [...prevBoard];
            newBoard[i][j] = event.target.value;
            return newBoard;
        });
    };

    // Function to handle board reset
    const handleReset = () => {
        setBoard(initialBoard);
        setIsBoardSolved(false);
        setSolvedCells([]);
    };

    const getCellClassNames = (i, j) => {
        const classNames = [
            "xs:w-12 h-10 min-w-9 border-[1px] border-gray-200 text-center",
            `${(i + 1) % n === 0 && i !== boardSize - 1 ? "border-b-2 border-b-gray-300" : ""}`,
            `${(j + 1) % n === 0 && j !== boardSize - 1 ? "border-r-2 border-r-gray-300" : ""}`,
            `${solvedCells.includes(`${i}${j}`) ? "bg-red-400 text-white" : ""}`,
        ];

        return twMerge(classNames.filter((className) => className).join(" "));
    };

    useEffect(() => {
        // Generate a new board on component mount
        handleRegenerate();
    }, [boardSize]);

    return (
        <>
            <nav className="fixed inset-0 bottom-auto  flex items-center bg-red-300 px-2 py-4 shadow sm:px-5 md:px-8 md:shadow-lg xl:px-10 ">
                <SideBar
                    sideBarItems={boardSizes}
                    onChangeBoardSize={(size) => setBoardSize(size)}
                />
                <h1 className="grow text-center text-lg font-extrabold capitalize">
                    Sudoku {boardSize} Solver
                </h1>
            </nav>

            <div className="container">
                <div className="my-24 flex w-full flex-col justify-center gap-y-8 overflow-x-auto outline">
                    <ul className="flex flex-col self-center">
                        {board.map((row, i) => (
                            <li key={i} className="flex" id={i}>
                                {row.map((col, j) => (
                                    <input
                                        key={`${i}${j}`}
                                        type="number"
                                        min="1"
                                        value={row[j]}
                                        max={boardSize}
                                        disabled={isBoardSolved}
                                        onChange={(event) =>
                                            handleCellChange(event, i, j)
                                        }
                                        className={getCellClassNames(i, j)}
                                    />
                                ))}
                            </li>
                        ))}
                    </ul>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button
                            className={`rounded-md bg-blue-500 px-4 py-2 capitalize  text-white hover:bg-blue-700 ${isBoardSolved ? "bg-gray-400 hover:bg-gray-500" : ""}`}
                            onClick={solveSudoku}
                            disabled={isBoardSolved}
                        >
                            Solve
                        </button>
                        <button
                            className="rounded-md bg-blue-500 px-4 py-2 capitalize  text-white hover:bg-blue-700"
                            onClick={handleRegenerate}
                        >
                            refresh
                        </button>
                        <button
                            className="rounded-md bg-red-500 px-4 py-2 capitalize  text-white hover:bg-red-700"
                            onClick={handleReset}
                        >
                            reset
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SudokuSolver;
