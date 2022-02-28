import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportBoatComponent } from './report-boat.component';

describe('ReportBoatComponent', () => {
  let component: ReportBoatComponent;
  let fixture: ComponentFixture<ReportBoatComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportBoatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportBoatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
