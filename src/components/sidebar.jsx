import { stack as Menu } from "react-burger-menu";

const SideBar = ({ sideBarItems, onChangeBoardSize }) => {
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
            padding: "2.5em 1.5em 0",
            fontSize: "1.15em",
        },
        bmMorphShape: {
            fill: "#373a47",
        },
        bmItemList: {
            color: "#b8b7ad",
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

    return (
        <Menu
            styles={styles}
            burgerButtonClassName="relative w-6 h-5 sm:w-7 sm:h-6 md:w-8"
        >
            <ul>
                {sideBarItems.map((item, index) => (
                    <li key={index}>
                        <button onClick={() => onChangeBoardSize(item)}>
                            {item}X{item}
                        </button>
                    </li>
                ))}
            </ul>
        </Menu>
    );
};

export default SideBar;
