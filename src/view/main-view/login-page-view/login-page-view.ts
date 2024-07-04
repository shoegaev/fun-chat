import { View } from "../../../util/view";
import { ElementParametrs } from "../../../util/element-creator";
import { Connection } from "../../../connection/connection";
import {
  InputFieldParams,
  InputFieldView,
} from "./input-view/input-field-view";
import "./login-page-style.scss";

export class LoginPageView extends View {
  private connection: Connection;

  private inputsFrame: HTMLElement;

  private button: HTMLElement;

  innerFields: InputFieldView[];

  constructor(connection: Connection) {
    const LOGIN_PAGE_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: ["login-page"],
    };
    super(LOGIN_PAGE_PARAMS);
    this.connection = connection;
    this.configureView();
    [this.inputsFrame, this.button] = this.assignInnerElements();
    this.innerFields = [];
    this.createLoginInputField();
    this.createPasswordInputField();
    this.buttonOnClick();
  }

  configureView(): void {
    const innerElementsParams: ElementParametrs[] = [
      {
        tag: "div",
        cssClasses: ["login-page__form"],
      },
      {
        tag: "h2",
        cssClasses: ["form__heading"],
        textContent: "Login",
        target: ".login-page__form",
      },
      {
        tag: "div",
        cssClasses: ["form__inputs-frame"],
        target: ".login-page__form",
      },
      {
        tag: "div",
        cssClasses: ["form__login-button", "button", "button_disabled"],
        target: ".login-page__form",
      },
      {
        tag: "span",
        cssClasses: ["button__text"],
        textContent: "Continue",
        target: ".form__login-button",
      },
    ];
    this.addInnerElements(innerElementsParams);
  }

  private assignInnerElements(): HTMLElement[] {
    const button = this.getHtmlElement().querySelector(".form__login-button");
    const inputsFrame = this.getHtmlElement().querySelector(
      ".form__inputs-frame",
    );
    if (
      !(button instanceof HTMLElement) ||
      !(inputsFrame instanceof HTMLElement)
    ) {
      throw new Error("inner element is not HTMLElement");
    }
    return [inputsFrame, button];
  }

  private isAllFieldsDataValid(): boolean {
    for (let i = 0; i < this.innerFields.length; i += 1) {
      if (!this.innerFields[i].isCurrentValueValid()) {
        return false;
      }
    }
    return true;
  }

  private changeButtonStatus(): void {
    if (this.isAllFieldsDataValid()) {
      this.button.classList.remove("button_disabled");
    } else {
      this.button.classList.add("button_disabled");
    }
  }

  private createLoginInputField() {
    const inputFieldParams: InputFieldParams = {
      labelText: "Login",
      inputType: "text",
      cssClasses: ["form__login-input-field"],
      paramsForValidation: [
        {
          paramName: "Minimal length 3 letters",
          callback: (text: string) => text.length >= 3,
        },
        {
          paramName: "Only latin letters and numbers",
          callback: (text: string) => {
            for (let i = 0; i < text.length; i += 1) {
              if (!text[i].match(/[a-zA-Z0-9]/)) {
                return false;
              }
            }
            return true;
          },
        },
      ],
      inputEventCallbacks: [this.changeButtonStatus.bind(this)],
    };
    const inputField = new InputFieldView(inputFieldParams);
    this.inputsFrame.append(inputField.getHtmlElement());
    this.innerFields.push(inputField);
  }

  private createPasswordInputField() {
    const inputFieldParams: InputFieldParams = {
      labelText: "Password",
      inputType: "password",
      cssClasses: ["form__password-input-field"],
      paramsForValidation: [
        {
          paramName: "Minimal length 6 symbols",
          callback: (text: string) => text.length >= 6,
        },
        {
          paramName: "Have capital letters",
          callback: (text: string) => {
            for (let i = 0; i < text.length; i += 1) {
              if (text[i].match(/[A-Z]/)) {
                return true;
              }
            }
            return false;
          },
        },
        {
          paramName: "Have numbers",
          callback: (text: string) => {
            for (let i = 0; i < text.length; i += 1) {
              if (text[i].match(/[0-9]/)) {
                return true;
              }
            }
            return false;
          },
        },
      ],
      inputEventCallbacks: [this.changeButtonStatus.bind(this)],
    };
    const inputField = new InputFieldView(inputFieldParams);
    this.inputsFrame.append(inputField.getHtmlElement());
    this.innerFields.push(inputField);
  }

  private buttonOnClick(): void {
    this.button.addEventListener("click", () => {
      if (this.isAllFieldsDataValid()) {
        const login = this.innerFields[0].getValue();
        const password = this.innerFields[1].getValue();
        this.connection.sender.login(login, password);
      }
    });
  }
}
