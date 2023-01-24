export interface ModelInterface {
  readonly id: string,
  __data?: any,
}

//export type ModelConstructor<M> = new (id: string, ...args: any) => M;

export class Model implements ModelInterface {

  readonly id: string;
  __data?: ModelInterface;

  constructor(id: string) {
    this.id = id;
  }

  static createFromInterface(data: ModelInterface) : Model {
    
    const model = new Model(data.id);
    return model;
  }
}