import React, { useState } from 'react';
import { generateNaturalLanguageRule } from '../api';
import { Sparkles, Code, CheckCircle, RefreshCw, Terminal } from 'lucide-react';

export const AiRuleGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('Create a rule that checks if interest rate exceeds 30.0% for non-jumbo loans');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRule, setGeneratedRule] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError(null);
    try {
      const res = await generateNaturalLanguageRule(prompt);
      setGeneratedRule(res);
    } catch (err: any) {
      setError(err.message || 'Generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      <div className="glass-panel p-6 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/20 to-slate-900/60 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">AI Assistant Stretch Module</span>
          <h2 className="text-2xl font-bold text-white mt-1">Natural Language Validation Rule Generator</h2>
          <p className="text-sm text-slate-400 mt-1">
            Describe a custom business constraint in plain English. The AI engine synthesizes a validated JSON rule payload.
          </p>
        </div>
        <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
          <Sparkles className="w-8 h-8" />
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <label className="text-xs font-bold text-slate-300 block uppercase tracking-wider">Natural Language Business Rule Description</label>
        
        <textarea
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Flag any record where origination date is after maturity date or borrower state is outside target region..."
          className="w-full bg-slate-900 text-sm text-slate-200 p-4 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-500 font-sans"
        />

        <div className="flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white shadow-lg shadow-amber-500/20 flex items-center space-x-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Synthesizing Rule JSON...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Rule Payload</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}
      </div>

      {generatedRule && (
        <div className="glass-panel p-6 rounded-2xl border border-emerald-500/40 bg-slate-950 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-emerald-400 flex items-center space-x-2">
              <Code className="w-4 h-4" />
              <span>Generated ValidationRule JSON</span>
            </h3>
            <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-500/30">
              SYNTHESIS SUCCESS
            </span>
          </div>

          <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-indigo-300 font-mono overflow-x-auto">
            {JSON.stringify(generatedRule, null, 2)}
          </pre>
        </div>
      )}

    </div>
  );
};
