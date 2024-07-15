export interface DBEvent {
  id: number;
  title: string;
  start:string;
  end: string;
  allDay: boolean;
  location: {
    name: string;
    address: string;
    iconUrl: string;
    imageUrl: string;
  };
}
