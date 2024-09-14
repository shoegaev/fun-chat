import { View } from "../../../../util/view";
import {
  ElementCreator,
  ElementParametrs,
} from "../../../../util/element-creator";
import { Router } from "../../../../router/router";
import { Connection } from "../../../../connection/connection";
import { MessageHistoryView } from "./message-history-view/message-history-view";
import { MessageInputFieldView } from "./message-input-panel-view/message-input-field-view";
import { ModalWindowView } from "../../../modal-window-view/modal-window-view";
import "./messenger-interface-style.scss";

export class MessengerInterfaceView extends View {
  private readonly router: Router;

  private readonly connection: Connection;

  private readonly messageHistoryArr: [MessageHistoryView | null];

  private readonly messageHistoryContainer: HTMLElement;

  public readonly messageInputField: MessageInputFieldView;

  public readonly modalWindowView: ModalWindowView;

  constructor(
    cssClasses: string[],
    router: Router,
    connection: Connection,
    modalWindow: ModalWindowView,
  ) {
    const MESSENGER_INTERFACE_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: [
        "messenger-interface",
        "messenger-interface_user-not-selected",
        ...cssClasses,
      ],
    };
    super(MESSENGER_INTERFACE_PARAMS);
    this.router = router;
    this.connection = connection;
    this.modalWindowView = modalWindow;
    this.messageHistoryArr = [null];
    [this.messageHistoryContainer, this.messageInputField] =
      this.configureView();
  }

  public openMessageHistory(login: string): void {
    this.messageHistoryArr[0]?.removeView();
    const messageHistoryView = new MessageHistoryView(
      ["messenger-interface__message-history"],
      login,
      this.connection,
      this.router,
      this.messageInputField.enableEditMode.bind(this.messageInputField),
    );
    this.messageHistoryContainer.append(messageHistoryView.getHtmlElement());
    this.removeUserNotSelectedClass();
    this.messageHistoryArr[0] = messageHistoryView;
    this.connection.sender.getMessageHistory(login);
  }

  public closeMessageHistory(): void {
    this.messageHistoryArr[0]?.removeView();
    this.addUserNotSelectedClass();
  }

  private removeUserNotSelectedClass(): void {
    this.getHtmlElement().classList.remove(
      "messenger-interface_user-not-selected",
    );
  }

  public getCurrentMessageHistoriView(): MessageHistoryView | null {
    return this.messageHistoryArr[0];
  }

  private addUserNotSelectedClass(): void {
    this.getHtmlElement().classList.add(
      "messenger-interface_user-not-selected",
    );
  }

  private configureView(): [HTMLElement, MessageInputFieldView] {
    const messageHistoryContainer = new ElementCreator({
      tag: "div",
      cssClasses: ["messenger-interface__history-container"],
    });
    const messageHistoryPlaceholder = new ElementCreator({
      tag: "span",
      cssClasses: ["messenger-interface__message-history-placeholder"],
      textContent: "Select user from user list to start conversation",
    });
    messageHistoryContainer.apendInnerElements(messageHistoryPlaceholder);
    const messageInputField = new MessageInputFieldView(
      ["messenger-interface__message-input-field"],
      this.connection,
      this.messageHistoryArr,
      this.modalWindowView,
    );
    this.viewCreator.apendInnerElements(
      messageHistoryContainer,
      messageInputField.getHtmlElement(),
    );
    return [messageHistoryContainer.getElement(), messageInputField];
  }
}
