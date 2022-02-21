import { Connector, engineKind } from "../connector";
import { WebSqlSelect } from "./select";
import { Table } from "../../table";

export class WebsqlConnector implements Connector{

  db: Database;
  engine: engineKind = engineKind.WebSQL;

  constructor(name: string, description: string, size: number){

    this.db = window.openDatabase(name, '', description, size);
  }

  public async transaction() : Promise<SQLTransaction>{

    return new Promise(this.db.transaction);
  }

  public select(table: typeof Table) : WebSqlSelect {
    let select = new WebSqlSelect(table, this);
    return select;
  }

  public async query(sql: DOMString, data?: ObjectArray) : Promise<SQLResultSet> {

    let tx : SQLTransaction = await this.transaction();

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