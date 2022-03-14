import { Adapter } from "../adapters/adapter";
export declare type config = {
    default?: any;
    required?: boolean;
};
export declare abstract class Field {
    _config: config;
    constructor(config?: config);
    getName(name: string): string;
    abstract toDB(value: any): any;
    abstract fromDB(value: any): any;
    abstract castDB(conn: Adapter): string;
}
