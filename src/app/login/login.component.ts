import { Input, Component, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  @Input() error: string | null;
  @Output() submitEM = new EventEmitter();

  constructor() {
    this.error = '';
  }

  loginForm: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  onSubmit() {
    console.log(this.loginForm.value);
    console.log(this.loginForm.valid);
    if (this.loginForm.valid) {
      this.submitEM.emit(this.loginForm.value);
    }
  }

}
