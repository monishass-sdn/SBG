import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookForOwnerComponent } from './book-for-owner.component';

describe('BookForOwnerComponent', () => {
  let component: BookForOwnerComponent;
  let fixture: ComponentFixture<BookForOwnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookForOwnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookForOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
