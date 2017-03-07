import {Component} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';

export class QueueItem {
  constructor(
    // TODO - update this schema
    public logo: string,
    public title: string,
    public text1: string,
    public text2: string
  ) {}
}

@Component({
  selector: 'cheap-thrills-queue',
  template: require('./queue.html')
})
export class QueueComponent {
  public queue: QueueItem[];
  public queueItem: QueueItem;

  constructor(public http: Http) {
    this.getQueueData().subscribe(result => this.queue = result);
  }

  getQueueData(): Observable<QueueItem[]> {
    let test = this.http
      .get('app/queue/queue-model.json')
      .map(response => {
        // console.log('response:', response.json());
        return response.json();
      });
    // console.log('test:', test);
    return test;
  }
}
