import img0eaefd63 from "./images/0eaefd63-e4da-43c0-8b15-3c8400f84021.jpg";
import img54e41355 from "./images/54e41355-abe3-4d60-aaae-da2855fbdee9.jpg";
import img95bc7992 from "./images/95bc7992-6a98-4948-9bbe-50255cc6421b.jpg";

export type InfoStation = { id: string; coords: [number, number] };
export const stations: InfoStation[] = [
  {
    id: "PT01072_2887",
    coords: [27.6461574, 85.3402103],
  },
  {
    id: "PT01071_2886",
    coords: [27.6349734,	85.5276167],
  }
];

export type InfoObservation = {
  id: string;
  station: string;
  horo: string;
  image: string;
}

export const données: InfoObservation[] = [
  {
    id: "0eaefd63-e4da-43c0-8b15-3c8400f84021",
    station: "PT01072_2887",
    horo: "2023-06-15T14:27:02.02Z",
    image: img0eaefd63,
  },
  {
    id: "54e41355-abe3-4d60-aaae-da2855fbdee9",
    station: "PT01072_2887",
    horo: "2023-05-27T02:35:10.237Z",
    image: img54e41355,
  },
  {
    id: "95bc7992-6a98-4948-9bbe-50255cc6421b",
    station: "PT01071_2886",
    horo: "2023-10-06T10:21:31.823Z",
    image: img95bc7992,
  }
];
