import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerBookingDetailsComponent } from './owner-booking-details.component';

describe('OwnerBookingDetailsComponent', () => {
  let component: OwnerBookingDetailsComponent;
  let fixture: ComponentFixture<OwnerBookingDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnerBookingDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerBookingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
