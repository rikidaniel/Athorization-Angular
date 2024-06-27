import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpContextToken
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthorizationService } from "./authorization.service";

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {

  public static BYPASS_LOG = new HttpContextToken(() => false);

  constructor(private authorizationService: AuthorizationService) {}

  intercept(httpRequest: HttpRequest<any>, httpHandler: HttpHandler): Observable<HttpEvent<any>> {
    if (httpRequest.url.includes(`${this.authorizationService.host}/sign-in`)) {
      return httpHandler.handle(httpRequest);
    }

    // Mengaktifkan pengabaian log untuk permintaan tertentu jika diperlukan
    if (httpRequest.context.get(AuthorizationInterceptor.BYPASS_LOG) === true) {
      const request = httpRequest.clone();
      return httpHandler.handle(request);
    }

    // Memuat token dan menambahkannya ke header permintaan
    this.authorizationService.loadToken();
    const token = this.authorizationService.getToken();
    const request = httpRequest.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });

    return httpHandler.handle(request);
  }
}
