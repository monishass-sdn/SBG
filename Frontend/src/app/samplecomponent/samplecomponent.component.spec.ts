import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SamplecomponentComponent } from './samplecomponent.component';

describe('SamplecomponentComponent', () => {
  let component: SamplecomponentComponent;
  let fixture: ComponentFixture<SamplecomponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SamplecomponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamplecomponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
