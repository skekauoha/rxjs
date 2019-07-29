import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { interval, timer, fromEvent, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { createHttpObservable } from "../common/util";
import { Course } from "../model/course";

@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"]
})
export class AboutComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    const http$ = createHttpObservable("/api/courses");
    const courses$ = http$.pipe(map(res => Object.values(res["payload"]))); // -> pipe allows you to chain multiple rx operators in order to produce a new observable
    //    -> In this case we will take the http$ observable and pipe it into the rx map operator

    // This works, but you should avoid adding too much logic in the subscribe.
    // It's not scalable and we want to avoid callbacks or nested subscribes
    // considered an imperative approach
    courses$.subscribe(
      courses => console.log(courses),
      () => {},
      () => console.log("complete")
    );
  }
}
