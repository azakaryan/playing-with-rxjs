import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RxjsCqrsBasedCounterComponent } from './rxjs-cqrs-based-counter.component';

describe('RxjsCqrsBasedCounterComponent', () => {
  let component: RxjsCqrsBasedCounterComponent;
  let fixture: ComponentFixture<RxjsCqrsBasedCounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RxjsCqrsBasedCounterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RxjsCqrsBasedCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
