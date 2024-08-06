import { View } from "../../../../../util/view";
import {
  ElementCreator,
  ElementParametrs,
} from "../../../../../util/element-creator";
import { Connection } from "../../../../../connection/connection";
import { MessageHistoryView } from "../message-history-view/message-history-view";
import sendIcon from "./send-icon.svg";
import "./message-input-field-style.scss";

export class MessageInputFieldView extends View {
  private readonly connection: Connection;

  private readonly textArea: HTMLElement;

  private readonly button: HTMLElement;

  private readonly messageHistoryArr: [MessageHistoryView | null];

  private isFieldActie: boolean;

  constructor(
    cssCLasses: string[],
    connection: Connection,
    messageHistoryArr: [MessageHistoryView | null],
  ) {
    const MESSAGE_INPUT_FIELD_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: [
        "message-input-field",
        "message-input-field_disabled",
        ...cssCLasses,
      ],
    };
    super(MESSAGE_INPUT_FIELD_PARAMS);
    this.connection = connection;
    this.isFieldActie = false;
    this.messageHistoryArr = messageHistoryArr;
    [this.textArea, this.button] = this.configureView();
    this.buttonOnCLick();
    this.textAreaKeyboardEvents();
  }

  public disableField(): void {
    this.getHtmlElement().classList.add("message-input-field_disabled");
    this.textArea.contentEditable = "false";
    this.isFieldActie = false;
    this.clearTextArea();
  }

  public activateField(): void {
    this.getHtmlElement().classList.remove("message-input-field_disabled");
    this.isFieldActie = true;
    this.textArea.contentEditable = "true";
  }

  public clearTextArea(): void {
    this.textArea.textContent = "";
  }

  private configureView(): HTMLElement[] {
    const textArea = new ElementCreator({
      tag: "p",
      cssClasses: ["message-input-field__textArea"],
      atributes: [{ name: "contenteditable", value: "true" }],
    });
    textArea.getElement().style.width = "";
    textArea.getElement().style.height = "";

    const button = new ElementCreator({
      tag: "div",
      cssClasses: ["message-input-field__button"],
    });
    const buttonIcon = new ElementCreator({
      tag: "img",
      cssClasses: ["message-input-field__button-icon"],
      atributes: [
        {
          name: "src",
          value: sendIcon,
        },
      ],
    });
    button.apendInnerElements(buttonIcon);
    this.viewCreator.apendInnerElements(textArea, button);
    return [textArea.getElement(), button.getElement()];
  }

  private sendMessage(): void {
    if (this.messageHistoryArr[0] && this.textArea.textContent?.trim()) {
      this.connection.sender.sendMessage(
        this.messageHistoryArr[0]?.login,
        this.textArea.textContent,
      );
      this.clearTextArea();
      this.messageHistoryArr[0].changeMessagesReadedStatus();
      this.messageHistoryArr[0].removeNewMessagesLine();
    }
  }

  private buttonOnCLick(): void {
    this.button.addEventListener("click", () => {
      if (!this.isFieldActie) {
        return;
      }
      this.sendMessage();
    });
  }

  private textAreaKeyboardEvents(): void {
    const keyDownEventHandler = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !event.shiftKey) {
        this.sendMessage();
        event.preventDefault();
      }
    };
    this.textArea.addEventListener("focus", () => {
      window.addEventListener("keydown", keyDownEventHandler);
    });
    this.textArea.addEventListener("blur", () => {
      window.removeEventListener("keydown", keyDownEventHandler);
    });
  }
}
