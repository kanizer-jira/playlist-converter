// TODO - cleanup all the redundancy in these types

export interface IPlaylistData {
  playlistId: string;
  playlistTitle: string;
  items: any[];
  nextPageToken?: string;
  etag?: string;
  kind?: string;
  pageInfo?: any;
}

export interface IPlaylistItem {
  videoId: string;
  position: number;
  title: string;
  description: string;
  thumbnails: any; // TODO - convert to IThumbnail
  startTime?: string;
  endTime?: string;
  songTitle?: string;
  artist?: string;
}

export interface IThumbnailItem {
  url: string;
  width: number;
  height: number;
}

export interface IConversionItem {
  videoId: string;
  videoTitle: string;
  title: string;
  artist: string;
  length: number;
  file: string; // TODO - convert to URL type
}

// bound to endpoint data schema
export interface IArchiveItem {
  message: string;
  downloadPath: string;
}

// bound to endpoint data schema
export interface IConversionRequestParam {
  index: number;
  videoId: string;
  videoTitle: string;
  startTime?: number;
  duration?: number;
  songTitle?: string;
  artist?: string;
}
