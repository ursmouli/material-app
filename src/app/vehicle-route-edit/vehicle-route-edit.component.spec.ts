import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleRouteEditComponent } from './vehicle-route-edit.component';

describe('VehicleRouteEditComponent', () => {
  let component: VehicleRouteEditComponent;
  let fixture: ComponentFixture<VehicleRouteEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleRouteEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VehicleRouteEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
