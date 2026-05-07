import { Component, output, signal } from '@angular/core';
import { email, form, FormField, minLength, required, submit } from '@angular/forms/signals';

interface LoginFormData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login-form',
  imports: [FormField],
  templateUrl: './login-form.html',
})
export class LoginForm {


  loginModel = signal<LoginFormData>({
    email: '',
    password: '',
  })

  formSubmited = output<LoginFormData>();

  loginForm = form(this.loginModel, (path) => {
    required(path.email, { message: 'Email is required' });
    email(path.email, { message: 'Please enter a valid email address' });
    required(path.password, { message: 'Password is required' });
    minLength(path.password, 8, { message: 'Password must be at least 8 characters long' });
  })

  isFieldInvalid(fieldName: keyof LoginFormData): boolean {
    const fieldSignal = this.loginForm[fieldName];
    if (!fieldSignal) return false;
    
    const field = fieldSignal();  
    return field && field.touched() && field.errors().length > 0;
  }

  onSubmit(event: Event) {
    event.preventDefault();

    submit(this.loginForm, async () => {
      this.formSubmited.emit(this.loginModel());      
    });

  }

}
