import { useState } from "react";
import { useOpenaiClient } from "../context/openaiClient";
import { useTheme } from "../context/themeProvider";

export const KeySetup = () => {
  const { handleSetToken } = useOpenaiClient();
  const [inputToken, setInputToken] = useState("");
  const [showInputError, setShowInputError] = useState(false);
  const theme = useTheme();
  return (
    <form
      autoComplete="off"
      onSubmit={(e) => e.preventDefault()}
      className="mt-2"
    >
      <div className="form-control">
        <label className="label mb-0">
          <span className="label-text">
            Please enter your OpenAI API-Key to start using the assistant
          </span>
        </label>
        <div className="flex gap-2">
          <input
            type="password"
            autoComplete="new-password"
            role="presentation"
            id="api-key"
            name="api-key"
            placeholder="***************************************************"
            onChange={(e) => {
              setShowInputError(false);
              setInputToken(e.target.value);
            }}
            style={{
              backgroundColor: theme.vars.inputSearchBackgroundColor
            }}
            className="input input-sm input-bordered rounded-lg w-full  shadow-md"
          />
          <button
            className="btn btn-sm"
            style={{
              backgroundColor: theme.vars.primary,
              color: "white"
            }}
            onClick={(e) => {
              e.preventDefault();

              if (!inputToken) {
                setShowInputError(true);
                return;
              }
              handleSetToken(inputToken);
            }}
          >
            Set Key
          </button>
        </div>

        <label className="label mb-0 mb-0">
          <span className="label-text-alt text-red-500">
            {showInputError && "Field is empty!"}
          </span>
          <span className="label-text-alt">
            <a href="https://elephas.app/blog/how-to-create-openai-api-keys-cl5c4f21d281431po7k8fgyol0">
              Where do i find my API key?
            </a>
          </span>
        </label>
      </div>
    </form>
  );
};
