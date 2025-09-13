import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PetsService {
    private baseURL = environment.baseURL;

    constructor(private http: HttpClient) {}

    getPets() {
        return this.http.get<any>(`${this.baseURL}/pets`);
    }

    createPet(data: any) {
        return this.http.post<any>(`${this.baseURL}/pets`, data);
    }

    updatePet(id: string, data: any) {
        return this.http.put<any>(`${this.baseURL}/pets/${id}`, data);
    }

    deletePet(id: string) {
        return this.http.delete<any>(`${this.baseURL}/pets/${id}`);
    }
}
