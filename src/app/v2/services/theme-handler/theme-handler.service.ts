import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from "rxjs";

const THEME_STORAGE_KEY = 'THEME_STORAGE_KEY';

@Injectable({
  providedIn: 'root',
})
export class ThemeHandlerService {
  public $theme = new BehaviorSubject([]);
  public STANDARD_MODE = 'standardMode';
  public CONTRAST_MODE = 'contrastMode';

  constructor(private storage: Storage) {
  }

  public getActiveTheme(): Promise<string> {
    return this.storage.get(THEME_STORAGE_KEY);
  }

  public setActiveTheme(value: string) {
    const val : any = value;
    this.$theme.next(val);
    this.storage.set(THEME_STORAGE_KEY, value);
  }

  public setDefaultTheme() {
    this.setActiveTheme(this.STANDARD_MODE);
  }
}
