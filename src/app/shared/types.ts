export interface IPlaylistData {
  playlistId: string;
  playlistTitle: string;
  items: any[];
  nextPageToken?: string;

  // don't care about these:
  // etag: string;
  // kind: string;
  // pageInfo: any;
}

export interface IPlaylistItem {
  videoId: string;
  position: number;
  title: string;
  description: string;
  thumbnails: any; // TODO - convert to IThumbnail if you feel like it
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
