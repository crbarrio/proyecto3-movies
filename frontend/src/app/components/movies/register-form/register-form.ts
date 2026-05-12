import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { email, form, FormField, minLength, required, submit } from '@angular/forms/signals';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-register-form',
  imports: [FormField],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterForm {
  isSubmitting = input(false);

  registerModel = signal<RegisterFormData>({
    name: '',
    email: '',
    password: '',
  });

  formSubmited = output<RegisterFormData>();

  registerForm = form(this.registerModel, (path) => {
    required(path.name, { message: 'Name is required' });
    required(path.email, { message: 'Email is required' });
    email(path.email, { message: 'Please enter a valid email address' });
    required(path.password, { message: 'Password is required' });
    minLength(path.password, 8, { message: 'Password must be at least 8 characters long' });
  });

  isFieldInvalid(fieldName: keyof RegisterFormData): boolean {
    const fieldSignal = this.registerForm[fieldName];
    if (!fieldSignal) return false;

    const field = fieldSignal();
    return field && field.touched() && field.errors().length > 0;
  }

  onSubmit(event: Event) {
    event.preventDefault();

    if (this.isSubmitting()) {
      return;
    }

    submit(this.registerForm, async () => {
      this.formSubmited.emit(this.registerModel());
    });
  }
}
