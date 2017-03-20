import { Injectable }                    from '@angular/core';
import { Http, Response }                from '@angular/http';
import { Observable }                    from 'rxjs/Observable';
import { EmitterService }                from '../shared/service/emitter.service';
import { IPlaylistItem, IThumbnailItem } from './queue';
import { IConversionItem }               from './queue-item';


const CONVERSION_API_URL: string = 'http://www.youtubeinmp3.com/fetch/';
const YOUTUBE_URL: string = 'http://www.youtube.com/watch?v=';

@Injectable()
export class QueueService {

  private queueIndex: number = 0;
  private queueActive: boolean;

  constructor(public http: Http) {
    // TODO - move all queue API related requests to here
    // TODO - unit tests
  }

  getConversion(videoId: string): Observable<IConversionItem> {
    return this.http
      .get(CONVERSION_API_URL, {
        search: `format=JSON&video=${YOUTUBE_URL + videoId}`
      })
      .map((res: Response) => {
        return res;
      })
      .catch((error: any) => {
        return Observable.throw(error || 'Server error');
      });
  }

  /**
   * kickoff/resume queue
   */
  startQueue() {
    if(this.queueActive) {
      return;
    }
  }

  /**
   * pause queue
   */
  pauseQueue() {
    if(!this.queueActive) {
      return;
    }
  }

  /**
   * stop and reset queue
   */
  resetQueue() {
    if(!this.queueActive) {
      return;
    }
  }

}
