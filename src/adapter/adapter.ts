import { Select } from "./select";
import { ModelInterface } from "../model";
import { Insert } from "./insert";
import { Create } from "./create";
import { Drop } from "./drop";
import { Schema } from "../schema";
import { Field } from "../field/field";

export type AdapterConstructor<T> = { new(): T };

export interface Adapter {

  select<M extends ModelInterface>(schema: Schema<this, M>): Select<M>;
  insert<M extends ModelInterface>(schema: Schema<this, M>): Insert<M>;
  create<M extends ModelInterface>(schema: Schema<this, M>): Create<M>;
  drop<M extends ModelInterface>(schema: Schema<this, M>): Drop<M>;
  //getVersion(): '' | number;
  //changeVersion(newVersion: number, cb: callbackMigration): Promise<void>;
  fieldTransformFromDb<F extends Field>(field: F, value: any): any;
  fieldTransformToDB<F extends Field, M extends ModelInterface>(field: F, model: M): any;
  fieldCast<F extends Field>(field: F): string;
}