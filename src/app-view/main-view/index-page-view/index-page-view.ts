import { View } from "../../../util/view";
import {
  ElementParametrs,
  ElementCreator,
} from "../../../util/element-creator";
import { Connection } from "../../../connection/connection";
import { UserSelectorView } from "./user-selector-view/user-selector-view";
import { MessengerInterfaceView } from "./messenger-interface-view/messenger-interface-view";
import { ModalWindowView } from "../../modal-window-view/modal-window-view";
import { Router } from "../../../router/router";
import "./index-page-style.scss";

export class IndexPageView extends View {
  private connection: Connection;

  private router: Router;

  private content: HTMLElement;

  public userSelectorView: UserSelectorView;

  public messengerInterfaceView: MessengerInterfaceView;

  constructor(
    connection: Connection,
    router: Router,
    modalWindow: ModalWindowView,
  ) {
    const INDEX_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: ["index-page"],
    };
    super(INDEX_PARAMS);
    this.connection = connection;
    this.router = router;
    this.content = this.configureView();
    this.userSelectorView = this.createUserSelectorView();
    this.messengerInterfaceView =
      this.createMessengerInterfaceView(modalWindow);
  }

  private configureView(): HTMLElement {
    const content = new ElementCreator({
      tag: "div",
      cssClasses: ["index-page__content"],
    });
    this.getHtmlElement().append(content.getElement());
    return content.getElement();
  }

  private createUserSelectorView(): UserSelectorView {
    const userList = new UserSelectorView(
      ["index-page__user-selector"],
      this.router,
    );
    this.content.append(userList.getHtmlElement());
    return userList;
  }

  private createMessengerInterfaceView(
    modalWindow: ModalWindowView,
  ): MessengerInterfaceView {
    const messengerInterface = new MessengerInterfaceView(
      ["index-page__messenger-interface"],
      this.router,
      this.connection,
      modalWindow,
    );
    this.content.append(messengerInterface.getHtmlElement());
    return messengerInterface;
  }
}
