import { stack as Menu } from "react-burger-menu";
import { useState } from "react";

const SideBar = ({ sideBarItems, onChangeBoardSize, currentBoardSize }) => {
    var styles = {
        bmBurgerBars: {
            background: "#373a47",
        },
        bmBurgerBarsHover: {
            background: "#a90000",
        },
        bmCrossButton: {
            height: "24px",
            width: "24px",
        },
        bmCross: {
            background: "#bdc3c7",
        },
        bmMenuWrap: {
            position: "fixed",
            height: "100%",
            left: "0",
            top: "0",
        },
        bmMenu: {
            background: "#373a47",
            padding: "1.7em 0.8em 0",
            fontSize: "1.15em",
            overflow: "hidden",
        },
        bmMorphShape: {
            fill: "#373a47",
        },
        bmItemList: {
            color: "white",
            padding: "0.8em",
        },
        bmItem: {
            display: "inline-block",
        },
        bmOverlay: {
            background: "rgba(0, 0, 0, 0.3)",
            top: "0",
            left: "0",
        },
    };
    const [menuOpenState, setMenuOpenState] = useState(false);

    const handleBoardSizeChange = (size) => {
        setMenuOpenState(false);
        onChangeBoardSize(size);
    };
    return (
        <Menu
            styles={styles}
            burgerButtonClassName="relative w-6 h-5 sm:w-7 sm:h-6 md:w-8"
            isOpen={menuOpenState}
            onStateChange={(newState) => setMenuOpenState(newState.isOpen)}
        >
            <div className="h-full w-full space-y-2">
                <h1 className="mb-5 text-center text-sm font-bold capitalize  xs:text-lg  md:text-xl  lg:text-2xl">
                    sudoku board
                </h1>
                <ul className="md:bg-gree h-[84%] space-y-3 sm:space-y-1">
                    {sideBarItems.map((item, index) => (
                        <li
                            key={index}
                            className={`cursor-pointer rounded-md p-2  text-sm  font-medium capitalize transition-colors duration-200  ease-in-out  hover:bg-slate-400   xs:text-base md:text-lg lg:text-xl ${currentBoardSize === item ? "bg-slate-500" : ""}`}
                            onClick={() => handleBoardSizeChange(item)}
                        >
                            {item} X {item}
                        </li>
                    ))}
                </ul>
                <p className="text-xs font-medium  xs:text-sm md:text-base lg:text-lg">
                    Copyright &copy; {new Date().getFullYear()} Jai teja. All
                    rights reserved.
                </p>
            </div>
        </Menu>
    );
};

export default SideBar;
