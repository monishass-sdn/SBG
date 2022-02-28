import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportOwnershipComponent } from './report-ownership.component';

describe('ReportOwnershipComponent', () => {
  let component: ReportOwnershipComponent;
  let fixture: ComponentFixture<ReportOwnershipComponent>;

  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportOwnershipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportOwnershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
