/**
* main page object containing all methods, selectors and functionality
* that is shared across all page objects
*/
import {server} from './../server/server';
const PORT = 8080;

export default class Page {

  wakeUp() : Promise<void>{

    return new Promise((resolve, reject) => {
      server.listen(PORT, () => {
        // tslint:disable-next-line:no-console
        console.log( `server started at http://localhost:${ PORT }`);
        resolve();
      });
    });
  }
  
  /**
   * Opens a sub page of the page
   * @param path path of the sub page (e.g.
   *  /path/to/page.html)
   */
  public async open(path: string): Promise<string> {

    console.log('PASSSSSSSSSSSSSSSSSSA');
    await this.wakeUp();
    console.log('PASSSSSSSSSSSSSSSSSSOUUU');


    return browser.url(`http://localhost:8080`);
    return browser.url(`https://the-internet.herokuapp.com/${ path }`)
  }
}
