
import React, { useState } from 'react';
import { BusinessProfile, Platform } from '../types';
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
    businessMoment: '',
    targetAudience: '',
    region: '',
    objective: 'vender',
    style: 'popular',
    selectedPlatforms: ['Instagram', 'TikTok'],
    postsPerDay: 1,
    selectedDaysOfWeek: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
    manualColors: []
  });

  const daysOfWeek = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  const platforms: Platform[] = ['Instagram', 'TikTok', 'LinkedIn', 'YouTube Shorts', 'WhatsApp'];

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

  const togglePlatform = (p: Platform) => {
    setProfile(prev => {
      const exists = prev.selectedPlatforms.includes(p);
      if (exists && prev.selectedPlatforms.length === 1) return prev; 
      return {
        ...prev,
        selectedPlatforms: exists 
          ? prev.selectedPlatforms.filter(item => item !== p) 
          : [...prev.selectedPlatforms, p]
      };
    });
  };

  const toggleDay = (day: string) => {
    setProfile(prev => {
      const exists = prev.selectedDaysOfWeek.includes(day);
      if (exists && prev.selectedDaysOfWeek.length === 1) return prev;
      return {
        ...prev,
        selectedDaysOfWeek: exists 
          ? prev.selectedDaysOfWeek.filter(item => item !== day) 
          : [...prev.selectedDaysOfWeek, day]
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(profile);
  };

  const inputClasses = "w-full p-5 bg-black/40 rounded-2xl border-2 border-white/5 focus:border-stratyx-green focus:ring-0 outline-none transition-all text-stratyx-white font-medium text-lg placeholder:text-slate-600";
  const textareaClasses = "w-full p-5 bg-black/40 rounded-2xl border-2 border-white/5 focus:border-stratyx-green focus:ring-0 outline-none transition-all text-stratyx-white font-medium text-lg min-h-[120px] placeholder:text-slate-600";
  const labelClasses = "block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em]";

  const totalSteps = 7;

  return (
    <div className="max-w-xl mx-auto bg-black/20 backdrop-blur-xl rounded-[3rem] shadow-2xl border border-white/5 overflow-hidden p-10 md:p-14">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-black text-stratyx-white mb-2 tracking-tighter uppercase">STRATEGIC SCAN</h2>
        <p className="text-slate-500 font-medium">Calibre sua engrenagem de marketing.</p>
        <div className="mt-8 flex justify-center gap-3">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className={`h-1.5 w-10 rounded-full transition-all duration-500 ${step > i ? 'bg-stratyx-green' : 'bg-white/10'}`} />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="space-y-8 text-left animate-in slide-in-from-right-4 duration-300">
            <div>
              <label className={labelClasses}>Marca & Logo</label>
              <div className="flex items-center gap-6 p-6 bg-black/30 rounded-3xl border border-white/5">
                <div className="w-24 h-24 border-2 border-dashed border-white/10 rounded-3xl flex items-center justify-center overflow-hidden bg-black relative group">
                  {profile.logoUrl ? (
                    <img src={profile.logoUrl} className="w-full h-full object-contain" alt="Logo preview" />
                  ) : (
                    <svg className="w-10 h-10 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  )}
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" id="logo-input" />
                  <label htmlFor="logo-input" className="absolute inset-0 cursor-pointer bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                    <span className="text-white text-[10px] font-black opacity-0 group-hover:opacity-100 uppercase tracking-widest">UPLOAD</span>
                  </label>
                </div>
                <div className="flex-1">
                  <h4 className="text-stratyx-white font-black uppercase text-xs tracking-tighter mb-1">Logotipo</h4>
                  <p className="text-[10px] text-slate-500 leading-snug">Extração automática de cores.</p>
                  {extractingColors && <p className="text-[10px] text-stratyx-green font-black mt-3 animate-pulse uppercase tracking-widest">Processando...</p>}
                </div>
              </div>
            </div>
            <div>
              <label className={labelClasses}>Nome do Negócio</label>
              <input required type="text" placeholder="Ex: Stratyx Corp" className={inputClasses} value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
            </div>
            <button type="button" onClick={nextStep} className="w-full bg-stratyx-green text-slate-950 py-5 rounded-[2rem] font-black text-lg hover:brightness-110 shadow-xl shadow-stratyx-green/10 transition-all">PRÓXIMO</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 text-left animate-in slide-in-from-right-4 duration-300">
            <div>
              <label className={labelClasses}>Nicho de Atuação</label>
              <input required type="text" placeholder="Ex: Ecommerce de Moda, Consultoria" className={inputClasses} value={profile.businessType} onChange={e => setProfile({...profile, businessType: e.target.value})} />
            </div>
            <div>
              <label className={labelClasses}>Descrição do Produto</label>
              <textarea required placeholder="O que você vende? Quais os diferenciais?" className={textareaClasses} value={profile.productDescription} onChange={e => setProfile({...profile, productDescription: e.target.value})} />
            </div>
            <div className="flex gap-4">
              <button type="button" onClick={prevStep} className="flex-1 bg-white/5 border-2 border-white/5 py-5 rounded-[2rem] font-black text-slate-400">VOLTAR</button>
              <button type="button" onClick={nextStep} className="flex-[2] bg-stratyx-green text-slate-950 py-5 rounded-[2rem] font-black hover:brightness-110 shadow-xl shadow-stratyx-green/10">CONTINUAR</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 text-left animate-in slide-in-from-right-4 duration-300">
            <div>
              <label className={labelClasses}>Momento da Empresa (Opcional)</label>
              <textarea 
                placeholder="Ex: Estamos lançando um novo produto, estamos em fase de expansão, queremos recuperar clientes antigos..." 
                className={textareaClasses} 
                value={profile.businessMoment} 
                onChange={e => setProfile({...profile, businessMoment: e.target.value})} 
              />
              <p className="text-[10px] text-slate-600 mt-2 font-bold uppercase tracking-widest italic">A IA usará isso para calibrar a urgência e o tom das postagens.</p>
            </div>
            <div className="flex gap-4">
              <button type="button" onClick={prevStep} className="flex-1 bg-white/5 border-2 border-white/5 py-5 rounded-[2rem] font-black text-slate-400">VOLTAR</button>
              <button type="button" onClick={nextStep} className="flex-[2] bg-stratyx-green text-slate-950 py-5 rounded-[2rem] font-black hover:brightness-110 shadow-xl shadow-stratyx-green/10">CONTINUAR</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8 text-left animate-in slide-in-from-right-4 duration-300">
            <div>
              <label className={labelClasses}>Alvo & Região</label>
              <input required type="text" placeholder="Ex: Empreendedores, Brasil" className={inputClasses} value={profile.targetAudience} onChange={e => setProfile({...profile, targetAudience: e.target.value})} />
            </div>
            <div>
              <label className={labelClasses}>Geografia</label>
              <input required type="text" placeholder="Ex: São Paulo, Global" className={inputClasses} value={profile.region} onChange={e => setProfile({...profile, region: e.target.value})} />
            </div>
            <div className="flex gap-4">
              <button type="button" onClick={prevStep} className="flex-1 bg-white/5 border-2 border-white/5 py-5 rounded-[2rem] font-black text-slate-400">VOLTAR</button>
              <button type="button" onClick={nextStep} className="flex-[2] bg-stratyx-green text-slate-950 py-5 rounded-[2rem] font-black hover:brightness-110 shadow-xl shadow-stratyx-green/10">CONTINUAR</button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-8 text-left animate-in slide-in-from-right-4 duration-300">
            <div>
              <label className={labelClasses}>Configurar Agendamento</label>
              <div className="flex flex-wrap gap-2 mb-6">
                {platforms.map(p => (
                  <button 
                    key={p} 
                    type="button"
                    onClick={() => togglePlatform(p)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border-2 ${profile.selectedPlatforms.includes(p) ? 'bg-stratyx-green text-slate-950 border-stratyx-green shadow-lg shadow-stratyx-green/10' : 'bg-black/20 text-slate-500 border-white/5'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <div className="space-y-4">
                <label className={labelClasses}>Posts por Dia (em cada rede)</label>
                <div className="flex items-center gap-6 p-4 bg-black/20 rounded-2xl border border-white/5">
                  <input type="range" min="1" max="5" className="flex-1 accent-stratyx-green" value={profile.postsPerDay} onChange={e => setProfile({...profile, postsPerDay: parseInt(e.target.value)})} />
                  <span className="text-2xl font-black text-stratyx-green w-10 text-center">{profile.postsPerDay}</span>
                </div>
              </div>
            </div>
            <div>
              <label className={labelClasses}>Dias Ativos</label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map(day => (
                  <button 
                    key={day} 
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-2 rounded-xl text-[10px] font-bold transition-all border-2 ${profile.selectedDaysOfWeek.includes(day) ? 'bg-stratyx-green text-slate-950 border-stratyx-green shadow-lg shadow-stratyx-green/10' : 'bg-black/20 text-slate-500 border-white/5'}`}
                  >
                    {day.substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <button type="button" onClick={prevStep} className="flex-1 bg-white/5 border-2 border-white/5 py-5 rounded-[2rem] font-black text-slate-400">VOLTAR</button>
              <button type="button" onClick={nextStep} className="flex-[2] bg-stratyx-green text-slate-950 py-5 rounded-[2rem] font-black hover:brightness-110 shadow-xl shadow-stratyx-green/10">CONTINUAR</button>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-8 text-left animate-in slide-in-from-right-4 duration-300">
            <div>
              <label className={labelClasses}>Objetivo</label>
              <select className={inputClasses} value={profile.objective} onChange={e => setProfile({...profile, objective: e.target.value as any})}>
                <option value="vender">Conversão Bruta</option>
                <option value="atrair">Expansão de Audiência</option>
                <option value="autoridade">Posicionamento de Autoridade</option>
              </select>
            </div>
            <div>
              <label className={labelClasses}>Diretriz de Estilo</label>
              <select className={inputClasses} value={profile.style} onChange={e => setProfile({...profile, style: e.target.value as any})}>
                <option value="popular">Impacto Direto</option>
                <option value="descontraido">Criatividade Disruptiva</option>
                <option value="serio">Executivo Premium</option>
              </select>
            </div>
            <div className="flex gap-4">
              <button type="button" onClick={prevStep} className="flex-1 bg-white/5 border-2 border-white/5 py-5 rounded-[2rem] font-black text-slate-400">VOLTAR</button>
              <button type="button" onClick={nextStep} className="flex-[2] bg-stratyx-green text-slate-950 py-5 rounded-[2rem] font-black hover:brightness-110 shadow-xl shadow-stratyx-green/10">FINALIZAR</button>
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-8 text-left animate-in slide-in-from-right-4 duration-300">
            <div className="bg-black/40 p-8 rounded-[2rem] border border-white/5 text-center">
              <p className="text-stratyx-green text-sm font-black uppercase tracking-widest mb-2">⚡ SINTETIZADOR PRONTO.</p>
              <p className="text-slate-500 text-xs">A STRATYX está pronta para construir seu império semanal.</p>
            </div>
            <div className="flex gap-4">
              <button type="button" onClick={prevStep} className="flex-1 bg-white/5 border-2 border-white/5 py-5 rounded-[2rem] font-black text-slate-400">VOLTAR</button>
              <button disabled={isLoading} type="submit" className="flex-[2] bg-gradient-to-r from-stratyx-green to-emerald-400 text-slate-950 py-5 rounded-[2rem] font-black hover:brightness-110 shadow-xl shadow-stratyx-green/20 disabled:opacity-50">
                {isLoading ? 'EXECUTANDO...' : 'LANÇAR SEMANA 01 🚀'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default OnboardingForm;
