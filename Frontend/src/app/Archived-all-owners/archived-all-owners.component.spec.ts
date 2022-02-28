import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { archivedAllOwnersComponent } from './archived-all-owners.component';

describe('archivedAllOwnersComponent', () => {
  let component: archivedAllOwnersComponent;
  let fixture: ComponentFixture<archivedAllOwnersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ archivedAllOwnersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(archivedAllOwnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
