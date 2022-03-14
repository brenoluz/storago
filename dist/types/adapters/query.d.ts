import { Table } from '../table';
import { Adapter } from './adapter';
export declare abstract class Query {
    protected conn: Adapter;
    protected Table: typeof Table;
    constructor(table: typeof Table, conn: Adapter);
}
