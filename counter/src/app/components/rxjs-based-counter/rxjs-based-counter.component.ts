import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {fromEvent, merge, NEVER, Observable, Subscription, timer} from "rxjs";
import {mapTo, switchMap} from "rxjs/operators";

@Component({
  selector: 'app-rxjs-based-counter',
  templateUrl: './rxjs-based-counter.component.html',
  styleUrls: ['./rxjs-based-counter.component.css']
})
export class RxjsBasedCounterComponent implements OnInit, OnDestroy {
  @ViewChild('startBtn', {static: true, read: ElementRef}) startBtn :ElementRef;
  @ViewChild('stopBtn', {static: true, read: ElementRef}) stopBtn :ElementRef;
  public counter: number = 0;
  private tickSpeed = 800;
  private btnStart$: Observable<any>;
  private btnStop$: Observable<any>;
  private counter$: Observable<number>;
  private counterSubscription: Subscription;

  constructor() { }

  ngOnInit() {
    this.init();

    this.counter$ = this.mergeStreams()
      .pipe(
        switchMap((isTicking: boolean) =>
          isTicking
            ? timer(0, this.tickSpeed)
            : NEVER)
      );

    this.counterSubscription = this.counter$
      .subscribe(
        (value: number) => this.counter = value
      );
  }

  ngOnDestroy(): void {
    this.counterSubscription.unsubscribe();
  }

  /*
  * Private Helpers
  * */
  private init(): void {
    this.btnStart$ = fromEvent(this.startBtn.nativeElement, 'click');
    this.btnStop$ = fromEvent(this.stopBtn.nativeElement, 'click');
  }

  // Merge streams and convert to boolean
  private mergeStreams(): Observable<boolean> {
    return merge(
      this.btnStart$.pipe(mapTo(true)),
      this.btnStop$.pipe(mapTo(false)),
    )
  }
}
