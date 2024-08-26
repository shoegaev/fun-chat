import { View } from "../../util/view";
import { ElementCreator, ElementParametrs } from "../../util/element-creator";
import { Pages, Router } from "../../router/router";
import { Connection } from "../../connection/connection";
import { NavButtonView } from "./nav-button-view/nav-button-view";
import "./header-style.scss";
import logautIcon from "./logout-icon.svg";
import userIcon from "./user-icon.svg";

export class HeaderView extends View {
  private buttons: NavButtonView[];

  private readonly connection: Connection;

  private readonly userPanel: HTMLElement;

  private readonly userLogin: HTMLElement;

  private readonly logoutButton: HTMLElement;

  constructor(router: Router, connection: Connection) {
    const HEADER_PARAMS: ElementParametrs = {
      tag: "header",
      cssClasses: ["header"],
    };
    super(HEADER_PARAMS);
    this.buttons = [];
    this.connection = connection;
    [this.userPanel, this.userLogin, this.logoutButton] =
      this.configureView(router);
    this.logoutButton.addEventListener("click", () => {
      connection.sender.logaut();
    });
  }

  public openUserPanel(): void {
    this.userPanel.classList.remove("user-panel__closed");
  }

  public closeUserPanel(): void {
    this.userPanel.classList.add("user-panel__closed");
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

  private configureView(router: Router): HTMLElement[] {
    const [userPanel, userLogin, logautButton] = this.createUserPanel();
    this.viewCreator.apendInnerElements(userPanel);
    this.addInnerElements([{ tag: "nav", cssClasses: ["navigation"] }]);
    const mainButton = new NavButtonView({
      page: Pages.index,
      cssClasses: ["navigation__nav-button"],
      buttonText: "Main-page",
      callback: () => {
        router.navigate({ page: Pages.index });
      },
      buttons: this.buttons,
    });
    const infoButton = new NavButtonView({
      page: Pages.info,
      cssClasses: ["navigation__nav-button"],
      buttonText: "Information",
      callback: () => {
        router.navigate({ page: Pages.info });
      },
      buttons: this.buttons,
    });
    [mainButton, infoButton].forEach((button) => {
      this.buttons.push(button);
      this.getHtmlElement()
        .querySelector("nav")
        ?.append(button.getHtmlElement());
    });
    return [userPanel, userLogin, logautButton];
  }

  private createUserPanel(): HTMLElement[] {
    const panel = new ElementCreator({
      tag: "div",
      cssClasses: ["user-panel", "user-panel__closed"],
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
}
