export enum Pages {
  index = "index",
  info = "info",
  login = "login",
  notFound = "notFound",
}

export interface Route {
  hasResource: boolean;
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
    window.addEventListener("popstate", () => {
      this.navigate();
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
    if (!route.hasResource && urlParams?.resource) {
      this.navigate({ page: route.page });
    } else {
      route?.callback(urlParams.resource);
    }
  }

  private pushState(urlParams: UrlParams): void {
    history.pushState(
      null,
      "",
      urlParams.resource
        ? `/${urlParams.page}#${urlParams.resource}`
        : `/${urlParams.page}`,
    );
  }

  private parseCurrentUrl(): { page: string; resource: string } {
    const path = window.location.pathname.slice(1);
    const resource = window.location.hash.slice(1);
    if (path === "") {
      this.pushState({ page: Pages.login });
      return { page: Pages.login, resource: "" };
    }
    return { page: path, resource: resource };
  }

  private redirectToNotFoundPage(): void {
    this.navigate({ page: Pages.notFound });
  }
}
