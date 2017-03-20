import { MockBackend, MockConnection }                         from '@angular/http/testing';
import { Http, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { ReactiveFormsModule }                                 from '@angular/forms';
import { TestBed, inject, async }                              from '@angular/core/testing';
import { InputComponent }                                      from './input';
import { PLAYLIST_DATA }                                       from '../shared/mock-data';

describe('InputComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [
        InputComponent
      ],
      providers: [
        // some crazy setup here that i stole from template
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
    TestBed.compileComponents();
  }));

  // pointless test to test testing...
  it('should render form elem', () => {
    const fixture = TestBed.createComponent(InputComponent);
    fixture.detectChanges();
    const inputElem = fixture.nativeElement;
    expect(inputElem.querySelector('form')).toBeDefined();
  });

  // faking the request to youtube api
  it('should get playlist data', inject([MockBackend], (mockBackend: MockBackend) => {
    const fixture = TestBed.createComponent(InputComponent);
    const input: InputComponent = fixture.componentInstance;
    let conn: MockConnection;
    const response = new Response(new ResponseOptions({body: PLAYLIST_DATA}));
    mockBackend.connections.subscribe((connection: MockConnection) => {
      conn = connection;
    });
    input.getComments().subscribe(mockResponseBody => {
      input.consolidatedData = mockResponseBody;
    });
    conn.mockRespond(response);
    expect(input.consolidatedData.items.length).toBe(3);
    mockBackend.verifyNoPendingRequests();
  }));

});
