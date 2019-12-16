import {Component} from '@angular/core';
import {interval, Subscription} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public count = 0;
  private countSub: Subscription;
  private isRunning = false;
  private currentValue = 0;
  private countDirection = 1;

  public onStart(): void {
    if (this.isRunning) return;
    this.countSub = interval(800).subscribe(val => this.count = this.countDirection * val + this.currentValue);
    this.isRunning = true;
  }

  public onReset(): void {
    this.countSub.unsubscribe();
    this.count = 0;
    this.isRunning = false;
    this.currentValue = 0;
  }

  public onPause(): void {
    this.currentValue = this.count;
    this.countSub.unsubscribe();
    this.isRunning = false;
  }

  public customValueChanged(event: Event): void {
    const newValue = +event.target['value'];
    if (!this.isRunning) return;
    this.count = newValue;
    this.onPause();
    this.onStart();
  }

  public setCountDirection(direction: number): void {
    this.countDirection = direction;
    this.onPause();
    this.onStart();
  }
}
