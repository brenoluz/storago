import { Create } from "../create";
import { Model } from '../../model';
import { WebSQLAdapter } from './adapter';

export class WebSQLCreate implements Create{

  private Model: typeof Model;
  private adapter: WebSQLAdapter;
 
  constructor(model: typeof Model, adapter: WebSQLAdapter){
    this.Model = model;
    this.adapter = adapter;
  }

  private getColumns() : string[] {

    const columns: string[] = [];
    let fields = this.Model.schema.getRealFields();

    for(let field of fields){
      let name = field.getName();
      columns.push(`${name} ${field.castDB(this.adapter)}`);
    }

    return columns;
  }

  public render() : string {

    let columns: string[] = this.getColumns();
    let sql = `CREATE TABLE IF NOT EXISTS ${this.Model.schema.getName()} (`;
    sql += columns.join(', ');
    sql += ');';
    return sql;
  }

  public execute(tx: SQLTransaction) : Promise<SQLResultSet> {

    let sql: string = this.render();
    return this.adapter.query(sql, [], tx);
  }
}