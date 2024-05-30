import { Component } from '@angular/core';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-side-navigation',
  standalone: true,
  imports: [MatSlideToggleModule],
  templateUrl: './side-navigation.component.html',
  styleUrl: './side-navigation.component.scss'
})
export class SideNavigationComponent {

}
