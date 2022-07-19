import { Adapter } from "./adapter";
import { Schema } from "./schema";

export type ConstructorModel<M extends Model> = new (id: string) => M;

export class Model{

  readonly id: string;

  public __data?: object;

  constructor(id: string) {
    this.id = id;
  }
}

