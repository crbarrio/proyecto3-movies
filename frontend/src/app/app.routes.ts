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
                path: '**',
                redirectTo: ''
            }
        ],
    }
];
