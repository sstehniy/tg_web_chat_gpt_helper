import { PromptType } from "./types";

/*
i will give you a log of chat messages between two people: ME and OTHER. each log looks like this:

> [ME|OTHER]: [MESSAGE]

These messages should be used as the conversation context.  The last message can be either marked as REPLYTO or FOLLOWUP. Such a message looks like this:

> [REPLYTO|FOLLOWUP]: [MESSAGE]

If the last message is marked as REPLYTO,  your task is given the context, create a reply to the given MESSAGE. It is up to you to take the context into account when creating the reply message.
If the last message is marked as FOLLOWUP,  your task is given the context, create a follow-up message to the given MESSAGE. It is up to you to take the context into account when creating the reply message. Output should be in the language of the REPLYTO|FOLLOWUP language marked as ME. Return only the output message without log foramtting.

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

Each input ends with "Output type: [REPLY|FOLLOWUP]"

If the output type is REPLY,  your task is given the context, create a reply to the given selected MESSAGE. It is up to you to take the context into account when creating the reply message.
If the output type is FOLLOUP,  your task is given the context, create a follow-up to the given selected MESSAGE. It is up to you to take the context into account when creating the reply message.
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
  
  Each input ends with "Output type: [REPLY|FOLLOWUP]"
  
  If the output type is REPLY, your task is given the context, create a reply to the given selected MESSAGE. It is up to you to take the context into account when creating the reply message.
  If the output type is FOLLOUP, your task is given the context, create a follow-up to the given selected MESSAGE. It is up to you to take the context into account when creating the reply message.
  Output should be in the language of the SELECTED message. Return only the output message without log foramtting.
  
  LOG: 
  {{LOGS}}
  
  Output type: {{OUTPUT_TYPE}}
  `
};
