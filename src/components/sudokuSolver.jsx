import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

    const notify = () => {
        toast.error("🦄invalid board !");
    };

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

    // console.log("n", n, "m", m);
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
                            board[i][j] = c.toString();
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
        const invalidCells = [];
        // let validBoard = true;
        setIsBoardSolved(false);
        for (let i = 0; i < newBoard.length; i++) {
            for (let j = 0; j < newBoard[0].length; j++) {
                if (newBoard[i][j] == "") continue;
                if (!verifyInputBoard(newBoard, i, j, newBoard[i][j])) {
                    invalidCells.push(`${i}${j}`);
                }
            }
        }
        // FIXME: Fix the issue with the invalid cells include is not working
        if (invalidCells.length > 0) {
            setSolvedCells((prev) =>
                prev.map((cell) =>
                    invalidCells.includes(cell.position)
                        ? { ...cell, isValid: false }
                        : cell,
                ),
            );
            notify();
            return;
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

    const getEmptyCells = (inputBoard) => {
        const emptyCells = [];
        inputBoard.forEach((row, i) => {
            row.forEach((col, j) => {
                if (col == "") {
                    emptyCells.push({ position: `${i}${j}`, isValid: true });
                }
            });
        });

        return emptyCells;
    };
    // Function to regenerate the board
    const handleRegenerate = () => {
        // setSolvedCells([]);
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
        const newValue = parseInt(event.target.value, 10);
        if (event.target.value === "") {
            setBoard((prevBoard) => {
                const newBoard = [...prevBoard];
                newBoard[i][j] = "";
                return newBoard;
            });
        } else if (newValue >= 1 && newValue <= boardSize) {
            setBoard((prevBoard) => {
                const newBoard = [...prevBoard];
                newBoard[i][j] = newValue.toString(); // Convert back to string for consistency
                return newBoard;
            });
        }
    };

    // Function to handle board reset
    const handleReset = () => {
        setBoard(initialBoard);
        setIsBoardSolved(false);
        // setSolvedCells([]);
    };

    const getCellClassNames = (i, j) => {
        const classNames = [
            "xs:w-12 h-10 min-w-9 border-[1px] border-gray-200 text-center sm:h-12 sm:w-14 md:h-14 md:w-16",
            `${(i + 1) % n === 0 && i !== boardSize - 1 ? "border-b-2 border-b-gray-300" : ""}`,
            `${(j + 1) % m === 0 && j !== boardSize - 1 ? "border-r-2 border-r-gray-300" : ""}`,
            // `${solvedCells.find(cell => cell.position === `${i}${j}))?.isValid ? "" : "bg-red-200"}`,
        ];
        // console.log("solvedCells", solvedCells);
        // console.log(
        //     solvedCells.find((cell) => cell.position == `${i}${j}`)?.isValid,
        // );
        return twMerge(classNames.filter((className) => className).join(" "));
    };

    useEffect(() => {
        // Generate a new board on component mount
        handleRegenerate();
    }, [boardSize]);

    useEffect(() => {
        setSolvedCells(getEmptyCells(board));
    }, [board]);

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
            <ToastContainer position="top-center" />
        </>
    );
};

export default SudokuSolver;
