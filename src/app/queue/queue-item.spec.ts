import {MockBackend, MockConnection} from '@angular/http/testing';
import {Http, BaseRequestOptions, Response, ResponseOptions} from '@angular/http';
import {TestBed, inject, async} from '@angular/core/testing';
import { QueueItemComponent, IConversionItem } from './queue-item';
import { PLAYLIST_DATA, CONVERSION_DATA } from '../shared/mock-data';

describe('queue item component', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        QueueItemComponent
      ],
      providers: [
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

  // describe('QueueItemComponent methods', () => {

    // it('should get conversion item', inject([MockBackend], (mockBackend: MockBackend) => {
    //   const fixture = TestBed.createComponent(QueueItemComponent);
    //   const queueItem: QueueItemComponent = fixture.componentInstance;
    //   const response = new Response(new ResponseOptions({ body: CONVERSION_DATA }));
    //   let conn: MockConnection;
    //   mockBackend.connections.subscribe((connection: MockConnection) => {
    //     conn = connection;
    //   });
    //
    //   // populate fake model req'd for api call
    //   queueItem.queueItem = PLAYLIST_DATA.items[0];
    //
    //   // hit mock conversion api
    //   queueItem.getConversion().subscribe(
    //     (mockResponseBody: IConversionItem) => {
    //       queueItem.conversionData = mockResponseBody;
    //     }
    //   );
    //   conn.mockRespond(response);
    //
    //   // verify conversion data format?
    //   expect(queueItem.conversionData.link).toBe('link');
    //   mockBackend.verifyNoPendingRequests();
    // }));

  // });

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
