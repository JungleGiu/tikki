import { Routes } from '@angular/router';
import { PublicLayout } from './layout/public-layout/public-layout';
import { AuthLayout } from './layout/auth-layout/auth-layout';
export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      { path: '', loadChildren: () => import('./features/landing/landing.routes') },
      { path: 'register', loadChildren: () => import('./features/auth/register/registrer.routes') },
      { path: 'login', loadChildren: () => import('./features/auth/login/login.routes') },
    ],
  },
  {
    path: '',
    component: AuthLayout,
    children: [
      { path: 'dashboard', loadChildren: () => import('./features/dashboard/dashboard.routes') },
    ],
  },
];
