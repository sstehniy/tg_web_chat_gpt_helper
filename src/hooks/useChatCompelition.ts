import { ChatCompletionRequestMessage } from "openai";
import { useCallback, useEffect, useState } from "react";

import { useChatObserver } from "../context/chatObserver";
import { baseApiOptions, useOpenaiClient } from "../context/openaiClient";

export function useChatCompelition() {
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { updatedUrl, selectedMessage } = useChatObserver();
  const { client } = useOpenaiClient();

  useEffect(() => {
    setMessages([]);
  }, [updatedUrl, selectedMessage]);

  const generate = useCallback(
    async (messages: ChatCompletionRequestMessage[]) => {
      setError(null);
      try {
        console.log(messages);
        setLoading(true);
        const response = await client.createChatCompletion({
          ...baseApiOptions,
          messages
        });
        console.log(response);
        const responseText = response.data.choices[0].message?.content;
        if (responseText) {
          setMessages((prev) => [...prev, responseText]);
        }
      } catch (e) {
        console.log(e);
        setError(e as any);
      } finally {
        setLoading(false);
      }
    },
    [client]
  );
  return { messages, loading, error, generate };
}
