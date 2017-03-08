import {MockBackend, MockConnection} from '@angular/http/testing';
import {Http, BaseRequestOptions, Response, ResponseOptions} from '@angular/http';
import {Component, Input} from '@angular/core';
import {QueueComponent, QueueItem} from './queue';
import {TestBed, inject, async} from '@angular/core/testing';
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'cheap-thrills-queue',
  template: ''
})
class MockQueueItemComponent {
  @Input() public queueItem: QueueItem;
}

const queueJson = [
  {
    key: 'gulp',
    title: 'Gulp',
    logo: 'http://fountainjs.io/assets/imgs/gulp.png',
    text1: 'The streaming build system',
    text2: 'Automate and enhance your workflow'
  },
  {
    key: 'react',
    title: 'React',
    logo: 'http://fountainjs.io/assets/imgs/react.png',
    text1: 'A JavaScript library for building user interfaces',
    text2: 'A declarative, efficient, and flexible JavaScript library for building user interfaces'
  },
  {
    key: 'angular1',
    title: 'Angular 1',
    logo: 'http://fountainjs.io/assets/imgs/angular1.png',
    text1: 'HTML enhanced for web apps!',
    text2: 'AngularJS lets you extend HTML vocabulary for your application. The resulting environment is extraordinarily expressive, readable, and quick to develop.'
  }
];

describe('queue component', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        QueueComponent,
        MockQueueItemComponent
      ],
      providers: [
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http, useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
    TestBed.compileComponents();
  }));

  describe('queue component methods', () => {
    it('should get queue', inject([MockBackend], (mockBackend: MockBackend) => {
      const fixture = TestBed.createComponent(QueueComponent);
      const queue: QueueComponent = fixture.componentInstance;
      let conn: MockConnection;
      const response = new Response(new ResponseOptions({body: queueJson}));
      mockBackend.connections.subscribe((connection: MockConnection) => {
        conn = connection;
      });
      queue.getQueueData().subscribe(jsonObject => {
        queue.queueArray = jsonObject;
      });
      conn.mockRespond(response);
      expect(queue.queueArray.length).toBe(3);
      mockBackend.verifyNoPendingRequests();
    }));
  });

  describe('queue component rendering', () => {
    beforeEach(() => {
      QueueComponent.prototype.getQueueData = function () {
        const response = new Response(new ResponseOptions({body: queueJson})); // TODO - wtf is queueJson?
        return Observable.of(response).map(response => response.json());
      };
    });

    it('should mock the queue and render 3 elements <tech>', () => {
      const fixture = TestBed.createComponent(QueueComponent);
      fixture.detectChanges();
      const queue = fixture.nativeElement;
      expect(queue.querySelectorAll('cheap-thrills-queue').length).toBe(3);
    });
  });
});
