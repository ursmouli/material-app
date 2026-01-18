import { Input, Component, Output, EventEmitter, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../common/services/auth.service';
import { User } from '../common/model/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive,
    MatCardModule, 
    MatInputModule, 
    MatButtonModule, 
    ReactiveFormsModule, 
    MatDividerModule,
    CommonModule
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
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    // console.log(this.loginForm.value);
    // console.log(this.loginForm.valid);

    if (this.loginForm.valid) {
      const user: User = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.authService.login(user);
      this.submitEM.emit(this.loginForm.value);
    }
  }

}
