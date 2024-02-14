import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum
} from "openai";
import { useCallback, useState } from "react";
import { baseApiOptions, useOpenaiClient } from "../context/openaiClient";

export function useChat() {
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { client, selectedModel } = useOpenaiClient();

  const fetchResponse = useCallback(
    async (messages: ChatCompletionRequestMessage[]) => {
      try {
        setLoading(true);
        const response = await client.createChatCompletion({
          ...baseApiOptions,
          model: selectedModel.value,
          messages
        });
        let responseText = response.data.choices[0].message?.content;
        // check if responseText starts with the pattern something:
        if (responseText?.match(/^[a-zA-Z]+:/)) {
          // if so, remove the first part of the string
          responseText = responseText.replace(/^[a-zA-Z]+:/, "").trim();
        }
        if (responseText) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: responseText as string
            }
          ]);
        }
      } catch (e) {
        setError(e as any);
      } finally {
        setLoading(false);
      }
    },
    [client, selectedModel.value]
  );

  const generate = useCallback(
    async (newInput: string) => {
      setError(null);
      const newMessages = [
        ...messages,
        { role: ChatCompletionRequestMessageRoleEnum.User, content: newInput }
      ];
      setMessages(newMessages);
      fetchResponse(newMessages);
    },
    [fetchResponse, messages]
  );
  return { messages, loading, error, generate };
}
