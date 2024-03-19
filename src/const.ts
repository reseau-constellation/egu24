export const URL_CODE_SOURCE = "https://github.com/reseau-constellation";
export const URL_DONNÉES_EXEMPLE = "https://drive.google.com/drive/folders/1L-nZ2rhkJUtyL0L-mpSxzOT9Y5BdCruj?usp=sharing";
export const URL_DONNÉES_LIEN = "https://docs.google.com/spreadsheets/d/15_Kmiu2MRqCf23ZspeD-Ex9x3cUYlisJM9cc9ynayow/";

export const ID_NUÉE_DONNÉES = process.env.VITE_ID_NUÉE_DONNÉES || "";
export const CLEF_TABLEAU = "pluviométrie";

export const ID_VAR_ID = "";
export const ID_VAR_HORO = "";
export const ID_VAR_LAT = "";
export const ID_VAR_LONG = "";
export const ID_VAR_PRECIP = "";

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
  tableaux: [
    {
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
      clef: CLEF_TABLEAU,
    },
  ],
};
