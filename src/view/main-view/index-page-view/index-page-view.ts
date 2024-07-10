import { View } from "../../../util/view";
import {
  ElementParametrs,
  ElementCreator,
} from "../../../util/element-creator";
import { Connection } from "../../../connection/connection";
import { UserListView } from "./user-list-view/user-list-view";
import { MessengerInterfaceView } from "./messenger-interface-view/messenger-interface-view";
import { Router } from "../../../router/router";
import "./index-page-style.scss";

export class IndexPageView extends View {
  private connection: Connection;

  private router: Router;

  private content: HTMLElement;

  public userListView: UserListView;

  public messengerInterfaceView: MessengerInterfaceView;

  constructor(connection: Connection, router: Router) {
    const INDEX_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: ["index-page"],
    };
    super(INDEX_PARAMS);
    this.connection = connection;
    this.router = router;
    this.content = this.configureView();
    this.userListView = this.createUserListView();
    this.messengerInterfaceView = this.createMessengerInterfaceView();
  }

  private configureView(): HTMLElement {
    const content = new ElementCreator({
      tag: "div",
      cssClasses: ["index-page__content"],
    });
    this.getHtmlElement().append(content.getElement());
    return content.getElement();
  }

  private createUserListView(): UserListView {
    const userList = new UserListView(["index-page__users-list"], this.router);
    this.content.append(userList.getHtmlElement());
    return userList;
  }

  private createMessengerInterfaceView(): MessengerInterfaceView {
    const messengerInterface = new MessengerInterfaceView(
      ["index-page__messenger-interface"],
      this.router,
    );
    this.content.append(messengerInterface.getHtmlElement());
    return messengerInterface;
  }
}
