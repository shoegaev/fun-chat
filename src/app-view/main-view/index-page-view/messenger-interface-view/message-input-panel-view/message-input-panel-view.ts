import { View } from "../../../../../util/view";
import { MessageHistoryView } from "../message-history-view/message-history-view";
import { ElementParametrs } from "../../../../../util/element-creator";
import { Connection } from "../../../../../connection/connection";
import "./message-input-panel-style.scss";

export class MessageInputFieldView extends View {
  private connection: Connection;

  private readonly messageHistoryArr: [MessageHistoryView | null];

  constructor(
    cssCLasses: string[],
    connection: Connection,
    messageHistoryArr: [MessageHistoryView | null],
  ) {
    const MESSAGE_INPUT_FIELD_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: ["message_input-field", ...cssCLasses],
    };
    super(MESSAGE_INPUT_FIELD_PARAMS);
    this.connection = connection;
    this.messageHistoryArr = messageHistoryArr;
  }

  private getMessageHistory(): MessageHistoryView | null {
    return this.messageHistoryArr[0];
  }
}
