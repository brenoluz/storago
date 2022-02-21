import {Table} from '../table';
import { Connector } from './connector';

export abstract class Create{

  Table: typeof Table;
  coon: Connector;

  constructor(table: typeof Table, conn: Connector){

    this.Table = table;
    this.coon = conn;
  }

  abstract execute() : Promise<any>;
}