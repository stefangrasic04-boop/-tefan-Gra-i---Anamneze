
import React, { useState } from 'react';
import { CopyIcon, CheckIcon } from './Icons';

interface OutputDisplayProps {
  text: string;
  onGenerate: () => void;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ text, onGenerate }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-pale-blue/50 p-6 rounded-lg border border-slate-blue/30 space-y-4 shadow-sm">
      <h2 className="text-2xl font-bold text-charcoal">Generiran zapis</h2>
      
      <button
        onClick={onGenerate}
        className="w-full bg-charcoal text-white font-bold py-3 px-4 rounded-lg hover:bg-steel-gray focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-charcoal transition-colors duration-300"
      >
        Generiraj zapis
      </button>

      <div className="relative">
        <textarea
          value={text}
          readOnly
          rows={20}
          className="w-full p-3 border border-slate-blue/50 rounded-md bg-white text-sm font-mono leading-relaxed text-steel-gray"
          placeholder="Tukaj se bo prikazal generiran klinični zapis..."
        />
        <button
          onClick={handleCopy}
          disabled={!text}
          className="absolute top-2 right-2 p-2 rounded-md bg-slate-blue/20 hover:bg-slate-blue/40 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition"
          aria-label="Copy to clipboard"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      </div>
    </div>
  );
};

export default OutputDisplay;