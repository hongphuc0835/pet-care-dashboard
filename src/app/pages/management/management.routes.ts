import { Routes } from '@angular/router';
import { Users } from './users/users';
import { Appointments } from './appointments/appointments';
import { Pets } from './pets/pets';
import { Discoveries } from './discoveries/discoveries';

export default [
    { path: 'users', component: Users },
    { path: 'pets', component: Pets },
    { path: 'appointments', component: Appointments },
    { path: 'services', component: Discoveries },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
