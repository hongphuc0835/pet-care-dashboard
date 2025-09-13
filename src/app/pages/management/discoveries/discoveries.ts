import { TextareaModule } from 'primeng/textarea';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { DiscoveryService } from '@/service/discovery';

interface Column {
    field: string;
    header: string;
}

@Component({
    selector: 'app-discoveries',
    imports: [CommonModule, TableModule, FormsModule, ButtonModule, ToastModule, ToolbarModule, InputTextModule, SelectModule, DialogModule, ConfirmDialogModule, PasswordModule, IconField, InputIcon, TextareaModule],
    templateUrl: './discoveries.html',
    styleUrl: './discoveries.scss'
})
export class Discoveries implements OnInit {
    dialog: boolean = false;

    items = signal<any[]>([]);

    item!: any;

    selectedItems!: any[] | null;

    submitted: boolean = false;

    @ViewChild('dt') dt!: Table;

    cols!: Column[];

    isAddMode: boolean = true;

    constructor(
        private discoveryService: DiscoveryService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.discoveryService.getDiscoveries().subscribe({
            next: (data) => {
                this.items.set(data);
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load discoveries' });
            }
        });

        this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'category', header: 'Category' },
            { field: 'requirements', header: 'Requirements' },
            { field: 'address', header: 'Address' },
            { field: 'location', header: 'Location' },
            { field: 'description', header: 'Description' }
        ];
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.item = {};
        this.submitted = false;
        this.dialog = true;
        this.isAddMode = true;
    }

    handleEdit(item: any) {
        this.item = { ...item };
        this.dialog = true;
        this.isAddMode = false;
    }

    deleteSelectedItems() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected services?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.items.set(this.items().filter((val) => !this.selectedItems?.includes(val)));
                this.selectedItems = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Services deleted successfully'
                });
            }
        });
    }

    hideDialog() {
        this.dialog = false;
        this.submitted = false;
    }

    deleteItem(item: any) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete service <b>' + item.name + '</b>?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.discoveryService.deleteDiscovery(item.id).subscribe({
                    next: () => {
                        this.items.set(this.items().filter((val) => val.id !== item.id));
                        this.item = {};
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Service deleted successfully'
                        });
                    },
                    error: (err) => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete service' });
                    }
                });
            }
        });
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.items().length; i++) {
            if (this.items()[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    saveItem() {
        this.submitted = true;
        if (!this.item.name || !this.item.category || !this.item.requirements || !this.item.location) {
            return;
        }
        let _items = this.items();
        if (this.items.name?.trim()) {
            if (this.item.id) {
                _items[this.findIndexById(this.item.id)] = this.item;
                this.discoveryService.updateDiscovery(this.item.id, this.item).subscribe({
                    next: (data) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Service updated successfully'
                        });
                    },
                    error: (err) => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update service' });
                    }
                });
                this.items.set([..._items]);
            } else {
                this.discoveryService.createDiscovery(this.item).subscribe({
                    next: (data) => {
                        this.item.id = data.id;
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Service created successfully'
                        });
                    },
                    error: (err) => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create service' });
                    }
                });

                this.items.set([..._items, this.item]);
            }

            this.dialog = false;
            this.item = {};
        }
    }
}
