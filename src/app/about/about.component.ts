import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { interval, timer, fromEvent, Observable } from "rxjs";

@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"]
})
export class AboutComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    const http$ = Observable.create(observer => {
      // -> The OBSERVER is what allows us to emit values, error out the observable, or complete the observable
      fetch("/api/courses")
        .then(response => {
          return response.json();
        })
        .then(body => {
          observer.next(body); // -> .next() emits the value
          observer.complete(); // -> now that we emitted the value, complete the observable
        })
        .catch(err => observer.error(err));
    });

    http$.subscribe(
      courses => console.log(courses),
      () => {},
      () => console.log("complete")
    );
  }
}

// observer methods
// 1. next - emit a new value for our stream
// 2. error - error out the stream
// 3. complete - end the stream

// The observer is what we use internally to implement the observable

// const http$ = Observable.create(observer => {
//   observer.complete(); // -> this function would only get called on subscribe of http$
// });

// WHY do all this work when we could've just as easily called fetch to get data?
// -> Now we can use rxjs operators to combine this stream with other streams
// such as click handlers, timeouts, or other http requests.
