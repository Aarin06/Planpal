export interface Itinerary {
  title: string;
  location: {
    name: string;
    address: string;
    iconUrl: string;
    imageUrl: string;
    location: {
      lat: number;
      lng: number;
    };
  };
  startDate: Date;
  endDate: Date;
  description: string;
}
