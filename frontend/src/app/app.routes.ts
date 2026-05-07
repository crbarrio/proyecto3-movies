import { Routes } from '@angular/router';

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
                path: 'login',
                outlet: 'modal',
                loadComponent: () => import('./components/shared/modal-route-host/modal-route-host'),
                data: { mode: 'login' },
            },
            {
                path: 'register',
                outlet: 'modal',
                loadComponent: () => import('./components/shared/modal-route-host/modal-route-host'),
                data: { mode: 'register' },
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
