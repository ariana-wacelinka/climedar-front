import { Injectable, signal } from "@angular/core";
import { environment } from "../../environments";
// @ts-ignore
import * as auth0 from 'auth0-js';
import { MatSnackBar } from '@angular/material/snack-bar';
import { jwtDecode } from "jwt-decode";
import { MatDialog } from '@angular/material/dialog';
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ErrorDialogComponent } from "../../shared/components/error-dialog/error-dialog.component";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth0Client: auth0.WebAuth;
  // isAuthenticated = signal<boolean>(false);
  // userInfo = signal<any>(null);

  constructor(
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private router: Router,
    private http: HttpClient
  ) {
    this.auth0Client = new auth0.WebAuth({
      domain: environment.auth0.domain,
      clientID: environment.auth0.clientId,
      audience: environment.auth0.audience,
      redirectUri: "http://localhost:4200/login",
      responseType: 'token id_token'
    });
    this.loadSession();
  }

  // Método de Login
  public login(email: string | undefined, password: string | undefined): Observable<boolean> {
    this.auth0Client.login({
      email: email,
      password: password,
      realm: environment.auth0.database,
      audience: environment.auth0.audience
    }, (err: any, result: any) => {
      if (err?.code === "access_denied") {
        console.log("Usuario o contraseña incorrectos");
        this.dialog.open(ErrorDialogComponent, {
          data: { message: "Usuario o contraseña incorrectos" }
        });
      } else if (err) {
        console.log("error");
        this.dialog.open(ErrorDialogComponent, {
          data: { message: "Ha ocurrido un error" }
        });
      }
      if (result) {
        console.log("result: ", result);
      }
    });
    return new Observable<false>();
  }

  // Método para manejar la autenticación
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
      } catch (error) {
        console.error(error);
      }
    }
  }

  // Método para hacer logout
  public logout(): void {
    console.log("Entra al logout");
    this.clearSession();
    // this.isAuthenticated.set(false);
    this.auth0Client.logout({
      returnTo: 'http://localhost:4200/login'
    });
  }

  // Método para establecer la sesión
  private setSession(accessToken: any, expiresIn: any, idToken: any): Promise<void> {
    return new Promise(async (resolve) => {
      const expiresAt = (Date.now() + parseInt(expiresIn) * 1000).toString();
      
      // Almacena el token en una Cookie HTTPOnly
      document.cookie = `access_token=${accessToken};expires=${new Date(parseInt(expiresAt)).toUTCString()};path=/;SameSite=Strict;Secure`;
      document.cookie = `idToken=${idToken};expires=${new Date(parseInt(expiresAt)).toUTCString()};path=/;SameSite=Strict;Secure`;

      // this.isAuthenticated.set(true);
      // this.setUserInfo(idToken);
      this.router.navigate(['/']);
    });
  }

  // Método para limpiar la sesión
  private clearSession() {
    // Limpia las cookies al desloguear
    document.cookie = "access_token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;";
    document.cookie = "idToken=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;";
    // this.isAuthenticated.set(false);
  }

  // Método para configurar la información del usuario
  // public setUserInfo(idToken: any) {
  //   console.log("Entra a setUserInfo: ", jwtDecode(idToken));
  //   // this.userInfo.set(jwtDecode(idToken));
  // }

  // Método para cargar la sesión
  private loadSession() {
    const idToken = this.getCookie('idToken');
    const accessToken = this.getCookie('access_token');

    if (accessToken && idToken) {
      // this.isAuthenticated.set(true);
      // this.setUserInfo(idToken);
      console.log('Sesión restaurada con éxito.');
    } else {
      // this.isAuthenticated.set(false);
      console.log('No hay sesión activa almacenada.');
      // 🔴 Se quita el logout para evitar el bucle de recarga
    }
  }

  // Método para obtener cookies
  private getCookie(name: string): string | null {
    const cookieArr = document.cookie.split(';');
    for (let cookie of cookieArr) {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName.trim() === name) {
        return cookieValue;
      }
    }
    return null;
  }

  // Método para obtener el token
  getToken() {
    console.log("Entra a getToken");
    const token = this.getCookie('access_token');
    console.log(token);
    return token;
  }

  // Método para hacer solicitudes HTTP con el token en el header Authorization
  getData(endpoint: string) {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });

    return this.http.get(`${environment.apiUrl}/${endpoint}`, { headers });
  }

  isAuthenticated(): boolean {
    const accessToken = this.getCookie('access_token');
    return !!accessToken; // Retorna true si hay un token, false si no
  }
}
