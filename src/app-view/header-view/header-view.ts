import { View } from "../../util/view";
import { ElementCreator, ElementParametrs } from "../../util/element-creator";
import { Pages, Router } from "../../router/router";
import { Connection } from "../../connection/connection";
import { NavButtonView } from "./nav-button-view/nav-button-view";
import { UserSelectorView } from "../main-view/index-page-view/user-selector-view/user-selector-view";
import { ModalWindowView } from "../modal-window-view/modal-window-view";
import { State } from "../../state/state";
import { StateFieldsKeys } from "../../state/fields-types";
import "./header-style.scss";
import logautIcon from "../../../public/assets/icons/logout-icon.svg";
import userIcon from "../../../public/assets/icons/user-icon.svg";
import userListIcon from "../../../public/assets/icons/user-list-icon.svg";

type MenuButtons = {
  container: HTMLElement;
  userListButton: HTMLElement;
  navigationButton: HTMLElement;
};

export class HeaderView extends View {
  private buttons: NavButtonView[];

  private readonly connection: Connection;

  private readonly headerContent: HTMLElement;

  private readonly userPanel: HTMLElement;

  private readonly userLogin: HTMLElement;

  private readonly logoutButton: HTMLElement;

  private readonly menuButtons: MenuButtons;

  constructor(
    router: Router,
    connection: Connection,
    userSelector: UserSelectorView,
    modalWindow: ModalWindowView,
    state: State,
  ) {
    const HEADER_PARAMS: ElementParametrs = {
      tag: "header",
      cssClasses: ["header"],
    };
    super(HEADER_PARAMS);
    this.buttons = [];
    this.connection = connection;
    [
      this.headerContent,
      this.userPanel,
      this.userLogin,
      this.logoutButton,
      this.menuButtons,
    ] = this.configureView(router, state);
    this.addEventListeners(connection, userSelector, modalWindow);
  }

  public onLogin(): void {
    this.userPanel.classList.remove("user-panel_closed");
    this.showUserListButton();
  }

  public onLogaut(): void {
    this.userPanel.classList.add("user-panel_closed");
    this.hideUserListButton();
  }

  private hideUserListButton(): void {
    this.menuButtons.userListButton.classList.add(
      "header__user-list-button_hidden",
    );
  }

  private showUserListButton(): void {
    this.menuButtons.userListButton.classList.remove(
      "header__user-list-button_hidden",
    );
  }

  public setUserLogin(login: string): void {
    this.userLogin.textContent = login;
  }

  public setButtonSelectedStatus(page: Pages) {
    const buttonView = this.buttons.find((item) => item.params.page === page);
    buttonView?.setSelectedCLass();
  }

  public removeButtonsSelectedStatus(): void {
    this.buttons.forEach((button) => {
      button.removeSelectedStatus();
    });
  }

  // eslint-disable-next-line max-lines-per-function
  private configureView(
    router: Router,
    state: State,
  ): [HTMLElement, HTMLElement, HTMLElement, HTMLElement, MenuButtons] {
    const [userPanel, userLogin, logautButton] = this.createUserPanel();
    const navigation = new ElementCreator({
      tag: "nav",
      cssClasses: ["header__navigation"],
    });
    const headerContent = new ElementCreator({
      tag: "div",
      cssClasses: ["header__content"],
    });
    headerContent.apendInnerElements(userPanel, navigation);
    const mainButton = new NavButtonView({
      page: Pages.index,
      cssClasses: ["header__nav-button"],
      buttonText: "Main-page",
      callback: () => {
        this.closeNavigationMenu();
        if (this.connection.isUserAuthorized()) {
          this.showUserListButton();
        }
        const openedMessageHistory = state.getField(
          StateFieldsKeys.openedMsgHistory,
        );
        if (openedMessageHistory) {
          router.navigate({
            page: Pages.index,
            resource: openedMessageHistory,
          });
        } else {
          router.navigate({ page: Pages.index });
        }
      },
      buttons: this.buttons,
    });
    const infoButton = new NavButtonView({
      page: Pages.info,
      cssClasses: ["header__nav-button"],
      buttonText: "Information",
      callback: () => {
        this.closeNavigationMenu();
        this.hideUserListButton();
        router.navigate({ page: Pages.info });
      },
      buttons: this.buttons,
    });
    [mainButton, infoButton].forEach((button) => {
      this.buttons.push(button);
      navigation.apendInnerElements(button.getHtmlElement());
    });
    const menuButtons = this.createMenuButtons();
    this.viewCreator.apendInnerElements(menuButtons.container, headerContent);
    return [
      headerContent.getElement(),
      userPanel,
      userLogin,
      logautButton,
      menuButtons,
    ];
  }

  private createUserPanel(): HTMLElement[] {
    const panel = new ElementCreator({
      tag: "div",
      cssClasses: ["user-panel", "user-panel_closed"],
    });
    const userLoginContainer = new ElementCreator({
      tag: "div",
      cssClasses: ["user-panel__login-container"],
    });
    const userImage = new ElementCreator({
      tag: "img",
      cssClasses: ["user-panel__icon"],
      atributes: [
        {
          name: "src",
          value: userIcon,
        },
      ],
    });
    const userLogin = new ElementCreator({
      tag: "span",
      cssClasses: ["user-panel__login"],
      textContent: "Konstantin",
    });
    userLoginContainer.apendInnerElements(userLogin, userImage);
    const logautButton = this.createLogautButton();
    panel.apendInnerElements(logautButton, userLoginContainer);
    return [panel.getElement(), userLogin.getElement(), logautButton];
  }

  private createLogautButton(): HTMLElement {
    const logautButton = new ElementCreator({
      tag: "div",
      cssClasses: ["user-panel__logaut-button", "nav-button"],
    });
    const logautButtonText = new ElementCreator({
      tag: "span",
      cssClasses: ["logaut-button__text"],
      textContent: "Logaut",
    });
    const logautButtonIcon = new ElementCreator({
      tag: "img",
      cssClasses: ["logaut-button__icon"],
      atributes: [
        {
          name: "src",
          value: logautIcon,
        },
      ],
    });
    logautButton.apendInnerElements(logautButtonText, logautButtonIcon);
    return logautButton.getElement();
  }

  private createMenuButtons(): MenuButtons {
    const container = new ElementCreator({
      tag: "div",
      cssClasses: ["header__menu-buttons"],
    });
    const userListButton = new ElementCreator({
      tag: "div",
      cssClasses: [
        "header__user-list-button",
        "header__user-list-button_hidden",
        "nav-button",
      ],
    });
    const userListButtonIcon = new ElementCreator({
      tag: "img",
      cssClasses: ["header__user-list-button-icon"],
      atributes: [{ name: "src", value: userListIcon }],
    });
    userListButton.apendInnerElements(userListButtonIcon);
    const navigationButton = new ElementCreator({
      tag: "div",
      cssClasses: ["header__navigation-button", "nav-button"],
    });
    for (let i = 0; i < 3; i++) {
      const navigationButtonStick = new ElementCreator({
        tag: "div",
        cssClasses: ["header__navigation-button-stick"],
      });
      navigationButton.apendInnerElements(navigationButtonStick);
    }
    container.apendInnerElements(userListButton, navigationButton);
    return {
      container: container.getElement(),
      userListButton: userListButton.getElement(),
      navigationButton: navigationButton.getElement(),
    };
  }

  private openNavigationMenu(): void {
    this.getHtmlElement().classList.add("header_navigation-open");
  }

  private closeNavigationMenu(): void {
    this.getHtmlElement().classList.remove("header_navigation-open");
  }

  private addEventListeners(
    connection: Connection,
    userSelector: UserSelectorView,
    modalWindow: ModalWindowView,
  ): void {
    this.logoutButton.addEventListener("click", () => {
      modalWindow.openModalWindow({
        text: "Are you sure you want to logout?",
        leftButton: {
          text: "Yes",
          callback: () => {
            connection.sender.logaut();
            this.closeNavigationMenu();
          },
        },
        rightButton: {
          text: "No",
        },
      });
    });
    this.menuButtons.navigationButton.addEventListener("click", () => {
      if (this.getHtmlElement().classList.contains("header_navigation-open")) {
        this.closeNavigationMenu();
      } else {
        this.openNavigationMenu();
      }
    });
    this.menuButtons.userListButton.addEventListener("click", () => {
      if (userSelector.isSelectorOpened()) {
        userSelector.close();
      } else {
        userSelector.open();
      }
    });
  }
}
