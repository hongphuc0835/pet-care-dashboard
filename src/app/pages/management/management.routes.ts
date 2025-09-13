import { Routes } from '@angular/router';
import { Users } from './users/users';
import { Appointments } from './appointments/appointments';
import { Pets } from './pets/pets';
import { Discoveries } from './discoveries/discoveries';
import { HealthRecord } from './health-record/health-record';

export default [
    { path: 'users', component: Users },
    { path: 'pets', component: Pets },
    { path: 'appointments', component: Appointments },
    { path: 'health-records', component: HealthRecord },
    { path: 'services', component: Discoveries },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
