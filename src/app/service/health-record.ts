import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class HealthRecordService {
    private baseURL = environment.baseURL;

    constructor(private http: HttpClient) {}

    getRecords() {
        return this.http.get<any>(`${this.baseURL}/health-records`);
    }

    updateRecord(id: string, data: any) {
        return this.http.put<any>(`${this.baseURL}/health-records/${id}`, data);
    }

    deleteRecord(id: string) {
        return this.http.delete<any>(`${this.baseURL}/health-records/${id}`);
    }
}
