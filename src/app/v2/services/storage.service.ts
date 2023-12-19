import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {}

  public initialize():Promise<any> {
    return new Promise(async(resolve) => {
      const storage = await this.storage.create();
      this._storage = storage;
      return resolve('done')
    })
  }

  public set(key: string, value: any) {
    return this._storage?.set(key, value);
  }

  public get<T>(key: string):Promise<T> {
    return new Promise(async(resolve) => {
      const promise = await this._storage?.get(key)
      return resolve(promise);
    })
  }

  public remove(key:string) {
    return new Promise(async (resolve) => {
      const promise = await this._storage?.remove(key)
      return resolve(promise);
    })
  }
}
