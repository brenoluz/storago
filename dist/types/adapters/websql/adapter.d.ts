/// <reference types="@types/websql" />
import { Adapter, engineKind } from "../adapter";
import { WebSQLSelect } from "./select";
import { Table } from "../../table";
export declare class WebSQLAdapter implements Adapter {
    db: Database;
    engine: engineKind;
    constructor(name: string, description: string, size: number);
    transaction(): Promise<SQLTransaction>;
    select(table: typeof Table): WebSQLSelect;
    query(sql: DOMString, data?: ObjectArray): Promise<SQLResultSet>;
}
