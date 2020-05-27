import { localStorageMock } from './localStorage.mock';
import jasmine from 'jasmine';

export const specHelper = {
  localStorageSetup: () => {
    spyOn(localStorage, 'getItem')
      .and.callFake(localStorageMock.getItem);
    spyOn(localStorage, 'setItem')
      .and.callFake(localStorageMock.setItem);
    spyOn(localStorage, 'removeItem')
      .and.callFake(localStorageMock.removeItem);
    spyOn(localStorage, 'clear')
      .and.callFake(localStorageMock.clear);
  },

  decodeHtmlCharCodes: (value: String) => {
    return value.replace(/(&#(\d+);)/g, (match, capture, charCode) => {
          return String.fromCharCode(charCode);
        }
    );
  }
};
