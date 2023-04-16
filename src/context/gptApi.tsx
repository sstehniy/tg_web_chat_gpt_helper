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
import { useChatObserver } from "./chatObserver";

let client: OpenAIApi;

type GptApiContextType = {
  isAuthorized: boolean;
  handleSetToken: (token: string) => void;
  handleCreateSmartReply: () => Promise<void>;
  handleCreateCustomReply: (
    customPrompt: string,
    customLanguage: string,
    customTone: string,
    customStyle: string
  ) => Promise<void>;
  currentSmartReplies: string[];
  currentCustomReplies: string[];
};

const GptApiContext = createContext<GptApiContextType>(
  null as unknown as GptApiContextType
);

export const useGptApi = () => useContext(GptApiContext);

const baseApiOptions = {
  model: "gpt-3.5-turbo",
  top_p: 1,
  temperature: 0.7,
  max_tokens: 512
};

export const GptApiProvider: FC<PropsWithChildren<unknown>> = ({
  children
}) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [token, setToken] = useState("");
  const clientInitialized = useRef(false);
  const [currentSmartReplies, setCurrentSmartReplies] = useState<string[]>([]);
  const [currentCustomReplies, setCurrentCustomReplies] = useState<string[]>(
    []
  );
  const { contextMessages, selectedMessage, updatedUrl } = useChatObserver();

  useEffect(() => {
    setCurrentCustomReplies([]);
    setCurrentSmartReplies([]);
  }, [updatedUrl]);

  useEffect(() => {
    setCurrentSmartReplies([]);
    setCurrentCustomReplies([]);
  }, [selectedMessage]);

  const handleSetToken = useCallback((token: string) => {
    chrome.storage.local.set({ tg_gpt_helper_openai_token: token }, () => {
      setToken(token);
    });
  }, []);

  const handleCreateCustomReply = useCallback(
    async (
      customPrompt: string,
      customLanguage: string,
      customTone: string,
      customStyle: string
    ) => {
      if (!selectedMessage) return;
      let output = "";
      try {
        const response = await client.createChatCompletion({
          ...baseApiOptions,
          messages: [
            {
              content: consturctCustomPrompt(
                selectedMessage,
                contextMessages,
                customPrompt,
                customLanguage,
                customTone,
                customStyle
              ),
              role: "user"
            }
          ]
        });
        console.log(response.data.choices[0].message);
        output = response.data.choices[0].message?.content || "Error";
      } catch (e) {
        console.error(e);
        output = "Error";
      }
      setCurrentCustomReplies((prev) => [...prev, output]);
    },
    [contextMessages, selectedMessage]
  );

  const handleCreateSmartReply = useCallback(async () => {
    if (!selectedMessage) return;
    let output = "";
    try {
      const response = await client.createChatCompletion({
        ...baseApiOptions,
        messages: [
          {
            content: consturctSmartPrompt(selectedMessage, contextMessages),
            role: "user"
          }
        ]
      });
      console.log(response.data.choices[0].message);
      output = response.data.choices[0].message?.content || "Error";
    } catch (e) {
      console.error(e);
      output = "Error";
    }
    setCurrentSmartReplies((prev) => [...prev, output]);
  }, [contextMessages, selectedMessage]);

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
      value={{
        isAuthorized,
        handleSetToken,
        handleCreateSmartReply,
        handleCreateCustomReply,
        currentCustomReplies,
        currentSmartReplies
      }}
    >
      {children}
    </GptApiContext.Provider>
  );
};

const consturctSmartPrompt = (
  targetMessage: ContextMessage,
  contextMessages: ContextMessage[]
) => {
  const logs = contextMessages.map((message) => {
    return `> ${message.isOwn ? "ME" : "OTHER"}: ${message.content}\n`;
  });
  logs.push(`> SELECTED: ${targetMessage.content}\n`);
  const logsString = logs.join("");
  const promptTemplate = prompts.SMART_PROMPT;
  const requestPrompt = promptTemplate
    .replace("{{LOGS}}", logsString)
    .replace(
      "{{OUTPUT_TYPE}}",
      targetMessage.isOwn
        ? OutputMessageType.COMPLEMENT
        : OutputMessageType.REPLY
    );
  console.warn({ requestPrompt });
  return requestPrompt;
};

const consturctCustomPrompt = (
  targetMessage: ContextMessage,
  contextMessages: ContextMessage[],
  customPrompt: string,
  customLanguage: string,
  customTone: string,
  customStyle: string
) => {
  const logs = contextMessages.map((message) => {
    return `> ${message.isOwn ? "ME" : "OTHER"}: ${message.content}\n`;
  });
  const logsString = logs.join("");
  const promptTemplate = prompts.CUSTOM_PROMPT;
  console.log(logsString);
  const requestPrompt = promptTemplate
    .replace("{{LOGS}}", logsString)
    .replace(
      "{{OUTPUT_TYPE}}",
      targetMessage.isOwn
        ? OutputMessageType.COMPLEMENT
        : OutputMessageType.REPLY
    )

    .replace("{{SELECTED_MESSAGE}}", `> SELECTED: ${targetMessage.content}\n`)
    .replace(
      "{{OUTPUT_LANGUAGE}}",
      customLanguage === "Default language"
        ? "The language of the SELECTED message"
        : customLanguage
    )
    .replace("{{CUSTOM_PROMPT}}", customPrompt || "")
    .replace("{{OUTPUT_TONE}}", customTone)
    .replace("{{OUTPUT_WRITING_STYLE}}", customStyle);

  console.warn({ requestPrompt });
  return requestPrompt;
};
