import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { UsersService } from '@/service/users';
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
import { AppointmentsService } from '@/service/appointments';
import { PetsService } from '@/service/pets';
import { DiscoveryService } from '@/service/discovery';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { FilterService } from 'primeng/api';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

@Component({
    selector: 'app-appointments',
    imports: [CommonModule, TableModule, FormsModule, ButtonModule, ToastModule, ToolbarModule, InputTextModule, SelectModule, DialogModule, ConfirmDialogModule, PasswordModule, IconField, InputIcon, DatePickerModule, TextareaModule],
    templateUrl: './appointments.html',
    styleUrl: './appointments.scss'
})
export class Appointments implements OnInit {
    currentDate: Date = new Date();

    dialog: boolean = false;

    items = signal<any[]>([]);

    item!: any;

    selectedItems!: any[] | null;

    submitted: boolean = false;

    @ViewChild('dt') dt!: Table;

    cols!: Column[];

    isAddMode: boolean = true;

    isAddRecordMode: boolean = false;

    usersMap: Record<any, any> = {};

    petsMap: Record<any, any> = {};

    discoveriesMap: Record<any, any> = {};

    users: any[] = [];

    pets: any[] = [];

    allPets: any[] = [];

    discoveries: any[] = [];

    dateFilterFrom: Date | null = null;
    dateFilterTo: Date | null = null;

    status = [
        {
            name: 'PENDING',
            code: 'PENDING'
        },
        {
            name: 'CANCELLED',
            code: 'CANCELLED'
        },
        {
            name: 'CONFIRMED',
            code: 'CONFIRMED'
        },
        {
            name: 'DONE',
            code: 'DONE'
        }
    ];

    constructor(
        private userService: UsersService,
        private petsService: PetsService,
        private appointmentService: AppointmentsService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private discoveryService: DiscoveryService,
        private filterService: FilterService
    ) {}

    ngOnInit() {
        this.loadData();
        this.loadUsers();
        this.loadPets();
        this.loadDiscoveries();

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
        this.appointmentService.getAppointments().subscribe({
            next: (data) => {
                this.items.set(
                    data.map((rec: any) => ({
                        ...rec,
                        serviceName: this.getDiscoveryName(rec.discoveryId),
                        ownerName: this.getOwnerName(rec.ownerId),
                        petName: this.getPetName(rec.petId)
                    }))
                );
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load appointments' });
            }
        });

        this.cols = [
            { field: 'serviceName', header: 'Service' },
            { field: 'ownerName', header: 'Owner' },
            { field: 'petName', header: 'Pet' },
            { field: 'apptTime', header: 'Date' },
            { field: 'status', header: 'Status' }
        ];
    }

    getOwnerName(ownerId: string): string {
        return this.usersMap[ownerId] ?? ownerId;
    }

    getPetName(petId: string): string {
        return this.petsMap[petId] ?? petId;
    }

    getDiscoveryName(discoveryId: string): string {
        return this.discoveriesMap[discoveryId] ?? discoveryId;
    }

    onOwnerChange(ownerId: string) {
        this.item.petId = null;
        if (!ownerId) {
            this.pets = [];
            return;
        }

        this.petsService.getPetById(ownerId).subscribe({
            next: (data) => {
                this.pets = data;
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load pets for owner'
                });
            }
        });
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
                this.allPets = data;
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

    loadDiscoveries() {
        this.discoveryService.getDiscoveries().subscribe({
            next: (data) => {
                this.discoveries = data;
                this.discoveriesMap = data.reduce((acc: Record<string, string>, discovery: any) => {
                    acc[discovery.id] = discovery.name;
                    return acc;
                }, {});
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load discoveries'
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

    openAdd(item: any) {
        this.item = { ...item, diagnosis: '', treatment: '', notes: '', createdAt: new Date(), vetId: Number(localStorage.getItem('id')) };
        this.submitted = false;
        this.dialog = true;
        this.isAddRecordMode = true;
    }

    handleEdit(item: any) {
        this.item = { ...item };
        if (this.item.apptTime && typeof this.item.apptTime === 'string') {
            this.item.apptTime = new Date(this.item.apptTime);
        }
        this.petsService.getPetById(this.item.ownerId).subscribe({
            next: (data) => {
                this.pets = data;
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load pets for owner'
                });
            }
        });
        this.dialog = true;
        this.isAddMode = false;
    }

    deleteSelectedItems() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected appointments?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.items.set(this.items().filter((val) => !this.selectedItems?.includes(val)));
                this.selectedItems = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Appointments deleted successfully'
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
            message: 'Are you sure you want to delete appointment <b>' + item.name + '</b>?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.appointmentService.deleteAppointment(item.id).subscribe({
                    next: () => {
                        this.items.set(this.items().filter((val) => val.id !== item.id));
                        this.item = {};
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Appointment deleted successfully'
                        });
                    },
                    error: (err) => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete appointment' });
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
        if (this.isAddRecordMode) {
            if (!this.item.diagnosis || !this.item.createdAt || !this.item.treatment) {
                return;
            }
        } else {
            if (!this.item.discoveryId || !this.item.ownerId || !this.item.petId || !this.item.status || !this.item.apptTime) {
                return;
            }
        }
        let _items = this.items();

        if (this.isAddRecordMode) {
            const { id, ...payload } = this.item;
            this.appointmentService.addHealthRecord({ ...payload, apptId: id }).subscribe({
                next: (data) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Health record added successfully'
                    });
                },
                error: (err) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add health record' });
                }
            });
            this.dialog = false;
            this.item = {};
            this.isAddRecordMode = false;
            return;
        }

        if (this.item.id) {
            _items[this.findIndexById(this.item.id)] = this.item;
            this.appointmentService.updateAppointment(this.item.id, this.item).subscribe({
                next: (data) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Appointment updated successfully'
                    });
                },
                error: (err) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update appointment' });
                }
            });
            this.items.set([..._items]);
        } else {
            this.appointmentService.createAppointment(this.item).subscribe({
                next: (data) => {
                    this.item.id = data.id;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Appointment created successfully'
                    });
                },
                error: (err) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create appointment' });
                }
            });

            this.items.set([..._items, this.item]);
        }

        this.dialog = false;
        this.item = {};
    }

    onDateFilter(table: Table) {
        if (this.dateFilterFrom && this.dateFilterTo) {
            const from = new Date(this.dateFilterFrom);
            const to = new Date(this.dateFilterTo);

            table.filter({ from, to }, '', 'customDateRange');
        } else if (this.dateFilterFrom) {
            const from = new Date(this.dateFilterFrom);
            table.filter({ from }, 'apptTime', 'customDateRange');
        } else if (this.dateFilterTo) {
            const to = new Date(this.dateFilterTo);
            table.filter({ to }, 'apptTime', 'customDateRange');
        } else {
            table.clear();
        }
    }
}
