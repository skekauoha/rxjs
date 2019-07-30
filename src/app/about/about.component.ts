import { Component, OnInit } from "@angular/core";
import { of, concat, interval, merge } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"]
})
export class AboutComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    // const source1$ = of(1, 2, 3);

    // const source2$ = of(4, 5, 6);

    // const source3$ = of(7, 8, 9);

    // const results$ = concat(source1$, source2$, source3$);

    // results$.subscribe(console.log);

    // *** MERGE

    const interval1$ = interval(1000);
    const interval2$ = interval1$.pipe(map(val => 10 * val));

    const results$ = merge(interval1$, interval2$);

    results$.subscribe(console.log);
  }
}
