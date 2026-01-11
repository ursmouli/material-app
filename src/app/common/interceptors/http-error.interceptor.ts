import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMesage = 'An unknown error occurred!';

        if (error.error instanceof ErrorEvent) {
          // Client-side errors
          errorMesage = `Error: ${error.error.message}`;
        } else {
          // Server-side errors
          errorMesage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }

        console.error(errorMesage);

        return throwError(() => new Error(errorMesage));
      }));
  }
}