import { Injectable, NgModule, Pipe, PipeTransform } from '@angular/core';
import {
    TranslateLoader,
    TranslateModule,
    TranslatePipe,
    TranslateService,
} from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

import * as english from '../../../assets/i18n/en.json';

const translations: any = english;

export class FakeLoader implements TranslateLoader {
    getTranslation(lang: string): Observable<any> {
        return of(translations);
    }
}

@Pipe({
    name: 'translate',
})
export class TranslatePipeMock implements PipeTransform {
    public name = 'translate';

    public transform(query: string, ...args: any[]): any {
        return query;
    }
}

@Injectable()
export class TranslateServiceStub {
    public get<T>(key: T): Observable<T> {
        return of(key);
    }

    public instant<T>(key: T): T {
        return key;
    }

    public getLangs(): string[] {
        return ['en', 'nl'];
    }
}

@NgModule({
    declarations: [TranslatePipeMock],
    providers: [
        { provide: TranslateService, useClass: TranslateServiceStub },
        { provide: TranslatePipe, useClass: TranslatePipeMock },
    ],
    imports: [
        TranslateModule.forRoot({
            loader: { provide: TranslateLoader, useClass: FakeLoader },
        }),
    ],
    exports: [TranslatePipeMock, TranslateModule],
})
export class TranslateTestingModule {}
