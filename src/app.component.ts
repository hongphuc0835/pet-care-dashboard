import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, ToastModule, ConfirmDialog],
    template: `<router-outlet></router-outlet><p-toast></p-toast> <p-confirmdialog [style]="{ width: '450px' }" />`
})
export class AppComponent {}
