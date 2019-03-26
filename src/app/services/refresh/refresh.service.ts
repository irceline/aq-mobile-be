import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class RefreshHandler {

  public onRefresh: EventEmitter<void> = new EventEmitter<void>();

  public refresh() {
    this.onRefresh.emit();
  }

}
