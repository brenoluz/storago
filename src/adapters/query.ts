import { Table } from '../table';
import { Connector } from './connector';

export abstract class Query{

  protected conn: Connector;
  protected Table: typeof Table;

  constructor(table: typeof Table, conn: Connector){
  
    this.Table = table;
    this.conn = conn;
  }
}