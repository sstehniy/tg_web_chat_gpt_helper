import { FC, useState } from "react";
import ReactSelect, { SingleValue } from "react-select";
import { useTheme } from "../context/themeProvider";

type SelectProps = {
  options: { value: string; label: string }[];
  onChange: (value: SingleValue<{ value: string; label: string }>) => void;
};

export const Select: FC<SelectProps> = ({ onChange, options }) => {
  const theme = useTheme();
  return (
    <div className="w-full">
      <ReactSelect
        options={options}
        onChange={onChange}
        components={{
          IndicatorSeparator: () => null
        }}
        maxMenuHeight={200}
        defaultValue={options[0]}
        menuPlacement="top"
        styles={{
          control: (provided, state) => ({
            ...provided,
            backgroundColor: theme.vars.inputSearchBackgroundColor,
            color: theme.vars.primaryTextColor,
            borderColor: theme.vars.secondary,
            borderWidth: "2px",
            borderRadius: "0.5rem",
            boxShadow: state.isFocused
              ? "0 0 0 3px rgba(209, 213, 219, 0.3)"
              : "none",
            padding: "0.25rem",
            minHeight: "2.5rem",
            "&:hover": {
              borderColor: theme.vars.primary
            }
          }),
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused
              ? theme.vars.messageBackground
              : theme.vars.surfaceColor,
            color: theme.vars.primaryTextColor,
            cursor: "pointer",
            padding: "0.5rem 1rem"
          }),
          menu: (provided) => ({
            ...provided,
            backgroundColor: theme.vars.surfaceColor,
            borderRadius: "0.5rem",
            overflow: "hidden",
            boxShadow: "0 1px 4px 0 rgba(0, 0, 0, 0.5)",
            marginTop: "0.25rem"
          }),
          singleValue: (provided) => ({
            ...provided,
            color: theme.vars.primaryTextColor,
            fontSize: "1rem"
          })
        }}
      />
    </div>
  );
};
