import { Routes } from '@angular/router';
import { NonAuthenticatedGuard } from './auth/guards/non-authenticated.guard';
import { AuthenticatedGuard } from './auth/guards/authenticated.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./layout/layout'),
        children: [
            {
                path: '',
                loadComponent: () => import('./pages/home-page/home-page')
            },
            {
                path: 'movie/:movieId',
                loadComponent: () => import('./pages/movie-details-page/movie-details-page'),
            },
            {
                path: 'profile',
                loadComponent: () => import('./pages/profile-page/profile-page'),
                canMatch: [AuthenticatedGuard]
            },
            {
                path: 'login',
                outlet: 'modal',
                loadComponent: () => import('./components/shared/modal-route-host/modal-route-host'),
                data: { mode: 'login' },
                canMatch: [NonAuthenticatedGuard]
            },
            {
                path: 'register',
                outlet: 'modal',
                loadComponent: () => import('./components/shared/modal-route-host/modal-route-host'),
                data: { mode: 'register' },
                canMatch: [NonAuthenticatedGuard]
            },
            {
                path: 'person/:personId',
                outlet: 'modal',
                loadComponent: () => import('./components/shared/modal-route-host/modal-route-host'),
                data: { mode: 'person-details' },
            },
            {
                path: '**',
                redirectTo: ''
            }
        ],
    },
];
