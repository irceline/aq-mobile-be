import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ModelledPhenomenon } from '../modelled-value/modelled-value';

@Injectable()
export class CategorizeValueToIndexProvider {

  constructor(public http: HttpClient) {
    console.log('Hello CategorizeValueToIndexProvider Provider');
  }

  public categorize(value: number, phenomenon: ModelledPhenomenon): number {
    switch (phenomenon) {
      case ModelledPhenomenon.o3:
        return this.categorizeO3(value);
      case ModelledPhenomenon.pm10:
        return this.categorizePM10(value);
      default:
        throw "not implemented for " + phenomenon;
    }
  }

  private categorizeO3(value: number): number {
    if (value <= 25) return 1;
    if (value <= 50) return 2;
    if (value <= 70) return 3;
    if (value <= 120) return 4;
    if (value <= 160) return 5;
    if (value <= 180) return 6;
    if (value <= 240) return 7;
    if (value <= 280) return 8;
    if (value <= 320) return 9;
    return 10;
  }

  private categorizePM10(value: number): number {
    if (value <= 10) return 1;
    if (value <= 20) return 2;
    if (value <= 30) return 3;
    if (value <= 40) return 4;
    if (value <= 50) return 5;
    if (value <= 60) return 6;
    if (value <= 70) return 7;
    if (value <= 80) return 8;
    if (value <= 90) return 9;
    return 10;
  }
}
