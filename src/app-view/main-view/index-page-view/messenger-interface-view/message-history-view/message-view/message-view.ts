import { View } from "../../../../../../util/view";
import {
  ElementCreator,
  ElementParametrs,
} from "../../../../../../util/element-creator";
import { Connection } from "../../../../../../connection/connection";
import "./message-style.scss";
import editIcon from "./edit-icon.svg";
import deleteIcon from "./delete-icon.svg";

export enum MessageStatus {
  sended = "Sended",
  delivered = "Delivered",
  readed = "Readed",
}

export interface MessageParams {
  incoming: boolean;
  datetime: number;
  status: MessageStatus;
  edited: boolean;
  text: string;
}

export class MessageView extends View {
  private readonly connection: Connection;

  public readonly params: MessageParams;

  private readonly status: HTMLElement;

  private readonly editedStatus: HTMLElement;

  private readonly editButton: HTMLElement;

  private readonly deleteButton: HTMLElement;

  private readonly text: HTMLElement;

  constructor(
    cssClasses: string[],
    connection: Connection,
    params: MessageParams,
  ) {
    const MESSAGE_VIEW_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: ["message", ...cssClasses],
    };
    if (params.incoming) {
      MESSAGE_VIEW_PARAMS.cssClasses.push("message_incoming");
    }
    super(MESSAGE_VIEW_PARAMS);
    this.connection = connection;
    this.params = params;
    [
      this.status,
      this.editedStatus,
      this.editButton,
      this.deleteButton,
      this.text,
    ] = this.configureView();
  }

  public setStatus(status: MessageStatus) {
    this.status.textContent = status;
  }

  private configureView(): HTMLElement[] {
    const userName = new ElementCreator({
      tag: "div",
      cssClasses: ["message__user-name"],
      textContent: this.params.incoming ? "other" : "you",
    });
    const messageContainer = new ElementCreator({
      tag: "div",
      cssClasses: ["message__message-container"],
    });
    const [header, status, editButton, deleteButton] =
      this.createHeader();
    const messageFooter = new ElementCreator({
      tag: "div",
      cssClasses: ["message__message-footer"],
    });
    const editedStatus = new ElementCreator({
      tag: "span",
      cssClasses: ["message__edited-status"],
      textContent: "Edited",
    });
    const date = new ElementCreator({
      tag: "span",
      cssClasses: ["message__date"],
      textContent: new Date(this.params.datetime).toUTCString().slice(4, -7),
    });
    messageFooter.apendInnerElements(editedStatus, date);
    const text = new ElementCreator({
      tag: "div",
      cssClasses: ["message__text"],
      textContent: this.params.text,
    });
    messageContainer.apendInnerElements(header, text, messageFooter);
    this.viewCreator.apendInnerElements(userName, messageContainer);
    return [
      status.getElement(),
      editedStatus.getElement(),
      editButton.getElement(),
      deleteButton.getElement(),
      text.getElement(),
    ];
  }

  private createHeader(): ElementCreator[] {
    const header = new ElementCreator({
      tag: "div",
      cssClasses: ["message__header"],
    });
    const status = new ElementCreator({
      tag: "span",
      cssClasses: ["message__status"],
      textContent: this.params.status,
    });

    const statusesContainer = new ElementCreator({
      tag: "div",
      cssClasses: ["message__statuses-container"],
    });
    const buttonsContainer = new ElementCreator({
      tag: "div",
      cssClasses: ["message__buttons-container"],
    });
    const editButton = new ElementCreator({
      tag: "div",
      cssClasses: ["message__edit-button"],
    });
    const editButtonIcon = new ElementCreator({
      tag: "img",
      cssClasses: ["message__edit-button-icon"],
      atributes: [{ name: "src", value: editIcon }],
    });
    const deleteButton = new ElementCreator({
      tag: "div",
      cssClasses: ["message__delete-button"],
    });
    const deleteButtonIcon = new ElementCreator({
      tag: "img",
      cssClasses: ["message__delete-button-icon"],
      atributes: [{ name: "src", value: deleteIcon }],
    });
    editButton.apendInnerElements(editButtonIcon);
    deleteButton.apendInnerElements(deleteButtonIcon);
    statusesContainer.apendInnerElements(status);
    buttonsContainer.apendInnerElements(editButton, deleteButton);
    header.apendInnerElements(statusesContainer, buttonsContainer);
    return [header, status, editButton, editButton, deleteButton];
  }
}
