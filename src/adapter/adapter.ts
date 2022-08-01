import { Select } from "./select";
import { Model } from "../model";
import { Insert } from "./insert";
import { Create } from "./create";
import { Schema } from "../schema";
import { Field } from "../field/field";

export type AdapterConstructor<T> = { new(): T };

export interface Adapter {

  select<M extends Model>(schema: Schema<this, M>): Select<M>;
  insert<M extends Model>(schema: Schema<this, M>): Insert<M>;
  create<M extends Model>(schema: Schema<this, M>): Create<M>;
  //getVersion(): '' | number;
  //changeVersion(newVersion: number, cb: callbackMigration): Promise<void>;
  fieldTransformFromDb<F extends Field>(field: F, value: any): any;
  fieldTransformToDB<F extends Field, M extends Model>(field: F, model: M): any;
  fieldCast<F extends Field>(field: F): string;
}