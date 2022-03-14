import { Query } from './query';
export declare abstract class Create extends Query {
    abstract execute(): Promise<any>;
}
