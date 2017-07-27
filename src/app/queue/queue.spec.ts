import {Component, EventEmitter, Input} from '@angular/core';
import { Http } from '@angular/http';
import {TestBed, async} from '@angular/core/testing';
// import {Observable} from 'rxjs/Rx';
import { QueueComponent } from './queue';
import { QueueService } from './queue.service';
import { PLAYLIST_DATA } from '../shared/mock-data';
import { IPlaylistItem } from '../shared/types';

@Component({
  selector: 'cheapthrills-queue-item',
  template: ''
})
class MockQueueItemComponent {
  @Input() public queueItem: IPlaylistItem;
  public queueArray: IPlaylistItem[];
}

const MockEmitter = new EventEmitter();

describe('QueueComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        QueueComponent,
        Http,
        MockQueueItemComponent
      ],
      providers: [
        QueueService
      ]
    });
    TestBed.compileComponents();
  }));

  // describe('QueueComponent methods', () => {
  // });

  // describe('QueueComponent rendering', () => {
  //   beforeEach(() => {
  //     // *interesting pattern for returning an Observable

  //     // QueueComponent.prototype.getQueueData = function () {
  //     //   const response = new Response(new ResponseOptions({body: queueJson}));
  //     //   return Observable.of(response).map(response => response.json());
  //     // };

  //     // const fixture = TestBed.createComponent(QueueComponent);
  //     //
  //     // // spoof EmitterService
  //     // const queue = fixture.componentInstance;
  //     // MockEmitter.subscribe( () => {
  //     //   queue.queueArray = PLAYLIST_DATA.items;
  //     // });
  //   });

  //   it('should mock the queue and render 3 elements', () => {
  //     const fixture = TestBed.createComponent(QueueComponent);

  //     // spoof EmitterService
  //     const queueInstance = fixture.componentInstance;
  //     queueInstance.queueArray = PLAYLIST_DATA.items;

  //     // TODO - hook up this emitter properly
  //     // MockEmitter.emit();

  //     fixture.detectChanges();
  //     const queue = fixture.nativeElement;
  //     expect(queue.querySelectorAll('cheapthrills-queue-item').length).toBe(3);
  //   });
  // });

});
