import { Injectable } from '@angular/core';

import { MainPhenomenon } from '../../model/phenomenon';

@Injectable()
export class CategorizeValueToIndexProvider {

  public categorize(value: number, phenomenon: MainPhenomenon): number {
    switch (phenomenon) {
      case MainPhenomenon.O3:
        return this.categorizeO3(value);
      case MainPhenomenon.PM10:
        return this.categorizePM10(value);
      case MainPhenomenon.PM25:
        return this.categorizePM25(value);
      case MainPhenomenon.NO2:
        return this.categorizeNO2(value);
      case MainPhenomenon.BC:
        return this.categorizeBC(value);
      default:
        throw "not implemented for " + phenomenon;
    }
  }

  private categorizeNO2(value: number): number {
    if (value <= 20) return 1;
    if (value <= 50) return 2;
    if (value <= 70) return 3;
    if (value <= 120) return 4;
    if (value <= 150) return 5;
    if (value <= 180) return 6;
    if (value <= 200) return 7;
    if (value <= 250) return 8;
    if (value <= 300) return 9;
    return 10;
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
    if (value <= 100) return 9;
    return 10;
  }

  private categorizePM25(value: number): number {
    if (value <= 5) return 1;
    if (value <= 10) return 2;
    if (value <= 15) return 3;
    if (value <= 25) return 4;
    if (value <= 35) return 5;
    if (value <= 40) return 6;
    if (value <= 50) return 7;
    if (value <= 60) return 8;
    if (value <= 70) return 9;
    return 10;
  }

  private categorizeBC(value: number): number {
    if (value <= 0.99) return 1;
    if (value <= 1.99) return 2;
    if (value <= 2.99) return 3;
    if (value <= 3.99) return 4;
    if (value <= 4.99) return 5;
    if (value <= 6.99) return 6;
    if (value <= 9.99) return 7;
    if (value <= 14.99) return 8;
    if (value <= 19.99) return 9;
    return 10;
  }
}
