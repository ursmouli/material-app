import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickupPointEditComponent } from './pickup-point-edit.component';

describe('PickupPointEditComponent', () => {
  let component: PickupPointEditComponent;
  let fixture: ComponentFixture<PickupPointEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PickupPointEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PickupPointEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
