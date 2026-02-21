import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickupPointEditDialogComponent } from './pickup-point-edit-dialog.component';

describe('PickupPointEditDialogComponent', () => {
  let component: PickupPointEditDialogComponent;
  let fixture: ComponentFixture<PickupPointEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PickupPointEditDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PickupPointEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
