import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideBar from "./sidebar";

const SudokuSolver = () => {
    const [boardSize, setBoardSize] = useState(9);
    const boardSizes = [4, 6, 8, 9, 10, 12, 14, 15, 16];
    const initialBoard = Array.from({ length: boardSize }, () =>
        Array.from({ length: boardSize }, () => ({
            value: "",
            isValid: true,
            isEmpty: true,
        })),
    );
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

    const handleCellChange = (event, i, j) => {
        console.log("change event");
        event.preventDefault();
        const newValue = parseInt(event.target.value, 10);
        if (event.target.value === "") {
            setBoard((prevBoard) => {
                const newBoard = [...prevBoard];
                newBoard[i][j].value = "";
                newBoard[i][j].isEmpty = true;
                newBoard[i][j].isValid = true;
                return newBoard;
            });
        } else if (newValue >= 1 && newValue <= boardSize) {
            setBoard((prevBoard) => {
                const newBoard = [...prevBoard];
                newBoard[i][j].value = newValue.toString();
                newBoard[i][j].isEmpty = false;
                newBoard[i][j].isValid = true;
                return newBoard;
            });
        }
    };

    const getCellClassNames = (i, j) => {
        const classNames = [
            "xs:w-12 h-10 min-w-9 border-[1px] border-gray-200 text-center sm:h-12 sm:w-14 md:h-14 md:w-16 text-black",
            `${(i + 1) % n === 0 && i !== boardSize - 1 ? "border-b-2 border-b-gray-300" : ""}`,
            `${(j + 1) % m === 0 && j !== boardSize - 1 ? "border-r-2 border-r-gray-300" : ""}`,
            `${!board[i][j].isValid ? "bg-red-500 text-white" : ""}`,
            `${isBoardSolved && board[i][j].isEmpty ? "bg-red-300" : ""}`,
            // ` ${isEmptyCell ? (isEmptyCell.isValid ? (isBoardSolved ? "bg-red-300" : "bg-white") : "bg-red-500 text-white") : ""}`,
        ];

        return twMerge(classNames.filter((className) => className).join(" "));
    };

    // Function to check if the number is valid
    const isValid = (board, row, col, c) => {
        for (let i = 0; i < boardSize; i++) {
            let rowValue = n * Math.floor(row / n) + Math.floor(i / m);
            let colValue = m * Math.floor(col / m) + (i % m);
            if (board[i][col].value == c) return false;
            if (board[row][i].value == c) return false;
            if (board[rowValue][colValue].value == c) return false;
        }
        return true;
    };

    // Function to solve the sudoku
    const solve = (board, skips = false) => {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                if (board[i][j].value == "") {
                    const maxRange = boardSize.toString();
                    for (let c = "1"; c <= maxRange; c++) {
                        if (isValid(board, i, j, c)) {
                            board[i][j].value = c.toString();
                            if (solve(board)) {
                                if (skips) continue;
                                return true;
                            } else {
                                board[i][j].value = "";
                            }
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    };

    // Function to generate a random number
    //TODO:change min default value
    const randomGenerator = (min = 40, max = boardSize * boardSize) => {
        return Math.floor(Math.random() * max + min);
    };

    // Function to regenerate the board
    const handleRegenerate = () => {
        setIsBoardSolved(false);
        let eraseNumbers = randomGenerator();
        const newBoard = [...initialBoard];
        solve(newBoard, true);
        for (let i = 0; i < newBoard.length; i++) {
            for (let j = 0; j < newBoard[0].length; j++) {
                if (randomGenerator(0, n) == 0 && eraseNumbers > 0) {
                    newBoard[i][j].value = "";
                    newBoard[i][j].isEmpty = true;
                    eraseNumbers--;
                }
                if (newBoard[i][j].value !== "") {
                    newBoard[i][j].isEmpty = false;
                }
            }
        }
        setBoard(newBoard);
    };

    // Function to verify the input board
    const verifyInputBoard = (board, row, col, c) => {
        for (let i = 0; i < board.length; i++) {
            let rowValue = n * Math.floor(row / n) + Math.floor(i / m);
            let colValue = m * Math.floor(col / m) + (i % m);
            if (i != row && board[i][col].value == c) return false;
            if (i != col && board[row][i].value == c) return false;
            if (
                rowValue != row &&
                colValue != col &&
                board[rowValue][colValue].value == c
            )
                return false;
        }
        return true;
    };

    const notify = () => {
        toast.error("🦄invalid board !");
    };

    // Function to solve the sudoku
    const solveSudoku = () => {
        const newBoard = [...board];
        let isValidSudoku = true;
        setIsBoardSolved(false);
        for (let i = 0; i < newBoard.length; i++) {
            for (let j = 0; j < newBoard[0].length; j++) {
                newBoard[i][j].isValid = true;
                if (newBoard[i][j].value == "") continue;
                if (!verifyInputBoard(newBoard, i, j, newBoard[i][j].value)) {
                    newBoard[i][j].isValid = false;
                    isValidSudoku = false;
                }
            }
        }
        setBoard(newBoard);
        if (!isValidSudoku) {
            notify();
            return;
        }
        solve(newBoard);
        setIsBoardSolved(true);
    };

    const handleReset = () => {
        setBoard(initialBoard);
        setIsBoardSolved(false);
    };

    useEffect(() => {
        // Generate a new board on component mount
        handleRegenerate();
    }, [boardSize]);

    return (
        <>
            <nav className="fixed inset-0 bottom-auto  flex items-center bg-red-300 px-2 py-4 shadow sm:px-5 md:px-8 md:shadow-lg xl:px-10">
                <SideBar
                    sideBarItems={boardSizes}
                    onChangeBoardSize={(size) => setBoardSize(size)}
                />
                <h1 className="grow text-center text-lg font-extrabold capitalize">
                    Sudoku {boardSize} Solver
                </h1>
            </nav>

            <div className="container">
                <div className="my-24 flex w-full flex-col justify-center gap-y-8 overflow-x-auto outline ">
                    <ul className="flex flex-col self-center">
                        {board.map((row, i) => (
                            <li key={i} className="flex" id={i}>
                                {row.map((col, j) => (
                                    <input
                                        key={`${i}${j}`}
                                        type="number"
                                        min="1"
                                        value={col.value}
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
