import { Select } from "./select";
import { Model } from "../model";
import { Insert } from "./insert";
import { Create } from "./create";
import { Schema } from "../schema";

type callbackMigration = {(transaction: any) : Promise<void>};

export interface Adapter{

  query(sql: any, data: ObjectArray, transaction: any) : Promise<any>;
  select<M extends Model>(model: new() => M, schema: Schema<M>) : Select<M>;
  insert<M extends Model>(model: new() => M, schema: Schema<M>) : Insert;
  getVersion() : ''|number;
  create<M extends Model>(model: new() => M, schema: Schema<M>) : Create;
  changeVersion(newVersion: number, cb: callbackMigration) : Promise<void>;
  fieldTransformFromDb<Field>(field: Field, value: any) : any;
  fieldTransformToDB<Field>(field: Field, model: Model): any;
  fieldCast<Field>(field: Field) : string;
}