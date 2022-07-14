import { Schema } from "./schema";

export class Model{

  public __data?: object;
  public id?: string;

  readonly schema: Schema<Model>;

  constructor(schema: Schema<Model>){

    this.schema = schema;
  }
}
