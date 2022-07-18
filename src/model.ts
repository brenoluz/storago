import { Adapter } from "./adapter";
import { Schema } from "./schema";

export type ConstructorModel<A extends Adapter, M extends Model<A>> = new (id: string, schema: Schema<A, M>) => M;

export class Model<A extends Adapter>{

  readonly __schema: Schema<A, Model<A>>;
  readonly id: string;

  public __data?: object;

  constructor(id: string, schema: Schema<A, Model<A>>) {
    this.id = id;
    this.__schema = schema;
  }

  public async save(): Promise<any> {

    return this.__schema.saveRow(this);
  }
}

