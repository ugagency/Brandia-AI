
import React, { useState } from 'react';
import OnboardingForm from './components/OnboardingForm';
import Dashboard from './components/Dashboard';
import { BusinessProfile, MarketingPlan } from './types';
import { generateMarketingPlan } from './services/geminiService';

const App: React.FC = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [marketingPlan, setMarketingPlan] = useState<MarketingPlan | null>(null);

  const handleOnboardingSubmit = async (data: BusinessProfile) => {
    setIsLoading(true);
    try {
      setProfile(data);
      const plan = await generateMarketingPlan(data);
      setMarketingPlan(plan);
      setIsStarted(true);
    } catch (error) {
      console.error("Error generating plan:", error);
      alert("Houve um erro ao gerar seu plano. Verifique sua conexão ou tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl italic">B</div>
          <span className="text-2xl font-black tracking-tighter text-slate-900">BRANDIA<span className="text-indigo-600">AI</span></span>
        </div>
        {!isStarted && !isLoading && (
          <div className="hidden md:flex gap-8 text-sm font-bold text-slate-600 uppercase tracking-widest">
            <a href="#" className="hover:text-indigo-600">Como funciona</a>
            <a href="#" className="hover:text-indigo-600">Preços</a>
          </div>
        )}
        {isStarted && (
           <button onClick={() => setIsStarted(false)} className="text-sm font-bold text-indigo-600 uppercase">Novo Negócio</button>
        )}
      </nav>

      <main className="pt-12 pb-24">
        {!isStarted && !isLoading && !profile && (
          <div className="px-4 text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
              Sua marca profissional pronta para <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">crescer</span>.
            </h1>
            <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Deixe a IA cuidar do seu marketing. Do diagnóstico à agenda de postagens, tudo automático em 5 minutos.
            </p>
            <OnboardingForm onSubmit={handleOnboardingSubmit} isLoading={isLoading} />
            
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              {[
                { title: 'Zero Agência', desc: 'Marketing profissional sem o custo de uma equipe externa.' },
                { title: 'Plano Viral', desc: 'Conteúdos baseados nas tendências reais do seu nicho.' },
                { title: 'Pronto pra Postar', desc: 'Legendas, hashtags e ganchos prontos. Só copiar e postar.' }
              ].map((feature, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 font-bold text-xl">{i+1}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-8" />
            <h2 className="text-3xl font-bold text-slate-900 mb-4 animate-pulse">A IA está criando seu império digital...</h2>
            <p className="text-slate-500 max-w-md">Estamos analisando seu nicho, criando seu tom de voz e gerando seus roteiros agora mesmo.</p>
          </div>
        )}

        {isStarted && marketingPlan && profile && (
          <Dashboard plan={marketingPlan} profile={profile} />
        )}
      </main>

      <footer className="py-12 border-t border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-400 text-sm">© 2024 Brandia AI. Se você sabe trabalhar, a Brandia cuida do marketing.</div>
          <div className="flex gap-6 text-slate-400 font-bold text-xs uppercase tracking-widest">
            <a href="#" className="hover:text-indigo-600">Termos</a>
            <a href="#" className="hover:text-indigo-600">Privacidade</a>
            <a href="#" className="hover:text-indigo-600">Suporte</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
