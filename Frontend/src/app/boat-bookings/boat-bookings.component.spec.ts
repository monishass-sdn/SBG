import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoatBookingsComponent } from './boat-bookings.component';

describe('BoatBookingsComponent', () => {
  let component: BoatBookingsComponent;
  let fixture: ComponentFixture<BoatBookingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoatBookingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoatBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
