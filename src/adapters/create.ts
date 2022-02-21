import { Query } from './query';

export abstract class Create extends Query{

  abstract execute() : Promise<any>;
}