
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
    productDescription: '',
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

  const inputClasses = "w-full p-5 bg-slate-800 rounded-2xl border-2 border-slate-700 focus:border-green-500 focus:ring-0 outline-none transition-all text-white font-medium text-lg placeholder:text-slate-600";
  const textareaClasses = "w-full p-5 bg-slate-800 rounded-2xl border-2 border-slate-700 focus:border-green-500 focus:ring-0 outline-none transition-all text-white font-medium text-lg min-h-[150px] placeholder:text-slate-600";
  const labelClasses = "block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em]";

  const totalSteps = 5;

  return (
    <div className="max-w-xl mx-auto bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-800 overflow-hidden p-10 md:p-14">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase">DIAGNOSTIC ENGINE</h2>
        <p className="text-slate-500 font-medium">Deixe a IA mapear seu império digital.</p>
        <div className="mt-8 flex justify-center gap-3">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className={`h-1.5 w-10 rounded-full transition-all duration-500 ${step > i ? 'bg-green-500' : 'bg-slate-800'}`} />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="space-y-8 text-left animate-in slide-in-from-right-4 duration-300">
            <div>
              <label className={labelClasses}>Marca & Identidade Visual</label>
              <div className="flex items-center gap-6 p-6 bg-slate-950 rounded-3xl border border-slate-800">
                <div className="w-24 h-24 border-2 border-dashed border-slate-800 rounded-3xl flex items-center justify-center overflow-hidden bg-slate-900 relative group">
                  {profile.logoUrl ? (
                    <img src={profile.logoUrl} className="w-full h-full object-contain" alt="Logo preview" />
                  ) : (
                    <svg className="w-10 h-10 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  )}
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" id="logo-input" />
                  <label htmlFor="logo-input" className="absolute inset-0 cursor-pointer bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                    <span className="text-white text-[10px] font-black opacity-0 group-hover:opacity-100 uppercase tracking-widest">ALTERAR</span>
                  </label>
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-black uppercase text-xs tracking-tighter mb-1">Envie sua Logo</h4>
                  <p className="text-[10px] text-slate-500 leading-snug">A IA extrairá automaticamente a paleta base de cores da imagem enviada.</p>
                  {extractingColors && <p className="text-[10px] text-green-400 font-black mt-3 animate-pulse uppercase tracking-widest">Extraindo cores...</p>}
                  {profile.manualColors && profile.manualColors.length > 0 && (
                    <div className="mt-4 flex gap-2">
                      {profile.manualColors.map((c, i) => (
                        <div key={i} className="w-6 h-6 rounded-lg shadow-inner border border-slate-800" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div>
              <label className={labelClasses}>Nome do Negócio</label>
              <input 
                required
                type="text" 
                placeholder="Ex: UG AI Agency" 
                className={inputClasses}
                value={profile.name}
                onChange={e => setProfile({...profile, name: e.target.value})}
              />
            </div>
            <button type="button" onClick={nextStep} className="w-full bg-green-500 text-slate-950 py-5 rounded-[2rem] font-black text-lg hover:brightness-110 transition-all shadow-xl shadow-green-500/10">
              PRÓXIMO PASSO
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 text-left animate-in slide-in-from-right-4 duration-300">
            <div>
              <label className={labelClasses}>O que você vende / faz?</label>
              <input 
                required
                type="text" 
                placeholder="Ex: Consultoria Tech, Estética, Delivery de Pizza" 
                className={inputClasses}
                value={profile.businessType}
                onChange={e => setProfile({...profile, businessType: e.target.value})}
              />
            </div>
            <div>
              <label className={labelClasses}>Descrição do Produto/Serviço</label>
              <textarea 
                required
                placeholder="Descreva detalhes como diferenciais, preços (se quiser), o que torna seu produto único..." 
                className={textareaClasses}
                value={profile.productDescription}
                onChange={e => setProfile({...profile, productDescription: e.target.value})}
              />
            </div>
            <div className="flex gap-4">
              <button type="button" onClick={prevStep} className="flex-1 bg-slate-800 border-2 border-slate-700 py-5 rounded-[2rem] font-black text-slate-400">VOLTAR</button>
              <button type="button" onClick={nextStep} className="flex-[2] bg-green-500 text-slate-950 py-5 rounded-[2rem] font-black hover:brightness-110 shadow-xl shadow-green-500/10">CONTINUAR</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 text-left animate-in slide-in-from-right-4 duration-300">
            <div>
              <label className={labelClasses}>Quem é seu Cliente Ideal?</label>
              <input 
                required
                type="text" 
                placeholder="Ex: Empreendedores digitais, 25-45 anos, classe A" 
                className={inputClasses}
                value={profile.targetAudience}
                onChange={e => setProfile({...profile, targetAudience: e.target.value})}
              />
            </div>
            <div>
              <label className={labelClasses}>Região de Atuação</label>
              <input 
                required
                type="text" 
                placeholder="Ex: Brasil todo, São Paulo Capital, Portugal" 
                className={inputClasses}
                value={profile.region}
                onChange={e => setProfile({...profile, region: e.target.value})}
              />
            </div>
            <div className="flex gap-4">
              <button type="button" onClick={prevStep} className="flex-1 bg-slate-800 border-2 border-slate-700 py-5 rounded-[2rem] font-black text-slate-400">VOLTAR</button>
              <button type="button" onClick={nextStep} className="flex-[2] bg-green-500 text-slate-950 py-5 rounded-[2rem] font-black hover:brightness-110 shadow-xl shadow-green-500/10">CONTINUAR</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8 text-left animate-in slide-in-from-right-4 duration-300">
            <div>
              <label className={labelClasses}>Foco do Marketing</label>
              <select 
                className={inputClasses}
                value={profile.objective}
                onChange={e => setProfile({...profile, objective: e.target.value as any})}
              >
                <option value="vender">Conversão em Vendas</option>
                <option value="atrair">Growth / Novos Seguidores</option>
                <option value="autoridade">Brand Authority / Especialista</option>
              </select>
            </div>
            <div>
              <label className={labelClasses}>Tom de Voz / Estilo</label>
              <select 
                className={inputClasses}
                value={profile.style}
                onChange={e => setProfile({...profile, style: e.target.value as any})}
              >
                <option value="popular">Popular & Direto</option>
                <option value="descontraido">Moderno & Criativo</option>
                <option value="serio">Premium & Profissional</option>
              </select>
            </div>
            <div className="flex gap-4">
              <button type="button" onClick={prevStep} className="flex-1 bg-slate-800 border-2 border-slate-700 py-5 rounded-[2rem] font-black text-slate-400">VOLTAR</button>
              <button type="button" onClick={nextStep} className="flex-[2] bg-green-500 text-slate-950 py-5 rounded-[2rem] font-black hover:brightness-110 shadow-xl shadow-green-500/10">CONTINUAR</button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-8 text-left animate-in slide-in-from-right-4 duration-300">
            <div className="bg-slate-950 p-8 rounded-[2rem] border border-slate-800 text-center">
              <p className="text-green-400 text-sm font-black uppercase tracking-widest mb-2">✨ TUDO PRONTO PARA O LANÇAMENTO.</p>
              <p className="text-slate-500 text-xs">O diagnóstico será processado pelo nosso motor de IA Sênior.</p>
            </div>
            <div className="flex gap-4">
              <button type="button" onClick={prevStep} className="flex-1 bg-slate-800 border-2 border-slate-700 py-5 rounded-[2rem] font-black text-slate-400">VOLTAR</button>
              <button disabled={isLoading} type="submit" className="flex-[2] bg-gradient-to-r from-green-500 to-cyan-500 text-slate-950 py-5 rounded-[2rem] font-black hover:brightness-110 shadow-xl shadow-green-500/20 disabled:opacity-50">
                {isLoading ? 'GERANDO...' : 'EXECUTAR PLANO 🚀'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default OnboardingForm;
