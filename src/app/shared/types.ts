export interface IPlaylistData {
  items: any[];
  nextPageToken: string;

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
  title: string;
  length: number;
  link: string; // TODO - convert to URL type
}
