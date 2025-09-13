import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private baseURL = environment.baseURL;

    constructor(private http: HttpClient) {}

    getUsers() {
        return this.http.get<any>(`${this.baseURL}/user-pets`);
    }

    createUser(data: any) {
        return this.http.post<any>(`${this.baseURL}/user-pets`, data);
    }

    updateUser(id: string, data: any) {
        return this.http.put<any>(`${this.baseURL}/user-pets/${id}`, data);
    }

    deleteUser(id: string) {
        return this.http.delete<any>(`${this.baseURL}/user-pets/${id}`);
    }
}
