import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpEvent,
  HttpErrorResponse,
  HttpRequest,
  HttpHandler,
  HTTP_INTERCEPTORS
  // tslint:disable-next-line: quotemark
} from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { throwError, Observable } from "rxjs";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse) {
          // tslint:disable-next-line: triple-equals
          if (error.status == 401) {
            return throwError(error.statusText);
          }

          const applicationError = error.headers.get("Application-Error");
          if (applicationError) {
            console.error(applicationError);
            return throwError(applicationError);
          }
          const serverError = error.error;
          let modalStateErrors = "";
          if (serverError && typeof serverError === "object") {
            for (const key of serverError) {
              if (serverError[key]) {
                modalStateErrors += serverError[key] + "\n";
              }
            }
          }
          return throwError(modalStateErrors || serverError || "Server Error");
        }
      })
    );
  }
}

export const ErrorInterceptorProvide = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true
};
