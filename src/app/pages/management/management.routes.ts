import { Routes } from '@angular/router';
import { Users } from './users/users';
import { Appointments } from './appointments/appointments';
import { Pets } from './pets/pets';

export default [
    { path: 'users', component: Users },
    { path: 'pets', component: Pets },
    { path: 'appointments', component: Appointments },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
