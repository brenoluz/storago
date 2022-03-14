import { Schema } from './schema';
import { Select, paramsType } from './adapters/select';
export declare class Table {
    static schema: Schema;
    [key: string]: any;
    static find(where: string, param: paramsType): Promise<any[]>;
    static select(): Select;
    static createFromDB(row: {
        [index: string]: any;
    }): Table;
}
