import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class LoaderService {

  isLoading = new Subject<boolean>();
  public show() {
    console.log("showing loader")
      this.isLoading.next(true);
  }
  public hide() {
    console.log("hiding loader")
      this.isLoading.next(false);
  }
}
