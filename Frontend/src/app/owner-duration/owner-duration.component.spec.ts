import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerDurationComponent } from './owner-duration.component';

describe('OwnerDurationComponent', () => {
  let component: OwnerDurationComponent;
  let fixture: ComponentFixture<OwnerDurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnerDurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerDurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
