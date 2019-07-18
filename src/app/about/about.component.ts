import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { interval, timer, fromEvent } from "rxjs";

@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"]
})
export class AboutComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    // Callback Hell -> Why we use observables and the rxjs library to avoid the snippet below
    // document.addEventListener("click", evt => {
    //   console.log(evt);

    //   setTimeout(() => {
    //     console.log("finished...");
    //   }, 3000);

    //   let counter = 0;

    //   setInterval(() => {
    //     console.log(counter);
    //     counter++;
    //   }, 1000);
    // });

    // ** interval **
    // param1: interval time when value is emitted
    // interval(1000) -> emit value every 1 second
    const interval$ = interval(1000); // -> Observable<number> // Definition of a stream, not an instance
    const sub = interval$.subscribe(val => console.log("stream 1: ", +val)); // -> Saving subscription of interval$ to a const

    setTimeout(() => sub.unsubscribe(), 5000); // -> After 5 seconds unsubscribe from sub which is the subscribed observable stream instance of interval$

    // interval$.subscribe(val => console.log("stream 1: " + val)); // -> subscribing creates Observable stream instance
    // interval$.subscribe(val => console.log("stream 2: " + val)); // -> subscribing creates Observable stream instance

    // ** timer **
    // param1: initial delay that we will before starting
    // param2: interval time that emits
    // timer(3000, 1000) -> start after 3 seconds and emit every 1 second
    const timer$ = timer(3000, 1000); // -> Observable<number> // Definition of a stream, not an instance

    // timer$.subscribe(val => console.log("timer 1: ", val)); // -> subscribing creates Observable stream instance

    // ** fromEvent **
    // param1: source of the event
    // param2: event that we are subscribing to
    // fromEvent(document, 'click) -> clicking on any part of the document returns the definition of a stream
    const click$ = fromEvent(document, "click"); // -> Observable<Event> // Definition of a stream, not an instance

    click$.subscribe(
      evt => console.log(evt), // value being emitted
      err => console.log(err), // err object if err occurred
      () => console.log("completed") // callback to call once observable is completed
    ); // -> subscribing creates Observable stream instance
  }
}
