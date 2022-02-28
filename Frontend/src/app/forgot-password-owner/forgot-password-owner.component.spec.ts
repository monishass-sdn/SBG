import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordOwnerComponent } from './forgot-password-owner.component';

describe('ForgotPasswordOwnerComponent', () => {
  let component: ForgotPasswordOwnerComponent;
  let fixture: ComponentFixture<ForgotPasswordOwnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotPasswordOwnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
