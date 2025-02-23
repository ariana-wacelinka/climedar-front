import {Injectable, signal} from "@angular/core";
import {environment} from "../../environments";
// @ts-ignore
import * as auth0 from 'auth0-js';
// import {UserService} from "./user.service";
// import {Role, UserModel} from "../../models";
import {MatSnackBar} from '@angular/material/snack-bar';
import { jwtDecode } from "jwt-decode";
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { firstValueFrom, lastValueFrom } from "rxjs";
// import { ErrorDialogComponent } from "../../shared/error-dialog/error-dialog.component";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth0Client: auth0.WebAuth;
  isAuthenticated = signal<boolean>(false);
  userInfo = signal<any>(null);

  constructor(
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private router: Router,
  ) {
    this.auth0Client = new auth0.WebAuth({
      domain: environment.auth0.domain,
      clientID: environment.auth0.clientId,
      audience: environment.auth0.audience,
      redirectUri: "http://localhost:4200/login",
      responseType: 'token id_token'
    })
    this.loadSession();
  }

  public login(email: string | undefined, password: string | undefined): void {
    this.auth0Client.login({
      email: email,
      password: password,
      realm: environment.auth0.database,
      audience: environment.auth0.audience
    }, (err: any, result: any) => {
      if (err.code == "access_denied") {
        console.log("Usuario o contraseña incorrectos");
        // this.dialog.open(ErrorDialogComponent, {data: {message: "Usuario o contraseña incorrectos"}});
      } else if (err) {
        console.log("error");
        // this.dialog.open(ErrorDialogComponent, {data: {message: "Ha ocurrido un error, intente nuevamente"}});
      }
      if (result) {
        console.log("result: ", result);
      }
    });
  }

  public async handleAuthentication(): Promise<void> {
    const queryParams = new URLSearchParams(window.location.hash.substring(1));
    const urlParams = new URLSearchParams(queryParams);

    console.log("Entra a handleauth");

    if (urlParams.get("access_token")) {
      try {
        const accessToken = urlParams.get("access_token");
        const expiresIn = urlParams.get("expires_in");
        const idToken = urlParams.get("id_token");

        console.log("accessToken: ", accessToken);
        console.log("entramos a handleauth");
        
        await this.setSession(accessToken, expiresIn, idToken);
        console.log("Sesión iniciada con éxito.");
        
      } catch (error) {
        console.error(error);
      }
    }
  }

  public logout(): void {
    console.log("Entra al logout")
    localStorage.removeItem('accessToken');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('idToken');

    this.isAuthenticated.set(false);
    console.log("me Deslogea");

    this.auth0Client.logout({
      returnTo: 'http://localhost:4200/login'
    })

  }

  public forgotPassword(email: string): void {
    this.auth0Client.changePassword({
      connection: environment.auth0.database,
      email: email
    }, (err: any, resp: any) => {
      if (err) {
        // this.dialog.open(ErrorDialogComponent, { data: { message: "Ha ocurrido un error, intente nuevamente." } });
      } else {
        console.log("Password change email sent:", resp);
        // this.dialog.open(SendEmailComponent, { data: { message: "Correo de restablecimiento de contraseña enviado." } });
      }
    });
  }

  private setSession(accessToken: any, expiresIn: any, idToken: any): Promise<void> {
    return new Promise(async (resolve) => {
      const expiresAt = (Date.now() + parseInt(expiresIn) * 1000).toString();
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('expires_at', expiresAt);
      localStorage.setItem('idToken', idToken);

      console.log("Entra a setSession");

      this.isAuthenticated.set(true);
      this.setUserInfo(idToken);

      console.log("se autentico?", this.isAuthenticated());
      this.router.navigate(['/']);
      //this.isClient.set(true);
    });
  }

  public setUserInfo(idToken: any) {
    console.log("Entra a setUserInfo: ", jwtDecode(idToken));
    this.userInfo.set(jwtDecode(idToken)); //TODO: ver si vamos a utilizar la informacion del secretario (nombre, email, etc)
  }

  private loadSession() {
    const accessToken = localStorage.getItem('access_token');
    const expiresAt = localStorage.getItem('expires_at');
    const idToken = localStorage.getItem('idToken');

    if (accessToken && expiresAt && idToken) {
      const expiresAtDate = new Date(parseInt(expiresAt!));
      const currentDate = new Date();

      if (currentDate < expiresAtDate) {
        this.isAuthenticated.set(true);
        this.setUserInfo(idToken);
        console.log('Sesión restaurada con éxito.');
      } else {
        console.log('La sesión ha expirado, deslogueando...');
        this.logout();
      }
    } else {
      console.log('No hay sesión activa almacenada.');
      console.log('Deslogueando...');
    }
  }

  getToken() {
    console.log("Entra a getToken");
    console.log(localStorage.getItem('access_token'));
    return localStorage.getItem('access_token');
  }
}
