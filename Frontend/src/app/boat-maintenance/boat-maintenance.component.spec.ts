import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoatMaintenanceComponent } from './boat-maintenance.component';

describe('BoatMaintenanceComponent', () => {
  let component: BoatMaintenanceComponent;
  let fixture: ComponentFixture<BoatMaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoatMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoatMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
