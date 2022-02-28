import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonDurationComponent } from './season-duration.component';

describe('SeasonDurationComponent', () => {
  let component: SeasonDurationComponent;
  let fixture: ComponentFixture<SeasonDurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeasonDurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeasonDurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
