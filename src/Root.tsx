import { ReactComponent as Logo } from "./assets/chat_gpt_logo.svg";
import { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { GptMenu } from "./components/GptMenu";
import { useTheme } from "./context/themeProvider";

export const Root = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuBottomProp, setMenuBottomProp] = useState(0);
  const [hide, setHide] = useState(true);

  const menuRef = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const inputHeight = document
        .querySelector(theme.selectors.chatInputContainer)
        ?.getBoundingClientRect().height;
      if (inputHeight && inputHeight !== menuBottomProp) {
        setMenuBottomProp(inputHeight - 10);
      }
    });
    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true
    });
    return () => {
      observer.disconnect();
    };
  }, [menuBottomProp, theme]);

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
      <div
        style={{
          position: "absolute",
          bottom: menuBottomProp,
          right: 0,
          display: hide ? "none" : "block",
          transition: "bottom 0.2s ease-in-out"
        }}
      >
        <CSSTransition
          nodeRef={menuRef}
          in={isMenuOpen}
          timeout={200}
          classNames="gpt-menu"
          onEnter={() => {
            setHide(false);
          }}
          onExited={() => {
            setHide(true);
          }}
        >
          <GptMenu ref={menuRef} />
        </CSSTransition>
      </div>
    </>
  );
};
