import { Component, OnInit } from "@angular/core";
import {
  of,
  concat,
  interval,
  merge,
  Subject,
  from,
  BehaviorSubject,
  AsyncSubject,
  ReplaySubject
} from "rxjs";
import { map } from "rxjs/operators";
import { createHttpObservable } from "../common/util";
import { fromPromise } from "rxjs/internal-compatibility";

@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"]
})
export class AboutComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    // const http$ = createHttpObservable("/api/courses");
    // const sub = http$.subscribe(console.log);

    // setTimeout(() => sub.unsubscribe(), 0);

    // Subject is an observer and an observable
    // BehaviorSubject can receive late subscribers values and sets a default value
    // AsyncSubject will wait for complete to be called and then emit the last value
    // ReplaySubject will replay the complete observable to late subscribers
    const subject = new ReplaySubject();

    const series$ = subject.asObservable();

    series$.subscribe(val => console.log("early sub: ", val));

    subject.next(1);
    subject.next(2);
    subject.next(3);
    // subject.complete();

    setTimeout(() => {
      series$.subscribe(val => console.log("second sub: ", val));
      subject.next(4);
    }, 3000);
  }
}
