import Table from '../../table';
import {default as SelectInteface, Rowset} from '../select';

type queryTuple = [string, any[]];

export default class Select implements SelectInteface{

  private table: Table;
  private _offset: number;
  private _from: string;
  private _where: queryTuple[];
  private _columns: string[];

  constructor(table: Table){

    this.table = table;
  }

  from(from: string, columns?: string[]) : Select {

    this._from = from;
    if(!columns){
      columns = ['*'];
    }

    columns.push('rowid');
    
    for(let column of columns){
      this._columns.push(`${from}.${column}`);
    }

    return this;
  }

  where(criteria: string, params: any|any[]) : Select {

    if(!Array.isArray(params))

    this._where.push([criteria, params]);
    return this;
  }

  render() : string {

    return '';
  }

  execute(): Promise<Rowset> {
    
    let rows : Rowset = [1,2];
    return Promise.resolve(rows);
  }
}