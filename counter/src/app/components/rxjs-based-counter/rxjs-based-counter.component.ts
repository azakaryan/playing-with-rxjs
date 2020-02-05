import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {fromEvent, merge, NEVER, Observable, timer} from 'rxjs';
import {map, mapTo, pluck, shareReplay, startWith, switchMap, tap} from 'rxjs/operators';

@Component({
  selector: 'app-rxjs-based-counter',
  templateUrl: './rxjs-based-counter.component.html',
  styleUrls: ['./rxjs-based-counter.component.css']
})
export class RxjsBasedCounterComponent implements OnInit, OnDestroy {
  @ViewChild('startBtn', {static: true, read: ElementRef}) startBtn: ElementRef;
  @ViewChild('stopBtn', {static: true, read: ElementRef}) stopBtn: ElementRef;
  @ViewChild('inputSetData', {static: true, read: ElementRef}) btnSetTo: ElementRef;

  private btnStart$: Observable<any>;
  private btnStop$: Observable<any>;
  private counter$: Observable<number>;
  private btnSetTo$: Observable<any>;

  private actualCount = 0;

  constructor() { }

  ngOnInit() {
    this.init();

    this.counter$ = merge(
      this.mergeStreams()
        .pipe(
          switchMap((isTicking: boolean) =>
            isTicking
              ? timer(0, 800)
              : NEVER
          ),
          tap(() => ++this.actualCount),
        ),
      this.btnSetTo$
        .pipe(
          tap(count => this.actualCount = count)
        )
    )
      .pipe(
        map(() => this.actualCount)
      );
  }

  ngOnDestroy(): void {}

  /*
  * Private Helpers
  * */
  private init(): void {
    this.btnStart$ = fromEvent(this.startBtn.nativeElement, 'click');
    this.btnStop$ = fromEvent(this.stopBtn.nativeElement, 'click');
    this.btnSetTo$ = this.getInputObservable(this.btnSetTo).pipe(startWith(0));
  }

  // Merge streams and convert to boolean
  private mergeStreams(): Observable<boolean> {
    return merge(
      this.btnStart$.pipe(mapTo(true)),
      this.btnStop$.pipe(mapTo(false)),
    );
  }

  private getInputObservable(elem: ElementRef): Observable<number> {
    return fromEvent(elem.nativeElement, 'input')
    .pipe(
      pluck('target', 'value'),
      map((v: any) => parseInt(v, 10)),
      shareReplay(1)
    );
  }
}
