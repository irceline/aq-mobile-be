import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { share } from 'rxjs/operators';

@Injectable()
export class OngoingHttpCacheService {

  private cache: { [key: string]: { request: Observable<HttpEvent<any>> } } = {};

  public has(req: HttpRequest<any>): boolean {
    return this.cache[req.urlWithParams] !== undefined;
  }

  public set(req: HttpRequest<any>, request: Observable<HttpEvent<any>>): void {
    this.cache[req.urlWithParams] = {
      request
    };
  }

  public observe(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    return this.cache[req.urlWithParams].request;
  }

  public clear(req: HttpRequest<any>) {
    delete this.cache[req.urlWithParams];
  }
}


@Injectable()
export class CachingInterceptor implements HttpInterceptor {

  constructor(
    protected ongoingCache: OngoingHttpCacheService
  ) { }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (req.method !== 'GET') {
      return next.handle(req);
    }

    if (this.ongoingCache.has(req)) {
      return this.ongoingCache.observe(req);
    } else {
      return new Observable<HttpEvent<any>>((observer: Observer<HttpEvent<any>>) => {
        const shared = next.handle(req).pipe(share());
        shared.subscribe((res) => {
          if (res instanceof HttpResponse) {
            this.ongoingCache.clear(req);
            observer.next(res);
            observer.complete();
          }
        }, (error) => {
          observer.error(error);
          observer.complete();
        });
        this.ongoingCache.set(req, shared);
      });
    }
  }
}