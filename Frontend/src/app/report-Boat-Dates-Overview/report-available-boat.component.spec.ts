import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportAvailableBoatComponent } from './report-available-boat.component';

describe('ReportAvailableBoatComponent', () => {
  let component: ReportAvailableBoatComponent;
  let fixture: ComponentFixture<ReportAvailableBoatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportAvailableBoatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportAvailableBoatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
