import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOwnerProfileComponent } from './edit-owner-profile.component';

describe('EditOwnerProfileComponent', () => {
  let component: EditOwnerProfileComponent;
  let fixture: ComponentFixture<EditOwnerProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditOwnerProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOwnerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
