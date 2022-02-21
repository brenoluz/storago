import { Select } from "./select";
import { Table } from "../table";

export enum engineKind {
  WebSQL,
  PostgreSQL,
}

export interface Connector{

  engine: engineKind;

  query(sql: any, data?: any) : Promise<any>;
  select(table: typeof Table) : Select;
}