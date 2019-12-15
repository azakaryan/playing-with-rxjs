import { Component } from '@angular/core';
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

  public onStart(): void {
    if (this.isRunning) return;
    this.countSub = interval(800).subscribe(val => this.count = val);
    this.isRunning = true;
  }

  public onReset(): void {
    this.countSub.unsubscribe();
    this.count = 0;
    this.isRunning = false;
  }
}
