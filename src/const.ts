export const COURRIEL_CONTACT = "julien.malard@mail.mcgill.ca"
export const URL_CODE_SOURCE = "https://github.com/reseau-constellation";
export const URL_DONNÉES_EXEMPLE =
  "https://drive.google.com/drive/folders/1L-nZ2rhkJUtyL0L-mpSxzOT9Y5BdCruj?usp=sharing";
export const URL_DONNÉES_LIEN =
  "https://docs.google.com/spreadsheets/d/15_Kmiu2MRqCf23ZspeD-Ex9x3cUYlisJM9cc9ynayow/";

// À faire : id nuée
export const ID_NUÉE_DONNÉES = process.env.VITE_ID_NUÉE_DONNÉES || "/orbitdb/zdpuAmJyEysNGUYXuNBrFaXktzQUiWyfFW2WCgh9yV4Sz2w9j";
export const CLEF_TABLEAU = "pluviométrie";

// À faire : ids variables
export const ID_VAR_ID = "/orbitdb/zdpuAnsiz6PBJeskg7PEqLoUkWvriJsGYf8mUwdhwQazfyAFF";
export const ID_VAR_HORO = "/orbitdb/zdpuAnsiz6PBJeskg7PEqLoUkWvriJsGYf8mUwdhwQazfyAG";
export const ID_VAR_LAT = "/orbitdb/zdpuAnsiz6PBJeskg7PEqLoUkWvriJsGYf8mUwdhwQazfyAFH";
export const ID_VAR_LONG = "/orbitdb/zdpuAnsiz6PBJeskg7PEqLoUkWvriJsGYf8mUwdhwQazfyAFI";
export const ID_VAR_PRECIP = "/orbitdb/zdpuAnsiz6PBJeskg7PEqLoUkWvriJsGYf8mUwdhwQazfyAFJ";

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
