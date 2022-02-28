import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBoatOwnerComponent } from './view-boat-owner.component';

describe('ViewBoatOwnerComponent', () => {
  let component: ViewBoatOwnerComponent;
  let fixture: ComponentFixture<ViewBoatOwnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewBoatOwnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBoatOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
