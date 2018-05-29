import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AppModule } from './app.module';

import { AppComponent } from './app.component';

const hasHash = req =>
  !!(req.body.extensions && req.body.extensions.persistedQuery);
const hasQuery = req => !!req.body.query;

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let httpBackend: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(
    inject([HttpTestingController], _httpBackend => {
      httpBackend = _httpBackend;
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpBackend.verify();
  });

  it('red', done => {
    fixture.detectChanges();
    component.ngOnInit();

    component.hello.subscribe(hello => {
      // 6. Client receives data and completes request
      expect(hello).toEqual('world');
      done();
    });

    const firstCall = () => {
      // 1. Client sends query signature with no query field
      httpBackend
        .match(req => hasHash(req) && !hasQuery(req))[0]
        // 2. Server looks up query based on hash, none is found
        // 3. Server responds with NotFound error response
        .flush({ errors: [{ message: 'PersistedQueryNotFound' }] });
    };

    const secondCall = () => {
      // 4. Client sends both hash and query string to Server
      httpBackend
        .match(req => hasHash(req) && hasQuery(req))[0]
        // 5. Server fulfills response and saves query string + hash for future lookup
        .flush({ data: { hello: 'world' } });
    };

    setTimeout(firstCall, 100);
    setTimeout(secondCall, 200);
  });

  it('green', done => {
    fixture.detectChanges();
    component.ngOnInit();

    component.hello.subscribe(hello => {
      // 3. Client receives data and completes request
      expect(hello).toEqual('world');
      done();
    });

    const firstCall = () => {
      // 1. Client sends query signature with no query field
      httpBackend
        .match(req => hasHash(req) && !hasQuery(req))[0]
        // 2. Server looks up query based on hash, if found, it resolves the data
        .flush({ data: { hello: 'world' } });
    };

    setTimeout(firstCall, 100);
  });
});
