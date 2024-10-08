import { View } from "../../../../util/view";
import {
  ElementCreator,
  ElementParametrs,
} from "../../../../util/element-creator";
import "./input-field-style.scss";
import tickIcon from "../../../../../public/assets/icons/tick-icon.svg";

export interface InputFieldParams {
  placeholder: string;
  inputType: "text" | "password";
  paramsForValidation: {
    paramName: string;
    callback: (text: string) => boolean;
  }[];
  cssClasses: string[];
  inputEventCallbacks: Array<() => void>;
}

export class InputFieldView extends View {
  params: InputFieldParams;

  input: HTMLInputElement | null;

  criteriaStatuses: boolean[];

  constructor(params: InputFieldParams) {
    const INPUT_FIELD_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: [...params.cssClasses, "input-field"],
    };
    super(INPUT_FIELD_PARAMS);
    this.params = params;
    this.criteriaStatuses = [];
    this.input = null;
    this.configureView();
  }

  public clearInput(): void {
    if (this.input) {
      this.input.value = "";
      this.input?.dispatchEvent(new Event("input"));
    }
  }

  private configureView(): void {
    const innerElementsParams: ElementParametrs[] = [
      {
        tag: "input",
        cssClasses: ["input-field__input"],
        atributes: [
          {
            name: "type",
            value: this.params.inputType,
          },
          {
            name: "placeholder",
            value: this.params.placeholder,
          },
        ],
      },
      {
        tag: "div",
        cssClasses: ["input-field__criteria"],
      },
    ];
    this.addInnerElements(innerElementsParams);
    const input = this.getHtmlElement().querySelector(".input-field__input");
    if (!(input instanceof HTMLInputElement)) {
      throw new Error();
    }
    this.input = input;
    this.addCriteria(this.params.paramsForValidation);
    this.setInputCallbacks();
  }

  private setInputCallbacks(): void {
    this.params.inputEventCallbacks.forEach((callback) => {
      this.input?.addEventListener("input", callback);
    });
  }

  private addCriteria(
    criteriaParametrs: InputFieldParams["paramsForValidation"],
  ): void {
    const container = this.getHtmlElement().querySelector(
      ".input-field__criteria",
    );
    criteriaParametrs.forEach((param, index) => {
      const criterium = new ElementCreator({
        tag: "div",
        cssClasses: ["input-field__criterium"],
      });
      const criteriumDot = new ElementCreator({
        tag: "div",
        cssClasses: ["criterium__dot"],
        textContent: "-",
      });
      const criteriumStatus = new ElementCreator({
        tag: "div",
        cssClasses: ["criterium__status"],
      });
      const tickIconSvg = new ElementCreator({
        tag: "img",
        cssClasses: ["criterium__status-tick"],
        atributes: [{ name: "src", value: tickIcon }],
      });
      const criteriumText = new ElementCreator({
        tag: "div",
        cssClasses: ["criterium__text"],
        textContent: param.paramName,
      });
      criteriumStatus.apendInnerElements(tickIconSvg);
      criterium.apendInnerElements(
        criteriumDot,
        criteriumText,
        criteriumStatus,
      );
      this.setCriteriumCallback(param.callback, criterium.getElement(), index);
      container?.append(criterium.getElement());
    });
  }

  private setCriteriumCallback(
    callback: (text: string) => boolean,
    criterium: HTMLElement,
    index: number,
  ): void {
    const eventHandler = () => {
      if (this.input && callback(this.input?.value) && this.input.value) {
        criterium.classList.add("input-field__criterium_passed");
        this.criteriaStatuses[index] = true;
      } else {
        criterium.classList.remove("input-field__criterium_passed");
        this.criteriaStatuses[index] = false;
      }
    };
    this.input?.addEventListener("input", () => {
      eventHandler();
    });
  }

  public isCurrentValueValid(): boolean {
    for (let i = 0; i < this.criteriaStatuses.length; i += 1) {
      if (!this.criteriaStatuses[i]) {
        return false;
      }
    }
    return true;
  }

  public getValue(): string {
    const value = this.input?.value;
    if (value) {
      return value;
    } else {
      return "";
    }
  }
}
