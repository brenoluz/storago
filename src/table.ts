import Schema from './schema';
import Select from './adapters/select';

export default abstract class Table{

  public static schema: Schema;

  public static find(where: string, param: string | number) : any[] {
    
    
    return [];
  };

  public static select() : Select{

    return this.schema.select();
  }