import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import { Configuration, OpenAIApi } from "openai";
import { ContextMessage, OutputMessageType } from "../types";
import { prompts } from "../propmpts_config";

let client: OpenAIApi;

type GptApiContextType = {
  isAuthorized: boolean;
  handleSetToken: (token: string) => void;
  handleCreateSmartReply: (
    targetMessage: string,
    contextMessages: ContextMessage[],
    type: OutputMessageType
  ) => Promise<string>;
};

const GptApiContext = createContext<GptApiContextType>(
  null as unknown as GptApiContextType
);

export const useGptApi = () => useContext(GptApiContext);

export const GptApiProvider: FC<PropsWithChildren<unknown>> = ({
  children
}) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [token, setToken] = useState("");
  const clientInitialized = useRef(false);

  const handleSetToken = useCallback((token: string) => {
    chrome.storage.local.set({ tg_gpt_helper_openai_token: token }, () => {
      setToken(token);
    });
  }, []);

  const handleCreateSmartReply = useCallback(
    async (
      targetMessage: string,
      contextMessages: ContextMessage[],
      type: OutputMessageType
    ) => {
      let output = "";
      try {
        const response = await client.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            {
              content: consturctSmartPrompt(
                targetMessage,
                contextMessages,
                type
              ),
              role: "user"
            }
          ],
          top_p: 0.7,
          temperature: 0.7,
          max_tokens: 512
        });
        console.log(response.data.choices[0].message);
        output = response.data.choices[0].message?.content || "Error";
      } catch (e) {
        console.error(e);
        output = "Error";
      }
      return output;
    },
    []
  );

  useEffect(() => {
    chrome.storage.local.get("tg_gpt_helper_openai_token", (result) => {
      if (typeof result.tg_gpt_helper_openai_token === "string")
        setToken(result.tg_gpt_helper_openai_token);
    });
  }, []);

  useEffect(() => {
    if (!token) return;
    (async () => {
      const config = new Configuration({
        apiKey: token
      });
      client = new OpenAIApi(config);
      clientInitialized.current = true;
      try {
        const models = await client.listModels();
        setIsAuthorized(true);
        console.log(models);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [token]);

  return (
    <GptApiContext.Provider
      value={{ isAuthorized, handleSetToken, handleCreateSmartReply }}
    >
      {children}
    </GptApiContext.Provider>
  );
};

const consturctSmartPrompt = (
  targetMessage: string,
  contextMessages: ContextMessage[],
  type: OutputMessageType
) => {
  const logs = contextMessages.map((message) => {
    return `> ${message.isOwn ? "ME" : "OTHER"}: ${message.content}\n`;
  });
  logs.push(`> SELECTED: ${targetMessage}\n`);
  const logsString = logs.join("");
  const promptTemplate = prompts.SMART_PROMPT;
  const requestPrompt = promptTemplate
    .replace("{{LOGS}}", logsString)
    .replace("{{OUTPUT_TYPE}}", type);
  console.warn({ requestPrompt });
  return requestPrompt;
};
