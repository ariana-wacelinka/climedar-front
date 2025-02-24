import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verifica si el usuario está autenticado
  if (authService.isAuthenticated()) {
    return true; // Permite el acceso
  } else {
    // Redirige al login si no está autenticado
    router.navigate(['/login']);
    return false;
  }
};
