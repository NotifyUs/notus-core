import WebSocket from "ws";

export class LogManager {
  private subscriptions: Map<string, WebSocket[]>;

  constructor() {
    this.subscriptions = new Map();
  }

  public subscribe(id: string, ws: WebSocket) {
    this.subscriptions[id];
    if (!this.subscriptions[id]) {
      this.subscriptions[id] = [];
    }

    this.subscriptions[id].push(ws);

    console.info(`Log subscription ${id} added to. Current: ${this.subscriptions[id].length}`);
  }

  public unsubscribe(id: string, ws: WebSocket) {
    if (!this.subscriptions[id]) {
      return;
    }

    this.subscriptions[id] = this.subscriptions[id].filter((arrWs) => arrWs !== ws);

    console.info(`Log subscription ${id} removed from. Current: ${this.subscriptions[id].length}`);
  }

  public pushLog(id: string, log: Object) {
    console.log(`pushLog ${id}`, log)
    const wsArr = this.subscriptions[id];
    if (!wsArr) {
      return;
    }

    wsArr.forEach((ws) => {
      try {
        ws.send(JSON.stringify(log));
      } catch (err) {
        console.error(err);
      }
    });
  }
}
