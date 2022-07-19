import { HttpClient } from '@angular/common/http';
import { Component, OnInit, VERSION } from '@angular/core';
import { EMPTY } from 'rxjs';
import { concatMap, expand, map, reduce, tap } from 'rxjs/operators';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  name = 'Angular ' + VERSION.major;

  uri: string = 'https://swapi.dev/api/people';
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    console.log('CAlled');
    this.getAllPages(this.uri).subscribe((res) => {
      console.log(res);
    });
  }

  getAllPages(uri) {
    return this.getSinglePage(uri).pipe(
      expand(({ next }) => (next ? this.getSinglePage(next) : EMPTY)),
      reduce((a, content) => [...a, ...content.content], [])
    );
  }

  getSinglePage(uri) {
    return this.http.get(uri).pipe(
      tap((res) => console.log(1111, res)),
      map((res: any) => ({
        content: res.results,
        next: res.next,
      }))
    );
  }
}
