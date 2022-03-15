import { Insert } from "../insert";
import { WebSQLAdapter } from "./adapter";
import { Model } from "../../model";

export type dbValueCast = string | number;

export class WebSQLInsert implements Insert {

  private Model: typeof Model;
  private adapter: WebSQLAdapter;
  private values: dbValueCast[] = [];
  private objects: Model[] = [];

  constructor(model: typeof Model, adapter: WebSQLAdapter) {
    this.Model = model;
    this.adapter = adapter;
  }

  add(row: Model): void {

    this.objects.push(row);
  }

  render(): string {

    let schema = this.Model.schema;
    let fields = schema.getRealFields();

    let length = fields.length - 1;
    let sql = `INSERT INTO ${ schema.getName() } (`;
    for (let i in fields) {

      let index = parseInt(i);
      let field = fields[i];
      let name = field.getName();
      sql += `"${ name }"`;
      if (index < length) {
        sql += ', ';
      }
    }

    sql += ') VALUES (';

    let o_size = this.objects.length - 1;
    for (let o in this.objects) {

      let o_index = parseInt(o);
      let obj = this.objects[o];

      for (let i in fields) {

        let index = parseInt(i);
        let field = fields[i];
        let name = field.getName();

        this.values.push(field.toDB(obj[name])); //guarda os valores para gravar no banco

        sql += '?';
        if (index < length) {
          sql += ', ';
        }
      }

      if (o_index < o_size) {
        sql += '), ';
      }
    }

    sql += ')';

    return sql;
  }

  public async execute(): Promise<SQLResultSet> {

    let sql = this.render();
    return this.adapter.query(sql, this.values);
  }
}