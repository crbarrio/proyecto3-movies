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
                loadComponent: () => import('./pages/home-page/home-page'),
                title: 'Trending Movies',
            },
            {
                path: 'movie/:movieId',
                loadComponent: () => import('./pages/movie-details-page/movie-details-page'),
                title: 'Movie Details',
            },
            {
                path: 'profile',
                loadComponent: () => import('./pages/profile-page/profile-page'),
                title: 'Profile',
                canMatch: [AuthenticatedGuard]
            },
            {
                path: 'login',
                outlet: 'modal',
                loadComponent: () => import('./components/shared/modal-route-host/modal-route-host'),
                data: { mode: 'login' },
                title: 'Login',
                canMatch: [NonAuthenticatedGuard]
            },
            {
                path: 'register',
                outlet: 'modal',
                loadComponent: () => import('./components/shared/modal-route-host/modal-route-host'),
                data: { mode: 'register' },
                title: 'Register',
                canMatch: [NonAuthenticatedGuard]
            },
            {
                path: 'person/:personId',
                outlet: 'modal',
                loadComponent: () => import('./components/shared/modal-route-host/modal-route-host'),
                data: { mode: 'person-details' },
                title: 'Person Details',
            },
            {
                path: '**',
                redirectTo: ''
            }
        ],
    },
];
