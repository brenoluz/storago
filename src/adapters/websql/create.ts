import { Create } from "../create";

export class CreateWebSQL extends Create{
 
  private getColumns() : string[] {

    const columns: string[] = [];
    let fields = this.Model.schema.getFields();

    for(let field of fields){
      let name = field.getName();
      columns.push(`${name} ${field.castDB(this.conn)}`);
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

  public execute() : Promise<SQLResultSet> {

    let sql: string = this.render();
    return this.conn.query(sql);
  }
}