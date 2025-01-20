import type {
  AccessToken,
  Artist,
  Search,
  ArtistsAlbums,
  Album,
} from "@/types";

const client_id = "019dfbcf7af643e7b503df00bbbc0879";
const client_secret = "989b36c305814e08b8949650c01ab001";

let cachedToken: AccessToken | null = null;
let tokenExpiry: number | null = null;

const getCurrentTimestamp = (): number => Math.floor(Date.now() / 1000);

export async function spotifyGetToken(): Promise<AccessToken> {
  if (cachedToken && tokenExpiry && getCurrentTimestamp() < tokenExpiry) {
    return cachedToken;
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
  });

  const newToken = (await response.json()) as AccessToken;

  tokenExpiry = getCurrentTimestamp() + newToken.expires_in;
  cachedToken = newToken;

  return newToken;
}

export async function spotifySearchArtists(
  access_token: string,
  url: string
): Promise<Search> {
  const response = await fetch(
    "https://api.spotify.com/v1/search?q=" + url + "&type=artist",
    {
      method: "GET",
      headers: { Authorization: "Bearer " + access_token },
    }
  );

  return (await response.json()) as Search;
}

export async function searchAlbums(
  access_token: string,
  url: string
): Promise<Search> {
  const response = await fetch(
    "https://api.spotify.com/v1/search?q=" + url + "&type=album",
    {
      method: "GET",
      headers: { Authorization: "Bearer " + access_token },
    }
  );

  return (await response.json()) as Search;
}

export async function getArtist(
  access_token: string,
  url: string
): Promise<Artist> {
  const response = await fetch("https://api.spotify.com/v1/artists/" + url, {
    method: "GET",
    headers: { Authorization: "Bearer " + access_token },
  });

  return (await response.json()) as Artist;
}

export async function getArtistAlbums(
  access_token: string,
  url: string
): Promise<ArtistsAlbums> {
  const response = await fetch(
    "https://api.spotify.com/v1/artists/" + url + "/albums",
    {
      method: "GET",
      headers: { Authorization: "Bearer " + access_token },
    }
  );

  return (await response.json()) as ArtistsAlbums;
}

export async function getAlbum(
  access_token: string,
  url: string
): Promise<Album> {
  const response = await fetch("https://api.spotify.com/v1/albums/" + url, {
    method: "GET",
    headers: { Authorization: "Bearer " + access_token },
  });

  return (await response.json()) as Album;
}
