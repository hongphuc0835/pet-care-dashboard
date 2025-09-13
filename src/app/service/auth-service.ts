import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private baseURL = environment.baseURL;

    constructor(private http: HttpClient) {}

    isLoggedIn(): boolean {
        return !!localStorage.getItem('id');
    }

    login(data: any): Observable<any> {
        return this.http.post<any>(`${this.baseURL}/user-pets/login`, data);
    }

    logout() {
        localStorage.clear();
        window.location.href = '/login';
    }
}
