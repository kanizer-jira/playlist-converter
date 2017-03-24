// TODO - implement in node service; not TypeScript compatible or something

// import * as YoutubeMp3Downloader from 'youtube-mp3-downloader';
// import { Injectable } from '@angular/core';

// // TODO - this should be a service that lives on a server...
// @Injectable()
// export class ConverterService {

//   public YD: YoutubeMp3Downloader;
//   public config: any = {
//     // Where is the FFmpeg binary located?
//     "ffmpegPath": "/usr/local/Cellar/ffmpeg/3.2.4/bin/ffmpeg",
//     // Where should the downloaded and encoded files be stored?
//     "outputPath": "~/Downloads/playlist-converter",
//     // What video quality should be used?
//     "youtubeVideoQuality": "highest",
//     // How many parallel downloads/encodes should be started?
//     "queueParallelism": 2,
//     // How long should be the interval of the progress reports
//     "progressTimeout": 2000
//   };

//   getMP3(
//     videoId: string,
//     name: string,
//     callback: Function,
//     progressCallback: Function = undefined,
//     queueCallback: Function = undefined
//   ) {

//     // TODO - should allow adding custom outputPath

//     //Configure YoutubeMp3Downloader with your settings
//     this.YD = new YoutubeMp3Downloader(this.config);

//     // Trigger download
//     this.YD.download(videoId, name);

//     // event handlers/callbacks
//     this.YD.on("finished", function(error, data) {
//       console.log('converter.service.ts: finished: error, data:', error, data);
//       callback(error, data);
//     });

//     this.YD.on("error", function(error, data) {
//       console.log('converter.service.ts: error: error, data:', error, data);
//       callback(error, data);
//     });

//     this.YD.on("progress", function(progress) {
//       console.log('converter.service.ts: progress:', progress);
//       if(progressCallback) {
//         progressCallback(progress);
//       }
//     });

//     this.YD.on("queueSize", function(size) {
//       console.log('converter.service.ts: size:', size);
//       if(queueCallback) {
//         queueCallback(size);
//       }
//     });

//   }

// }
