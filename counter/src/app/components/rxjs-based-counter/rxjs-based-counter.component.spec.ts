import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RxjsBasedCounterComponent } from './rxjs-based-counter.component';

describe('RxjsBasedCounterComponent', () => {
  let component: RxjsBasedCounterComponent;
  let fixture: ComponentFixture<RxjsBasedCounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RxjsBasedCounterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RxjsBasedCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
