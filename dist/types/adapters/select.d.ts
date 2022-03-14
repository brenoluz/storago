export declare type paramsType = string | number;
export interface Select {
    from(from: string, columns?: any[]): Select;
    execute(): Promise<any>;
    where(criteria: string, params?: paramsType[] | paramsType): Select;
    all(): Promise<any[]>;
    render(): string;
}
