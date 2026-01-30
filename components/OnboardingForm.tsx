
import React, { useState } from 'react';
import { BusinessProfile } from '../types';
import { extractColorsFromLogo } from '../services/geminiService';

interface OnboardingFormProps {
  onSubmit: (profile: BusinessProfile) => void;
  isLoading: boolean;
}

const OnboardingForm: React.FC<OnboardingFormProps> = ({ onSubmit, isLoading }) => {
  const [step, setStep] = useState(1);
  const [extractingColors, setExtractingColors] = useState(false);
  const [profile, setProfile] = useState<BusinessProfile>({
    name: '',
    businessType: '',
    targetAudience: '',
    region: '',
    objective: 'vender',
    style: 'popular',
    manualColors: []
  });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setProfile(prev => ({ ...prev, logoUrl: base64 }));
      
      setExtractingColors(true);
      try {
        const colors = await extractColorsFromLogo(base64);
        setProfile(prev => ({ ...prev, manualColors: colors }));
      } catch (err) {
        console.error("Failed to extract colors", err);
      } finally {
        setExtractingColors(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(profile);
  };

  const inputClasses = "w-full p-4 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-0 outline-none transition-all text-lg";
  const labelClasses = "block text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wider";

  return (
    <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden p-8 md:p-12">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Diagnóstico Inteligente</h2>
        <p className="text-slate-500">Responda as perguntas e deixe a IA cuidar do resto.</p>
        <div className="mt-6 flex justify-center gap-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`h-2 w-12 rounded-full transition-all ${step >= i ? 'bg-indigo-600' : 'bg-slate-200'}`} />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="space-y-6 text-left">
            <div>
              <label className={labelClasses}>Logo da sua Marca (Opcional)</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center overflow-hidden bg-slate-50">
                  {profile.logoUrl ? (
                    <img src={profile.logoUrl} className="w-full h-full object-contain" alt="Logo preview" />
                  ) : (
                    <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  )}
                </div>
                <div className="flex-1">
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" id="logo-input" />
                  <label htmlFor="logo-input" className="cursor-pointer bg-slate-100 px-4 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors inline-block mb-1">
                    Upload Logo
                  </label>
                  <p className="text-[10px] text-slate-400">A IA vai extrair as cores automaticamente.</p>
                </div>
              </div>
              {extractingColors && <p className="text-[10px] text-indigo-600 font-bold mt-2 animate-pulse">Extraindo cores da logo...</p>}
              {profile.manualColors && profile.manualColors.length > 0 && (
                <div className="mt-3 flex gap-2">
                  {profile.manualColors.map((c, i) => (
                    <div key={i} className="w-6 h-6 rounded-md shadow-sm border border-white" style={{ backgroundColor: c }} />
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className={labelClasses}>Nome do seu Negócio</label>
              <input 
                required
                type="text" 
                placeholder="Ex: Barber Shop do João" 
                className={inputClasses}
                value={profile.name}
                onChange={e => setProfile({...profile, name: e.target.value})}
              />
            </div>
            <button type="button" onClick={nextStep} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
              Próximo
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 text-left">
            <div>
              <label className={labelClasses}>O que você faz?</label>
              <input 
                required
                type="text" 
                placeholder="Ex: Barbeiro, Manicure, Venda de Bolos" 
                className={inputClasses}
                value={profile.businessType}
                onChange={e => setProfile({...profile, businessType: e.target.value})}
              />
            </div>
            <div>
              <label className={labelClasses}>Para quem você vende?</label>
              <input 
                required
                type="text" 
                placeholder="Ex: Mulheres de 20-40 anos" 
                className={inputClasses}
                value={profile.targetAudience}
                onChange={e => setProfile({...profile, targetAudience: e.target.value})}
              />
            </div>
            <div className="flex gap-4">
              <button type="button" onClick={prevStep} className="flex-1 border-2 border-slate-200 py-4 rounded-xl font-bold text-slate-600">Voltar</button>
              <button type="button" onClick={nextStep} className="flex-[2] bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200">Próximo</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 text-left">
            <div>
              <label className={labelClasses}>Onde você atua?</label>
              <input 
                required
                type="text" 
                placeholder="Ex: São Paulo, Bairro Itaim" 
                className={inputClasses}
                value={profile.region}
                onChange={e => setProfile({...profile, region: e.target.value})}
              />
            </div>
            <div>
              <label className={labelClasses}>Objetivo Principal</label>
              <select 
                className={inputClasses}
                value={profile.objective}
                onChange={e => setProfile({...profile, objective: e.target.value as any})}
              >
                <option value="vender">Vender mais produtos/serviços</option>
                <option value="atrair">Atrair novos seguidores/clientes</option>
                <option value="autoridade">Ser visto como especialista</option>
              </select>
            </div>
            <div className="flex gap-4">
              <button type="button" onClick={prevStep} className="flex-1 border-2 border-slate-200 py-4 rounded-xl font-bold text-slate-600">Voltar</button>
              <button type="button" onClick={nextStep} className="flex-[2] bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200">Próximo</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 text-left">
            <div>
              <label className={labelClasses}>Estilo da Marca</label>
              <select 
                className={inputClasses}
                value={profile.style}
                onChange={e => setProfile({...profile, style: e.target.value as any})}
              >
                <option value="popular">Popular e Acessível</option>
                <option value="descontraido">Descontraído e Moderno</option>
                <option value="serio">Sério e Profissional</option>
              </select>
            </div>
            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
              <p className="text-indigo-900 text-sm font-medium">✨ Estamos quase lá! A IA vai analisar tudo isso e gerar seu plano viral agora.</p>
            </div>
            <div className="flex gap-4">
              <button type="button" onClick={prevStep} className="flex-1 border-2 border-slate-200 py-4 rounded-xl font-bold text-slate-600">Voltar</button>
              <button disabled={isLoading} type="submit" className="flex-[2] bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 disabled:opacity-50">
                {isLoading ? 'Gerando Plano...' : 'Criar Meu Plano! 🚀'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default OnboardingForm;
