export interface placesSearchResult {
  address: string;
  location:google.maps.LatLng | undefined;
  imageUrl?:string;
  iconUrl?:string;
  name?:string;
}
