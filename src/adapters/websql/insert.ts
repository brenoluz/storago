import { paramsType } from "../query";
import { Insert } from "../insert";
import { WebSQLAdapter } from "./adapter";
import { Model } from "../../model";

export class WebSQLInsert implements Insert {

  private Model: typeof Model;
  private adapter: WebSQLAdapter;
  private _from: string = '';
  private _column: string[] = [];
  private objects: Model[] = [];

  constructor(model: typeof Model, adapter: WebSQLAdapter){
    this.Model = model;
    this.adapter = adapter;
  }

  from(from: string, columns?: string[]) : WebSQLInsert {

    this._from = from;
    if(!columns){
      columns = ['*'];
    }

    columns.push('rowid');
    
    for(let column of columns){
      this._column.push(`${from}.${column}`);
    }

    return this;
  }

  render(): string {

    let length = this._column.length-1;
    let sql = `INSERT INTO ${this._from} (`;
    for(let c in this._column){

      let index = parseInt(c);
      let name = this._column[c];
      sql += `"${name}"`;
      if(index < length){
        sql += ', ';
      }
    }

    sql += ') VALUES (';

    let o_size = this.objects.length-1;
    for(let o in this.objects){

      let o_index = parseInt(o);
      let obj = this.objects[o];

      for(let c in this._column){
        let index = parseInt(c);
        let column = this._column[c];
        sql += '?';
        if(index < length){
          sql += ', ';
        }
      }

      if(o_index < o_size){
        sql += '), ';
      }
    }

    sql += ')';

    return sql;
  }
}