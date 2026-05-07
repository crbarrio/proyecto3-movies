import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoginForm } from "../../movies/login-form/login-form";
import { RegisterForm } from "../../movies/register-form/register-form";

type AuthMode = 'login' | 'register';

type AuthModalData = {
  mode: AuthMode;
};

@Component({
  selector: 'app-auth-modal',
  imports: [LoginForm, RegisterForm],
  templateUrl: './auth-modal.html',
  styleUrl: './auth-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AuthModal {
  private dialogRef = inject(DialogRef<AuthModal>);
  private router = inject(Router);
  private data = inject<AuthModalData>(DIALOG_DATA);

  protected readonly mode = signal<AuthMode>(this.data.mode);
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
    this.router.navigate([{ outlets: { modal: [this.alternateMode()] } }], {
      replaceUrl: true,
    });
  }
}
