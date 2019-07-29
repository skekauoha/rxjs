import { Component, OnInit } from "@angular/core";
import { Course } from "../model/course";
import { interval, noop, Observable, of, throwError, timer } from "rxjs";
import {
  catchError,
  delay,
  delayWhen,
  finalize,
  map,
  retryWhen,
  shareReplay,
  tap
} from "rxjs/operators";
import { createHttpObservable } from "../common/util";
import { Store } from "../common/store.service";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  beginnerCourses: Course[];

  advancedCourses: Course[];

  constructor(private store: Store) {}

  ngOnInit() {
    const http$ = createHttpObservable("/api/courses");
    const courses$ = http$.pipe(map(res => Object.values(res["payload"]))); // -> pipe allows you to chain multiple rx operators in order to produce a new observable
    //    -> In this case we will take the http$ observable and pipe it into the rx map operator

    courses$.subscribe(
      courses => {
        this.beginnerCourses = courses.filter(
          course => course.category == "BEGINNER"
        );
        this.advancedCourses = courses.filter(
          course => course.category == "ADVANCED"
        );
      },
      () => {},
      () => console.log("complete")
    );
  }
}

// export class AboutComponent implements OnInit {
//   beginnersCourses: Course[];

//   constructor() {}

//   ngOnInit() {
//     const http$ = createHttpObservable("/api/courses");
//     const courses$ = http$.pipe(map(res => Object.values(res["payload"]))); // -> pipe allows you to chain multiple rx operators in order to produce a new observable
//     //    -> In this case we will take the http$ observable and pipe it into the rx map operator

//     // This works, but you should avoid adding too much logic in the subscribe.
//     // It's not scalable and we want to avoid callbacks or nested subscribes
//     // considered an imperative approach
//     courses$.subscribe(
//       courses => {
//         this.beginnersCourses = courses.filter(
//           course => course.category == "BEGINNER"
//         );
//         this.beginnersCourses = courses.filter(
//           course => course.category == "ADVANCED"
//         );
//       },
//       () => {},
//       () => console.log("complete")
//     );
//   }
// }
