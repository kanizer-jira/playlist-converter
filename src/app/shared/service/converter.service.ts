import { Injectable, EventEmitter } from '@angular/core';

// const fs         = require('fs');
// const https      = require('https');
// const path       = require('path');
// const mkdirp     = require('mkdirp');
// const sanitize   = require('sanitize-filename');
// const ffmetadata = require('ffmetadata');
// const Ytdl       = require('../lib/YoutubeMp3Downloader');
// const DateUtil   = require('../utils/date-util');
// const Logger     = require('../utils/logger-util');


// This instance handles downloading from Youtube and handling the conversion requests
// - paths should be to instance on a container or local machine...shouldn't need to change
const config = {
  // Where is the FFmpeg binary located?
  'ffmpegPath': '/usr/local/Cellar/ffmpeg/3.2.4/bin/ffmpeg',
  // Where should the downloaded and encoded files be stored?
  'outputPath': './public/downloads/',
  // What video quality should be used?
  'youtubeVideoQuality': 'highest',
  // How many parallel downloads/encodes should be started?
  'queueParallelism': 1,
  // How long should be the interval of the progress reports
  'progressTimeout': 1000

  // optional props
  // - startTime
  // - duration
  // - title
  // - artist

};


@Injectable()
export class ConverterService {
  static convert(params, callbacks) {
    // lazier aggregated params don't enforce order and are simpler to read
    const {
      model,
      socketToken,
      sessionId,
      videoId,
      videoTitle,
      thumbnail,
      // optional
      startTime,
      duration,
      songTitle,
      artist
    } = params;

    const {
      onProgress,
      onComplete,
      onError
    } = callbacks;

    // designate download folder name by date & session ID
    // const folderId = DateUtil.formatDate(new Date()) + '/' + sanitize(sessionId);
    // const conversionKey = `${sessionId}-${videoId}`;

    // // kickoff conversion
    // this.makeDestinationFolder(folderId)
    // .then( destPath => {
    //   // add optional props
    //   const conf = Object.assign({}, config, { startTime, duration, songTitle, artist });
    //   return model.getConversionModel(socketToken)
    //     .then( conversionModel => {
    //       return conversionModel.add(conversionKey, new Ytdl(conf));
    //     });
    // })
    // .then( conversion => {
    //   conversion.on('progress', onProgress); // progress
    //   conversion.on('finished', (error, data) => {
    //     // save thumbnail
    //     saveThumbnail(folderId, data, thumbnail || data.thumbnail)
    //       .then( thumbnailPath => {
    //         return updateMetaData(data.file, thumbnailPath);
    //       })
    //       .then(deleteThumbnail)
    //       .then(onComplete(data))
    //       .catch(onError);
    //   }); // error, data

    //   // Trigger download
    //   const videoPath = `${folderId}/${sanitize(videoTitle)}.mp3`;
    //   conversion.download(videoId, videoPath);

    //   // bubble to promise chain
    //   return new Promise( (resolve, reject) => {
    //     conversion.on('error', error => reject(error));
    //   });
    // })
    // .catch(onError);
  }

  saveThumbnail(folderId, fileData, url) {
    // // construct filename with extension and save
    // return new Promise( (resolve, reject) => {
    //   const extension = url.split('.').pop();
    //   const dest = `${config.outputPath}${folderId}/${fileData.title}.${extension}`;
    //   const file = fs.createWriteStream(dest);
    //   https.get(url, response => {
    //     response.pipe(file);
    //     file.on('finish', () => {
    //       file.close(resolve(dest));
    //     });
    //   })
    //   .on('error', error => {
    //     fs.unlink(dest);
    //     reject(error);
    //   });
    // });
  }

  deleteThumbnail(url) {
    // return new Promise( (resolve, reject) => {
    //   fs.exists(url, exists => {
    //     if(exists) {
    //       fs.unlink(url, err => {
    //         return err ? reject(err) : resolve();
    //       });
    //     }
    //   });
    // });
  }

  updateMetaData(file, thumbnail) {
    // return new Promise( (resolve, reject) => {
    //   // add thumbnail to metadata
    //   ffmetadata.write(file, {}, { attachments: [thumbnail] }, err => {
    //     if(err) {
    //       return reject(err);
    //     }
    //     return resolve(thumbnail);
    //   });
    // });
  }

  cancel(connectionModel, socketToken, conversionKey) {
    // these methods already return promises
    return connectionModel.getConversionModel(socketToken)
      .then( model => {
        model.search(conversionKey)
          .then( conversion => {
            conversion.destroy();
            return model.remove(conversionKey);
          });
      });
  }

  cancelAll(connectionModel, socketToken) {
    return connectionModel.getConversionModel(socketToken)
      .then( model => {
        const promises = [];
        for(let key in model._list) {
          const conversion = model._list[key];
          conversion.destroy();
          promises.push(model.remove(key));
        }
        return Promise.all(promises);
      })
      .catch( error => Promise.reject(error) );
  }

  makeDestinationFolder(folderId) {
    // create a new folder per day
    // const outputPathFull = path.resolve(config.outputPath + folderId);

    // return new Promise( (resolve, reject) => {
    //   fs.stat(outputPathFull, (err, stats) => {
    //     // folder already exists
    //     if(stats) {
    //       return resolve(stats);
    //     }
    //     // create folder
    //     return mkdirp(outputPathFull, (writeErr) => {
    //       if(writeErr) {
    //         return reject(writeErr);
    //       }
    //       return resolve(outputPathFull);
    //     });
    //   });
    // });
  }

}