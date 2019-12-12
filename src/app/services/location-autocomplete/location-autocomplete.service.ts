import { Injectable } from '@angular/core';
import { AutoCompleteService } from 'ionic4-auto-complete';

@Injectable()
export class LocationAutocompleteService implements AutoCompleteService {

  private isInitialized = false;
  private objects: String[];

  constructor() { }

  init() {
    if (!this.isInitialized) {
      this.objects = require('./zipCodes.json');
    }
  }

  destroy() {
    if (this.isInitialized) {
      this.objects = null;
    }
  }

  getResults(term: string) {
    let result = [];
    // Always show input itself as first option
    if (term != "") {
      result.push(term);
    }
    return result.concat(this.objects.filter((elem) => {
      return elem.toLowerCase().includes(term.toLowerCase())
    }))
  }
}
