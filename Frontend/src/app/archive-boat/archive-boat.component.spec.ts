import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveBoatComponent } from './archive-boat.component';

describe('ArchiveBoatComponent', () => {
  let component: ArchiveBoatComponent;
  let fixture: ComponentFixture<ArchiveBoatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchiveBoatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiveBoatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
