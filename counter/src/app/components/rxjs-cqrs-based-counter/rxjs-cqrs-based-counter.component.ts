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
  withLatestFrom
} from "rxjs/operators";
import {combineLatest, fromEvent, merge, NEVER, Observable, Subject, timer} from "rxjs";

interface CounterState {
  isTicking: boolean,
  count: number,
  countUp: boolean,
  tickSpeed: number,
  countDiff: number,
}

enum ConterStateKeys {
  IsTicking = 'isTicking',
  Count = 'count',
  CountUp = 'countUp',
  TickSpeed = 'tickSpeed',
  CountDiff = 'countDiff',
}

const initialConterState: CounterState = {
  isTicking: false,
  count: 0,
  countUp: true,
  tickSpeed: 600,
  countDiff:1
};

type CounterCommand =
  { isTicking: boolean } |
  { count: number } |
  { countUp: boolean } |
  { tickSpeed: number } |
  { countDiff:number};

@Component({
  selector: 'app-rxjs-cqrs-based-counter',
  templateUrl: './rxjs-cqrs-based-counter.component.html',
  styleUrls: ['./rxjs-cqrs-based-counter.component.css']
})
export class RxjsCqrsBasedCounterComponent implements OnInit, OnDestroy {
  @ViewChild('btnStart', {static: true, read: ElementRef}) btnStart :ElementRef;
  @ViewChild('btnStop', {static: true, read: ElementRef}) btnStop :ElementRef;
  @ViewChild('btnReset', {static: true, read: ElementRef}) btnReset :ElementRef;
  @ViewChild('btnUp', {static: true, read: ElementRef}) btnUp :ElementRef;
  @ViewChild('btnDown', {static: true, read: ElementRef}) btnDown :ElementRef;
  @ViewChild('inputSetData', {static: true, read: ElementRef}) btnSetTo :ElementRef;
  @ViewChild('inputTickSpeed', {static: true, read: ElementRef}) inputTickSpeed :ElementRef;
  @ViewChild('inputCountDiff', {static: true, read: ElementRef}) inputCountDiff :ElementRef;

  /* STATE OBSERVABLES */
  private btnStart$: Observable<any>;
  private btnStop$: Observable<any>;
  private btnSetTo$: Observable<any>;
  private btnUp$: Observable<any>;
  private btnDown$: Observable<any>;
  private btnReset$: Observable<any>;
  private inputTickSpeed$: Observable<any>;
  private inputCountDiff$: Observable<any>;
  private programmaticCommandSubject: Subject<CounterCommand> = new Subject<CounterCommand>();

  public count: number;
  public tickSpeedValue: number;
  public countDiffValue: number;
  public inputSetTo: number;


  constructor() { }

  ngOnInit() {
    this.bindEvents();

    /*
    * STATE OBSERVABLES
    * */
    const counterCommands$ = this.initCounterCommands();
    const counterState$ = this.initCounterState(counterCommands$);

    /*
    * INTERMEDIATE OBSERVABLES
    * */
    const count$ = counterState$.pipe(pluck<CounterState, number>(ConterStateKeys.Count));
    const isTicking$ = counterState$.pipe(pluck(ConterStateKeys.IsTicking), distinctUntilChanged<boolean>());

    const tickSpeed$ = counterState$.pipe(pluck(ConterStateKeys.TickSpeed), distinctUntilChanged<number>());
    const countDiff$ = counterState$.pipe(pluck(ConterStateKeys.CountDiff), distinctUntilChanged<number>());

    // const counterUpdateTrigger$ = isTicking$
    //   .pipe(
    //     switchMap((isTicking: boolean) => isTicking ? timer(0, initialConterState.tickSpeed) : NEVER)
    //   );

    const counterUpdateTrigger$ = combineLatest([isTicking$, tickSpeed$])
      .pipe(
        switchMap(([isTicking, tickSpeed]) => isTicking ? timer(0, tickSpeed) : NEVER)
      );

    /*
    * UI INPUTS
    * */
    const renderCountChange$ = count$.pipe(tap(n => this.count = n));
    const renderTickSpeedChange$ = tickSpeed$.pipe(tap((value: number) => this.tickSpeedValue = value));
    const renderCountDiffChange$ = countDiff$.pipe(tap((value: number) => this.countDiffValue = value));
    const renderSetToChange$ = this.btnReset$.pipe(tap(() => this.inputSetTo = 0));

    /*
    * UI OUTPUTS
    * */
    const commandFromTick$ = counterUpdateTrigger$
      .pipe(
        withLatestFrom(counterState$, (_, counterState) => ({
          [ConterStateKeys.Count]: counterState.count,
          [ConterStateKeys.CountUp]: counterState.countUp
        })),
        tap((obj: {count: number, countUp: boolean}) => {
          const {count, countUp} = obj;
          const direction = countUp ? 1 : -1;
          return this.updateCounterStateProgrammatically({count: count + 1 * direction})
        })
      );


    /*
    * SUBSCRIPTION
    * */
    merge(
      // Input side effect
      renderCountChange$,
      renderTickSpeedChange$,
      renderCountDiffChange$,
      renderSetToChange$,
      // Outputs side effect
      commandFromTick$,
    )
    .subscribe();
  }

  ngOnDestroy(): void {
    // TOOD
  }

  /*
  * Private Helpers
  * */
  private initCounterState(counterCommands$: Observable<any>): Observable<CounterState> {
    return counterCommands$
    .pipe(
      startWith(initialConterState),
      scan( (counterState: CounterState, command): CounterState => ( {...counterState, ...command} ) ),
      shareReplay(1)
    );
  }

  private updateCounterStateProgrammatically(command: CounterCommand): void {
    this.programmaticCommandSubject.next(command)
  }

  private bindEvents(): void {
    this.btnStart$ = fromEvent(this.btnStart.nativeElement, 'click');
    this.btnStop$ = fromEvent(this.btnStop.nativeElement, 'click');
    this.btnReset$ = fromEvent(this.btnReset.nativeElement, 'click');
    this.btnUp$ = fromEvent(this.btnUp.nativeElement, 'click');
    this.btnDown$ = fromEvent(this.btnDown.nativeElement, 'click');

    this.btnSetTo$ = this.getInputObservable(this.btnSetTo).pipe(startWith(initialConterState.count));
    this.inputTickSpeed$ = this.getInputObservable(this.inputTickSpeed).pipe(startWith(initialConterState.tickSpeed));
    this.inputCountDiff$ = this.getInputObservable(this.inputCountDiff).pipe(startWith(initialConterState.countDiff));
  }

  private initCounterCommands(): Observable<any> {
    return merge(
      this.btnStart$.pipe(mapTo({isTicking: true})),
      this.btnStop$.pipe(mapTo({isTicking: false})),
      this.btnUp$.pipe(mapTo({countUp: true})),
      this.btnDown$.pipe(mapTo({countUp: false})),
      this.btnReset$.pipe(mapTo({...initialConterState})),
      this.btnSetTo$.pipe(map((value) => ({count: value}))),
      this.inputTickSpeed$.pipe(map ( (value) => ({tickSpeed: value}))),
      this.inputCountDiff$.pipe(map ( (value) => ({countDiff: value}))),
      this.programmaticCommandSubject,
    );
  }

  private getInputObservable(elem: ElementRef): Observable<number> {
    return fromEvent(elem.nativeElement, 'input')
    .pipe(
      map(v => v['target'].value),
      map(v => parseInt(v, 10)),
      shareReplay(1)
    );
  }
}
