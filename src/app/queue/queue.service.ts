import { Injectable }      from '@angular/core';
import { Http, Response }  from '@angular/http';
import { Observable }      from 'rxjs/Observable';
import * as io from 'socket.io-client';
import { EmitterService }  from '../shared/service/emitter.service';
import {
  IPlaylistData,
  IPlaylistItem,
  IConversionItem,
  IThumbnailItem
} from '../shared/types';

// obscure API key
const PLAYLIST_API_KEY = process.env.NODE_ENV === 'dev'
? require('../../_constants').YOUTUBE_API_KEY
: 'get from env';
const PLAYLIST_URL = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet'; // & playlistId, maxResults, key
const CONVERSION_API_URL: string = 'http://www.youtubeinmp3.com/fetch/';
const YOUTUBE_URL: string = 'http://www.youtube.com/watch?v=';
const REQUEST_LIMIT: number = 1;
const REQUEST_DELAY: number = 500; // ms
const socket = io('http://localhost:3838'); // TODO - abstract this url

// emitter key shared between service and subscribers
export const CONVERSION_KEY: string = 'CONVERSION_KEY';
export const CONVERSION_QUEUE_COMPLETE: string = 'CONVERSION_QUEUE_COMPLETE';

@Injectable()
export class QueueService {

  private requestCounter: number = 0;

  constructor(public http: Http) {
    // TODO - unit tests
    this.configureSocket();
  }

  configureSocket() {
    socket.on('connect', () => {
      console.log('queue.service.ts: connect');
    });
    socket.on('disconnect', () => {
      console.log('queue.service.ts: disconnect');
    });
    socket.on('timer-event', (obj) => {
      console.log('queue.service.ts: timer handler: obj:', obj);
    });
    // // dummy emit for testing
    // setTimeout(() => {
    //   socket.emit('client-event', {
    //     data: 'fake shit'
    //   });
    // }, 2000);
  }

  // ----------------------------------------------------------------------
  //
  // youtube api request and subscribe
  //
  // ----------------------------------------------------------------------

  public consolidatedData: IPlaylistData;
  private pageToken: string;

  // handle request to Youtube Playlist API
  // - subscribe to observer for http reqs to youtube api
  // - recurse for paginated response
  // - doesn't seem to compound listeners to re-assign this subscriber
  getPlaylistData(playlistKey: string, playlistId: string, pageToken: string = undefined) {
    this.requestPlaylist(playlistId, pageToken)
    .subscribe( (result: IPlaylistData) => {
      const simplifiedVideoObjects = result.items
      .map( (item: any) => ({
        videoId: item.snippet.resourceId.videoId,
        thumbnails: item.snippet.thumbnails,
        title: item.snippet.title,
        description: item.snippet.description,
        position: item.snippet.position
      }) );

      // merge with existing to build single model from pagination
      this.consolidatedData = {
        items: !this.consolidatedData
          ? simplifiedVideoObjects
          : this.consolidatedData.items.concat(simplifiedVideoObjects),
        nextPageToken: undefined // just need this to match interface - dumb
      };

      // recurse
      if(result.nextPageToken && this.pageToken !== result.nextPageToken) {
        this.pageToken = result.nextPageToken;
        this.getPlaylistData(playlistKey, playlistId, this.pageToken);
        return;
      }

      console.log('queue.service.ts: this.consolidatedData.items:', this.consolidatedData.items);
      // emit 'model ready' type event
      EmitterService.get(playlistKey).emit(this.consolidatedData.items);
    },
    err => {
      console.log('queue.service.ts: error');
      // emit 'error' type event
      EmitterService.get(playlistKey).emit(false);
    },
    () => {
      // console.log('every time');
    } );
  }

  // Observable<Response>
  // - Response is replaced with an array of DataType;
  //   array because it's like a sequence of responses
  // - <> brackets mean List/Array contents type
  requestPlaylist(playlistId: string, pageToken: string = undefined): Observable<IPlaylistData> {
    const pagination = pageToken ? `&pageToken=${pageToken}` : '';

    return this.http
      .get(PLAYLIST_URL, {
        // arbitrary maxLength to force the need for pagination
        search: `playlistId=${playlistId}&maxLength=10&key=${PLAYLIST_API_KEY}${pagination}`
      })
      // ...and calling .json() on the response to return data
      .map((res: Response) => {
        // returns http response; headers, status, body, etc...
        // - converting to an array to match expected response type from Observable (dumb! probably not right?)
        return res.json();
        // throw Error('testing');
      })
      // ...errors if any
      // this shit throws compile time errors if you leave this catch statement out!
      .catch((error: any) => {
        return Observable.throw(error || 'Server error');
      });
  }


  // ----------------------------------------------------------------------
  //
  // conversion api request
  //
  // ----------------------------------------------------------------------

  // TODO - convert to node custom downloader service

  // getConversionData(index: number) {
  //   if(!this.consolidatedData) {
  //     // TODO - thow error
  //     return;
  //   }

  //   // TODO - implement interruption if queue is paused...
  //   // - interrupt subscription

  //   const debouncedUpdate = _.debounce(this.updateQueue, REQUEST_DELAY).bind(this);
  //   const videoId: string = this.consolidatedData.items[this.queueIndex].videoId;

  //   const videoName: string = this.consolidatedData.items[this.queueIndex].title;
  //   this.cs.getMP3(videoId, videoName,
  //     (err, data) => {
  //       console.log('queue.service.ts: getConversionData: success: err, data:', err, data);
  //       const conversionData = data;
  //       // debouncedUpdate(index, conversionData);
  //     },
  //     (err, data) => {
  //       // need to request again
  //       console.log('queue.service.ts: getConversionData: err: err, data:', err, data);
  //       // debouncedUpdate(index);
  //     }
  //   );
  // }


  // ----------------------------------------------------------------------
  //
  // TODO - deprecated - shitty api would return redirects intermittently
  //
  // ----------------------------------------------------------------------

  getConversionData(index: number) {
    if(!this.consolidatedData) {
      // TODO - thow error
      return;
    }

    // TODO - implement interruption if queue is paused...
    // - interrupt subscription

    const videoId: string = this.consolidatedData.items[this.queueIndex].videoId;
    this.requestConversion(videoId).subscribe(
      (response: IConversionItem) => {
        const conversionData = response;
        this.updateQueue(index, conversionData);
      },
      err => {
        // need to request again
        console.log('queue.service: getConversionData: err:', err);
        this.updateQueue(index);
      }
    );
  }

  requestConversion(videoId: string): Observable<IConversionItem> {
    return this.http
      .get(CONVERSION_API_URL, {
        search: `format=JSON&video=${YOUTUBE_URL + videoId}`
      })
      .map((res: Response) => {
        return res.json();
      })
      .catch((error: any) => {
        return Observable.throw(error || 'Server error');
      });
  }


  // ----------------------------------------------------------------------
  //
  // queue execution/management
  //
  // ----------------------------------------------------------------------

  private queueIndex: number = 0;
  private queueActive: boolean;

  /**
   * kickoff/resume queue
   * @description
   * need this synchronous queue cuz rapid requests sometimes
   * bounce back a refresh header with no content
   */
  startQueue(index: number = 0) {
    if(this.queueActive
      && this.consolidatedData
      && this.consolidatedData.items.length > 0
      && this.queueIndex >= this.consolidatedData.items.length - 1
     ) {
      // dispatch queue completion event
      EmitterService.get('QUEUE_CONVERSION_COMPLETE').emit('Queue conversion complete!');
      this.resetQueue();
      return;
    }

    this.queueActive = true;
    this.getConversionData(index);
  }

  /**
   * update queue
   */
  updateQueue(index: number, conversionData: IConversionItem = undefined) {
    if(!this.queueActive) {
      return;
    }

    // retry if conversionData is undefined
    if(conversionData) {
      // emitter key is bound to queue-item instance/index
      this.queueIndex++;
      EmitterService.get(`${CONVERSION_KEY}_${index}`).emit(conversionData);
    } else {
      if(this.requestCounter < REQUEST_LIMIT) {
        this.requestCounter++;
        this.getConversionData(this.queueIndex);
        return;
      } else {
        this.requestCounter = 0;
        this.queueIndex++;

        // emit error
        EmitterService.get(`${CONVERSION_KEY}_${index}`).emit(new Error('This video fails to convert.'));
      }
    }

    if(this.queueIndex >= this.consolidatedData.items.length) {
      EmitterService.get(CONVERSION_QUEUE_COMPLETE).emit('All playlist items converted.');
      this.resetQueue();
      return;
    }

    this.getConversionData(this.queueIndex);
  }

  /**
   * pause queue
   */
  pauseQueue() {
    if(!this.queueActive) {
      return;
    }

    this.queueActive = false;
  }

  /**
   * stop and reset queue
   */
  resetQueue() {
    if(!this.queueActive) {
      return;
    }

    this.queueActive = false;
    this.queueIndex = 0;
  }

}
