import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(){}
    intercept(req: HttpRequest<any>, next: HttpHandler) {

  let token = sessionStorage.getItem('LEAD_ID');

  // If token is not available in sessionStorage,
  // try localStorage
  if (!token) {
    token = localStorage.getItem('LEAD_ID');
  }

  console.log("🔑 INTERCEPTOR TOKEN:", token);

  const authReq = req.clone({
    headers: req.headers.set(
      'authentication',
      'BreakerHeaders ' + token
    ),
  });

  return next.handle(authReq);
}
}