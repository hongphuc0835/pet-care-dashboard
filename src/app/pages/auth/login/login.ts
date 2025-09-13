import { AppFloatingConfigurator } from '@/layout/component/app.floatingconfigurator';
import { AuthService } from '@/service/auth-service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';

@Component({
    selector: 'app-login',
    imports: [CommonModule, ReactiveFormsModule, AppFloatingConfigurator, InputTextModule, PasswordModule, CheckboxModule, ButtonModule, RippleModule],
    templateUrl: './login.html',
    styleUrl: './login.scss'
})
export class Login {
    loading = false;

    loginForm: FormGroup;

    checked: boolean = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private messageService: MessageService,
        private router: Router
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    handleLogin() {
        this.loginForm.markAllAsTouched();

        const emailCtrl = this.loginForm.get('email');

        if (emailCtrl?.hasError('email')) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Invalid email format'
            });
            return;
        }

        if (this.loginForm.invalid) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please fill in all fields'
            });
            return;
        }

        this.loading = true;

        const { email, password } = this.loginForm.value;

        this.authService.login({ email, password }).subscribe({
            next: (res) => {
                localStorage.setItem('token', res.token);
                this.loading = false;
                this.messageService.add({ severity: 'success', summary: 'Login successful' });
                this.router.navigate(['/']);
                localStorage.setItem('id', res.id);
            },
            error: (err) => {
                this.loading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: err.error.message || 'Login failed'
                });
            }
        });
    }
}
