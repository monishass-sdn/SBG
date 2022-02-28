import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordOwnerComponent } from './reset-password-owner.component';

describe('ResetPasswordOwnerComponent', () => {
  let component: ResetPasswordOwnerComponent;
  let fixture: ComponentFixture<ResetPasswordOwnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetPasswordOwnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
