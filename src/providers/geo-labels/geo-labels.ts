import { Injectable } from '@angular/core';
import { GeoReverseResult, GeoSearchResult } from '@helgoland/map';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class GeoLabelsProvider {

  constructor(
    public translateSrvc: TranslateService
  ) { }

  public createLabelOfReverseResult(reverse: GeoReverseResult): string {
    let locationLabel = '';
    if (reverse && reverse.address) {
      if (reverse.address.road) { locationLabel = `${reverse.address.road}${reverse.address.houseNumber ? ' ' + reverse.address.houseNumber : ''}, `; }
      if (reverse.address.city || reverse.address.cityDistrict) { locationLabel += (reverse.address.city || reverse.address.cityDistrict) }
    } else {
      locationLabel = this.translateSrvc.instant('belaqi-user-location-slider.current-location');
    }
    return locationLabel;
  }

  public createLabelOfSearchResult(search: GeoSearchResult): string {
    if (search && search.address) {
      let locationLabel = '';
      if (search.address.road) { locationLabel = `${search.address.road} ${search.address.house_number ? search.address.house_number : ''}, `; }
      if (search.address.city || search.address.town) { locationLabel += (search.address.city ? search.address.city : search.address.town) }
      return locationLabel;
    } else {
      return search.name;
    }
  }

}
