import { Adapter } from "./adapter";

type taskCallback = { (transaction: SQLTransaction): Promise<void> };

interface taskVersion {
  [version: number]: taskCallback;
};

export class Migration {

  protected adapter: Adapter;
  private tasks: taskVersion = {};
  private firstAccess?: taskCallback;

  constructor(adapter: Adapter) {
    this.adapter = adapter;
  }

  protected make(): void { }

  public async run(): Promise<void> {

    this.make();

    if (this.firstAccess === undefined) {
      throw { code: null, message: `FirstAccess Migration not implemented!` };
    }

    let version = this.adapter.getVersion();
    if (version === '') {
      return this.adapter.changeVersion(0, this.firstAccess);
    }

    while (true) {

      version++;
      let task = this.tasks[version];
      if (task === undefined) {
        break;
      }

      await this.adapter.changeVersion(version, task);
    }

    return Promise.resolve();
  }

  protected registerFirstAccess(callback: taskCallback): void {

    if (this.firstAccess !== undefined) {
      throw { code: undefined, message: `firstAccess callback alredy registred` };
    }

    this.firstAccess = callback;
  }

  protected register(version: number, callback: taskCallback): void {

    if (this.tasks[version] !== undefined) {
      throw { code: undefined, message: `callback version ${ version } alredy registred` };
    }

    this.tasks[version] = callback;
  }
}