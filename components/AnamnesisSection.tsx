import React from 'react';
import { AnamnesisSectionData } from '../types';

interface AnamnesisSectionProps {
  sectionKey: string;
  label: string;
  data: AnamnesisSectionData;
  neg_text: string;
  onChange: (field: keyof AnamnesisSectionData, value: string | boolean) => void;
}

const AnamnesisSection: React.FC<AnamnesisSectionProps> = ({ sectionKey, label, data, neg_text, onChange }) => {
  const { isAsked, isOk, details } = data;

  const handleIsAskedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    onChange('isAsked', checked);
    if (!checked) {
      // Reset subordinate fields when "isAsked" is unchecked
      onChange('isOk', true);
      onChange('details', '');
    }
  };

  const handleIsOkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isNowOk = e.target.checked;
    onChange('isOk', isNowOk);
    if (!isNowOk) {
      onChange('details', neg_text);
    } else {
      onChange('details', '');
    }
  };
  
  const handleDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange('details', e.target.value);
  };

  const detailsId = `details-${sectionKey}`;

  return (
    <div className="bg-white p-4 rounded-lg border border-slate-blue/30 transition-all hover:border-slate-blue shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <label htmlFor={`asked-${sectionKey}`} className="flex items-center space-x-3 cursor-pointer">
          <input
            id={`asked-${sectionKey}`}
            type="checkbox"
            checked={isAsked}
            onChange={handleIsAskedChange}
            className="h-5 w-5 rounded border-slate-blue/60 text-steel-gray focus:ring-steel-gray"
          />
          <span className="font-semibold text-charcoal">{label}</span>
        </label>
        
        <div className="flex items-center space-x-4 mt-3 sm:mt-0">
          <label htmlFor={`ok-${sectionKey}`} className={`flex items-center space-x-2 transition-opacity ${isAsked ? 'opacity-100 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}>
            <input
              id={`ok-${sectionKey}`}
              type="checkbox"
              checked={isOk}
              disabled={!isAsked}
              onChange={handleIsOkChange}
              className="h-5 w-5 rounded border-slate-blue/60 text-green-600 focus:ring-green-500 disabled:bg-slate-200"
            />
            <span className="text-sm font-medium text-steel-gray">Brez posebnosti</span>
          </label>
        </div>
      </div>

      {isAsked && !isOk && (
        <div className="mt-4 pl-8">
          <label htmlFor={detailsId} className="block text-sm font-medium text-steel-gray mb-1">
            Opis odstopanj:
          </label>
          <textarea
            id={detailsId}
            value={details}
            onChange={handleDetailsChange}
            rows={3}
            className="w-full p-2 border border-slate-blue rounded-md focus:ring-1 focus:ring-steel-gray transition bg-white text-charcoal placeholder:text-slate-blue"
            placeholder="Vpišite odstopanja od normale..."
          />
        </div>
      )}
    </div>
  );
};

export default AnamnesisSection;