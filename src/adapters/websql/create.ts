import { Create } from "../create";
import { fieldsArray } from "../../schema";

export class CreateWebSQL extends Create{
 
  private getColumns() : string[] {

    let columns: string[];
    let fields: fieldsArray = this.Table.schema.getFields();

    for(let name in fields){
      let field = fields[name];
      name = field.getName(name);
      columns.push(`${name} ${field.castDB(this.conn)}`);
    }

    return columns;
  }

  public render() : string {

    let columns: string[] = this.getColumns();
    let sql = `CREATE TABLE IF NOT EXISTS ${this.Table.schema.getName()} (`;
    sql += columns.join(', ');
    sql += ');';
    return sql;
  }

  public execute() : Promise<SQLResultSet> {

    let sql: string = this.render();
    return this.conn.query(sql);
  }
}