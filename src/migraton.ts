import { Adapter } from "./adapters/adapter";

type taskCallback = {() : Promise<void>};

interface taskVersion {
  [version: number]: taskCallback;
};

export abstract class Migration{

  protected adapter: Adapter;
  private tasks: taskVersion = {};
  private firstAccess?: taskCallback;

  constructor(adapter: Adapter){
    this.adapter = adapter;

    this.tasks[1] = (): Promise<void> => {
      return Promise.resolve();
    }
  }

  protected registerFirstAccess(callback: taskCallback) : void{

    if(this.firstAccess !== undefined){
      throw {code: undefined, message: `firstAccess callback alredy registred`};
    }

    this.firstAccess = callback;
  }

  protected register(version: number, callback: taskCallback) : void{

    if(this.tasks[version] !== undefined){
      throw {code: undefined, message: `callback version ${version} alredy registred`};
    }

    this.tasks[version] = callback;
  }
}