import { WebSQLAdapter } from './adapter';
import { Select } from '../select';
import { Model } from '../../model';
import { paramsType } from '../query';
import { debug } from '../../debug';

type whereTuple = [string, paramsType[] | undefined];
type joinTuple = [string, string];
type orderType = "ASC" | "DESC";

export class WebSQLSelect implements Select {

  private Model: typeof Model;
  private adapter: WebSQLAdapter;
  private _offset: number = 0;
  private _distinct: boolean = false;
  private _from: string = '';
  private _where: whereTuple[] = [];
  private _column: string[] = [];
  private _join: joinTuple[] = [];
  private _joinLeft: joinTuple[] = [];
  private _joinRight: joinTuple[] = [];
  private _params: paramsType[] = [];
  private _order: string[] = [];

  constructor(model: typeof Model, adapter: WebSQLAdapter) {
    this.Model = model;
    this.adapter = adapter;
  }

  distinct(flag: boolean = true): WebSQLSelect {

    this._distinct = flag;
    return this;
  }

  from(from: string, columns?: string[]): WebSQLSelect {

    this._from = from;
    if (!columns) {
      columns = ['*'];
    }

    columns.push('rowid');

    for (let column of columns) {
      this._column.push(`${ from }.${ column }`);
    }

    return this;
  }

  where(criteria: string, params?: paramsType[] | paramsType): WebSQLSelect {

    if (params !== undefined && !Array.isArray(params)) {
      params = [params];
    }

    this._where.push([criteria, params]);
    return this;
  }

  join(tableName: string, on: string, columns?: string[]): WebSQLSelect {

    this._join.push([tableName, on]);
    if (!!columns) {
      this._column.concat(columns);
    }
    return this;
  }

  joinLeft(tableName: string, on: string, columns?: string[]): WebSQLSelect {

    this._joinLeft.push([tableName, on]);
    if (!!columns) {
      this._column.concat(columns);
    }
    return this;
  }

  joinRight(tableName: string, on: string, columns: string[]): WebSQLSelect {

    this._joinRight.push([tableName, on]);
    this._column.concat(columns);
    return this;
  }

  order(column: string, direction?: orderType) {

    if (!direction) {
      direction = 'ASC';
    }

    this._order.push(`${ column } ${ direction }`);
  }

  render(): string {

    this._params = [];
    /*
    if(!this._from && this.Table){
      this.from(this.Table.schema.name);
    }*/

    let sql = 'SELECT ';
    if (this._distinct) {
      sql += 'DISTINCT ';
    }

    sql += this._column.join(', ');
    sql += ` FROM ${ this._from }`;

    //join
    if (this._join.length > 0) {
      for (let join of this._join) {
        sql += ` JOIN ${ join[0] } ON ${ join[1] }`;
      }
    }

    //left join
    if (this._joinLeft.length > 0) {
      for (let join of this._joinLeft) {
        sql += ` JOIN LEFT ${ join[0] } ON ${ join[1] }`;
      }
    }

    //where
    let where_size = this._where.length;
    let whereAndLimit = where_size - 1;
    if (where_size > 0) {
      sql += ' WHERE ';
      for (let w in this._where) {
        let i: number = parseInt(w);
        let where = this._where[w];
        sql += where[0];
        if (whereAndLimit != i) {
          sql += ' AND ';
        }
        if (where[1] !== undefined) {
          console.log('where', where, where[1]);
          this._params = this._params.concat(where[1]);
        }
      }
    }

    sql += this._order.join(' ');
    sql += ';';
    return sql;
  }

  toString(): string {
    return this.render();
  }

  public async execute(): Promise<SQLResultSet> {

    let sql: string = this.render();
    console.log('execute', sql, this._params);
    return this.adapter.query(sql, this._params);
  }

  public async all(): Promise<Model[]> {

    let promises: Promise<Model>[] = [];
    let result = await this.execute();

    for (let i = 0; result.rows.length > i; i++) {
      let row = result.rows.item(i);
      promises.push(this.Model.schema.populateFromDB(row));
    }

    let rowset = await Promise.all(promises);
    if (debug.select) {
      console.log('@storago/orm', 'select:rowset', rowset);
    }

    return rowset;
  }

  public async one(): Promise<Model> {

    let rowset = await this.all();
    return rowset[0];
  }
}