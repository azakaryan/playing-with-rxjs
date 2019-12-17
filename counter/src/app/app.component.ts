import {Component} from '@angular/core';

enum CountDirection {
  'Inc' = 1,
  'Dec' = -1,
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public count = 0;
  public initialValue = 0;
  public tickSpeedValue = 600;
  public countDiffValue = 1;
  public CountDirection = CountDirection;
  public countDirection: CountDirection = CountDirection.Inc;
  public isRunning = false;
  private initialValueIsUpdated = false;
  private interval: number;

  public onStart(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.interval = setInterval(() => this.count = this.count + this.countDirection * this.countDiffValue, this.tickSpeedValue);
  }

  public onReset(): void {
    this.isRunning = false;
    this.count = 0;
    this.initialValue = 0;
    clearInterval(this.interval);
  }

  public onPause(): void {
    this.isRunning = false;
    clearInterval(this.interval);
  }

  public customValueChanged(): void {
    this.initialValueIsUpdated = true;
    this.restart();
  }

  public setCountDirection(direction: CountDirection): void {
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
    // Return if not running.
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
