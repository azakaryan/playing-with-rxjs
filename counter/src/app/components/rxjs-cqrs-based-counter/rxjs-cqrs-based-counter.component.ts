import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
  distinctUntilChanged,
  map,
  mapTo,
  pluck,
  scan,
  shareReplay,
  startWith,
  switchMap,
  tap,
  withLatestFrom} from 'rxjs/operators';
import {combineLatest, fromEvent, merge, NEVER, Observable, Subject, timer} from 'rxjs';

interface CounterState {
  isTicking: boolean;
  count: number;
  countUp: boolean;
  tickSpeed: number;
  countDiff: number;
}

const initialConterState: CounterState = {
  isTicking: false,
  count: 0,
  countUp: true,
  tickSpeed: 600,
  countDiff: 1,
};

type CounterCommand = { isTicking: boolean } | { count: number } | { countUp: boolean } | { tickSpeed: number } | { countDiff: number};

@Component({
  selector: 'app-rxjs-cqrs-based-counter',
  templateUrl: './rxjs-cqrs-based-counter.component.html',
  styleUrls: ['./rxjs-cqrs-based-counter.component.css']
})
export class RxjsCqrsBasedCounterComponent implements OnInit {
  @ViewChild('btnStart', {static: true, read: ElementRef}) btnStart: ElementRef;
  @ViewChild('btnStop', {static: true, read: ElementRef}) btnStop: ElementRef;
  @ViewChild('btnReset', {static: true, read: ElementRef}) btnReset: ElementRef;
  @ViewChild('btnUp', {static: true, read: ElementRef}) btnUp: ElementRef;
  @ViewChild('btnDown', {static: true, read: ElementRef}) btnDown: ElementRef;
  @ViewChild('inputSetData', {static: true, read: ElementRef}) btnSetTo: ElementRef;
  @ViewChild('inputTickSpeed', {static: true, read: ElementRef}) inputTickSpeed: ElementRef;
  @ViewChild('inputCountDiff', {static: true, read: ElementRef}) inputCountDiff: ElementRef;

  /* STATE OBSERVABLES */
  public count$: Observable<number>;
  public tickSpeedValue$: Observable<number>;
  public countDiffValue$: Observable<number>;
  public inputSetTo = 0;
  private btnStart$: Observable<any>;
  private btnStop$: Observable<any>;
  private btnSetTo$: Observable<any>;
  private btnUp$: Observable<any>;
  private btnDown$: Observable<any>;
  private btnReset$: Observable<any>;
  private inputTickSpeed$: Observable<any>;
  private inputCountDiff$: Observable<any>;
  private programmaticCommandSubject: Subject<CounterCommand> = new Subject<CounterCommand>();

  ngOnInit() {
    // Bind Events
    this.btnStart$ = fromEvent(this.btnStart.nativeElement, 'click');
    this.btnStop$ = fromEvent(this.btnStop.nativeElement, 'click');
    this.btnReset$ = fromEvent(this.btnReset.nativeElement, 'click');
    this.btnUp$ = fromEvent(this.btnUp.nativeElement, 'click');
    this.btnDown$ = fromEvent(this.btnDown.nativeElement, 'click');
    this.btnSetTo$ = this.getInputObservable(this.btnSetTo).pipe(startWith(initialConterState.count));
    this.inputTickSpeed$ = this.getInputObservable(this.inputTickSpeed).pipe(startWith(initialConterState.tickSpeed));
    this.inputCountDiff$ = this.getInputObservable(this.inputCountDiff).pipe(startWith(initialConterState.countDiff));

    const counterState$ = merge(
        this.btnStart$.pipe(mapTo({isTicking: true})),
        this.btnStop$.pipe(mapTo({isTicking: false})),
        this.btnUp$.pipe(mapTo({countUp: true})),
        this.btnDown$.pipe(mapTo({countUp: false})),
        this.btnReset$.pipe(mapTo({...initialConterState})),
        this.btnSetTo$.pipe(map((value) => ({count: value}))),
        this.inputTickSpeed$.pipe(map ( (value) => ({tickSpeed: value}))),
        this.inputCountDiff$.pipe(map ( (value) => ({countDiff: value}))),
        this.programmaticCommandSubject,
      )
      .pipe(
        startWith(initialConterState),
        scan( (state: CounterState, command: CounterCommand) => ({ ...state, ...command }) ),
        shareReplay(1)
      );

    this.count$ = counterState$.pipe(pluck('count'));
    this.tickSpeedValue$ = counterState$.pipe(pluck<CounterState, number>('tickSpeed'), distinctUntilChanged());
    this.countDiffValue$ = counterState$.pipe(pluck<CounterState, number>('countDiff'), distinctUntilChanged());

    merge(
      combineLatest(
        counterState$.pipe(pluck('isTicking'), distinctUntilChanged()),
        this.tickSpeedValue$,
      )
        .pipe(
          switchMap(([isTicking, tickSpeed]) => isTicking ? timer(0, tickSpeed) : NEVER),
          withLatestFrom(counterState$, (_, counterState: CounterState) => counterState),
          tap(({ count, countUp, countDiff }) => {
            const direction = countUp ? 1 : -1;
            this.programmaticCommandSubject.next({ count: count + countDiff * direction });
          })
        ),
      this.btnReset$
        .pipe(tap(() => this.inputSetTo = 0)),
    )
    .subscribe();
  }

  /*
  * Private Helpers
  * */
  private getInputObservable(elem: ElementRef): Observable<number> {
    return fromEvent(elem.nativeElement, 'input')
    .pipe(
      pluck('target', 'value'),
      map((v: any) => parseInt(v, 10)),
      shareReplay(1)
    );
  }
}
