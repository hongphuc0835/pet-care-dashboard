import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AppointmentsService {
    private baseURL = environment.baseURL;

    constructor(private http: HttpClient) {}

    getAppointments() {
        return this.http.get<any>(`${this.baseURL}/appointments`);
    }

    createAppointment(data: any) {
        return this.http.post<any>(`${this.baseURL}/appointments`, data);
    }

    updateAppointment(id: string, data: any) {
        return this.http.put<any>(`${this.baseURL}/appointments/${id}`, data);
    }

    deleteAppointment(id: string) {
        return this.http.delete<any>(`${this.baseURL}/appointments/${id}`);
    }
}
