export default class{

  db: Database;

  constructor(name: string, description: string, size: number){

    this.db = window.openDatabase(name, '', description, size);
  }

  public async transaction() : Promise<SQLTransaction>{

    return new Promise(this.db.transaction);
  }

  public async query(sql: DOMString, data?: ObjectArray) : Promise<SQLResultSetRowList> {

    let tx : SQLTransaction = await this.transaction();

    return new Promise((resolve, reject) => {

      tx.executeSql(sql, data, (tx: SQLTransaction, result: SQLResultSet): void => {

        resolve(result.rows);

      }, (tx: SQLTransaction, error: SQLError): boolean => {

        reject(error);
        return true;
      });
    });
  }
}