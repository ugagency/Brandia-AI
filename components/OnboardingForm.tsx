
import React, { useState } from 'react';
import { BusinessProfile } from '../types';

interface OnboardingFormProps {
  onSubmit: (profile: BusinessProfile) => void;
  isLoading: boolean;
}

const OnboardingForm: React.FC<OnboardingFormProps> = ({ onSubmit, isLoading }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<BusinessProfile>({
    name: '',
    businessType: '',
    targetAudience: '',
    region: '',
    objective: 'vender',
    style: 'popular'
  });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

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
        <p className="text-slate-500">Responda 5 perguntas e deixe a IA cuidar do resto.</p>
        <div className="mt-6 flex justify-center gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-2 w-12 rounded-full transition-all ${step >= i ? 'bg-indigo-600' : 'bg-slate-200'}`} />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="space-y-6">
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
            <button type="button" onClick={nextStep} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
              Continuar
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
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
            <div className="flex gap-4">
              <button type="button" onClick={prevStep} className="flex-1 border-2 border-slate-200 py-4 rounded-xl font-bold text-slate-600">Voltar</button>
              <button type="button" onClick={nextStep} className="flex-[2] bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200">Continuar</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
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
            <div className="flex gap-4">
              <button type="button" onClick={prevStep} className="flex-1 border-2 border-slate-200 py-4 rounded-xl font-bold text-slate-600">Voltar</button>
              <button disabled={isLoading} type="submit" className="flex-[2] bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 disabled:opacity-50">
                {isLoading ? 'Criando sua marca...' : 'Gerar Minha Estratégia! 🚀'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default OnboardingForm;
