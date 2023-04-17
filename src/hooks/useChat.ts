import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum
} from "openai";
import { useCallback, useEffect, useState } from "react";
import { baseApiOptions, useOpenaiClient } from "../context/openaiClient";

export function useChat() {
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { client } = useOpenaiClient();

  const fetchResponse = useCallback(
    async (messages: ChatCompletionRequestMessage[]) => {
      try {
        setLoading(true);
        const response = await client.createChatCompletion({
          ...baseApiOptions,
          messages
        });

        const responseText = response.data.choices[0].message?.content;
        if (responseText) {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: responseText }
          ]);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    },
    [client]
  );

  const generate = useCallback(
    async (newInput: string) => {
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
