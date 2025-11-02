import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { AnamnesisSectionData, StatusData, AppData, Gender, SectionKey, PatientData } from './types';
import { ANAMNESIS_SECTIONS, STATUS_SECTIONS } from './constants';
import AnamnesisSection from './components/AnamnesisSection';
import StatusSection from './components/StatusSection';
import OutputDisplay from './components/OutputDisplay';
import { HeaderIcon, UserIcon } from './components/Icons';

const initialAnamnesisState: AnamnesisSectionData = {
  isAsked: false,
  isOk: true,
  details: '',
};

const initialStatusState: StatusData = {
  general: { isAsked: false, isOk: true, details: '' },
  vitals: {
    temperature: null,
    bloodPressure: '',
    pulse: null,
    respiratoryRate: null,
    spo2: null,
    weight: null,
    height: null,
    bmi: null,
    waist: null,
  },
  head: { isAsked: false, isOk: true, details: '', subfindings: {} },
  neck: { isAsked: false, isOk: true, details: '', subfindings: {} },
  chest: { isAsked: false, isOk: true, details: '', subfindings: {} },
  heart: { isAsked: false, isOk: true, details: '', subfindings: {} },
  abdomen: { isAsked: false, isOk: true, details: '', subfindings: {} },
  limbs: { isAsked: false, isOk: true, details: '' },
};

const initialPatientData: PatientData = {
    ime: '',
    priimek: '',
    starost: '',
    poklic: ''
};

const App: React.FC = () => {
  const [gender, setGender] = useState<Gender>(Gender.Female);
  const [patientData, setPatientData] = useState<PatientData>(initialPatientData);

  const initializeState = useCallback(() => {
    const anamnesisData: { [key: string]: AnamnesisSectionData } = {};
    Object.keys(ANAMNESIS_SECTIONS).forEach(key => {
      anamnesisData[key] = { ...initialAnamnesisState };
    });
    return {
      anamnesis: anamnesisData,
      status: JSON.parse(JSON.stringify(initialStatusState)),
    };
  }, []);

  const [appData, setAppData] = useState<AppData>(initializeState());
  const [generatedText, setGeneratedText] = useState<string>('');
  
  useEffect(() => {
    setAppData(initializeState());
  }, [gender, initializeState]);

  const handlePatientDataChange = (field: keyof PatientData, value: string) => {
    setPatientData(prev => ({ ...prev, [field]: value }));
  };

  const handleAnamnesisChange = (key: SectionKey, field: keyof AnamnesisSectionData, value: string | boolean) => {
    setAppData(prev => ({
      ...prev,
      anamnesis: {
        ...prev.anamnesis,
        [key]: {
          ...prev.anamnesis[key],
          [field]: value
        }
      }
    }));
  };

    const handleStatusChange = (section: keyof StatusData, key: string, value: any) => {
        setAppData(prev => {
            const newStatus = JSON.parse(JSON.stringify(prev.status)); // Deep copy
            if (section === 'vitals') {
                (newStatus.vitals as any)[key] = value;
                const weight = newStatus.vitals.weight;
                const height = newStatus.vitals.height;
                if (weight && height && height > 0) {
                    newStatus.vitals.bmi = parseFloat((weight / ((height / 100) ** 2)).toFixed(1));
                } else {
                    newStatus.vitals.bmi = null;
                }
            } else {
                if (key.startsWith('subfindings.')) {
                    const subKey = key.split('.')[1];
                    if (!(newStatus[section] as any).subfindings) {
                        (newStatus[section] as any).subfindings = {};
                    }
                    (newStatus[section] as any).subfindings[subKey] = value;
                } else {
                    (newStatus[section] as any)[key] = value;
                }
            }
            return { ...prev, status: newStatus };
        });
    };

  const visibleAnamnesisKeys = useMemo(() => {
    return Object.keys(ANAMNESIS_SECTIONS).filter(key => {
      const section = ANAMNESIS_SECTIONS[key as SectionKey];
      if (!section.gender) return true;
      return section.gender === gender;
    });
  }, [gender]);
  
  const mainPreRosKeys = useMemo(() => {
    return visibleAnamnesisKeys.filter(key => ANAMNESIS_SECTIONS[key as SectionKey].group === 'main_pre_ros');
  }, [visibleAnamnesisKeys]);
  
  const rosAnamnesisKeys = useMemo(() => {
    return visibleAnamnesisKeys.filter(key => ANAMNESIS_SECTIONS[key as SectionKey].group === 'ros');
  }, [visibleAnamnesisKeys]);
  
  const mainPostRosKeys = useMemo(() => {
    return visibleAnamnesisKeys.filter(key => ANAMNESIS_SECTIONS[key as SectionKey].group === 'main_post_ros');
  }, [visibleAnamnesisKeys]);


  const generateReport = () => {
    const reportParts: string[] = [];

    const cleanup = (str: string) => {
        if (!str) return '';
        return str
            .replace(/:\s*:/g, ':')
            .replace(/\s{2,}/g, ' ')
            .replace(/ \./g, '.')
            .replace(/ ,/g, ',')
            .replace(/\.{2,}/g, '.')
            .replace(/,\./g, '.')
            .trim();
    };
    
    // 1. Osnovni podatki
    const { ime, priimek, starost, poklic } = patientData;
    if (ime || priimek || starost || poklic) {
        const starostText = starost ? `${starost} let` : '';
        const poklicText = poklic ? `, ${poklic}` : '';
        reportParts.push(`Osnovni podatki: ${ime} ${priimek}${starostText ? ', ' + starostText : ''}${poklicText}.`);
    }

    const reportOrder: SectionKey[] = [
        'mainComplaint',
        'familyHistory',
        'childhoodIllnesses',
        'pastIllnesses',
        'currentIllness',
        'medications',
        'vaccinations',
        'allergies',
        'addictions',
        'socialHistory',
    ];
    
    reportOrder.forEach(key => {
        const state = appData.anamnesis[key];
        const config = ANAMNESIS_SECTIONS[key];
        if (state && state.isAsked) {
            let text = state.isOk ? config.neg_text : state.details;

            if (key === 'currentIllness') {
                const rosText = rosAnamnesisKeys
                    .map(rosKey => {
                        const rosState = appData.anamnesis[rosKey];
                        if (rosState && rosState.isAsked) {
                            return rosState.isOk ? ANAMNESIS_SECTIONS[rosKey].neg_text : rosState.details;
                        }
                        return null;
                    })
                    .filter(Boolean)
                    .join('. ');

                text = [text, rosText].filter(Boolean).join('. ');
            }
            reportParts.push(`${config.reportLabel}: ${cleanup(text)}`);
        }
    });

    const vitals = appData.status.vitals;
    const vitalStrings = [
        vitals.temperature ? `TT ${vitals.temperature}°C` : '',
        vitals.bloodPressure ? `RR ${vitals.bloodPressure} mmHg` : '',
        vitals.pulse ? `pulz ${vitals.pulse}/min` : '',
        vitals.respiratoryRate ? `fr. ${vitals.respiratoryRate}/min` : '',
        vitals.spo2 ? `SpO2 ${vitals.spo2}%` : '',
        vitals.weight ? `teža ${vitals.weight} kg` : '',
        vitals.height ? `višina ${vitals.height} cm` : '',
        vitals.bmi ? `ITM ${vitals.bmi} kg/m²` : '',
        vitals.waist ? `obseg pasu ${vitals.waist} cm` : '',
    ].filter(Boolean);

    if (vitalStrings.length > 0) {
        reportParts.push(`Vitalne funkcije: ${vitalStrings.join(', ')}.`);
    }

    const statusOrder: (keyof typeof STATUS_SECTIONS)[] = ['general', 'head', 'neck', 'chest', 'heart', 'abdomen', 'limbs'];

    statusOrder.forEach(key => {
        const sectionKey = key as keyof typeof STATUS_SECTIONS;
        const state = appData.status[sectionKey];
        const config = STATUS_SECTIONS[sectionKey];

        if (state.isAsked) {
            let text: string;
            if (state.isOk) {
                text = config.neg_text;
            } else {
                const subfindingTexts = Object.keys(state.subfindings || {})
                    .filter(subKey => state.subfindings && state.subfindings[subKey])
                    .map(subKey => config.subfindingsConfig?.[subKey]?.reportText)
                    .filter(Boolean);
                
                const combinedDetails = [state.details, ...subfindingTexts].filter(p => p && p.trim() && p !== config.neg_text).join('. ');
                text = combinedDetails || "Prisotna odstopanja.";
            }
            reportParts.push(`${config.reportLabel}: ${cleanup(text)}`);
        }
    });


    setGeneratedText(reportParts.join('\n\n'));
  };


  return (
    <div className="min-h-screen bg-light-cyan font-sans text-charcoal">
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-blue/30 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <HeaderIcon />
            <h1 className="text-xl md:text-2xl font-bold text-charcoal">Pomagač pri zapisu ANAMNEZE in STATUSA</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="mb-8 text-center text-sm text-steel-gray bg-pale-blue/50 p-4 rounded-lg border border-slate-blue/30">
            <p className="font-semibold text-charcoal">To aplikacijo je ustvaril študent medicine Štefan Grašič (2025) kot pripomoček za študente in druge zdravstvene delavce.</p>
            <p className="mt-1">Če imate predloge za izboljšave, me prosim kontaktirajte na <a href="https://www.linkedin.com/in/štefan-grašič-562451228/?originalSubdomain=si" target="_blank" rel="noopener noreferrer" className="text-charcoal font-bold hover:underline">LinkedIn</a>.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-lg border border-slate-blue/30 shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-charcoal border-b border-slate-blue/30 pb-2">Osnovni podatki</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="ime" className="block text-sm font-medium text-steel-gray">Ime</label>
                        <input type="text" id="ime" value={patientData.ime} onChange={e => handlePatientDataChange('ime', e.target.value)} className="mt-1 w-full p-2 border border-slate-blue rounded-md bg-white focus:ring-1 focus:ring-steel-gray"/>
                    </div>
                    <div>
                        <label htmlFor="priimek" className="block text-sm font-medium text-steel-gray">Priimek</label>
                        <input type="text" id="priimek" value={patientData.priimek} onChange={e => handlePatientDataChange('priimek', e.target.value)} className="mt-1 w-full p-2 border border-slate-blue rounded-md bg-white focus:ring-1 focus:ring-steel-gray"/>
                    </div>
                    <div>
                        <label htmlFor="starost" className="block text-sm font-medium text-steel-gray">Starost</label>
                        <input type="text" id="starost" value={patientData.starost} onChange={e => handlePatientDataChange('starost', e.target.value)} className="mt-1 w-full p-2 border border-slate-blue rounded-md bg-white focus:ring-1 focus:ring-steel-gray"/>
                    </div>
                    <div>
                        <label htmlFor="poklic" className="block text-sm font-medium text-steel-gray">Poklic</label>
                        <input type="text" id="poklic" value={patientData.poklic} onChange={e => handlePatientDataChange('poklic', e.target.value)} className="mt-1 w-full p-2 border border-slate-blue rounded-md bg-white focus:ring-1 focus:ring-steel-gray"/>
                    </div>
                </div>
            </div>

            <div className="bg-pale-blue/50 p-6 rounded-lg border border-slate-blue/30">
              <h2 className="text-2xl font-bold mb-4 text-charcoal border-b border-slate-blue/30 pb-2">Nastavitve in opomnik</h2>
              <div className="bg-white/50 border-l-4 border-steel-gray text-charcoal p-4 rounded-md mb-6" role="alert">
                <p className="font-bold mb-2">Opomnik pred pregledom:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-steel-gray">
                    <li><b>Higiena rok:</b> Ne pozabi na 5 trenutkov za higieno rok (razkuževanje).</li>
                    <li><b>Priprava okolja in pacienta:</b> Zagotovi primerno osvetljen in ogrevan prostor, razkuženo mizo, zasebnost in udobje. Ogrej in razkuži si roke ter po potrebi uporabi zaščitno opremo. Pripravi bolnika na sodelovanje.</li>
                </ul>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="gender-select" className="flex items-center text-md font-medium text-charcoal mb-2">
                    <UserIcon /> Biološki spol pacienta
                  </label>
                  <select id="gender-select" value={gender} onChange={e => setGender(e.target.value as Gender)} className="w-full p-2 border border-slate-blue rounded-md focus:ring-1 focus:ring-steel-gray transition bg-white">
                    <option value={Gender.Female}>Ženska</option>
                    <option value={Gender.Male}>Moški</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4 text-charcoal">Anamneza</h2>
              <div className="space-y-4">
                {mainPreRosKeys.map(key => (
                  <AnamnesisSection
                    key={key}
                    sectionKey={key}
                    label={ANAMNESIS_SECTIONS[key as SectionKey].label}
                    data={appData.anamnesis[key]}
                    neg_text={ANAMNESIS_SECTIONS[key as SectionKey].neg_text}
                    onChange={(field, value) => handleAnamnesisChange(key as SectionKey, field, value)}
                  />
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-blue/30 shadow-sm">
              <h3 className="text-2xl font-bold text-charcoal border-b border-slate-blue/30 pb-2 mb-4">Pregled po organskih sistemih</h3>
              <div className="space-y-4">
                  {rosAnamnesisKeys.map(key => (
                    <AnamnesisSection
                      key={key}
                      sectionKey={key}
                      label={ANAMNESIS_SECTIONS[key as SectionKey].label}
                      data={appData.anamnesis[key]}
                      neg_text={ANAMNESIS_SECTIONS[key as SectionKey].neg_text}
                      onChange={(field, value) => handleAnamnesisChange(key as SectionKey, field, value)}
                    />
                  ))}
              </div>
            </div>

             <div className="mt-8 space-y-4">
                {mainPostRosKeys.map(key => (
                  <AnamnesisSection
                    key={key}
                    sectionKey={key}
                    label={ANAMNESIS_SECTIONS[key as SectionKey].label}
                    data={appData.anamnesis[key]}
                    neg_text={ANAMNESIS_SECTIONS[key as SectionKey].neg_text}
                    onChange={(field, value) => handleAnamnesisChange(key as SectionKey, field, value)}
                  />
                ))}
            </div>

            <div className="mt-8">
              <h2 className="text-3xl font-bold mb-4 text-charcoal">Status</h2>
              <div className="space-y-4">
                <StatusSection
                  data={appData.status}
                  onChange={handleStatusChange}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <OutputDisplay text={generatedText} onGenerate={generateReport} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;