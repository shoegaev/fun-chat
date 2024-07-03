import { View } from "../../../util/view";
import { ElementParametrs } from "../../../util/element-creator";
import { Connection } from "../../../connection/connection";

export class IndexPageView extends View {
  connection: Connection;

  constructor(connection: Connection) {
    const INDEX_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: ["index-page"],
      textContent: "INDEX",
    };
    super(INDEX_PARAMS);
    this.connection = connection;
  }
}
