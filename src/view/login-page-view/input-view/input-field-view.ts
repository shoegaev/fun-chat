import { View } from "../../../util/view";
import {
  ElementCreator,
  ElementParametrs,
} from "../../../util/element-creator";
import "./input-field-style.scss";
import tickIcon from "./tick-icon.svg";

export interface InputFieldParams {
  labelText: string;
  labeType: "text" | "password";
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

  private configureView(): void {
    const innerElementsParams: ElementParametrs[] = [
      {
        tag: "label",
        cssClasses: ["input-field__label"],
        textContent: this.params.labelText,
      },
      {
        tag: "input",
        cssClasses: ["input-field__input"],
        target: ".input-field__label",
        atributes: [
          {
            name: "type",
            value: this.params.labeType,
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
      criteriumStatus.addInnerElements(tickIconSvg.getElement());
      criterium.addInnerElements(
        criteriumDot.getElement(),
        criteriumText.getElement(),
        criteriumStatus.getElement(),
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
      if (this.input && callback(this.input?.value)) {
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
    eventHandler();
  }

  public isCurrentValueValid(): boolean {
    for (let i = 0; i < this.criteriaStatuses.length; i += 1) {
      if (!this.criteriaStatuses[i]) {
        return false;
      }
    }
    return true;
  }
}
