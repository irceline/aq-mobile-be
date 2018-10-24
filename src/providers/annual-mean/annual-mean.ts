import { Injectable } from '@angular/core';
import { HttpService } from '@helgoland/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const ANNUAL_MEAN_URL = 'http://www.irceline.be/air/timestring_rioifdm_anmean.php';

@Injectable()
export class AnnualMeanProvider {

  constructor(
    public http: HttpService
  ) { }

  public getYear(): Observable<string> {
    return this.http.client().get(ANNUAL_MEAN_URL, { responseType: 'text' })
      .pipe(map(res => {
        const framechar = '\'';
        const first = res.indexOf(framechar) + 1;
        return res.substring(first, res.indexOf(framechar, first));
      }));
  }

}
