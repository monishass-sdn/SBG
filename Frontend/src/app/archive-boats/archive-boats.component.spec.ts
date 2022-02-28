import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveBoatsComponent } from './archive-boats.component';

describe('ArchiveBoatsComponent', () => {
  let component: ArchiveBoatsComponent;
  let fixture: ComponentFixture<ArchiveBoatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchiveBoatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiveBoatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
