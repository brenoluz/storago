import { Schema } from "./schema";

export type ConstructorModel<T extends Model> = new(id: string, schema: Schema<T>) => T; 

export class Model{

  readonly __schema: Schema<Model>;
  readonly id: string;

  public __data?: object;

  constructor(id: string, schema: Schema<Model>){
    this.id = id;
    this.__schema = schema;
  }

  public async save() : Promise<Model>{

    return this.__schema.saveRow(this);
  }
}

