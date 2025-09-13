import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DiscoveryService {
    private baseURL = environment.baseURL;

    constructor(private http: HttpClient) {}

    getDiscoveries() {
        return this.http.get<any>(`${this.baseURL}/discoveries`);
    }

    createDiscovery(data: any) {
        return this.http.post<any>(`${this.baseURL}/discoveries`, data);
    }

    updateDiscovery(id: string, data: any) {
        return this.http.put<any>(`${this.baseURL}/discoveries/${id}`, data);
    }

    deleteDiscovery(id: string) {
        return this.http.delete<any>(`${this.baseURL}/discoveries/${id}`);
    }
}
