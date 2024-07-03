export enum Pages {
  index = "index",
  info = "info",
  login = "login",
  notFound = "notFound",
}
export interface Route {
  page: Pages;
  callback: (resource?: string) => void;
}
export interface UrlParams {
  page: Pages;
  resource?: string;
}

export class Router {
  private routes: Route[];

  constructor(routes: Route[]) {
    this.routes = routes;
    ["popstate", "hashchange"].forEach((str) => {
      window.addEventListener(str, () => {
        this.navigate();
      });
    });
    document.addEventListener("DOMContentLoaded", () => {
      this.navigate();
    });
  }

  public navigate(params?: UrlParams): void {
    if (params) {
      this.pushState(params);
    }
    const urlParams = this.parseCurrentUrl();
    const route = this.routes.find((item) => item.page === urlParams.page);
    if (!route) {
      this.redirectToNotFoundPage();
      return;
    }
    route?.callback(urlParams.resource);
  }

  private pushState(urlParams: UrlParams): void {
    history.pushState(
      null,
      "",
      urlParams.resource
        ? `/${urlParams.page}/${urlParams.resource}`
        : `/${urlParams.page}`,
    );
  }

  private parseCurrentUrl(): { page: string; resource?: string } {
    const path = window.location.pathname.slice(1);
    if (path === "") {
      this.pushState({ page: Pages.login });
      return { page: Pages.login };
    }
    const pathArr = path.split("/");
    return { page: pathArr[0], resource: pathArr[1] };
  }

  private redirectToNotFoundPage(): void {
    this.navigate({ page: Pages.notFound });
  }
}
