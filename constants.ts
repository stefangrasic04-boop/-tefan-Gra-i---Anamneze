import { Gender } from './types';

interface SectionConfig {
  label: string;
  reportLabel: string;
  neg_text: string;
  gender?: Gender;
  group: 'main_pre_ros' | 'ros' | 'main_post_ros';
}

interface SubfindingConfig {
  label: string;
  reportText: string;
}

interface StatusSectionConfig {
    label: string;
    reportLabel: string;
    neg_text: string;
    subfindingsConfig?: { [key: string]: SubfindingConfig };
}


export const ANAMNESIS_SECTIONS: { [key: string]: SectionConfig } = {
  // UI Group 1: Before ROS
  mainComplaint: {
    label: "Glavna težava / vodilni simptom (Kdaj, kje, kako, jakost, širjenje, lajšanje...)",
    reportLabel: "Glavna težava / vodilni simptom",
    neg_text: "Trenutno brez specifične glavne težave.",
    group: 'main_pre_ros',
  },
  currentIllness: {
    label: "Sedanja bolezen (Podroben opis glavne težave, OPQRST, spremljevalni simptomi)",
    reportLabel: "Sedanja bolezen",
    neg_text: "Brez novih akutnih težav, kroničnih poslabšanj ne navaja.",
    group: 'main_pre_ros',
  },

  // UI Group 2: Review of Systems
  general: {
    label: "Splošni simptomi (Počutje, apetit, teža, spanje, potenje, vročica)",
    reportLabel: "Splošni simptomi",
    neg_text: "Počutje je stabilno, apetit, žeja in spanje so ustrezni. Zanika izgubo telesne teže, potenje, vročino, mrzlico in povečane bezgavke.",
    group: 'ros',
  },
  endocrine: {
    label: "Endokrini sistem (Ščitnica, žeja, potenje, telesna teža)",
    reportLabel: "Endokrini sistem",
    neg_text: "Zanika težave s ščitnico, prekomerno žejo, potenje ali nenadne spremembe v telesni teži.",
    group: 'ros',
  },
  headNeck: {
    label: "Glava in vrat (Glavobol, vid, sluh, žrelo)",
    reportLabel: "Glava in vrat",
    neg_text: "Zanika glavobole. Sluh in vid sta brez posebnosti. Nos in sinusi so prehodni, žrelo pa je mirno.",
    group: 'ros',
  },
  cardiovascular: {
    label: "Obtočila (Bolečina v prsih, dispneja, palpitacije, edemi)",
    reportLabel: "Obtočila",
    neg_text: "Zanika bolečine v prsih, dispnejo, palpitacije in edeme.",
    group: 'ros',
  },
  respiratory: {
    label: "Dihala (Kašelj, izmeček, dispneja, hemoptiza)",
    reportLabel: "Dihala",
    neg_text: "Zanika dispnejo, kašelj, izmeček, hemoptizo in nočno potenje.",
    group: 'ros',
  },
  breasts: {
    label: "Dojke (Zatrdline, bolečina, izcedek)",
    reportLabel: "Dojke",
    neg_text: "Redno samopregledovanje, brez zatrdlin, bolečin ali izcedkov.",
    gender: Gender.Female,
    group: 'ros',
  },
  gastrointestinal: {
    label: "Prebavila (Apetit, bolečine, odvajanje, kri)",
    reportLabel: "Prebavila",
    neg_text: "Apetit je normalen, abdominalnih bolečin ne navaja, odvajanje je redno in brez posebnosti.",
    group: 'ros',
  },
  hematopoietic: {
    label: "Hematopoetski sistem (Krvavitve, modrice, bezgavke)",
    reportLabel: "Hematopoetski sistem",
    neg_text: "Zanika nagnjenost h krvavitvam ali modricam. Perifernih bezgavk ne zatipa.",
    group: 'ros',
  },
  urogenital: {
    label: "Sečila (Dizurija, nikturija, hematurija, inkontinenca)",
    reportLabel: "Sečila",
    neg_text: "Zanika dizurijo, nikturijo, hematurijo in inkontinenco.",
    group: 'ros',
  },
  genitalsMale: {
    label: "Spolovila - moški (Libido, potenca, LUTS)",
    reportLabel: "Spolovila - moški",
    neg_text: "Libido je ohranjen, erektilna funkcija je brez težav. Zanika težave z mikcijo v smislu LUTS.",
    gender: Gender.Male,
    group: 'ros',
  },
  genitalsFemale: {
    label: "Spolovila - ženska (Menstruacija, Ginekološki pregledi)",
    reportLabel: "Spolovila - ženska",
    neg_text: "Menstrualni cikel je reden, ginekološko brez posebnosti.",
    gender: Gender.Female,
    group: 'ros',
  },
  musculoskeletal: {
    label: "Gibala (Bolečine v sklepih/mišicah, otekline)",
    reportLabel: "Gibala",
    neg_text: "Brez bolečin v sklepih ali mišicah, polno gibljiv, brez oteklin.",
    group: 'ros',
  },
  neurological: {
    label: "Nevrološki sistem (Vrtoglavica, krči, parestezije)",
    reportLabel: "Nevrološki sistem",
    neg_text: "Zanika omotico, vrtoglavico, krče, parestezije ali motorične izpade.",
    group: 'ros',
  },
  skin: {
    label: "Koža, lasje, nohti (Izpuščaji, srbež, spremembe)",
    reportLabel: "Koža, lasje, nohti",
    neg_text: "Zanika izpuščaje, srbež ali druge pomembnejše kožne spremembe. Lasišče in nohti so brez posebnosti.",
    group: 'ros',
  },
  
  // UI Group 3: After ROS
  childhoodIllnesses: {
    label: "Otroške bolezni (Prebolele bolezni, cepljenje po shemi)",
    reportLabel: "Otroške bolezni",
    neg_text: "Prebolel običajne otroške bolezni, cepljen po shemi.",
    group: 'main_post_ros',
  },
  pastIllnesses: {
    label: "Prejšnje bolezni (Operacije, hospitalizacije, poškodbe, kronične bolezni)",
    reportLabel: "Prejšnje bolezni",
    neg_text: "Zanika resnejše kronične bolezni, operacije ali hospitalizacije v odrasli dobi.",
    group: 'main_post_ros',
  },
  familyHistory: {
    label: "Družinska anamneza (Starši, sorojenci, otroci, dedne bolezni)",
    reportLabel: "Družinska anamneza",
    neg_text: "Družinske obremenjenosti ne navaja.",
    group: 'main_post_ros',
  },
  medications: {
    label: "Zdravila in medicinski pripomočki (Ime, jakost, odmerek, režim jemanja)",
    reportLabel: "Zdravila in medicinski pripomočki",
    neg_text: "Ne jemlje redne terapije in ne uporablja medicinskih pripomočkov.",
    group: 'main_post_ros',
  },
  vaccinations: {
    label: "Cepljenja in preventivne dejavnosti (Obvezna, priporočena, presejalni programi SVIT/DORA/ZORA)",
    reportLabel: "Cepljenja in preventivne dejavnosti",
    neg_text: "Redno cepljen po nacionalnem programu, udeležuje se presejalnih programov.",
    group: 'main_post_ros',
  },
  allergies: {
    label: "Alergije (Zdravila, hrana, okolje, opis reakcije)",
    reportLabel: "Alergije",
    neg_text: "Zanika alergije na zdravila, hrano ali druge znane alergene.",
    group: 'main_post_ros',
  },
  addictions: {
    label: "Zasvojenosti in razvade (Kajenje, alkohol, droge, igre na srečo)",
    reportLabel: "Zasvojenosti in razvade",
    neg_text: "Zanika kajenje, prekomerno pitje alkohola ali uporabo nedovoljenih substanc.",
    group: 'main_post_ros',
  },
  socialHistory: {
    label: "Socialna anamneza (Družina, poklic, bivalne razmere, hobiji)",
    reportLabel: "Socialna anamneza",
    neg_text: "Socialno stanje je urejeno, bivalne razmere so primerne.",
    group: 'main_post_ros',
  },
};


export const STATUS_SECTIONS: { [key: string]: StatusSectionConfig } = {
  general: {
    label: "Splošni vtis",
    reportLabel: "Splošni vtis",
    neg_text: "Neprizadet, buden, orientiran v času, prostoru in situaciji. Primerno odgovarja na vprašanja. Koža je normalno obarvana, suha, topla in primernega turgorja, brez izpuščajev ali ekhimoz. Nohti so brez posebnosti. Edemov ni. Perifernih bezgavk ne zatipam.",
  },
  head: {
    label: "Glava",
    reportLabel: "Glava",
    neg_text: "Glava je primerno oblikovana. Palpatorno je skalp neboleč. Očesni reži sta enako široki, zrkli mirujeta v srednji črti, bulbomotorika je primerna. Zenici so okrogle, enake in fotoreaktivne. Veznici sta rožnati. Sluh je orientacijsko brez posebnosti. Nos je prehoden. Ustna sluznica je rožnata, jezik vlažen, žrelo ni pordelo.",
    subfindingsConfig: {
      dentalCaries: { label: "Zobna gniloba/parodontoza", reportText: "Prisotna zobna gniloba/parodontoza." },
      refractiveErrors: { label: "Refrakcijske napake vida", reportText: "Ugotovljene refrakcijske napake vida (nosi očala/leče)." },
      upperAirwayInfection: { label: "Vnetje zgornjih dihal", reportText: "Prisotni znaki vnetja zgornjih dihal (pordelo žrelo, izcedek iz nosu)." }
    }
  },
  neck: {
    label: "Vrat",
    reportLabel: "Vrat",
    neg_text: "Vrat je aktivno in pasivno gibljiv v vseh smereh, brez meningealnih znakov. Ščitnica ni tipno povečana. Vratne vene niso nabrekle. Karotidna pulza je simetrično tipna, brez slišnih šumov.",
    subfindingsConfig: {
      enlargedThyroid: { label: "Povečana ščitnica", reportText: "Ščitnica je tipno povečana." },
      jvd: { label: "Nabrekle vratne vene", reportText: "Vratne vene so nabrekle." },
      meningealSigns: { label: "Meningealni znaki", reportText: "Prisotni meningealni znaki." }
    }
  },
  chest: {
    label: "Prsni koš / Pljuča",
    reportLabel: "Prsni koš / Pljuča",
    neg_text: "Prsni koš je normalne oblike, simetrično pomičen z dihanjem. Dihanje je normalno, slišno, brez adventivnih fenomenov. Poklep nad pljuči je sonoren. Pektoralni fremitus je primeren.",
    subfindingsConfig: {
      crackles: { label: "Slišni poki", reportText: "Avskultatorno so slišni poki." },
      wheezes: { label: "Slišni piski", reportText: "Avskultatorno so slišni piski." },
      tachypnea: { label: "Tahipneja", reportText: "Dihanje je pospešeno (tahipneja)." }
    }
  },
  heart: {
    label: "Srce in ožilje",
    reportLabel: "Srce in ožilje",
    neg_text: "Srčna akcija je ritmična, toni so jasni, šumov ni slišati. Iktus je tipen v 5. medrebrnem prostoru. Periferni pulzi so tipni in simetrični. Kapilarni povratek je krajši od 2 sekund.",
    subfindingsConfig: {
      murmur: { label: "Slišni šumi", reportText: "Prisoten je srčni šum." },
      arrhythmia: { label: "Neritmična akcija", reportText: "Akcija srca je neritmična." },
      weakPulses: { label: "Slabše tipni pulzi", reportText: "Periferni pulzi so slabše tipni." }
    }
  },
  abdomen: {
    label: "Trebuh (Abdomen)",
    reportLabel: "Trebuh",
    neg_text: "Trebuh je v nivoju prsnega koša, mehak in na palpacijo neboleč. Jetra in vranica nista tipna. Peristaltika je slišna. Ledveni poklep je obojestransko neboleč.",
    subfindingsConfig: {
      tenderness: { label: "Bolečnost na pritisk", reportText: "Trebuh je boleč na palpacijo." },
      masses: { label: "Tipne rezistence", reportText: "Tipne so patološke rezistence." }
    }
  },
  limbs: {
    label: "Gibala / Okončine",
    reportLabel: "Gibala / Okončine",
    neg_text: "Hoja je normalna. Okončine in hrbtenica so primerno oblikovani in gibljivi. Presejalni test GALS je v mejah normale.",
  }
};