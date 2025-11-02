import React from 'react';
import { StatusData, SectionData } from '../types';
import { STATUS_SECTIONS } from '../constants';

interface StatusSectionProps {
  data: StatusData;
  onChange: (section: keyof StatusData, key: string, value: any) => void;
}

const Section: React.FC<{
    sectionKey: keyof typeof STATUS_SECTIONS;
    data: SectionData;
    onChange: (field: string, value: any) => void;
}> = ({ sectionKey, data, onChange }) => {
    const config = STATUS_SECTIONS[sectionKey];
    
    const handleIsOkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isNowOk = e.target.checked;
        onChange('isOk', isNowOk);
        if (!isNowOk) {
            onChange('details', config.neg_text);
        } else {
            onChange('details', '');
            if (config.subfindingsConfig) {
                Object.keys(config.subfindingsConfig).forEach(subKey => {
                    onChange(`subfindings.${subKey}`, false);
                });
            }
        }
    };
    
    return (
        <div className="bg-white p-4 rounded-lg border border-slate-blue/30 transition-all hover:border-slate-blue shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <label htmlFor={`asked-${sectionKey}`} className="flex items-center space-x-3 cursor-pointer">
                    <input
                        id={`asked-${sectionKey}`}
                        type="checkbox"
                        checked={data.isAsked}
                        onChange={(e) => {
                            const isNowAsked = e.target.checked;
                            onChange('isAsked', isNowAsked);
                            if(!isNowAsked) {
                                onChange('isOk', true);
                                onChange('details', '');
                                if (config.subfindingsConfig) {
                                    Object.keys(config.subfindingsConfig).forEach(subKey => {
                                        onChange(`subfindings.${subKey}`, false);
                                    });
                                }
                            }
                        }}
                        className="h-5 w-5 rounded border-slate-blue/60 text-steel-gray focus:ring-steel-gray"
                    />
                    <span className="font-semibold text-charcoal">{config.label}</span>
                </label>
                <div className="flex items-center space-x-4 mt-3 sm:mt-0">
                    <label htmlFor={`ok-${sectionKey}`} className={`flex items-center space-x-2 transition-opacity ${data.isAsked ? 'opacity-100 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}>
                        <input
                            id={`ok-${sectionKey}`}
                            type="checkbox"
                            checked={data.isOk}
                            disabled={!data.isAsked}
                            onChange={handleIsOkChange}
                            className="h-5 w-5 rounded border-slate-blue/60 text-green-600 focus:ring-green-500 disabled:bg-slate-200"
                        />
                        <span className="text-sm font-medium text-steel-gray">Brez posebnosti</span>
                    </label>
                </div>
            </div>
            {data.isAsked && !data.isOk && (
                <div className="mt-4 pl-8 space-y-4">
                    {config.subfindingsConfig && (
                      <div>
                        <h4 className="text-sm font-medium text-steel-gray mb-2">Specifične ugotovitve:</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">
                          {Object.entries(config.subfindingsConfig).map(([subKey, subConfig]) => (
                            <label key={subKey} className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={data.subfindings?.[subKey] ?? false}
                                onChange={(e) => onChange(`subfindings.${subKey}`, e.target.checked)}
                                className="h-4 w-4 rounded border-slate-blue/60 text-steel-gray focus:ring-steel-gray"
                              />
                              <span className="text-sm text-charcoal">{subConfig.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                        <label htmlFor={`details-${sectionKey}`} className="block text-sm font-medium text-steel-gray mb-1">
                            Dodaten opis statusa:
                        </label>
                        <textarea
                            id={`details-${sectionKey}`}
                            value={data.details}
                            onChange={(e) => onChange('details', e.target.value)}
                            rows={3}
                            className="w-full p-2 border border-slate-blue rounded-md focus:ring-1 focus:ring-steel-gray transition bg-white text-charcoal placeholder:text-slate-blue"
                            placeholder="Vpišite dodatna odstopanja..."
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

const StatusSection: React.FC<StatusSectionProps> = ({ data, onChange }) => {
  const handleVitalsChange = (key: string, value: string) => {
    const numValue = value === '' ? null : parseFloat(value.replace(',', '.'));
    onChange('vitals', key, key === 'bloodPressure' ? value : numValue);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg border border-slate-blue/30 shadow-sm">
        <h3 className="font-bold text-lg mb-3 text-charcoal">Vitalni znaki</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries({
            'Telesna temp. (°C)': ['temperature', data.vitals.temperature],
            'Krvni tlak (mmHg)': ['bloodPressure', data.vitals.bloodPressure],
            'Pulz (/min)': ['pulse', data.vitals.pulse],
            'Dihanje (/min)': ['respiratoryRate', data.vitals.respiratoryRate],
            'SpO2 (%)': ['spo2', data.vitals.spo2],
            'Teža (kg)': ['weight', data.vitals.weight],
            'Višina (cm)': ['height', data.vitals.height],
            'Obseg pasu (cm)': ['waist', data.vitals.waist],
          }).map(([label, [key, value]]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-steel-gray mb-1">{label}</label>
              <input 
                type={key === 'bloodPressure' ? 'text' : 'number'}
                value={value ?? ''}
                onChange={(e) => handleVitalsChange(key, e.target.value)}
                className="w-full p-2 border border-slate-blue rounded-md focus:ring-1 focus:ring-steel-gray bg-white"
              />
            </div>
          ))}
           <div>
              <label className="block text-sm font-medium text-steel-gray mb-1">ITM (kg/m²)</label>
              <input 
                type="text"
                value={data.vitals.bmi ?? '...'}
                readOnly
                className="w-full p-2 border border-slate-blue/30 rounded-md bg-slate-100 text-steel-gray"
              />
            </div>
        </div>
      </div>
      
      {Object.keys(STATUS_SECTIONS).map(key => (
        <Section 
            key={key} 
            sectionKey={key as keyof typeof STATUS_SECTIONS}
            data={data[key as keyof StatusData] as SectionData}
            onChange={(field, value) => onChange(key as keyof StatusData, field, value)}
        />
      ))}
    </div>
  );
};

export default StatusSection;