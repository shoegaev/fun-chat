import { View } from "../../../../../util/view";
import {
  ElementCreator,
  ElementParametrs,
} from "../../../../../util/element-creator";
import { Connection } from "../../../../../connection/connection";

export class MessageHistoryView extends View {
  private connection: Connection;

  private readonly closeButton: HTMLElement;

  constructor(cssCLasses: string[], login: string, connection: Connection) {
    const MESSAGE_HISTORY_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: ["message-history", ...cssCLasses],
      textContent: login,
    };
    super(MESSAGE_HISTORY_PARAMS);
    this.connection = connection;
    [this.closeButton] = this.configureView();
  }

  private configureView(): HTMLElement[] {
    const closeButton = new ElementCreator({
      tag: "div",
      cssClasses: ["message-history__close-button"],
    });
    return [closeButton.getElement()];
  }
}
