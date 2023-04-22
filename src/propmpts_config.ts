import { PromptType } from "./types";
export const prompts: Record<PromptType, string> = {
  SMART_PROMPT: `
In this task, you'll be given a chat log between two people: 'ME' and 'OTHER'. Each message appears as follows:
ME: MESSAGE
or
OTHER: MESSAGE
The final message starts with 'SELECTED' and is part of the chat log. Based on the context from the 'ME' and 'OTHER' messages, craft a short, appropriate response to the 'SELECTED' message as if you were participating in the conversation. Please provide only the message content, without the 'ME:' prefix. If unsure of a response, still reply to the 'SELECTED' message. Please output the response in the primary language of the conversation.

Consider these guidelines:
  
Writing style: Conversational
Tone: Neutral
Maximum length: 50 words

Ensure these guidelines are followed when creating your response.  
`,
  CUSTOM_PROMPT: `
In this task, you'll be given a chat log between two people: 'ME' and 'OTHER'. Each message appears as follows:
ME: MESSAGE
or
OTHER: MESSAGE
The final message starts with 'SELECTED' and is part of the chat log. Based on the context from the 'ME' and 'OTHER' messages, craft a short, appropriate response to the 'SELECTED' message as if you were participating in the conversation. Please provide only the message content, without the 'ME:' prefix. If unsure of a response, still reply to the 'SELECTED' message. Please output the response in the primary language of the conversation.

Consider these guidelines:

Writing style: {{OUTPUT_WRITING_STYLE}}
Tone: {{OUTPUT_TONE}}
Maximum length: maximum 50 words

Ensure these guidelines are followed when creating your response.
`
};
