import { Adapter, engineKind } from "../adapter";
import { WebSQLSelect } from "./select";
import { Model } from "../../model";
import { WebSQLInsert } from "./insert";

type callbackMigration = {(transaction: SQLTransaction) : Promise<void>};

export class WebSQLAdapter implements Adapter {

  public readonly db: Database;
  public readonly engine: engineKind = engineKind.WebSQL;

  constructor(name: string, description: string, size: number) {

    this.db = window.openDatabase(name, '', description, size);
  }

  public getVersion(): ''|number {

    let version = this.db.version as string;
    if (version !== '') {
      return parseInt(version);
    }
    
    return '';
  }

  public changeVersion(newVersion: number, cb: callbackMigration) : Promise<void>{

    return new Promise((resolve, reject) => {

      this.db.changeVersion(String(this.getVersion()), String(newVersion), cb, reject, resolve);
    });
  }

  public async getTransaction(): Promise<SQLTransaction> {

    return new Promise((resolve, reject) => {
      this.db.transaction(resolve, reject);
    });
  }

  public select(table: typeof Model): WebSQLSelect {
    let select = new WebSQLSelect(table, this);
    return select;
  }

  public insert(model: typeof Model): WebSQLInsert {
    let insert = new WebSQLInsert(model, this);
    return insert;
  }

  public async query(sql: DOMString, data?: ObjectArray): Promise<SQLResultSet> {

    let tx: SQLTransaction = await this.getTransaction();

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