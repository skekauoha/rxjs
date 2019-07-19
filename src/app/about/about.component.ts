import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { interval, timer, fromEvent, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { createHttpObservable } from "../common/util";

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

    courses$.subscribe(
      courses => console.log(courses),
      () => {},
      () => console.log("complete")
    );
  }
}
