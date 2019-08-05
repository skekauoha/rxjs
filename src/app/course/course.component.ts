import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Course } from "../model/course";
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  map,
  switchMap,
  tap
} from "rxjs/operators";
import { fromEvent, Observable, forkJoin } from "rxjs";
import { Lesson } from "../model/lesson";
import { createHttpObservable } from "../common/util";
import { Store } from "../common/store.service";
import { searchLessons } from "../../../server/search-lessons.route";
import { RxJsLoggingLevel, debug } from "../common/debug";

@Component({
  selector: "course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.css"]
})
export class CourseComponent implements OnInit, AfterViewInit {
  courseId: string;
  course$: Observable<Course>;
  lessons$: Observable<Lesson[]>;

  @ViewChild("searchInput", { static: true }) input: ElementRef;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.params["id"];
    const course$ = createHttpObservable(`/api/courses/${this.courseId}`);
    const lesson$ = this.loadLessons();

    // forkJoin, call all methods and will wait for the reponses to return in the order they were called.
    // After all responses are returned, then continue.  --> forking the streams and joining them

    forkJoin(course$, lesson$)
      .pipe(
        tap(([course, lessons]) => {
          console.log("course: ", course);
          console.log("lessons: ", lessons);
        })
      )
      .subscribe();
  }

  ngAfterViewInit() {
    this.lessons$ = fromEvent<any>(this.input.nativeElement, "keyup").pipe(
      map(event => event.target.value),
      startWith(""),
      debounceTime(400),
      distinctUntilChanged(),
      // switchMap cancels the previous observable and switches to the new observable
      switchMap(search => this.loadLessons(search))
    );

    // fromEvent<any>(this.input.nativeElement, "keyup")
    //   .pipe(
    //     map(event => event.target.value),
    //     startWith(""),
    //     // debouncing is about waiting for a value to become stable
    //     // debounceTime(400)
    //     // throttle limits the output by limiting the number of values that can be emitted in a certain interval
    //     throttle(() => interval(500)),
    //     // throttleTime works as the same above
    //     throttleTime(500)
    //   )
    //   .subscribe(console.log);
  }

  loadLessons(search = ""): Observable<Lesson[]> {
    return createHttpObservable(
      `/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`
    ).pipe(map(res => res["payload"]));
  }
}
