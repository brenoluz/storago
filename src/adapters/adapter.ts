import { Select } from "./select";
import { Model } from "../model";

export enum engineKind {
  WebSQL,
  PostgreSQL,
}

export interface Adapter{

  engine: engineKind;

  query(sql: any, data?: any) : Promise<any>;
  select(model: typeof Model) : Select;
}