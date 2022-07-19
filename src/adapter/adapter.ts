import { Select } from "./select";
import { Model } from "../model";
import { Insert } from "./insert";
import { Create } from "./create";
import { Schema } from "../schema";
import { Field } from "../field/field";

export interface Adapter {

  select<A extends Adapter, M extends Model>(schema: Schema<A, M>): Select<A, M>;
  query(sql: any, params: any[], ...args: any[]): Promise<any[] | undefined>;
  insert<A extends Adapter, M extends Model>(schema: Schema<A, M>): Insert<A, M>;
  create<A extends Adapter, M extends Model>(schema: Schema<A, M>): Create<A, M>;
  //getVersion(): '' | number;
  //changeVersion(newVersion: number, cb: callbackMigration): Promise<void>;
  fieldTransformFromDb<F extends Field>(field: F, value: any): any;
  fieldTransformToDB<A extends Adapter, F extends Field, M extends Model>(field: F, model: M): any;
  fieldCast<F extends Field>(field: F): string;
}