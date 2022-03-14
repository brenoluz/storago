import { Select } from "./select";
import { Model } from "../model";
import { Insert } from "./insert";

export enum engineKind {
  WebSQL,
  PostgreSQL,
}

export interface Adapter{

  engine: engineKind;

  query(sql: any, data?: any) : Promise<any>;
  select(model: typeof Model) : Select;
  insert(model: typeof Model) : Insert;
}