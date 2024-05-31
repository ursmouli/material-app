import { Component, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-profile-menu',
  standalone: true,
  imports: [MatMenuModule, MatIconModule, MatButtonModule],
  templateUrl: './profile-menu.component.html',
  styleUrl: './profile-menu.component.scss'
})
export class ProfileMenuComponent {
}
