import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { AppError } from "./app-error";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        let errorMesage = 'An unknown error occurred!';
        let errorCode = error.status;

        if (error.error instanceof ErrorEvent) {
          // Client-side errors
          errorMesage = `Error: ${error.error.message}`;
        } else {
          // Server-side errors
          errorCode = error.status;
          errorMesage = `${error.error? error.error.message : 'An unknown error occurred!'}`;
        }

        console.error(`ErrorCode ${errorCode}, ErrorMessage: ${errorMesage}`);

        return throwError(() => new AppError(errorCode, errorMesage));
      }));
  }
}