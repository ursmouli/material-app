import { Component } from '@angular/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

@Component({
  selector: 'app-test-components',
  standalone: true,
  imports: [ NgxMaterialTimepickerModule ],
  templateUrl: './test-components.component.html',
  styleUrl: './test-components.component.scss'
})
export class TestComponentsComponent {

}
