import { Adapter, engineKind } from "../adapter";
import { WebSQLSelect } from "./select";
import { Model } from "../../model";
import { WebSQLInsert } from "./insert";

export class WebSQLAdapter implements Adapter{

  db: Database;
  engine: engineKind = engineKind.WebSQL;

  constructor(name: string, description: string, size: number){

    this.db = window.openDatabase(name, '', description, size);
  }

  public async getTransaction() : Promise<SQLTransaction>{

    return new Promise((resolve, reject) => {
      this.db.transaction(resolve, reject);
    });
  }

  public select(table: typeof Model) : WebSQLSelect {
    let select = new WebSQLSelect(table, this);
    return select;
  }

  public insert(model: typeof Model) : WebSQLInsert {
    let insert = new WebSQLInsert(model, this);
    return insert;
  }

  public async query(sql: DOMString, data?: ObjectArray) : Promise<SQLResultSet> {

    let tx : SQLTransaction = await this.getTransaction();

    return new Promise((resolve, reject) => {

      tx.executeSql(sql, data, (tx: SQLTransaction, result: SQLResultSet): void => {

        resolve(result);

      }, (tx: SQLTransaction, error: SQLError): boolean => {

        reject(error);
        return true;
      });
    });
  }
}