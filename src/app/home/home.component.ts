import { Component, OnInit } from "@angular/core";
import { Course } from "../model/course";
import { interval, noop, Observable, of, throwError, timer } from "rxjs";
import {
  map,
  filter,
  shareReplay,
  tap,
  catchError,
  finalize,
  retryWhen,
  delayWhen
} from "rxjs/operators";
import { createHttpObservable } from "../common/util";
import { Store } from "../common/store.service";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  beginnerCourses$: Observable<Course[]>;

  advancedCourses$: Observable<Course[]>;

  constructor(private store: Store) {}

  ngOnInit() {
    const http$ = createHttpObservable("/api/courses");
    const courses$: Observable<Course[]> = http$.pipe(
      // catchError can be applied multiple times if there are multiple areas where an observable may fail
      // catchError(err => {
      //   console.log("Error occurred", err);
      //   return throwError(err);
      // }),
      // finalize(() => console.log("Finalize executed")),
      map(res => Object.values(res["payload"])),
      // shareReplay will pass on the values from the http request rather than making a request for each subscriber and creating a new stream
      shareReplay(),
      // if can error occurs, we can use retryWhen to retry the stream
      // retryWhen must return an observable so let's return the error observable
      retryWhen(errors =>
        errors.pipe(
          // delay the retry for 2 seconds
          delayWhen(() => timer(2000))
        )
      )
    );

    // With shareReplay, this.beginnerCourses$ and this.advancedCourses$ will share the http request
    // They will not make new requests
    this.beginnerCourses$ = courses$.pipe(
      map(courses => courses.filter(course => course.category == "BEGINNER"))
    );

    this.advancedCourses$ = courses$.pipe(
      map(courses => courses.filter(course => course.category == "ADVANCED"))
    );
  }
}
