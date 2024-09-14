import { View } from "../../../../../util/view";
import {
  ElementCreator,
  ElementParametrs,
} from "../../../../../util/element-creator";
import { Connection } from "../../../../../connection/connection";
import { MessageHistoryView } from "../message-history-view/message-history-view";
import sendIcon from "./send-icon.svg";
import "./message-input-field-style.scss";
import { ModalWindowView } from "../../../../modal-window-view/modal-window-view";

type EditButtons = {
  container: HTMLElement;
  editButton: HTMLElement;
  undoButton: HTMLElement;
};

export class MessageInputFieldView extends View {
  private readonly connection: Connection;

  private readonly textArea: HTMLElement;

  private readonly sendButton: HTMLElement;

  private readonly editButtons: EditButtons;

  private readonly modalWindowView: ModalWindowView;

  private readonly messageHistoryArr: [MessageHistoryView | null];

  private isFieldActie: boolean;

  private readonly editModeData: {
    enable: boolean;
    id: string | null;
    initialtext: string | null;
  };

  constructor(
    cssCLasses: string[],
    connection: Connection,
    messageHistoryArr: [MessageHistoryView | null],
    modalWindow: ModalWindowView,
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
    this.modalWindowView = modalWindow;
    this.isFieldActie = false;
    this.editModeData = { enable: false, id: null, initialtext: null };
    this.messageHistoryArr = messageHistoryArr;
    [this.textArea, this.sendButton, this.editButtons] = this.configureView();
    this.addButtonsEventListeners();
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

  public enableEditMode(id: string, text?: string): void {
    if (text) {
      this.textArea.textContent = text;
      this.editModeData.initialtext = text;
    }
    this.editModeData.enable = true;
    this.editModeData.id = id;
    this.getHtmlElement().classList.add("message-iput-field_edit-mode");

    this.textArea.focus();
    const range = new Range();
    const selection = window.getSelection();
    const textNode = this.textArea.firstChild;
    const textContent = textNode?.textContent;
    if (textNode && textContent) {
      range.setStart(textNode, textContent.length);
      range.setEnd(textNode, textContent.length);
    }
    selection?.removeAllRanges();
    selection?.addRange(range);
  }

  public disableEditMode(): void {
    this.editModeData.enable = false;
    this.editModeData.id = "";
    this.getHtmlElement().classList.remove("message-iput-field_edit-mode");
  }

  public isEditModeEnable() {
    return this.editModeData.enable;
  }

  public showModalWindowOnEditModExit(yesCallback?: () => void): void {
    this.modalWindowView.openModalWindow({
      text: "Are you sure that you want to leave? Changes you made will not be saved.",
      leftButton: {
        text: "Yes",
        callback: () => {
          this.disableEditMode();
          this.clearTextArea();
          if (yesCallback) {
            yesCallback();
          }
        },
      },
      rightButton: { text: "No", callback: () => {} },
    });
  }

  private configureView(): [HTMLElement, HTMLElement, EditButtons] {
    const textArea = new ElementCreator({
      tag: "p",
      cssClasses: ["message-input-field__textArea"],
      atributes: [{ name: "contenteditable", value: "true" }],
    });
    textArea.getElement().style.width = "";
    textArea.getElement().style.height = "";
    const buttonsContainer = new ElementCreator({
      tag: "div",
      cssClasses: ["message-input-field__buttons-container"],
    });
    const editButtons = this.createEditButtons();
    const sendButton = new ElementCreator({
      tag: "div",
      cssClasses: ["message-input-field__send-button"],
    });
    const sendButtonIcon = new ElementCreator({
      tag: "img",
      cssClasses: ["message-input-field__send-button-icon"],
      atributes: [
        {
          name: "src",
          value: sendIcon,
        },
      ],
    });
    sendButton.apendInnerElements(sendButtonIcon);
    buttonsContainer.apendInnerElements(editButtons.container, sendButton);
    this.viewCreator.apendInnerElements(textArea, buttonsContainer);
    return [textArea.getElement(), sendButton.getElement(), editButtons];
  }

  private createEditButtons(): EditButtons {
    const editButtonsContainer = new ElementCreator({
      tag: "div",
      cssClasses: ["message-input-field__edit-buttons-container"],
    });
    const editButton = new ElementCreator({
      tag: "div",
      cssClasses: ["message-input-field__edit-button"],
    });
    const editButtonIcon = new ElementCreator({
      tag: "img",
      cssClasses: ["message-input-field__edit-button-icon"],
      atributes: [
        {
          name: "src",
          value: sendIcon,
        },
      ],
    });
    editButton.apendInnerElements(editButtonIcon);
    const undoButton = new ElementCreator({
      tag: "div",
      cssClasses: ["message-input-field__undo-button"],
    });
    const undoButtonIcon = new ElementCreator({
      tag: "img",
      cssClasses: ["message-input-field__undo-button-icon"],
      atributes: [
        {
          name: "src",
          value: sendIcon,
        },
      ],
    });
    undoButton.apendInnerElements(undoButtonIcon);
    editButtonsContainer.apendInnerElements(undoButton, editButton);
    return {
      container: editButtonsContainer.getElement(),
      editButton: editButton.getElement(),
      undoButton: undoButton.getElement(),
    };
  }

  private sendMessage(): void {
    if (this.messageHistoryArr[0] && this.textArea.textContent?.trim()) {
      this.connection.sender.sendMessage(
        this.messageHistoryArr[0]?.login,
        this.textArea.textContent,
      );
      this.clearTextArea();
    }
  }

  private editButtonHandler(): void {
    if (
      this.textArea.textContent &&
      this.editModeData.id &&
      !(this.textArea.textContent === this.editModeData.initialtext)
    ) {
      this.connection.sender.editMessage(
        this.editModeData.id,
        this.textArea.textContent,
      );
    }
    this.disableEditMode();
    this.clearTextArea();
  }

  private addButtonsEventListeners(): void {
    this.sendButton.addEventListener("click", () => {
      if (!this.isFieldActie) {
        return;
      }
      this.sendMessage();
    });
    this.editButtons.undoButton.addEventListener(
      "click",
      this.editButtonHandler.bind(this),
    );
  }

  private textAreaKeyboardEvents(): void {
    const keyDownEventHandler = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !event.shiftKey) {
        if (this.editModeData.enable) {
          this.editButtonHandler();
        } else {
          this.sendMessage();
        }
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
