// import {MockBackend, MockConnection} from '@angular/http/testing';
// import {Http, BaseRequestOptions, Response, ResponseOptions} from '@angular/http';
import {Component, Input} from '@angular/core';
import {QueueComponent, IPlaylistItem} from './queue';
import {TestBed, inject, async} from '@angular/core/testing';
// import {Observable} from 'rxjs/Rx';
//
@Component({
  selector: 'cheap-thrills-queue',
  template: ''
})
class MockQueueItemComponent {
  @Input() public queueItem: IPlaylistItem;
}

const playlistJson = [
  {
    id: '0',
    position: 0,
    title: 'title 0',
    description: 'desc 0',
    thumbnails: {
      default: {
        width: 0,
        height: 0,
        url: 'url 0'
      }
    }
  },
  {
    id: '1',
    position: 1,
    title: 'title 1',
    description: 'desc 1',
    thumbnails: {
      default: {
        width: 1,
        height: 1,
        url: 'url 1'
      }
    }
  },
  {
    id: '2',
    position: 2,
    title: 'title 2',
    description: 'desc 2',
    thumbnails: {
      default: {
        width: 2,
        height: 2,
        url: 'url 2'
      }
    }
  }
];

describe('queue item component', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        QueueComponent,
        MockQueueItemComponent
      ],
      // providers: [
      //   MockBackend,
      //   BaseRequestOptions,
      //   {
      //     provide: Http, useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
      //     deps: [MockBackend, BaseRequestOptions]
      //   }
      // ]
    });
    TestBed.compileComponents();
  }));

  describe('QueueComponent methods', () => {
    // it('should convert items to request', inject([MockBackend], (mockBackend: MockBackend) => {
    //
    // }));

    // it('should get queue', inject([MockBackend], (mockBackend: MockBackend) => {
    //   const fixture = TestBed.createComponent(QueueComponent);
    //   const queue: QueueComponent = fixture.componentInstance;
    //   let conn: MockConnection;
    //   const response = new Response(new ResponseOptions({body: queueJson}));
    //   mockBackend.connections.subscribe((connection: MockConnection) => {
    //     conn = connection;
    //   });
    //   queue.getQueueData().subscribe(jsonObject => {
    //     queue.queueArray = jsonObject;
    //   });
    //   conn.mockRespond(response);
    //   expect(queue.queueArray.length).toBe(3);
    //   mockBackend.verifyNoPendingRequests();
    // }));
  });

  describe('queue component rendering', () => {
    beforeEach(() => {
      // QueueComponent.prototype.getQueueData = function () {
      //   const response = new Response(new ResponseOptions({body: queueJson})); // TODO - wtf is queueJson?
      //   return Observable.of(response).map(response => response.json());
      // };
    });

    it('should mock the queue and render 3 elements <tech>', () => {
      // const fixture = TestBed.createComponent(QueueComponent);
      // fixture.detectChanges();
      // const queue = fixture.nativeElement;
      // expect(queue.querySelectorAll('cheap-thrills-queue').length).toBe(3);
    });
  });
});
