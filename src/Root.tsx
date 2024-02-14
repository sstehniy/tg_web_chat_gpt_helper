import { ReactComponent as Logo } from "./assets/chat_gpt_logo.svg";
import { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { GptMenu } from "./components/GPTMenu";
import { useTheme } from "./context/themeProvider";
import { useClickOutside } from "./hooks/useClickOutside";

export const Root = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuBottomProp, setMenuBottomProp] = useState(0);
  const [hide, setHide] = useState(true);

  const menuRef = useRef(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const theme = useTheme();
  useClickOutside(
    menuRef,
    () => {
      setIsMenuOpen(false);
    },
    (e) => {
      if (!buttonRef.current || !e.target) return false;
      return (
        // Prevents the menu from closing when the button is clicked
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        e.target.id === buttonRef.current.id ||
        buttonRef.current.contains(e.target as Node)
      );
    }
  );

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
        id="tg_gpt_helper_button"
        className={`btn-icon ${theme.classNames.attachFile} ${
          isMenuOpen ? theme.classNames.menuOpen : ""
        }`}
        ref={buttonRef}
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
