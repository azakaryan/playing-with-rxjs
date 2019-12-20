import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {map, mapTo, scan, shareReplay, startWith } from "rxjs/operators";
import {fromEvent, merge, Observable } from "rxjs";

interface CounterState {
  isTicking: boolean,
  count: number,
  countUp: boolean,
  tickSpeed: number,
  countDiff: number,
}

const initialConterState: CounterState = {
  isTicking: false,
  count: 0,
  countUp: true,
  tickSpeed: 600,
  countDiff:1
};

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

  private counterCommands$: Observable<any>;
  private counterState$: Observable<CounterState>;

  constructor() { }

  ngOnInit() {
    this.bindEvents();
    this.init();

    this.counterState$ = this.counterCommands$
    .pipe(
      startWith(initialConterState),
      scan( (counterState: CounterState, command): CounterState => ( {...counterState, ...command} ) ),
      shareReplay(1)
    );

    this.counterState$
      .subscribe(console.log);
  }

  ngOnDestroy(): void {
    // TOOD
  }

  /*
  * Private Helpers
  * */
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

  private init(): void {
    this.counterCommands$ = merge(
      this.btnStart$.pipe(mapTo({isTicking: true})),
      this.btnStop$.pipe(mapTo({isTicking: false})),
      this.btnUp$.pipe(mapTo({countUp: true})),
      this.btnDown$.pipe(mapTo({countUp: false})),
      this.btnReset$.pipe(mapTo({...initialConterState})),
      this.btnSetTo$.pipe(map((value) => ({count: value}))),
      this.inputTickSpeed$.pipe(map ( (value) => ({tickSpeed: value}))),
      this.inputCountDiff$.pipe(map ( (value) => ({countDiff: value})))
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
