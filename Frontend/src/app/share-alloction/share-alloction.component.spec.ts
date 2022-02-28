import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareAlloctionComponent } from './share-alloction.component';

describe('ShareAlloctionComponent', () => {
  let component: ShareAlloctionComponent;
  let fixture: ComponentFixture<ShareAlloctionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareAlloctionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareAlloctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
