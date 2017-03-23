import { MockBackend, MockConnection }    from '@angular/http/testing';
import {
  Http,
  BaseRequestOptions,
  Response,
  ResponseOptions
}                                         from '@angular/http';
import {TestBed, inject, async}           from '@angular/core/testing';
import { QueueService }                   from './queue.service';
import { QueueItemComponent }             from './queue-item';
import { IConversionItem }                from '../shared/types';
import { PLAYLIST_DATA, CONVERSION_DATA } from '../shared/mock-data';


describe('queue service', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        QueueItemComponent
      ],
      providers: [
        QueueService,
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

  describe('QueueService methods', () => {

    // faking the request to youtube api
    it('should get playlist data', inject([Http, MockBackend], (http: Http, mockBackend: MockBackend) => {
      let conn: MockConnection;
      const response = new Response(new ResponseOptions({body: PLAYLIST_DATA}));
      mockBackend.connections.subscribe((connection: MockConnection) => {
        conn = connection;
      });
      const qs = new QueueService(http);

      let responseBody: any;
      qs.requestPlaylist('playlistKey', 'playlistId')
      .subscribe( mockResponseBody => {
        responseBody = mockResponseBody;
      });

      conn.mockRespond(response);
      expect(responseBody.items.length).toBe(3)  ;
      mockBackend.verifyNoPendingRequests();
    }));

    // it('should get conversion item', inject([MockBackend], (mockBackend: MockBackend) => {
    //   const fixture = TestBed.createComponent(QueueItemComponent);
    //   const queueItem: QueueItemComponent = fixture.componentInstance;
    //   const response = new Response(new ResponseOptions({ body: CONVERSION_DATA }));
    //   let conn: MockConnection;
    //   mockBackend.connections.subscribe((connection: MockConnection) => {
    //     conn = connection;
    //   });

    //   // populate fake model req'd for api call
    //   queueItem.queueItem = PLAYLIST_DATA.items[0];

    //   // hit mock conversion api
    //   queueItem.getConversion().subscribe(
    //     (mockResponseBody: IConversionItem) => {
    //       queueItem.conversionData = mockResponseBody;
    //     }
    //   );
    //   conn.mockRespond(response);

    //   // verify conversion data format?
    //   expect(queueItem.conversionData.link).toBe('link');
    //   mockBackend.verifyNoPendingRequests();
    // }));

  });

  // TODO - thumbnail data
  // TODO - progress data

  // describe('QueueItemComponent rendering', () => {
  //   it('should render Gulp', () => {
  //     const fixture = TestBed.createComponent(QueueItemComponent);
  //     fixture.componentInstance.queueItem = {
  //       title: 'Gulp',
  //       logo: 'http://fountainjs.io/assets/imgs/gulp.png',
  //       text1: 'The streaming build system',
  //       text2: 'Automate and enhance your workflow'
  //     };
  //     fixture.detectChanges();
  //     const queueItem = fixture.nativeElement;
  //     expect(queueItem.querySelector('h3').textContent.trim()).toBe('Gulp');
  //   });
  // });

});
