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
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll,
  shareReplay,
  throttle,
  throttleTime
} from "rxjs/operators";
import { merge, fromEvent, Observable, concat, interval } from "rxjs";
import { Lesson } from "../model/lesson";
import { createHttpObservable } from "../common/util";
import { Store } from "../common/store.service";
import { searchLessons } from "../../../server/search-lessons.route";

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
    this.course$ = createHttpObservable(`/api/courses/${this.courseId}`);
  }

  ngAfterViewInit() {
    // this.lessons$ = fromEvent<any>(this.input.nativeElement, "keyup").pipe(
    //   map(event => event.target.value),
    //   startWith(""),
    //   debounceTime(400),
    //   distinctUntilChanged(),
    //   // switchMap cancels the previous observable and switches to the new observable
    //   switchMap(search => this.loadLessons(search))
    // );

    fromEvent<any>(this.input.nativeElement, "keyup")
      .pipe(
        map(event => event.target.value),
        startWith(""),
        // debouncing is about waiting for a value to become stable
        // debounceTime(400)
        // throttle limits the output by limiting the number of values that can be emitted in a certain interval
        throttle(() => interval(500)),
        // throttleTime works as the same above
        throttleTime(500)
      )
      .subscribe(console.log);
  }

  loadLessons(search = ""): Observable<Lesson[]> {
    return createHttpObservable(
      `/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`
    ).pipe(map(res => res["payload"]));
  }
}
