import {MockBackend, MockConnection} from '@angular/http/testing';
import {Http, BaseRequestOptions, Response, ResponseOptions} from '@angular/http';
import {TestBed, inject, async} from '@angular/core/testing';
import { BigButtonComponent } from './button';
// import { QueueService } from './queue.service';
// import { IConversionItem } from '../shared/types';
// import { PLAYLIST_DATA, CONVERSION_DATA } from '../shared/mock-data';

describe('button component', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BigButtonComponent
      // ],
      // providers: [
      //   MockBackend,
      //   BaseRequestOptions,
      //   QueueService,
      //   {
      //     provide: Http,
      //     useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
      //     deps: [MockBackend, BaseRequestOptions]
      //   }
      ]
    });
    TestBed.compileComponents();
  }));

  // TODO - reflect correct state

  describe('BigButtonComponent rendering', () => {
    it('should render a display element', () => {
      const fixture = TestBed.createComponent(BigButtonComponent);
      // fixture.componentInstance.queueItem = {
      //   videoId: 'vid id',
      //   position: 3,
      //   thumbnails: { default: { url: 'thumb url' } },
      //   title: 'Gulp',
      //   description: 'The streaming build system'
      // };
      // fixture.componentInstance.conversionData = {
      //   file: 'http://fountainjs.io/assets/imgs/gulp.png',
      //   videoId: 'test id',
      //   videoTitle: 'test video title',
      //   title: 'test title',
      //   artist: 'test artist',
      //   length: 3
      // };
      // fixture.detectChanges();
      const button = fixture.nativeElement;
      expect(button.querySelector('').textContent.trim()).toBe('Gulp');
    });
  });

});
