import { ElementParametrs } from "../util/element-creator";
import { LoadingWindowView } from "./loading-window-view/loading-window-view";
import { View } from "../util/view";

export class AppView extends View {
  public loadingWindowView: LoadingWindowView;

  constructor() {
    const APP_CONTAINER_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: ["main-container"],
    };
    super(APP_CONTAINER_PARAMS);
    [this.loadingWindowView] = this.createInnerViews();
  }

  private createInnerViews(): [LoadingWindowView] {
    const loadingWindow = new LoadingWindowView();
    this.getHtmlElement().append(loadingWindow.getHtmlElement());
    return [loadingWindow];
  }
}
