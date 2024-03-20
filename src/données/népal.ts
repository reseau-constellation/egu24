export type InfoStation = { id: string; coords: [number, number]; nom: string };
export const stations: InfoStation[] = [
  {
    id: "PT01072_2887",
    coords: [27.6461574, 85.3402103],
    nom: "Station test",
  },
];
export const données = [
  {
    id: "0eaefd63-e4da-43c0-8b15-3c8400f84021",
    station: "PT01072_2887",
    horo: "2023-06-15T14:27:02.02Z",
    image: async () =>
      await import("./images/0eaefd63-e4da-43c0-8b15-3c8400f84021.jpg"),
  },
  {
    id: "54e41355-abe3-4d60-aaae-da2855fbdee9",
    station: "PT01072_2887",
    horo: "2023-05-27T02:35:10.237Z",
    image: async () =>
      await import("./images/54e41355-abe3-4d60-aaae-da2855fbdee9.jpg"),
  },
];
