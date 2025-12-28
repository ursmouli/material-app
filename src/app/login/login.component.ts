import { Input, Component, Output, EventEmitter, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../common/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterOutlet, RouterLink, RouterLinkActive,
    MatCardModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatDividerModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  @Input() error: string | null;
  @Output() submitEM = new EventEmitter();

  authService = inject(AuthService);

  constructor() {
    this.error = '';
  }

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  onSubmit() {
    console.log(this.loginForm.value);
    console.log(this.loginForm.valid);

    if (this.loginForm.valid) {
      // set role based on email for demo purpose
      const role = this.loginForm.value.email.includes('admin') ? 'admin' : 'user';
      this.authService.login(
        this.loginForm.value.email, 
        this.loginForm.value.password,
        role
      );
      this.submitEM.emit(this.loginForm.value);
    }
  }

}
