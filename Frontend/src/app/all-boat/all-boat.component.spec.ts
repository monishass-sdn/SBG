import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllBoatComponent } from './all-boat.component';

describe('AllBoatComponent', () => {
  let component: AllBoatComponent;
  let fixture: ComponentFixture<AllBoatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllBoatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllBoatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
