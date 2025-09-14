import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Notfound } from './app/pages/notfound/notfound';
import { AuthGuard } from '@/auth-guard';
import { LoginGuard } from '@/login-guard';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [AuthGuard],
        children: [
            { path: '', component: Dashboard },
            {
                path: 'management',
                loadChildren: () => import('./app/pages/management/management.routes')
            }
        ]
    },
    // {
    //     path: 'auth',
    //     canActivate: [LoginGuard],
    //     loadChildren: () => import('./app/pages/auth/auth.routes')
    // },
    // { path: 'notfound', component: Notfound },
    // { path: '**', redirectTo: '/notfound' }

    {
        path: '',
        component: AppLayout,
        canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: 'management/users', pathMatch: 'full' },
            {
                path: 'management',
                loadChildren: () => import('./app/pages/management/management.routes')
            }
        ]
    },
    {
        path: 'auth',
        canActivate: [LoginGuard],
        loadChildren: () => import('./app/pages/auth/auth.routes')
    },
    { path: 'notfound', component: Notfound },
    { path: '**', redirectTo: '/notfound' }
];
