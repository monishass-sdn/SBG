import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAdminBoatComponent } from './view-adminboat.component';

describe('ViewAdminBoatComponent', () => {
  let component: ViewAdminBoatComponent;
  let fixture: ComponentFixture<ViewAdminBoatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAdminBoatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAdminBoatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
