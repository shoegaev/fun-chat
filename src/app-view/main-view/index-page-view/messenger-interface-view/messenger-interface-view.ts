import { View } from "../../../../util/view";
import {
  ElementCreator,
  ElementParametrs,
} from "../../../../util/element-creator";
import { Router } from "../../../../router/router";
import { Connection } from "../../../../connection/connection";
import { MessageHistoryView } from "./message-history-view/message-history-view";
import { MessageInputFieldView } from "./message-input-panel-view/message-input-field-view";
import "./messenger-interface-style.scss";

export class MessengerInterfaceView extends View {
  private router: Router;

  private connection: Connection;

  private readonly messageHistoryArr: [MessageHistoryView | null];

  private messageHistoryContainer: HTMLElement;

  public readonly messageInputField: MessageInputFieldView;

  constructor(cssClasses: string[], router: Router, connection: Connection) {
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
    );
    this.viewCreator.apendInnerElements(
      messageHistoryContainer,
      messageInputField.getHtmlElement(),
    );
    return [messageHistoryContainer.getElement(), messageInputField];
  }
}
