import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCleaningScheduleComponent } from './report-cleaning-schedule.component';

describe('ReportCleaningScheduleComponent', () => {
  let component: ReportCleaningScheduleComponent;
  let fixture: ComponentFixture<ReportCleaningScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportCleaningScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportCleaningScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
