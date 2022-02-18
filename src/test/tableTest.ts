import { Schema } from '..';
import Table from '../table';
import field from '../field';


class Car extends Table{

  public static schema: Schema = new Schema('db', {
    'color': new field.Options(['red', 'blue', 'green']),
    'brand': new field.Text(),
  });
}

export default class{

  run() : void {

    let car: Car = Car.find('color = ?', 'red');
  }
}


