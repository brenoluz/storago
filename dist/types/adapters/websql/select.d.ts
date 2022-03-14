/// <reference types="@types/websql" />
import { WebSQLAdapter } from './adapter';
import { Select, paramsType } from '../select';
import { Table } from '../../table';
import { Query } from '../query';
declare type orderType = "ASC" | "DESC";
export declare class WebSQLSelect extends Query implements Select {
    private _offset;
    private _distinct;
    private _from;
    private _where;
    private _column;
    private _join;
    private _joinLeft;
    private _joinRight;
    private _params;
    private _order;
    constructor(table: typeof Table, conn: WebSQLAdapter);
    distinct(flag?: boolean): WebSQLSelect;
    from(from: string, columns?: paramsType[]): WebSQLSelect;
    where(criteria: string, params?: paramsType[] | paramsType): WebSQLSelect;
    join(tableName: string, on: string, columns?: string[]): WebSQLSelect;
    joinLeft(tableName: string, on: string, columns?: string[]): WebSQLSelect;
    joinRight(tableName: string, on: string, columns: string[]): WebSQLSelect;
    order(column: string, direction?: orderType): void;
    render(): string;
    toString(): string;
    execute(): Promise<SQLResultSet>;
    all(): Promise<Table[]>;
}
export {};
