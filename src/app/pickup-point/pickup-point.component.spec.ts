import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickupPointComponent } from './pickup-point.component';

describe('PickupPointComponent', () => {
  let component: PickupPointComponent;
  let fixture: ComponentFixture<PickupPointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PickupPointComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PickupPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
