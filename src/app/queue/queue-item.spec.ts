import {MockBackend, MockConnection} from '@angular/http/testing';
import {Http, BaseRequestOptions, Response, ResponseOptions} from '@angular/http';
import {TestBed, inject, async} from '@angular/core/testing';
import { QueueItemComponent } from './queue-item';
import { QueueService } from './queue.service';
import { IConversionItem } from '../shared/types';
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
        QueueService,
        {
          provide: Http,
          useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
    TestBed.compileComponents();
  }));

  // TODO - thumbnail data
  // TODO - progress data

  describe('QueueItemComponent rendering', () => {
    it('should render Gulp', () => {
      const fixture = TestBed.createComponent(QueueItemComponent);
      fixture.componentInstance.queueItem = {
        videoId: 'vid id',
        position: 3,
        thumbnails: { default: { url: 'thumb url' } },
        title: 'Gulp',
        description: 'The streaming build system'
      };
      fixture.componentInstance.conversionData = {
        file: 'http://fountainjs.io/assets/imgs/gulp.png',
        videoId: 'test id',
        videoTitle: 'test video title',
        title: 'test title',
        artist: 'test artist',
        length: 3
      };
      fixture.detectChanges();
      const queueItem = fixture.nativeElement;
      expect(queueItem.querySelector('h3').textContent.trim()).toBe('Gulp');
    });
  });

});
