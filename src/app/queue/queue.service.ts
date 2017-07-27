import * as io            from 'socket.io-client';
import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import { EmitterService } from '../shared/service/emitter.service';
import {
  IPlaylistData,
  IPlaylistItem,
  IConversionItem,
  IThumbnailItem,
  IArchiveItem,
  IConversionRequestParam
}                         from '../shared/types';

// obscure API key
const _DEV_ = process.env.NODE_ENV === 'dev';

// TODO - define env vars for api key and prod endpoint

const PLAYLIST_API_KEY = _DEV_
? require('../../_constants').YOUTUBE_API_KEY // tslint:disable-line:no-var-requires
: 'get from env';
const CONVERSION_API_URL: string = _DEV_
? 'http://www.localhost'
: 'add prod endpoint';
const PORT_API: number = 3800;
const PORT_SOCKET: number = 3838;
const PLAYLIST_URL = 'https://www.googleapis.com/youtube/v3/';
const YOUTUBE_URL: string = 'http://www.youtube.com/watch?v=';

// socket.io emitter keys - shared between conversion service and client subscribers
const CONVERSION_PROGRESS: string = 'CONVERSION_PROGRESS';

// socket.io instance
const socketToken: string = Math.random().toString(36).substring(7); // 'unique' token
const socket = io(`${CONVERSION_API_URL}:${PORT_SOCKET}?token=${socketToken}`);

// client side emitter keys - dispatched w/in client scope
export const QUEUE_ITEM_ERROR: string = 'QUEUE_ITEM_ERROR';
export const QUEUE_ITEM_INITIATE_CONVERSION: string = 'QUEUE_ITEM_INITIATE_CONVERSION';
export const QUEUE_ITEM_PROGRESS: string = 'QUEUE_ITEM_PROGRESS';
export const QUEUE_ITEM_COMPLETE: string = 'QUEUE_ITEM_COMPLETE';
export const QUEUE_ITEM_CANCEL: string = 'QUEUE_ITEM_CANCEL';
export const QUEUE_ERROR: string = 'QUEUE_ERROR';
export const QUEUE_COMPLETE: string = 'QUEUE_COMPLETE';


@Injectable()
export class QueueService {

  public videoKeys: any[] = []; // bind videoId to queue index

  constructor(public http: Http) {
    this.configureSocket();
  }

  configureSocket() {
    socket.on('connect', () => {
      console.log('queue.service.ts: connect');
    });
    socket.on('disconnect', () => {
      console.log('queue.service.ts: disconnect');
    });
    socket.on(CONVERSION_PROGRESS, obj => {
      // delegate progress socket event
      const ind = this.videoKeys.indexOf(obj.videoId);
      if(ind > -1) {
        // console.log('queue.service.ts: obj:', obj);
        EmitterService.get(QUEUE_ITEM_PROGRESS)
        .emit({
          obj,
          ind});
      } else {
        console.log('queue.service.ts: socket index error: obj, ind:', obj, ind);
        EmitterService.get(QUEUE_ITEM_ERROR)
        .emit({
          obj: obj,
          msg: 'This videoId is not indexed'
        });
      }
    });
  }


  // ----------------------------------------------------------------------
  //
  // youtube api request and subscribe
  //
  // ----------------------------------------------------------------------

  public consolidatedData: IPlaylistData;
  private sessionId: string; // playlist id & title for indexing
  private pageToken: string; // playlist api page token
  private conversionRequest; // rxjs Subscription - not exported from lib

  // just getting the human readable playlist name
  getPlaylistTitle(playlistKey: string, playlistId: string) {
    const request = this.http.get(PLAYLIST_URL + 'playlists?part=snippet', {
      search: `id=${playlistId}&key=${PLAYLIST_API_KEY}`
    })
    .do((res: Response) => res)
    .catch((error: any, caught: Observable<Response>) => caught)
    .subscribe(res => {
      request.unsubscribe();
      const results = res.json().pageInfo.totalResults;
      if(results === 0) {
        // TODO - how to emit an error correctly
        EmitterService.get(playlistKey).emit(new Error('This playlist was not found: ' + playlistId));
        return;
      }
      const playlistTitle = res.json().items[0].snippet.localized.title;
      this.getPlaylistData(playlistKey, playlistId, playlistTitle);
    },
    err => {
      request.unsubscribe();
      EmitterService.get(playlistKey).emit(err);
    });
  }

  // handle request to Youtube Playlist API
  // - subscribe to observer for http reqs to youtube api
  // - recurse for paginated response
  // - doesn't seem to compound listeners to re-assign this subscriber
  getPlaylistData(playlistKey: string, playlistId: string, playlistTitle: string, pageToken: string = undefined) {
    const request = this.requestPlaylistItems(playlistId, pageToken)
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
        playlistId: playlistId,
        playlistTitle: playlistTitle,
        items: !this.consolidatedData
          ? simplifiedVideoObjects
          : this.consolidatedData.items.concat(simplifiedVideoObjects)
      };

      // unbind observable
      request.unsubscribe();

      // recurse
      if(result.nextPageToken && this.pageToken !== result.nextPageToken) {
        this.pageToken = result.nextPageToken;
        this.getPlaylistData(playlistKey, playlistId, playlistTitle, this.pageToken);
        return;
      }

      // emit 'model ready' type event
      EmitterService.get(playlistKey).emit(this.consolidatedData.items);
    },
    err => {
      console.log('queue.service.ts: error');
      request.unsubscribe();
      EmitterService.get(playlistKey).emit(new Error(err));
    });
  }

  // Observable<Response>
  // - Response is replaced with an array of DataType;
  //   array because it's like a sequence of responses
  // - <> brackets mean List/Array contents type
  requestPlaylistItems(playlistId: string, pageToken: string = undefined): Observable<IPlaylistData> {
    const pagination = pageToken ? `&pageToken=${pageToken}` : '';

    return this.http
      .get(PLAYLIST_URL + 'playlistItems?part=snippet', {
        // arbitrary maxLength to force the need for pagination
        search: `playlistId=${playlistId}&maxLength=10&key=${PLAYLIST_API_KEY}${pagination}`
      })
      // ...and calling .json() on the response to return data
      .map((res: Response) => {
        // returns http response; headers, status, body, etc...
        return res.json();
      })
      // ...errors if any
      // this shit throws compile time errors if you leave this catch statement out!
      .catch((error: any) => {
        return Observable.throw(error || 'Server error');
      });
  }

  updateOptions(optionsArray: any[]) {
    if(!this.consolidatedData) {
      return;
    }

    this.consolidatedData.items = this.consolidatedData.items
    .map( (item: IPlaylistItem, index: number) => {
      const options: any = optionsArray[index];
      return Object.assign({}, item, options);
    });
  }


  // ----------------------------------------------------------------------
  //
  // conversion requests
  //
  // ----------------------------------------------------------------------

  // iterated over from queue
  getConversionData(index: number) {
    if(!this.consolidatedData) {
      EmitterService.get(QUEUE_ERROR).emit('No available playlist data.');
      if(this.conversionRequest) {
        this.conversionRequest.unsubscribe();
      }
      return;
    }

    const video: IPlaylistItem = this.consolidatedData.items[this.queueIndex];
    const videoId: string = video.videoId;
    const videoTitle: string = video.title;
    const thumbnail: string = video.thumbnails.medium.url;

    // optional from form input
    const startTime: string = video.startTime;
    const endTime: string = video.endTime;
    const songTitle: string = video.songTitle; // `title` is a default property
    const artist: string = video.artist;

    // validate time stamps
    let convertedStartTime: number = 0;
    let duration: number;
    if(startTime || endTime) {
      const validated = this.validateTimestamp(startTime, endTime);
      if(validated) {
        convertedStartTime = startTime ? this.convertStampToSeconds(startTime) : convertedStartTime;
        if(endTime) {
          duration = validated;
        }
      } else {
        // TODO - display this error
        EmitterService.get(`${QUEUE_ITEM_COMPLETE}_${index}`)
        .emit(new Error('Trimming times are invalid and will be ignored.'));
      }
    }

    // map index to videoId
    this.videoKeys[index] = videoId;
    this.conversionRequest = this.requestConversion({
      index,
      videoId,
      videoTitle,
      thumbnail,
      startTime: convertedStartTime,
      duration,
      songTitle,
      artist
    })
    .subscribe( (response: IConversionItem) => {
      const conversionData = response;

      // TODO - RE-ENABLE QUEUE
      this.updateQueue(index, conversionData);

      // // TRIGGER MOCK QUEUE COMPLETION
      // EmitterService.get(`${QUEUE_ITEM_COMPLETE}_${index}`).emit(
      //   conversionData || new Error('This video fails to convert.')
      // );
      // this.requestPlaylistArchive();





    },
    err => {
      console.log('queue.service: getConversionData: err:', err);

      // TODO - test validity of this index value
      EmitterService.get(QUEUE_ITEM_ERROR + '_' + index).emit(err);

      // interrupt subscription if queue is paused
      this.conversionRequest.unsubscribe();
      this.updateQueue(index);
    });
  }

  requestConversion(conversionRequestParams: IConversionRequestParam): Observable<IConversionItem> {
    return this.http
      .post(`${CONVERSION_API_URL}:${PORT_API}` + '/convert', {
        socketToken,
        sessionId: this.sessionId,
        options: conversionRequestParams
      })
      .map((res: Response) => {
        return res.json();
      })
      .catch((error: any) => {
        console.log('queue.service.ts: requestConversion: error:', error);
        return Observable.throw(error || 'Server error');
      });
  }

  requestCancellation(params?: any): Observable<any> {
    const options: any = Object.assign({}, { socketToken }, params);
    return this.http
      .post(`${CONVERSION_API_URL}:${PORT_API}/cancel`, options)
      .map((res: Response) => {
        return res.json();
      })
      .catch((error: any) => {
        console.log('queue.service.ts: requestCancellation: error:', error);
        return Observable.throw(error || 'Server error');
      });
  }

  requestPlaylistArchive() {
    const request = this.http
    .post(CONVERSION_API_URL + '/archive', {
      sessionId: this.sessionId
    })
    .map((res: Response) => {
      return res.json();
    })
    .catch((error: any) => {
      return Observable.throw(error || 'Server error');
    })
    .subscribe((response: IArchiveItem) => {
      console.log('queue.service.ts: request archive: response:', response);

      // prepend endpoint url to download path
      response.downloadPath = CONVERSION_API_URL + '/' + response.downloadPath;

      // dispatch queue completion event
      EmitterService.get(QUEUE_COMPLETE).emit(response);
      request.unsubscribe();
    },
    err => {
      // dispatch queue completion err
      EmitterService.get(QUEUE_COMPLETE).emit(err);
      request.unsubscribe();
    });

  }

  // validate and convert end time to duration
  validateTimestamp(start: string = '0', end: string): any {
    // TODO - make the form enforce numbers only and split into hh mm ss
    start = start === '' ? '0' : start;
    end = end === '' ? undefined : end;

    // validate timestamp for HH:MM:SS (no ms)
    // https://goo.gl/ZGoWXS
    const re = new RegExp(/(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)/);
    const valid = end ? re.test(start) && re.test(end) : re.test(start);

    if(!valid) {
      return valid;
    }

    // calculate new duration based on trimming points
    return end ? this.calculateDuration(start, end) : true;
  }

  calculateDuration(start: string, end: string): number {
    const startSeconds: number = this.convertStampToSeconds(start);
    const endSeconds: number = this.convertStampToSeconds(end);
    return endSeconds - startSeconds;
  }

  convertStampToSeconds(stamp: string): number {
    // assuming already validated
    let hrs: number = 0;
    let mins: number = 0;
    let secs: number = 0;
    const split = stamp.split(':');
    split.forEach( (factor: string, ind: number) => {
      const num = parseInt(factor, 10);
      switch(split.length - ind) {
        case 3:
          hrs = num;
          break;
        case 2:
          mins = num;
          break;
        default:
          secs = num;
      }
    });

    return hrs * 360 + mins * 60 + secs;
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
      this.requestPlaylistArchive();
      this.resetQueue();
      return;
    }

    if(index === 0) {
      this.sessionId = this.consolidatedData.playlistId + '-' +  this.consolidatedData.playlistTitle;
    }
    this.queueActive = true;
    this.getConversionData(index);

    // emitter request for conversion to highlight display item
    EmitterService.get(QUEUE_ITEM_INITIATE_CONVERSION).emit(index);
  }

  /**
   * update queue
   */
  updateQueue(index: number, conversionData: IConversionItem = undefined) {
    console.log('queue.service.ts: updateQueue');
    if(!this.queueActive) {
      return;
    }
    this.queueIndex++;

    // emitter key is bound to queue-item instance/index
    EmitterService.get(`${QUEUE_ITEM_COMPLETE}_${index}`).emit(
      conversionData || new Error('This video fails to convert.')
    );

    if(this.queueIndex >= this.consolidatedData.items.length) {
      this.requestPlaylistArchive();
      this.resetQueue();
      return;
    }

    this.getConversionData(this.queueIndex);

    // emitter request for conversion to highlight display item
    EmitterService.get(QUEUE_ITEM_INITIATE_CONVERSION).emit(this.queueIndex);
  }

  /**
   * pause queue
   */
  pauseQueue() {
    if(!this.queueActive) {
      return;
    }

    // stop listening for server response
    if(this.conversionRequest) {
      this.conversionRequest.unsubscribe();
    }

    this.queueActive = false;

    // cancel in process conversion on the server
    const cancelRequest = this.requestCancellation({
      sessionId: this.sessionId,
      videoId: this.consolidatedData.items[this.queueIndex].videoId
    })
    .subscribe( (response: any) => {
      // dispatch cancellation to update queue item state
      EmitterService.get(`${QUEUE_ITEM_CANCEL}_${this.queueIndex}`).emit();
    },
    err => {
      console.log('queue.service.ts: pauseQueue: err:', err);
    });
  }

  /**
   * resume queue
   */
  resumeQueue() {
    if(this.queueActive) {
      return;
    }

    this.queueActive = true;
    this.startQueue(this.queueIndex);
  }

  /**
   * stop and reset queue
   */
  resetQueue() {
    // cancel in process conversions on the server
    const cancelRequest = this.requestCancellation()
    .subscribe( (response: any) => {
      console.log('queue.service.ts: resetQueue: response:', response);
    },
    err => {
      console.log('queue.service.ts: resetQueue: err:', err);
    });

    this.consolidatedData = undefined;
    this.queueActive = false;
    this.queueIndex = 0;
    this.videoKeys = [];
  }

}
