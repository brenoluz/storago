import { Adapter } from "../adapters/adapter";
import { Field } from "./field";
export declare class Text extends Field {
    fromDB(value: any): any;
    toDB(value: any): any;
    castDB(conn: Adapter): string;
}
