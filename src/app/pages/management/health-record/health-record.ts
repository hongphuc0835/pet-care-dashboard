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
import { HealthRecordService } from '@/service/health-record';
import { PetsService } from '@/service/pets';
import { UsersService } from '@/service/users';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { FilterService } from 'primeng/api';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}
@Component({
    selector: 'app-health-record',
    imports: [CommonModule, TableModule, FormsModule, ButtonModule, ToastModule, ToolbarModule, InputTextModule, SelectModule, DialogModule, ConfirmDialogModule, PasswordModule, IconField, InputIcon, DatePickerModule, TextareaModule],
    templateUrl: './health-record.html',
    styleUrl: './health-record.scss'
})
export class HealthRecord implements OnInit {
    currentDate: Date = new Date();

    dialog: boolean = false;

    items = signal<any[]>([]);

    item!: any;

    selectedItems!: any[] | null;

    submitted: boolean = false;

    @ViewChild('dt') dt!: Table;

    cols!: Column[];

    isAddMode: boolean = true;

    usersMap: Record<any, any> = {};

    petsMap: Record<any, any> = {};

    users: any[] = [];

    pets: any[] = [];

    dateFilterFrom: Date | null = null;
    dateFilterTo: Date | null = null;

    constructor(
        private healthRecordService: HealthRecordService,
        private userService: UsersService,
        private petsService: PetsService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private filterService: FilterService
    ) {}

    ngOnInit() {
        this.loadData();
        this.loadUsers();
        this.loadPets();

        this.filterService.register('customDateRange', (value: any, filter: any): boolean => {
            if (!filter) return true;
            if (!value) return false;

            const date = new Date(value);

            if (filter.from && filter.to) {
                return date >= filter.from && date <= filter.to;
            } else if (filter.from) {
                return date >= filter.from;
            } else if (filter.to) {
                return date <= filter.to;
            }
            return true;
        });
    }

    loadData() {
        this.healthRecordService.getRecords().subscribe({
            next: (data) => {
                this.items.set(data);
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load health records' });
            }
        });

        this.cols = [
            { field: 'vetId', header: 'Veterinarian' },
            { field: 'petId', header: 'Pet' },
            { field: 'diagnosis', header: 'Diagnosis' },
            { field: 'treatment', header: 'Treatment' },
            { field: 'notes', header: 'Notes' },
            { field: 'createdAt', header: 'Date' }
        ];
    }

    getVetName(vetId: string): string {
        return this.usersMap[vetId] ?? vetId;
    }

    getPetName(petId: string): string {
        return this.petsMap[petId] ?? petId;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
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

    loadPets() {
        this.petsService.getPets().subscribe({
            next: (data) => {
                this.pets = data;
                this.petsMap = data.reduce((acc: Record<string, string>, pet: any) => {
                    acc[pet.id] = pet.name;
                    return acc;
                }, {});
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load pets'
                });
            }
        });
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
            message: 'Are you sure you want to delete the selected health records?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.items.set(this.items().filter((val) => !this.selectedItems?.includes(val)));
                this.selectedItems = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Health records deleted successfully'
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
            message: 'Are you sure you want to delete health record for pet <b>' + this.getPetName(item.petId) + '</b>?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.healthRecordService.deleteRecord(item.id).subscribe({
                    next: () => {
                        this.items.set(this.items().filter((val) => val.id !== item.id));
                        this.item = {};
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Health record for pet <b>' + this.getPetName(item.petId) + '</b> deleted successfully'
                        });
                    },
                    error: (err) => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete health record' });
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
        if (!this.item.createdAt || !this.item.diagnosis || !this.item.treatment) {
            return;
        }
        let _items = this.items();
        if (this.item.id) {
            _items[this.findIndexById(this.item.id)] = this.item;
            this.healthRecordService.updateRecord(this.item.id, this.item).subscribe({
                next: (data) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Health record for pet <b>' + this.getPetName(this.item.petId) + '</b> updated successfully'
                    });
                },
                error: (err) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update health record' });
                }
            });
            this.items.set([..._items]);
        }

        this.dialog = false;
        this.item = {};
    }

    onDateFilter(table: Table) {
        if (this.dateFilterFrom && this.dateFilterTo) {
            const from = new Date(this.dateFilterFrom);
            const to = new Date(this.dateFilterTo);

            table.filter({ from, to }, 'createdAt', 'customDateRange');
        } else if (this.dateFilterFrom) {
            const from = new Date(this.dateFilterFrom);
            table.filter({ from }, 'createdAt', 'customDateRange');
        } else if (this.dateFilterTo) {
            const to = new Date(this.dateFilterTo);
            table.filter({ to }, 'createdAt', 'customDateRange');
        } else {
            table.clear();
        }
    }
}
