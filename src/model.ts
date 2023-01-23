export interface ModelInterface {
  id: string,
  __data?: any,
}

export type ModelConstructor<M> = new (id: string, ...args: any) => M;

export class Model {

  id: string;
  __data?: ModelInterface;

  constructor(id: string) {
    this.id = id;
  }
}