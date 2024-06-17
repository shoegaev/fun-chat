import { Connection } from "../connection/connection";
import { Router } from "../router/router";
import { State } from "../state/state";
import { AppView } from "../view/app-view";
export class App {
  private state: State;

  private connection: Connection;

  private appView: AppView;

  private router: Router;

  constructor() {
    [this.state, this.connection, this.appView, this.router] =
      this.createComponents();
  }

  private createComponents(): [State, Connection, AppView, Router] {
    const view = new AppView();
    document.body.append(view.getHtmlElement());
    const state = new State();
    const connection = new Connection(state, view.loadingWindowView);
    const router = new Router();
    return [state, connection, view, router];
  }

  public start() {
    this.connection.startConnection();
  }
}
