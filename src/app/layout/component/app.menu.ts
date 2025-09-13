import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            // {
            //     label: 'Home',
            //     items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            // },
            {
                label: 'Management',
                items: [
                    { label: 'Users', icon: 'pi pi-fw pi-user', routerLink: ['management/users'] },
                    { label: 'Pets', icon: 'pi pi-fw pi-database', routerLink: ['management/pets'] },
                    { label: 'Appointments', icon: 'pi pi-fw pi-calendar-clock', routerLink: ['management/appointments'] },
                    { label: 'Services', icon: 'pi pi-fw pi-warehouse', routerLink: ['management/services'] }
                ]
            }
        ];
    }
}
