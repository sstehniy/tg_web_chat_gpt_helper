import { ReactComponent as Logo } from "./assets/chat_gpt_logo.svg";
import { useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { GptMenu } from "./components/GptMenu";
import { useTheme } from "./context/themeProvider";

export const Root = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const theme = useTheme();

  return (
    <>
      <button
        className={`btn-icon ${theme.classNames.attachFile} ${
          isMenuOpen ? theme.classNames.menuOpen : ""
        }`}
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        <Logo
          width={24}
          height={24}
          fill={isMenuOpen ? theme.vars.primary : theme.vars.secondaryTextColor}
        />
      </button>
      <CSSTransition
        nodeRef={menuRef}
        in={isMenuOpen}
        timeout={200}
        classNames="menu"
        unmountOnExit
      >
        <GptMenu ref={menuRef} />
      </CSSTransition>
    </>
  );
};
