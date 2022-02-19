import { Select } from "./select";
import { Table } from "../table";

export interface Connector{

  query(sql: any, data?: any) : Promise<any>;
  select(table: typeof Table) : Select;
}