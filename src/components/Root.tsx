import { ReactComponent as Logo } from "../assets/chat_gpt_logo.svg";
import "../gpt-menu.css";
import { useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { useClickAway } from "../hooks/useClickAway";
import { GptMenu } from "./GPTMenu";

export const Root = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef(null);

  // useClickAway(wrapperRef, () => {
  //   setIsMenuOpen(false);
  // });

  return (
    <div ref={wrapperRef} style={{ position: "static" }}>
      <div
        className={`btn-icon attach-file ${isMenuOpen ? "menu-open" : ""}`}
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        <Logo
          width={24}
          height={24}
          fill={
            isMenuOpen ? "var(--primary-color)" : "var(--secondary-text-color)"
          }
        />
      </div>
      <CSSTransition
        nodeRef={menuRef}
        in={isMenuOpen}
        timeout={200}
        classNames="menu"
        unmountOnExit
      >
        <GptMenu ref={menuRef} />
      </CSSTransition>
    </div>
  );
};
