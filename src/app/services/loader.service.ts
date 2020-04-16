import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class LoaderService {

  isLoading = new Subject<boolean>();
  public show() {
      this.isLoading.next(true);
  }
  public hide() {
      this.isLoading.next(false);
  }
}
