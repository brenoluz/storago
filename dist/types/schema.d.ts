import { Adapter } from "./adapters/adapter";
import { Select } from "./adapters/select";
import { Table } from "./table";
import { Field } from "./field/field";
export interface fieldsArray {
    [index: string]: Field;
}
export declare class Schema {
    private name;
    private fields;
    private conn;
    constructor(name: string, fields: fieldsArray, adapter?: Adapter);
    getName(): string;
    getFields(): fieldsArray;
    getAdapter(): Adapter;
    select(table: typeof Table): Select;
}
