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
  thumbnails: any;
  startTime?: string;
  endTime?: string;
  songTitle?: string;
  artist?: string;
}

export interface IConversionItem {
  videoId: string;
  videoTitle: string;
  title: string;
  artist: string;
  length: number;
  file: string;
}

// bound to endpoint data schema
export interface IConversionRequestParam {
  index: number;
  videoId: string;
  videoTitle: string;
  thumbnail: string;
  startTime?: number;
  duration?: number;
  songTitle?: string;
  artist?: string;
}

export interface IThumbnailItem {
  url: string;
  width: number;
  height: number;
}

export interface IRingProgressItem {
  index: number;
  title: string;
}

// bound to endpoint data schema
export interface IArchiveItem {
  message: string;
  downloadPath: string;
}
