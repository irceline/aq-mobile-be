import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { StorageService } from '../storage.service';

const THEME_STORAGE_KEY = 'THEME_STORAGE_KEY';

@Injectable({
  providedIn: 'root',
})
export class ThemeHandlerService {
  public $theme = new BehaviorSubject([]);
  public STANDARD_MODE = 'standardMode';
  public CONTRAST_MODE = 'contrastMode';

  constructor(private storage: StorageService) {
  }

  public getActiveTheme(): Promise<string> {
    return this.storage.get(THEME_STORAGE_KEY);
  }

  public async setActiveTheme(value: string) {
    const val : any = value;
    this.$theme.next(val);
    await this.storage.set(THEME_STORAGE_KEY, value)
  }

  public async setDefaultTheme() {
    await this.setActiveTheme(this.STANDARD_MODE);
  }
}
