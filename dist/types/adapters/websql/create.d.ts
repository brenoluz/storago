/// <reference types="@types/websql" />
import { Create } from "../create";
export declare class CreateWebSQL extends Create {
    private getColumns;
    render(): string;
    execute(): Promise<SQLResultSet>;
}
