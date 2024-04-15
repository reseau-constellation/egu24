export const COURRIEL_CONTACT = "julien.malard@mail.mcgill.ca";
export const URL_CODE_SOURCE = "https://github.com/reseau-constellation";
export const URL_DONNÉES_EXEMPLE =
  "https://drive.google.com/drive/folders/1L-nZ2rhkJUtyL0L-mpSxzOT9Y5BdCruj?usp=sharing";
export const URL_DONNÉES_LIEN =
  "https://docs.google.com/spreadsheets/d/15_Kmiu2MRqCf23ZspeD-Ex9x3cUYlisJM9cc9ynayow/";

export const ID_NUÉE_DONNÉES =
  process.env.VITE_ID_NUÉE_DONNÉES ||
  "/orbitdb/zdpuAvWUWrZouLuJ5PVdEhNJ85tAPPuJcmw3hiDQMRsMkqgoy";
export const CLEF_TABLEAU = "11df704f-0b99-41f9-92fb-e8394ab83f88";

// À faire : ids variables
export const ID_VAR_ID =
  "/orbitdb/zdpuAwz2z5zKLHzKrdWY5bytWudXc6B2XCdH8x2uKj7HBxoYq";
export const ID_VAR_HORO =
  "/orbitdb/zdpuArcD64xg1vnrGutGyMSESiGQomXFxAxy4kPTUP1L6bDzV";
export const ID_VAR_LAT =
  "/orbitdb/zdpuAycMzQDbpJt6xvMjWGAHyn2Wya6RS6hQcKdK9QNZispex";
export const ID_VAR_LONG =
  "/orbitdb/zdpuAzaZ3u9oPYqF9gukynpSvM2fMxSCD4wLx4qrxcq9R8A8k";
export const ID_VAR_PRECIP =
  "/orbitdb/zdpuB2fu7mWLyhMxxBatYBPsBCiQcMW6xqsggb9HMKHZcnMtt";

export const ID_COL_ID = "idObservation";
export const ID_COL_HORO = "heureObservation";
export const ID_COL_LAT = "latitude";
export const ID_COL_LONG = "longitude";
export const ID_COL_PRECIP = "précipitation";

export type élémentDonnéesPluvio = {
  [ID_COL_ID]: string;
  [ID_COL_HORO]: number;
  [ID_COL_LAT]: number;
  [ID_COL_LONG]: number;
  [ID_COL_PRECIP]: number;
};

export const SCHÉMA_DONNÉES = {
  licence: "ODbl-1_0",
  nuées: [ID_NUÉE_DONNÉES],
  tableaux: [
    {
      clef: CLEF_TABLEAU,
      cols: [
        {
          idVariable: ID_VAR_ID,
          idColonne: ID_COL_ID,
        },
        {
          idVariable: ID_VAR_HORO,
          idColonne: ID_COL_HORO,
        },
        {
          idVariable: ID_VAR_LAT,
          idColonne: ID_COL_LAT,
        },
        {
          idVariable: ID_VAR_LONG,
          idColonne: ID_COL_LONG,
        },
        {
          idVariable: ID_VAR_PRECIP,
          idColonne: ID_COL_PRECIP,
        },
      ],
    },
  ],
};
