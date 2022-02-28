import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOwnerAllBoatViewComponent } from './view-owner-all-boat-view.component';

describe('ViewOwnerAllBoatViewComponent', () => {
  let component: ViewOwnerAllBoatViewComponent;
  let fixture: ComponentFixture<ViewOwnerAllBoatViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewOwnerAllBoatViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewOwnerAllBoatViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
