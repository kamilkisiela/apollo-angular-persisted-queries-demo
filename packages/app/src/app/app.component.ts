import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-root',
  template: `Hello {{hello | async}}!`,
})
export class AppComponent implements OnInit {
  hello: Observable<string>;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.hello = this.apollo
      .query<{ hello: string }>({
        query: gql`
          {
            hello
          }
        `,
      })
      .pipe(map(result => result.data.hello));
  }
}
