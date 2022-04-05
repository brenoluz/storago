import { Select } from "./select";
import { Model } from "../model";
import { Insert } from "./insert";
import { Create } from "./create";
import { Schema } from "../schema";

type callbackMigration = {(transaction: any) : Promise<void>};

export enum engineKind {
  WebSQL,
  PostgreSQL,
}

export interface Adapter{

  engine: engineKind;

  query(sql: any, data: ObjectArray, transaction: any) : Promise<any>;
  select<M extends Model>(model: new() => M, schema: Schema<M>) : Select<M>;
  insert<M extends Model>(model: new() => M, schema: Schema<M>) : Insert;
  getVersion() : ''|number;
  create<M extends Model>(model: new() => M, schema: Schema<M>) : Create;
  changeVersion(newVersion: number, cb: callbackMigration) : Promise<void>;
}