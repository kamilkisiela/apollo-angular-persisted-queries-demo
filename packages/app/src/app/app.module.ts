import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createPersistedQueryLink } from 'apollo-angular-link-persisted';

import { AppComponent } from './app.component';

export function createApollo(httpLink: HttpLink) {
  const persisted = createPersistedQueryLink();
  const http = httpLink.create({
    uri: '/graphql',
  });

  return {
    cache: new InMemoryCache(),
    link: persisted.concat(http),
  };
}

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
