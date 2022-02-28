import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerHeaderComponent } from './owner-header.component';

describe('OwnerHeaderComponent', () => {
  let component: OwnerHeaderComponent;
  let fixture: ComponentFixture<OwnerHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnerHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
