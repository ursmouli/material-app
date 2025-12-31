import { Component, EventEmitter, inject, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, MatToolbarModule, MatButtonModule, MatMenuModule, MatDividerModule, CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Output() toggleSidenav = new EventEmitter<void>();

  authService = inject(AuthService);
  router = inject(Router);

  isAdminOrUserRoute(): boolean {
    return this.router.url.includes('/admin') || this.router.url.includes('/user');
  }

  onToggle() {
    this.toggleSidenav.emit();
  }
}
