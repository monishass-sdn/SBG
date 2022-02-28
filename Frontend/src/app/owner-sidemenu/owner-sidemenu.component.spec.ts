import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerSidemenuComponent } from './owner-sidemenu.component';

describe('OwnerSidemenuComponent', () => {
  let component: OwnerSidemenuComponent;
  let fixture: ComponentFixture<OwnerSidemenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnerSidemenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerSidemenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
