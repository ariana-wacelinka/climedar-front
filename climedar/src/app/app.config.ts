import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';

import { provideRouter } from '@angular/router';
import { provideAuth0 } from '@auth0/auth0-angular';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { environment } from './environments';


import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { LOCALE_ID, inject } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ApolloLink, InMemoryCache, Observable } from '@apollo/client/core';
import { AuthService } from './auth/service/auth.service';

registerLocaleData(localeEs, 'es');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter(routes),
    provideAnimationsAsync('noop'),
    provideAuth0({
      domain: environment.auth0.domain,
      clientId: environment.auth0.clientId,
      authorizationParams: {
        // redirect_uri: "https://climedar-front.vercel.app",
        redirect_uri: "http://localhost:4200",
      }
    }),
    { provide: LOCALE_ID, useValue: 'es' },
    provideAnimationsAsync(),
    provideHttpClient(),
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      const auth = inject(AuthService);

      // Middleware para agregar el token automáticamente a cada request
      const authLink = new ApolloLink((operation, forward) => {
        return new Observable(observer => {
          const token = auth.getToken(); // Obtiene el token

          operation.setContext({
            headers: {
               Authorization: token ? `Bearer ${token}` : ''
            }
          });

          // Continuar con la request
          forward(operation).subscribe(observer);
        });
      });

      return {
        link: authLink.concat(httpLink.create({
          uri: environment.apiUrl,
        })),
        cache: new InMemoryCache(),
      };
    })]
};

