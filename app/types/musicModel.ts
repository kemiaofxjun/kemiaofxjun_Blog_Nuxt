import type { ResOptions } from "./options";
import { Post, Classify } from "./post-common";

export class Music extends Post {
  song_id: number = this.id;
  song_sheet_id: number = this.classify_id;
  song_title: string = this.title;
  song_views: number = this.views;
  song_likes: number = this.likes;
  song_comments: number = this.comments;
  song_singer: string = "";
  song_cover: string = "";
  song_audio_url: string = "";
  song_lyric_url: string = "";
}

export class MusicAndSheet {
  song_id: number = 0;
  song_sheet_id: number = 1;
  song_title: string = "";
  song_singer: string = "";
  song_cover: string = "";
  song_audio_url: string = "";
  song_lyric_url: string = "";
  song_date: string = "";
  song_views: number = 0;
  song_likes: number = 0;
  song_comments: number = 0;

  sheet_id: number = 1;
  sheet_path: string = "";
  sheet_title: string = "";
  sheet_cover: string = "";
}

export class MusicSheet extends Classify {
  sheet_id: number = this.id;
  sheet_path: string = this.path;
  sheet_title: string = this.title;
  sheet_cover: string = this.cover;
}

export class musicPlayerListItem {
  id: number = 0;
  title: string = "";
  singer: string = "";
  cover: string = "";
  audio: string = "";
  lyric: string = "";
}

export class MusicList {
  list: Music[] = [];
  total: number = 0;
  constructor() {
    this.list = [new Music()];
  }
}

export class MusicAndSheetList {
  list: MusicAndSheet[] = [];
  total: number = 0;
  constructor() {
    this.list = [new MusicAndSheet()];
  }
}

export class MusicSheetList {
  list: MusicSheet[] = [];
  constructor() {
    this.list = [new MusicSheet()];
  }
}

export interface ApiIndex {
  params: {
    page_numer?: number;
    page_size?: number;
    sheet_pash?: string | null;
    sort_label?: string;
    sort_order?: string;
  };
  result: ResOptions<MusicAndSheetList>;
}

export interface ApiShow {
  params: {
    song_id: string;
  };
  result: ResOptions<MusicAndSheet>;
}

export interface ApiAdd {
  params: {
    song_sheet_id: number;
    song_title: string;
    song_singer: string;
    song_cover: string;
    song_audio_url: string;
    song_lyric_url: string;
    song_date: string;
  };
  result: ResOptions<null>;
}

export interface ApiUpdate {
  params: {
    song_id: number;
    song_sheet_id: number;
    song_title: string;
    song_singer: string;
    song_cover: string;
    song_audio_url: string;
    song_lyric_url: string;
    song_date: string;
  };
  result: ResOptions<null>;
}

export interface ApiDelete {
  params: {
    song_id: number;
  };
  result: ResOptions<null>;
}

export interface ApiSheetIndex {
  params: null;
  result: ResOptions<MusicSheetList>;
}