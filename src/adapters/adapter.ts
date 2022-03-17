import { Select } from "./select";
import { Model } from "../model";
import { Insert } from "./insert";

type callbackMigration = {(transaction: any) : Promise<void>};

export enum engineKind {
  WebSQL,
  PostgreSQL,
}

export interface Adapter{

  engine: engineKind;

  query(sql: any, data?: any) : Promise<any>;
  select(model: typeof Model) : Select;
  insert(model: typeof Model) : Insert;
  getVersion() : ''|number;
  changeVersion(newVersion: number, cb: callbackMigration) : Promise<void>;
}