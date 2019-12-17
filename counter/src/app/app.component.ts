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
  private initialValue = 0;
  private countDirection = 1;
  private tickSpeedValue = 600;
  private countDiffValue = 1;
  private initialValueIsUpdated = false;

  public onStart(): void {
    this.countSub = interval(this.tickSpeedValue).subscribe(() => this.count = this.count + this.countDirection * this.countDiffValue);
    this.isRunning = true;
  }

  public onReset(): void {
    this.countSub.unsubscribe();
    this.count = 0;
    this.isRunning = false;
    this.initialValue = 0;
  }

  public onPause(): void {
    this.countSub.unsubscribe();
    this.isRunning = false;
  }

  public customValueChanged(event: Event): void {
    this.initialValueIsUpdated = true;
    this.restart();
  }

  public setCountDirection(direction: number): void {
    this.countDirection = direction;
    this.restart();
  }

  public onTickSpeedValueChanged(): void {
    this.restart();
  }

  public onCountDiffValueChanged(): void {
    this.restart();
  }

  /*
  * Private Helpers
  * */
  private restart(): void {
    // Return if already running.
    if (!this.isRunning) return;

    // Set initial value if updated
    if (this.initialValueIsUpdated) {
      this.count = this.initialValue;
      this.initialValueIsUpdated = false;
    }

    // Stop and Start the process.
    this.onPause();
    this.onStart();
  }
}
