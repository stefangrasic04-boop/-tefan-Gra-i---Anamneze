export enum Gender {
  Male = 'male',
  Female = 'female',
}

export interface PatientData {
  ime: string;
  priimek: string;
  starost: string;
  poklic: string;
}

export interface AnamnesisSectionData {
  isAsked: boolean;
  isOk: boolean;
  details: string;
}

export interface SectionData {
  isAsked: boolean;
  isOk: boolean;
  details: string;
  subfindings?: {
    [key: string]: boolean;
  };
}

export interface VitalsData {
  temperature: number | null;
  bloodPressure: string;
  pulse: number | null;
  respiratoryRate: number | null;
  spo2: number | null;
  weight: number | null;
  height: number | null;
  bmi: number | null;
  waist: number | null;
}

export interface StatusData {
  general: SectionData;
  vitals: VitalsData;
  head: SectionData;
  neck: SectionData;
  chest: SectionData;
  heart: SectionData;
  abdomen: SectionData;
  limbs: SectionData;
}


export interface AppData {
  anamnesis: {
    [key: string]: AnamnesisSectionData;
  };
  status: StatusData;
}

export type SectionKey = keyof typeof import('./constants').ANAMNESIS_SECTIONS;