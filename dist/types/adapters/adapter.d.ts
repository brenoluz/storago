import { Select } from "./select";
import { Table } from "../table";
export declare enum engineKind {
    WebSQL = 0,
    PostgreSQL = 1
}
export interface Adapter {
    engine: engineKind;
    query(sql: any, data?: any): Promise<any>;
    select(table: typeof Table): Select;
}
