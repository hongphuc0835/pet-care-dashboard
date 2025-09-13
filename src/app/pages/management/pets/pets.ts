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
import { PetsService } from '@/service/pets';
import { UsersService } from '@/service/users';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

@Component({
    selector: 'app-pets',
    imports: [CommonModule, TableModule, FormsModule, ButtonModule, ToastModule, ToolbarModule, InputTextModule, SelectModule, DialogModule, ConfirmDialogModule, PasswordModule, IconField, InputIcon],
    templateUrl: './pets.html',
    styleUrl: './pets.scss'
})
export class Pets implements OnInit {
    dialog: boolean = false;

    items = signal<any[]>([]);

    item!: any;

    selectedItems!: any[] | null;

    submitted: boolean = false;

    @ViewChild('dt') dt!: Table;

    cols!: Column[];

    isAddMode: boolean = true;

    usersMap: Record<any, any> = {};

    users: any[] = [];

    genders = [
        { label: 'MALE', value: 'MALE' },
        { label: 'FEMALE', value: 'FEMALE' }
    ];

    constructor(
        private petService: PetsService,
        private userService: UsersService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.loadData();
        this.loadUsers();
    }

    loadData() {
        this.petService.getPets().subscribe({
            next: (data) => {
                this.items.set(data);
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load pets' });
            }
        });

        this.cols = [
            { field: 'ownerId', header: 'Owner' },
            { field: 'name', header: 'Name' },
            { field: 'species', header: 'Species' },
            { field: 'age', header: 'Age' },
            { field: 'gender', header: 'Gender' },
            { field: 'breed', header: 'Breed' },
            { field: 'avatar', header: 'Avatar' }
        ];
    }

    getOwnerName(ownerId: string): string {
        return this.usersMap[ownerId] ?? ownerId;
    }

    loadUsers() {
        this.userService.getUsers().subscribe({
            next: (data) => {
                this.users = data;
                this.usersMap = data.reduce((acc: Record<string, string>, user: any) => {
                    acc[user.id] = user.name;
                    return acc;
                }, {});
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load users'
                });
            }
        });
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
            message: 'Are you sure you want to delete the selected pets?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.items.set(this.items().filter((val) => !this.selectedItems?.includes(val)));
                this.selectedItems = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Pets deleted successfully'
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
            message: 'Are you sure you want to delete pet <b>' + item.name + '</b>?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.petService.deletePet(item.id).subscribe({
                    next: () => {
                        this.items.set(this.items().filter((val) => val.id !== item.id));
                        this.item = {};
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Pet deleted successfully'
                        });
                    },
                    error: (err) => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete pet' });
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
        if (!this.item.ownerId || !this.item.name || !this.item.species || !this.item.age || !this.item.gender || !this.item.breed || !this.item.avatar) {
            return;
        }
        let _items = this.items();
        if (this.items.name?.trim()) {
            if (this.item.id) {
                _items[this.findIndexById(this.item.id)] = this.item;
                this.petService.updatePet(this.item.id, this.item).subscribe({
                    next: (data) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Pet updated successfully'
                        });
                    },
                    error: (err) => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update user' });
                    }
                });
                this.items.set([..._items]);
            } else {
                this.petService.createPet(this.item).subscribe({
                    next: (data) => {
                        this.item.id = data.id;
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Pet created successfully'
                        });
                    },
                    error: (err) => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create pet' });
                    }
                });

                this.items.set([..._items, this.item]);
            }

            this.dialog = false;
            this.item = {};
        }
    }
}
