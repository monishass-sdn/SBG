import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterAdminsessionComponent } from './footer-adminsession.component';

describe('FooterAdminsessionComponent', () => {
  let component: FooterAdminsessionComponent;
  let fixture: ComponentFixture<FooterAdminsessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterAdminsessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterAdminsessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
