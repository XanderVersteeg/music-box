export interface AccessToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  error?: {
    status: number;
    message: string;
  };
}

export interface Artist {
  external_urls: {
    spotify: string;
  };
  followers?: {
    href: string;
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: {
    url: string;
    height: number;
    width: number;
  }[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
  error?: {
    status: number;
    message: string;
  };
}

export interface Album {
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: {
    spotify?: string;
  };
  href: string;
  id: string;
  images: {
    url: string;
    height: number;
    width: number;
  }[];
  name: string;
  release_date: string;
  release_date_precision: string;
  restrictions?: {
    reason?: string;
  };
  type: string;
  uri: string;
  artists: {
    external_urls?: {
      spotify?: string;
    };
    href?: string;
    id?: string;
    name?: string;
    type?: string;
    uri?: string;
  }[];
  tracks: {
    href: string;
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
    items: {
      artists?: {
        external_urls?: {
          spotify?: string;
        };
        href?: string;
        id?: string;
        name?: string;
        type?: string;
        uri?: string;
      }[];
      available_markets?: string[];
      disc_number?: number;
      duration_ms?: number;
      explicit?: boolean;
      external_urls?: {
        spotify?: string;
      };
      href?: string;
      id?: string;
      is_playable?: boolean;
      linked_from?: {
        external_urls?: {
          spotify?: string;
        };
        href?: string;
        id?: string;
        type?: string;
        uri?: string;
      };
      restrictions?: {
        reason?: string;
      };
      name?: string;
      preview_url?: string;
      track_number?: number;
      type?: string;
      uri?: string;
      is_local?: boolean;
    }[];
  };
  copyright: {
    text?: string;
    type?: string;
  };
  external_ids: {
    isrc?: string;
    ean?: string;
    upc?: string;
  };
  genres: string[];
  label: string;
  popularity: number;
  error?: {
    status: number;
    message: string;
  };
}

export interface Search {
  tracks?: {
    href: string;
    items: {
      album: Album;
      artists: Artist[];
      available_markets: string[];
      disc_number: number;
      duration_ms: number;
      explicit: boolean;
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      is_local: boolean;
      name: string;
      popularity: number;
      preview_url: string;
      track_number: number;
      type: string;
      uri: string;
    }[];
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
  };
  artists?: {
    href: string;
    items: Artist[];
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
  };
  albums?: {
    href: string;
    items: Album[];
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
  };
  playlists?: {
    href: string;
    items: {
      collaborative: boolean;
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      images: {
        height: number;
        url: string;
        width: number;
      }[];
      name: string;
      owner: {
        display_name: string;
        external_urls: {
          spotify: string;
        };
        href: string;
        id: string;
        type: string;
        uri: string;
      };
      primary_color: string;
      public: boolean;
      snapshot_id: string;
      tracks: {
        href: string;
        total: number;
      };
      type: string;
      uri: string;
    }[];
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
  };
  error?: {
    status: number;
    message: string;
  };
}

export interface ArtistsAlbums {
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
  items: {
    album_type: string;
    total_tracks: number;
    available_markets: string[];
    external_urls: {
      spotify?: string;
    };
    href: string;
    id: string;
    images: {
      url: string;
      height: number;
      width: number;
    }[];
    name: string;
    release_date: string;
    release_date_precision: string;
    restrictions?: {
      reason?: string;
    };
    type: string;
    artists: {
      external_urls?: {
        spotify?: string;
      };
      href?: string;
      id?: string;
      name?: string;
      type?: string;
      uri?: string;
    }[];
    album_group: string;
  }[];
  error?: {
    status: number;
    message: string;
  };
}
