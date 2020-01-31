import { MyWebSocket } from "../services/webSocketServer/webSocket";

export interface IClient {
  getId(): string;

  getToken(): string;

  getMsg(): string;

  getSocket(): MyWebSocket | null;

  setSocket(socket: MyWebSocket | null): void;

  getLastPing(): number;

  setLastPing(lastPing: number): void;

  send(data: any): void;

  isAuthenticated(): boolean;

  setAuthenticated(authenticated: boolean): void;
}

export class Client implements IClient {
  private readonly id: string;
  private readonly token: string;
  private readonly msg: string;
  private socket: MyWebSocket | null = null;
  private lastPing: number = new Date().getTime();
  private authenticated: boolean = false;

  constructor({ id, token, msg }: { id: string; token: string; msg: string }) {
    this.id = id;
    this.token = token;
    this.msg = msg;
  }

  public getId(): string {
    return this.id;
  }

  public getToken(): string {
    return this.token;
  }

  public getMsg(): string {
    return this.msg;
  }

  public getSocket(): MyWebSocket | null {
    return this.socket;
  }

  public setSocket(socket: MyWebSocket | null): void {
    this.socket = socket;
  }

  public getLastPing(): number {
    return this.lastPing;
  }

  public setLastPing(lastPing: number): void {
    this.lastPing = lastPing;
  }

  public send(data: any): void {
    this.socket?.send(JSON.stringify(data));
  }

  public isAuthenticated(): boolean {
    return this.authenticated;
  }

  public setAuthenticated(authenticated: boolean): void {
    this.authenticated = authenticated;
  }
}
