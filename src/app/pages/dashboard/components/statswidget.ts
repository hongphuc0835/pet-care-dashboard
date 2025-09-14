import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-stats-widget',
    imports: [CommonModule],
    template: `<div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Appointments</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">208</div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                       <i class="pi pi-calendar text-blue-500 text-xl!"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">10 new appointment </span>
                <!-- <span class="text-muted-color">since last visit</span> -->
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Total Pet</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">105</div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-discord text-orange-500 text-xl!"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">15 new pets </span>
                <!-- <span class="text-muted-color">since last week</span> -->
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Customers</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">86</div>
                    </div>
                    <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-users text-cyan-500 text-xl!"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">22 new customers </span>
                <!-- <span class="text-muted-color">newly registered</span> -->
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Discoveries</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">10</div>
                    </div>
                    <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-credit-card text-purple-500 text-xl!"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">3 new discoveries </span>
                <!-- <span class="text-muted-color">responded</span> -->
            </div>
        </div>`
})
export class StatsWidget {}
