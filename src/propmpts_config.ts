import { PromptType } from "./types";

/*
i will give you a log of chat messages between two people: ME and OTHER. each log looks like this:

> [ME|OTHER]: [MESSAGE]

These messages should be used as the conversation context.  The last message can be either marked as REPLYTO or COMPLEMENT. Such a message looks like this:

> [REPLYTO|COMPLEMENT]: [MESSAGE]

If the last message is marked as REPLYTO,  your task is given the context, create a reply to the given MESSAGE. 
If the last message is marked as COMPLEMENT,  your task is given the context, create a follow-up message to the given MESSAGE.  Output should be in the language of the REPLYTO|COMPLEMENT language marked as ME. Return only the output message without log foramtting.

LOG: 
> OTHER:  Ты ещё не спишь, кисик?
> ME: нет
> ME: с парнями в дискорде сидим общаемся
> ME: а у тебя как дела?
> ME: на каком вы этапе
> OTHER: Едем в другую общагу
> ME: собирается народ)
> OTHER: Я не надеюсь на что-то хорошее
> ME: почему же?
> OTHER: Я предвзята
> REPLYTO: Наша общага ЗЭ БЭСТ
*/

/*
  i will give you a log of chat messages between two people: ME and OTHER. each log looks like this:

> [ME|OTHER]: [MESSAGE]

These messages should be used as the conversation context.  The last message is marked as SELECTED. Such a message looks like this:

> SELETED: [MESSAGE]

Each input ends with "Output type: [REPLY|COMPLEMENT]"

If the output type is REPLY,  your task is given the context, create a reply to the given selected MESSAGE. 
If the output type is FOLLOUP,  your task is given the context, create a follow-up to the given selected MESSAGE. 
Output should be in the language of the SELECTED message. Return only the output message without log foramtting.

LOG: 
> OTHER:  Ты ещё не спишь, кисик?
> ME: нет
> ME: с парнями в дискорде сидим общаемся
> ME: а у тебя как дела?
> ME: на каком вы этапе
> OTHER: Едем в другую общагу
> ME: собирается народ)
> OTHER: Я не надеюсь на что-то хорошее
> ME: почему же?
> OTHER: Я предвзята
> SELECTED: Наша общага ЗЭ БЭСТ

Output type: REPLY
*/

// file contains the prompts preset for completion
export const prompts: Record<PromptType, string> = {
  SMART_PROMPT: `
  i will give you a log of chat messages between two people: ME and OTHER. each log looks like this:

  > [ME|OTHER]: [MESSAGE]
  
  These messages should be used as the conversation context.  The last message is marked as SELECTED. Such a message looks like this:
  
  > SELETED: [MESSAGE]
  
  Each input ends with "Output type: REPLY"
  
  If the output type is REPLY, your task is given the context, create a reply to the message from the logs starting wiht SELECTED. You should analyze the logs to create a sensible message. Return only the output message without log foramtting. After the logs there will be given a list of additional infos to take in account when creating the output.
  
  LOG: 
  {{LOGS}}

  Additional info to take into account:
   - Output type should be: {{OUTPUT_TYPE}}
   - Output language: The language of the last log message
  
  Only return the message i will use in the chat, please! Without Output type at the end! `,
  CUSTOM_PROMPT: `
  i will give you a log of chat messages between two people: ME and OTHER. each log looks like this:

  > [ME|OTHER]: [MESSAGE]
  
  These messages should be used as the conversation context.  The last message is marked as SELECTED. Such a message looks like this:
  
  > SELETED: [MESSAGE]
  
  Each input ends with "Output type: REPLY"
  
  If the output type is REPLY, your task is given the context, create a reply to the message from the logs starting wiht SELECTED. You should analyze the logs to create a sensible message. Return only the output message without log foramtting. After the logs there will be given a list of additional infos to take in account when creating the output.
  
  LOG: 
  {{LOGS}}
  {{SELECTED_MESSAGE}}
  
  Additional info to take into account:
   - Output type should be: {{OUTPUT_TYPE}}
   - Output writing style: {{OUTPUT_WRITING_STYLE}}
   - Output tone: {{OUTPUT_TONE}}
   - Additional prompt to take into account: {{CUSTOM_PROMPT}}
   - Output language: {{OUTPUT_LANGUAGE}}
   
  Only return the message i will use in the chat, please! Without Output type at the end!`
};
