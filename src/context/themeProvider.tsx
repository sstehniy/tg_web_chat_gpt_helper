import { PropsWithChildren, createContext, useContext } from "react";
import { TelegramTheme } from "../tgSelectorsAndStyles";

const ThemeContext = createContext(null as unknown as TelegramTheme);

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<
  PropsWithChildren<{ theme: TelegramTheme }>
> = ({ children, theme }) => {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};
