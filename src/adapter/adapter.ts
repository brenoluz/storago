import { Select } from "./select";
import { Model } from "../model";
import { Insert } from "./insert";
import { Create } from "./create";
import { Schema } from "../schema";
import { Field } from "../field/field";

type callbackMigration = {(transaction: any) : Promise<void>};

export interface Adapter{

  query(sql: any, data: ObjectArray, transaction: any) : Promise<any>;
  select<M extends Model>(model: new() => M, schema: Schema<M>) : Select<M>;
  insert<M extends Model>(model: new() => M, schema: Schema<M>) : Insert;
  getVersion() : ''|number;
  create<M extends Model>(model: new() => M, schema: Schema<M>) : Create;
  changeVersion(newVersion: number, cb: callbackMigration) : Promise<void>;
  fieldTransformFromDb<F extends Field>(field: F, value: any) : any;
  fieldTransformToDB<F extends Field>(field: F, model: Model): any;
  fieldCast<F extends Field>(field: F) : string;
}