import { ComputedRef, Ref, computed, inject, onMounted, onUnmounted, ref } from "vue"

import { données } from "@/données/népal"
import { ClientConstellation, types } from "@constl/ipa";
import { CLEF_TABLEAU, ID_COL_ID, ID_COL_PRECIP, ID_NUÉE_DONNÉES, SCHÉMA_DONNÉES, élémentDonnéesPluvio } from "@/const";

export const constellation = (): ClientConstellation => {
  const constl = inject<ClientConstellation>('constl');
  if (constl) return constl;
  throw new Error("Constellation n'est pas trouvable.");
};


export const suivre = <
  U,
  V extends U | undefined,
  W extends
    | types.schémaFonctionOublier
    | types.schémaRetourFonctionRechercheParProfondeur
    | types.schémaRetourFonctionRechercheParN,
  T extends {[clef: string]: types.élémentsBd | undefined} = Record<string, never>,
>(
  fonc: (args: T & {f: types.schémaFonctionSuivi<U>}) => Promise<W>,
  args: T = {} as T,
  défaut?: V,
): ComputedRef<U | V> => {
  const val = ref(défaut) as Ref<U | V>;

  let fOublier: types.schémaFonctionOublier | undefined = undefined;

  const argsFinaux = {
    ...args,
    f: (x: U) => (val.value = x),
  };
  onMounted(async () => {
    const résultat = await fonc(argsFinaux);
    if (résultat instanceof Function) {
      fOublier = résultat;
    } else {
      fOublier = résultat?.fOublier;
    }
  });
  onUnmounted(async () => {
    if (fOublier) await fOublier();
  });

  return computed(() => val.value);
};

const moyenne = (x: number[]) => {
  return x.reduce((a, b) => a + b, 0) / x.length
};

const écartType = (x: number[]) => {
  const mu = moyenne(x)
  return Math.sqrt(x.map(y => (y - mu) ** 2).reduce((a, b) => a+b, 0)) / (x.length)  // À faire: vérifier
};

export const utiliserDonnées = () => {
  const constl = constellation();

  const numérisées = suivre(constl.nuées.suivreDonnéesTableauNuée<élémentDonnéesPluvio>, {
    idNuée: ID_NUÉE_DONNÉES,
    clefTableau: CLEF_TABLEAU,
  });

  const contribuer = async (vals: élémentDonnéesPluvio) => {
    return await constl.bds.ajouterÉlémentÀTableauUnique({
      schémaBd: SCHÉMA_DONNÉES,
      idNuéeUnique: ID_NUÉE_DONNÉES,
      clefTableau: CLEF_TABLEAU,
      vals
    })
  }

  const mesContributions = suivre(constl.bds.suivreDonnéesDeTableauUnique<élémentDonnéesPluvio>, {
    schémaBd: SCHÉMA_DONNÉES,
    idNuéeUnique: ID_NUÉE_DONNÉES,
    clefTableau: CLEF_TABLEAU,
  });

  const aléatoire = ({idStation}: {idStation?: string} = {}) => {
    // Uniquement inclure celles auxquelles on n'a pas déjà contribué nous-mêmes
    const pasEncoreVues = données.filter(
      d=>!mesContributions.value?.find(c => c.données[ID_COL_ID] === d.id)
      ).filter(
        d=>!idStation || d.station === idStation
      );

    const parNContributions = pasEncoreVues.map(p=>[{d: p, n: numérisées.value?.filter(x=>x.élément.données[ID_COL_ID] === p.id)}])
    
    // À faire : prioriser par n observations et par valeur Z
    const mu = moyenne(numérisées.value?.map(d => d.élément.données[ID_COL_PRECIP]));
    const sigma = écartType(numérisées.value);
    return pasEncoreVues[Math.floor(Math.random() * pasEncoreVues.length)]
  }

  const effacer = async (id: string) => {
    return await constl.bds.effacerÉlémentDeTableauUnique({
      schémaBd: SCHÉMA_DONNÉES,
      idNuéeUnique: ID_NUÉE_DONNÉES,
      clefTableau: CLEF_TABLEAU,
      idÉlément: id
    })
  }

  const imageDeDonnée = (id: string) => {
    return données.find(d=>d.id === id)?.image
  };

  return {
    toutesPhotos: données,
    numérisées,
    aléatoire,
    contribuer,
    effacer,
    imageDeDonnée,
    mesContributions
  }
}