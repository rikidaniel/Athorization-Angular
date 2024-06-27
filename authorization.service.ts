import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { SignIn } from "../components/sign-in/sign-in";
import { Observable } from "rxjs";
import { JwtHelperService } from "@auth0/angular-jwt";
import { SignInComponent } from "../components/sign-in/sign-in.component";

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  public host: string = environment.postAuth;
  private token: string;
  private uid: string;
  public static readonly TOKEN_KEY_LOCAL_STORAGE: string = 'TOKEN_KEY_LOCAL_STORAGE';
  public static readonly HEADER_TOKEN_KEY: string = 'Gg-Content';
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient,
              private router: Router) { }

  public doSignIn(signIn: SignIn): Observable<HttpResponse<any> | HttpErrorResponse> {
    return this.http.post<any>(this.host, signIn, { observe: "response" });
    //Why we need to add this option {observe: "response"} ? Because we need to get the details of response like header to get the token.
  }

  public signOut(): void {
    this.token = null;
    this.uid = null;
    localStorage.removeItem(AuthorizationService.TOKEN_KEY_LOCAL_STORAGE);
    this.router.navigate([SignInComponent.NAVIGATE]).then(() => {});
  }

  public saveToken(token: string): void {
    this.token = token;
    localStorage.setItem(AuthorizationService.TOKEN_KEY_LOCAL_STORAGE, this.token);
  }

  public loadToken(): void {
    this.token = localStorage.getItem(AuthorizationService.TOKEN_KEY_LOCAL_STORAGE);
  }

  public getToken(): string {
    return this.token;
  }

  public isSignedIn(): boolean {
    this.loadToken();
    if (this.token != null && this.token !== '') {

      if (!this.jwtHelper.isTokenExpired(this.token)) {

        if (this.jwtHelper.decodeToken(this.token).sub != null || '') {
          this.uid = this.jwtHelper.decodeToken(this.token);
        }
        return true;
      } else {
        this.signOut();
        return false;
      }
    } else {
      this.signOut();
      return false;
    }
  }

  public getClaims(): any {
    if (this.isSignedIn()) {
      const decodedToken = this.jwtHelper.decodeToken(this.token);
      if (decodedToken && decodedToken.claims != null) {
        return decodedToken.claims;
      }
    }
    return null;
  }

  public getUserId(): string {
    if (this.isSignedIn()) {
      const decodedToken = this.jwtHelper.decodeToken(this.token);
      return decodedToken.data.user_uuid || null;
    }
    return null;
  }

  public getUserRole(): string | null {
    if (this.isSignedIn()) {
      const decodedToken = this.jwtHelper.decodeToken(this.token);
      return decodedToken.data.role_alias || null;
    }
    return null;
  }
}
