
import React, { useState, useEffect } from 'react';
import OnboardingForm from './components/OnboardingForm';
import Dashboard from './components/Dashboard';
import { BusinessProfile, MarketingPlan, Project } from './types';
import { generateMarketingPlan, extendCalendar } from './services/geminiService';

const App: React.FC = () => {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExtending, setIsExtending] = useState(false);
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [marketingPlan, setMarketingPlan] = useState<MarketingPlan | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showProjects, setShowProjects] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  const getStorageKey = (email: string) => `stratyx_projects_v1_${email}`;

  useEffect(() => {
    const savedUser = localStorage.getItem('stratyx_current_user');
    if (savedUser) {
      const u = JSON.parse(savedUser);
      setUser(u);
      loadUserProjects(u.email);
    }
  }, []);

  const loadUserProjects = (email: string) => {
    const saved = localStorage.getItem(getStorageKey(email));
    if (saved) {
      setProjects(JSON.parse(saved));
    } else {
      setProjects([]);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) return;
    const u = { email: loginEmail };
    setUser(u);
    localStorage.setItem('stratyx_current_user', JSON.stringify(u));
    loadUserProjects(loginEmail);
  };

  const handleLogout = () => {
    setUser(null);
    setIsStarted(false);
    setMarketingPlan(null);
    setProfile(null);
    setShowProjects(false);
    setCurrentProjectId(null);
    localStorage.removeItem('stratyx_current_user');
  };

  const saveProject = (projectName: string) => {
    if (!profile || !marketingPlan || !user) return;
    
    setIsSaving(true);
    const updatedProfile = { ...profile, name: projectName };
    setProfile(updatedProfile);

    const updatedProjects = [...projects];
    const projectIndex = currentProjectId ? updatedProjects.findIndex(p => p.id === currentProjectId) : -1;

    if (projectIndex > -1) {
      updatedProjects[projectIndex] = {
        ...updatedProjects[projectIndex],
        projectName,
        profile: updatedProfile,
        plan: marketingPlan
      };
    } else {
      const id = Date.now().toString();
      const newProject: Project = {
        id,
        projectName,
        createdAt: new Date().toISOString(),
        profile: updatedProfile,
        plan: marketingPlan
      };
      updatedProjects.unshift(newProject);
      setCurrentProjectId(id);
    }

    setProjects(updatedProjects);
    localStorage.setItem(getStorageKey(user.email), JSON.stringify(updatedProjects));
    setTimeout(() => setIsSaving(false), 500);
  };

  const handleTogglePostStatus = (postId: string) => {
    if (!marketingPlan || !user) return;
    const updatedCalendar = marketingPlan.calendar.map(post => 
      post.id === postId ? { ...post, status: (post.status === 'posted' ? 'pending' : 'posted') as any } : post
    );
    const newPlan = { ...marketingPlan, calendar: updatedCalendar };
    setMarketingPlan(newPlan);
    
    if (currentProjectId) {
      const updatedProjects = projects.map(p => 
        p.id === currentProjectId ? { ...p, plan: newPlan } : p
      );
      setProjects(updatedProjects);
      localStorage.setItem(getStorageKey(user.email), JSON.stringify(updatedProjects));
    }
  };

  const handleExtendCalendar = async () => {
    if (!profile || !marketingPlan || !user) return;
    setIsExtending(true);
    try {
      const newPosts = await extendCalendar(profile, marketingPlan.calendar);
      const updatedCalendar = [...marketingPlan.calendar, ...newPosts];
      const newPlan = { ...marketingPlan, calendar: updatedCalendar };
      setMarketingPlan(newPlan);
      
      if (currentProjectId) {
        const updatedProjects = projects.map(p => 
          p.id === currentProjectId ? { ...p, plan: newPlan } : p
        );
        setProjects(updatedProjects);
        localStorage.setItem(getStorageKey(user.email), JSON.stringify(updatedProjects));
      }
    } catch (error) {
      console.error("Error extending calendar:", error);
      alert("Erro ao estender o plano.");
    } finally {
      setIsExtending(false);
    }
  };

  const deleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Excluir projeto permanentemente?") || !user) return;
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    localStorage.setItem(getStorageKey(user.email), JSON.stringify(updated));
  };

  const handleOnboardingSubmit = async (data: BusinessProfile) => {
    setIsLoading(true);
    try {
      setProfile(data);
      const plan = await generateMarketingPlan(data);
      setMarketingPlan(plan);
      setIsStarted(true);
      setCurrentProjectId(null);
    } catch (error) {
      console.error("Error generating plan:", error);
      alert("Falha crítica no motor de IA. Verifique as configurações e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadProject = (proj: Project) => {
    setProfile(proj.profile);
    setMarketingPlan(proj.plan);
    setCurrentProjectId(proj.id);
    setIsStarted(true);
    setShowProjects(false);
  };

  const handleNewPlan = () => {
    setIsStarted(false);
    setMarketingPlan(null);
    setProfile(null);
    setShowProjects(false);
    setCurrentProjectId(null);
  };

  // Login Screen
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-main-gradient">
        <div className="w-full max-w-md bg-black/30 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
          <div className="flex flex-col items-center mb-10">
            <div className="bg-stratyx-green w-16 h-16 rounded-2xl flex items-center justify-center font-black text-3xl italic text-slate-950 shadow-lg shadow-stratyx-green/20 mb-6">S</div>
            <h1 className="text-4xl font-black tracking-tighter text-stratyx-white">STRATYX<span className="text-stratyx-green">AI</span></h1>
            <p className="text-slate-400 mt-2">Sua inteligência, sua estratégia.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">E-mail de Acesso</label>
              <input 
                type="email" 
                required 
                placeholder="nome@exemplo.com"
                className="w-full bg-slate-800/50 border-2 border-slate-700 p-4 rounded-2xl outline-none focus:border-stratyx-green transition-all text-stratyx-white"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
              />
            </div>
            <button className="w-full bg-stratyx-green text-slate-950 py-4 rounded-2xl font-black text-lg hover:brightness-110 transition-all shadow-lg shadow-stratyx-green/10">
              CONECTAR AO HUB
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-500">
      <nav className="p-6 flex justify-between items-center max-w-6xl mx-auto no-print">
        <div className="flex items-center gap-3 cursor-pointer" onClick={handleNewPlan}>
          <div className="bg-stratyx-green text-slate-950 w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl italic shadow-lg shadow-stratyx-green/20">S</div>
          <span className="text-2xl font-black tracking-tighter text-stratyx-white">STRATYX<span className="text-stratyx-green">AI</span></span>
        </div>
        <div className="flex items-center gap-4">
          {!isStarted && !isLoading && projects.length > 0 && (
            <button onClick={() => setShowProjects(!showProjects)} className="text-xs font-bold text-slate-400 uppercase hover:text-stratyx-green transition-colors">
              {showProjects ? 'Início' : `Projetos (${projects.length})`}
            </button>
          )}
          <div className="h-4 w-[1px] bg-white/10 mx-2" />
          <button onClick={handleLogout} className="text-slate-500 hover:text-red-400">SAIR</button>
        </div>
      </nav>

      <main className="pt-8 pb-24">
        {!isStarted && !isLoading && !showProjects && (
          <div className="px-4 text-center max-w-4xl mx-auto no-print">
            <h1 className="text-5xl md:text-7xl font-black text-stratyx-white tracking-tighter leading-[1] mb-6 animate-in slide-in-from-top-10 duration-700">
              Arquitetura de conteúdo com <span className="bg-clip-text text-transparent bg-gradient-to-r from-stratyx-green to-cyan-400">PODER</span>.
            </h1>
            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed opacity-0 animate-in fade-in duration-1000 fill-mode-forwards">
              Sintonize seu produto com o algoritmo. Gere planos semanais precisos com STRATYX AI.
            </p>
            <OnboardingForm onSubmit={handleOnboardingSubmit} isLoading={isLoading} />
          </div>
        )}

        {showProjects && !isStarted && !isLoading && (
          <div className="max-w-4xl mx-auto px-4 no-print animate-in fade-in duration-500">
            <h2 className="text-4xl font-black text-stratyx-white mb-8 tracking-tighter uppercase">MEUS PROJETOS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map(proj => (
                <div key={proj.id} onClick={() => loadProject(proj)} className="bg-black/20 p-8 rounded-[2.5rem] border border-white/5 hover:border-stratyx-green/50 cursor-pointer transition-all group overflow-hidden">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-2xl font-black border border-white/5 overflow-hidden">
                      {proj.profile.logoUrl ? <img src={proj.profile.logoUrl} className="w-full h-full object-contain" /> : proj.projectName.charAt(0)}
                    </div>
                    <button onClick={(e) => deleteProject(proj.id, e)} className="p-2 text-slate-600 hover:text-red-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                  <h3 className="text-2xl font-black text-stratyx-white mb-1 group-hover:text-stratyx-green transition-colors">{proj.projectName}</h3>
                  <p className="text-slate-500 text-sm mb-6 uppercase tracking-widest">{proj.profile.businessType}</p>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-600 border-t border-white/5 pt-4">
                    <span>{proj.plan.calendar.length} POSTS</span>
                    <span className="text-stratyx-green">CARREGAR HUB →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 no-print">
            <div className="w-20 h-20 border-4 border-stratyx-green border-t-transparent rounded-full animate-spin mb-8 shadow-lg shadow-stratyx-green/20" />
            <h2 className="text-3xl font-black text-stratyx-white mb-4 animate-pulse uppercase tracking-tighter">SINTETIZANDO SEMANA 01...</h2>
            <p className="text-slate-500 max-w-md">Cruzando ganchos de retenção com padrões de consumo do seu alvo.</p>
          </div>
        )}

        {isStarted && marketingPlan && profile && (
          <Dashboard 
            plan={marketingPlan} 
            profile={profile} 
            onExportPDF={() => window.print()} 
            onSaveProject={saveProject}
            onTogglePostStatus={handleTogglePostStatus}
            onExtendCalendar={handleExtendCalendar}
            isSaving={isSaving}
            isExtending={isExtending}
          />
        )}
      </main>
    </div>
  );
};

export default App;
