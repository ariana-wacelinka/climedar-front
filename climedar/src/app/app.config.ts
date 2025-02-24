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
import { ApolloLink, InMemoryCache } from '@apollo/client/core';
import { AuthService } from './auth/service/auth.service';

registerLocaleData(localeEs, 'es');

const auth = AuthService

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
        redirect_uri: "https://climedar-front.vercel.app",
      }
    }),
    { provide: LOCALE_ID, useValue: 'es' },
    provideAnimationsAsync(), 
    provideHttpClient(), 
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      const auth = inject(AuthService);

      // TODO: DESCOMENTAR CUANDO TENGAMOS QUE ENVIAR EL TOKEN EN CADA REQUEST
      // Middleware para agregar el token automáticamente a cada request
      const authLink = new ApolloLink((operation, forward) => {
        const token = auth.getToken(); // Obtiene el token de localStorage

        operation.setContext({
          headers: {
            Authorization: token ? `Bearer ${token}` : '', // Agrega el token al header
          },
        });

        console.log('operation', operation);

        return forward(operation);
      });

      return {
        link: httpLink.create({
          uri: environment.apiUrl,
        }),
        cache: new InMemoryCache(),
      };
    })]
};

