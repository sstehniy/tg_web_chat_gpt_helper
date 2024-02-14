export type TelegramTheme = {
  selectors: {
    root: string;
    bubblesGroup: string;
    bubble: string;
    bubbles: string;
    bubblesWithTextWrappers: string;
    userTitle: string;
    helperActive: string;
    replyToPeer: string;
    replyContent: string;
    chatInputContainer: string;
    chatInput: string;
  };
  classNames: {
    attachMenu: string;
    attachFile: string;
    menuOpen: string;
    isOut: string;
  };
  vars: {
    primary: string;
    secondary: string;
    secondaryTextColor: string;
    surfaceColor: string;
    primaryTextColor: string;
    inputSearchBackgroundColor: string;
    messageBackground: string;
    tooltipBackground: string;
  };
};

export const tgSelectorsAndStyles: Record<"k" | "z", TelegramTheme> = {
  k: {
    selectors: {
      root: ".new-message-wrapper",
      bubblesGroup: ".bubbles-group",
      bubble: ".bubble",
      bubbles: ".bubbles",
      bubblesWithTextWrappers:
        ".message.spoilers-container:not(.call-message):not(.document-message)",
      userTitle: ".top .user-title",
      helperActive: ".chat.tabs-tab.active.is-helper-active",
      replyToPeer: ".reply-wrapper .reply-content .reply-title .peer-title",
      replyContent: ".reply-wrapper .reply-content .reply-subtitle",
      chatInputContainer: ".chat-input-container",
      chatInput:
        ".input-message-input.i18n.scrollable.scrollable-y.no-scrollbar"
    },
    classNames: {
      attachMenu: "",
      attachFile: "attach-file",
      menuOpen: "menu-open",
      isOut: "is-out"
    },
    vars: {
      primary: "var(--primary-color)",
      secondary: "var(--secondary-color)",
      secondaryTextColor: "var(--secondary-text-color)",
      surfaceColor: "var(--surface-color)",
      primaryTextColor: "var(--primary-text-color)",
      inputSearchBackgroundColor: "var(--input-search-background-color)",
      messageBackground: "var(--light-filled-message-out-primary-color)",
      tooltipBackground: "var(--light-filled-message-primary-color)"
    }
  },
  z: {
    selectors: {
      root: ".new-message-wrapper",
      bubblesGroup: ".messages-container",
      bubble: ".Message",
      bubbles: ".MessageList",
      bubblesWithTextWrappers: ".text-content.clearfix.with-meta",
      userTitle: ".info",
      helperActive: ".EmbeddedMessage.inside-input",
      replyToPeer: ".EmbeddedMessage.inside-input .message-text .message-title",
      replyContent: ".EmbeddedMessage.inside-input .message-text p",
      chatInputContainer: ".middle-column-footer",
      chatInput: "#editable-message-text"
    },
    classNames: {
      attachMenu: "AttachMenu",
      attachFile: "Button AttachMenu--button default translucent round",
      menuOpen: "activated",
      isOut: "own"
    },
    vars: {
      primary: "var(--color-primary)",
      secondary: "var(--color-text-secondary)",
      secondaryTextColor: "var(--color-text-secondary)",
      surfaceColor: "var(--color-background)",
      primaryTextColor: "var(--color-text)",
      inputSearchBackgroundColor: "var(--input-search-background-color)",
      messageBackground: "var(--color-background-own)",
      tooltipBackground: "var(--color-reply-hover)"
    }
  }
};
