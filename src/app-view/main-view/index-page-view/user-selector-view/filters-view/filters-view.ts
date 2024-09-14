import { View } from "../../../../../util/view";
import {
  ElementCreator,
  ElementParametrs,
} from "../../../../../util/element-creator";
import "./filters-style.scss";
import { UserListView } from "../user-list-view/user-list-view";
import triangleIcon from "../../../../../../public/assets/icons/triangle-icon.svg";
import tickIcon from "../../../../../../public/assets/icons/tick-icon.svg";

export class FiltersView extends View {
  private minimizeButton: HTMLElement;

  private onlineFilter: HTMLElement;

  private unreadFilter: HTMLElement;

  private userListView: UserListView;

  constructor(cssClasses: string[], userListView: UserListView) {
    const FILTERS_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: ["filters", ...cssClasses],
    };
    super(FILTERS_PARAMS);
    this.userListView = userListView;
    [this.minimizeButton, this.onlineFilter, this.unreadFilter] =
      this.configureView();
    this.minimizeButtonOnClick();
    this.filtersOnClick();
  }

  public unselectAllFilters(): void {
    [this.onlineFilter, this.unreadFilter].forEach((filter) => {
      filter.classList.remove("filters__filter_selected");
    });
  }

  public minimizeFilters(): void {
    this.getHtmlElement().classList.remove("filters_open");
  }

  public showFilters(): void {
    this.getHtmlElement().classList.add("filters_open");
  }

  private configureView(): HTMLElement[] {
    const minimizeButton = new ElementCreator({
      tag: "div",
      cssClasses: ["filters__minimize-button"],
    });
    const buttonText = new ElementCreator({
      tag: "span",
      cssClasses: ["minimize-button__text"],
      textContent: "Filters:",
    });
    const triangle = new ElementCreator({
      tag: "img",
      cssClasses: ["minimize-button__icon"],
      atributes: [
        {
          name: "src",
          value: triangleIcon,
        },
      ],
    });
    minimizeButton.apendInnerElements(triangle, buttonText);
    this.viewCreator.apendInnerElements(minimizeButton);
    const [onlineFilter, unreadFilter] = this.createFiltersList();
    return [minimizeButton.getElement(), onlineFilter, unreadFilter];
  }

  private createFiltersList(): HTMLElement[] {
    const filtersList = new ElementCreator({
      tag: "div",
      cssClasses: ["filters__list"],
    });
    const onlineFilter = new ElementCreator({
      tag: "div",
      cssClasses: ["filters__filter"],
      textContent: "Online",
    });
    const unreadFilter = new ElementCreator({
      tag: "div",
      cssClasses: ["filters__filter"],
      textContent: "Unread messages",
    });
    const icon = new ElementCreator({
      tag: "img",
      cssClasses: ["filter__icon"],
      atributes: [
        {
          name: "src",
          value: tickIcon,
        },
      ],
    });
    [unreadFilter, onlineFilter].forEach((filter) => {
      filter.apendInnerElements(
        icon.getElement().cloneNode(true) as HTMLElement,
      );
    });
    filtersList.apendInnerElements(onlineFilter, unreadFilter);
    this.viewCreator.apendInnerElements(filtersList);
    return [onlineFilter.getElement(), unreadFilter.getElement()];
  }

  private minimizeButtonOnClick(): void {
    this.minimizeButton.addEventListener("click", () => {
      if (this.getHtmlElement().classList.contains("filters_open")) {
        this.minimizeFilters();
      } else {
        this.showFilters();
      }
    });
  }

  private filtersOnClick(): void {
    const changeSelectedStatus = (filter: HTMLElement): boolean => {
      let filterIsOn: boolean;
      if (filter.classList.contains("filters__filter_selected")) {
        filter.classList.remove("filters__filter_selected");
        filterIsOn = false;
      } else {
        filter.classList.add("filters__filter_selected");
        filterIsOn = true;
      }
      return filterIsOn;
    };
    this.onlineFilter.addEventListener("click", () => {
      const filterIsOn = changeSelectedStatus(this.onlineFilter);
      if (filterIsOn) {
        this.userListView.filterByStatus();
      } else {
        this.userListView.stopFilterByStatus();
      }
    });
    this.unreadFilter.addEventListener("click", () => {
      const filterIsOn = changeSelectedStatus(this.unreadFilter);
      if (filterIsOn) {
        this.userListView.filterByUnreadMessages();
      } else {
        this.userListView.stopFilterByUnreadMessages();
      }
    });
  }
}
