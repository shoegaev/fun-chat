import { View } from "../../../../util/view";
import { ElementParametrs } from "../../../../util/element-creator";
import { Router } from "../../../../router/router";

export class MessengerInterfaceView extends View {
  router: Router;

  constructor(cssClasses: string[], router: Router) {
    const MESSENGER_INTERFACE_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: ["messenger-interface", ...cssClasses],
    };
    super(MESSENGER_INTERFACE_PARAMS);
    this.router = router;
    this.configureView();
  }

  private configureView(): void {
    const innerElementParams: ElementParametrs[] = [];
    this.addInnerElements(innerElementParams);
  }
}
