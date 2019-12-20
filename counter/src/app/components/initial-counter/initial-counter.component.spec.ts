import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialCounterComponent } from './initial-counter.component';

describe('InitialCounterComponent', () => {
  let component: InitialCounterComponent;
  let fixture: ComponentFixture<InitialCounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitialCounterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
