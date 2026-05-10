import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoginForm } from "../../movies/login-form/login-form";
import { RegisterForm } from "../../movies/register-form/register-form";
import ModalShell from "../modal-shell/modal-shell";
import { AuthService } from '../../../services/auth.service';

type AuthMode = 'login' | 'register';

type AuthModalData = {
  mode: AuthMode;
};


@Component({
  selector: 'app-auth-modal',
  imports: [LoginForm, RegisterForm, ModalShell],
  templateUrl: './auth-modal.html',
  styleUrl: './auth-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AuthModal {
  private dialogRef = inject(DialogRef<AuthModal>);
  private router = inject(Router);
  private data = inject<AuthModalData>(DIALOG_DATA);
  private authService = inject(AuthService);

  protected readonly mode = signal<AuthMode>(this.data.mode);
  protected readonly authError = signal<string | null>(null);
  protected readonly isSubmitting = signal(false);
  protected readonly title = computed(() => this.mode() === 'login' ? 'Welcome back' : 'Create account');
  protected readonly alternatePrompt = computed(() => this.mode() === 'login'
    ? '¿Aun no tienes cuenta?'
    : '¿Ya tienes cuenta?');
  protected readonly alternateActionLabel = computed(() => this.mode() === 'login' ? 'Registrate' : 'Inicia sesion');
  protected readonly alternateMode = computed<AuthMode>(() => this.mode() === 'login' ? 'register' : 'login');

  protected close() {
    this.dialogRef.close();
  }

  protected openAlternateMode() {
    if (this.isSubmitting()) {
      return;
    }

    this.authError.set(null);
    this.router.navigate([{ outlets: { modal: [this.alternateMode()] } }], {
      replaceUrl: true,
    });
  }

  protected onLogin(formData: { email: string; password: string }) {
    if (this.isSubmitting()) {
      return;
    }

    this.authError.set(null);
    this.isSubmitting.set(true);

    this.authService.login(formData.email, formData.password)
      .subscribe({
        next: (isAuthenticated) => {
          this.isSubmitting.set(false);

          if (isAuthenticated) {
            this.close();
          }
        },
        error: (error: HttpErrorResponse) => {
          this.isSubmitting.set(false);
          this.authError.set(this.getAuthErrorMessage(error, 'login'));
        },
      });
  }

  protected onRegister(formData: { email: string, password: string; name: string}) {
    if (this.isSubmitting()) {
      return;
    }

    this.authError.set(null);
    this.isSubmitting.set(true);

    this.authService.register(formData.email, formData.password, formData.name)
      .subscribe({
        next: (isAuthenticated) => {
          this.isSubmitting.set(false);

          if (isAuthenticated) {
            this.close();
          }
        },
        error: (error: HttpErrorResponse) => {
          this.isSubmitting.set(false);
          this.authError.set(this.getAuthErrorMessage(error, 'register'));
        },
      });
  }

  private getAuthErrorMessage(error: HttpErrorResponse, mode: AuthMode): string {
    if (error.status === 0) {
      return 'Could not connect to the server.';
    }

    const backendMessage = this.getBackendErrorMessage(error);

    if (backendMessage) {
      return backendMessage;
    }

    if (mode === 'login' && error.status === 401) {
      return 'Incorrect email or password.';
    }

    if (mode === 'register' && error.status === 409) {
      return 'An account with this email already exists.';
    }

    return 'Something went wrong. Please try again.';
  }

  private getBackendErrorMessage(error: HttpErrorResponse): string | null {
    const backendError = error.error;

    if (!backendError || typeof backendError !== 'object' || !('message' in backendError)) {
      return null;
    }

    const message = backendError.message;

    if (typeof message === 'string' && message.trim()) {
      return message.trim();
    }

    if (Array.isArray(message)) {
      const normalizedMessage = message
        .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
        .join(' ')
        .trim();

      return normalizedMessage || null;
    }

    return null;
  }
}
