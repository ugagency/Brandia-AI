
import React, { useState, useEffect } from 'react';
import OnboardingForm from './components/OnboardingForm';
import Dashboard from './components/Dashboard';
import { BusinessProfile, MarketingPlan, Project, PostItem } from './types';
import { generateMarketingPlan, extendCalendar } from './services/geminiService';

const STORAGE_KEY = 'brandia_projects_v3';

const App: React.FC = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExtending, setIsExtending] = useState(false);
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [marketingPlan, setMarketingPlan] = useState<MarketingPlan | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showProjects, setShowProjects] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setProjects(JSON.parse(saved));
    }
  }, []);

  const saveProject = (projectName: string) => {
    if (!profile || !marketingPlan) return;
    
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProjects));
    setTimeout(() => setIsSaving(false), 500);
  };

  const handleTogglePostStatus = (postId: string) => {
    if (!marketingPlan) return;
    const updatedCalendar = marketingPlan.calendar.map(post => 
      post.id === postId ? { ...post, status: (post.status === 'posted' ? 'pending' : 'posted') as any } : post
    );
    setMarketingPlan({ ...marketingPlan, calendar: updatedCalendar });
    
    // Auto-save if it's an existing project
    if (currentProjectId) {
      const updatedProjects = projects.map(p => 
        p.id === currentProjectId ? { ...p, plan: { ...p.plan, calendar: updatedCalendar } } : p
      );
      setProjects(updatedProjects);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProjects));
    }
  };

  const handleExtendCalendar = async () => {
    if (!profile || !marketingPlan) return;
    setIsExtending(true);
    try {
      const newPosts = await extendCalendar(profile, marketingPlan.calendar);
      const updatedCalendar = [...marketingPlan.calendar, ...newPosts];
      setMarketingPlan({ ...marketingPlan, calendar: updatedCalendar });
      
      if (currentProjectId) {
        const updatedProjects = projects.map(p => 
          p.id === currentProjectId ? { ...p, plan: { ...p.plan, calendar: updatedCalendar } } : p
        );
        setProjects(updatedProjects);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProjects));
      }
    } catch (error) {
      console.error("Error extending calendar:", error);
      alert("Houve um erro ao gerar mais posts.");
    } finally {
      setIsExtending(false);
    }
  };

  const deleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Tem certeza que deseja excluir este projeto?")) return;
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
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
      alert("Houve um erro ao gerar seu plano. Verifique sua conexão.");
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

  return (
    <div className="min-h-screen">
      <nav className="p-6 flex justify-between items-center max-w-6xl mx-auto no-print">
        <div className="flex items-center gap-2 cursor-pointer" onClick={handleNewPlan}>
          <div className="bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl italic shadow-lg shadow-indigo-100">B</div>
          <span className="text-2xl font-black tracking-tighter text-slate-900">BRANDIA<span className="text-indigo-600">AI</span></span>
        </div>
        <div className="flex items-center gap-6">
          {!isStarted && !isLoading && projects.length > 0 && (
            <button 
              onClick={() => setShowProjects(!showProjects)}
              className="text-sm font-bold text-slate-600 uppercase hover:text-indigo-600 transition-colors"
            >
              {showProjects ? 'Início' : `Meus Projetos (${projects.length})`}
            </button>
          )}
          {isStarted && (
             <button onClick={handleNewPlan} className="text-sm font-bold text-indigo-600 uppercase">Novo Negócio</button>
          )}
        </div>
      </nav>

      <main className="pt-12 pb-24">
        {!isStarted && !isLoading && !showProjects && (
          <div className="px-4 text-center max-w-4xl mx-auto no-print">
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
              Sua marca profissional pronta para <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">vencer</span>.
            </h1>
            <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              O primeiro gerente de marketing por IA que realmente entende de tendências e memes locais.
            </p>
            <OnboardingForm onSubmit={handleOnboardingSubmit} isLoading={isLoading} />
          </div>
        )}

        {showProjects && !isStarted && !isLoading && (
          <div className="max-w-4xl mx-auto px-4 no-print">
            <h2 className="text-4xl font-black text-slate-900 mb-8 tracking-tighter uppercase">Projetos Salvos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map(proj => (
                <div 
                  key={proj.id} 
                  onClick={() => loadProject(proj)}
                  className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-indigo-400 cursor-pointer transition-all group relative"
                >
                  <button onClick={(e) => deleteProject(proj.id, e)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                  <h3 className="text-xl font-bold text-slate-900">{proj.projectName}</h3>
                  <p className="text-slate-500 text-sm mb-4">{proj.profile.businessType}</p>
                  <div className="text-[10px] font-bold uppercase text-slate-400 border-t pt-4">
                    {proj.plan.calendar.length} Posts • {proj.plan.calendar.filter(p => p.status === 'posted').length} Concluídos
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 no-print">
            <div className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-8" />
            <h2 className="text-3xl font-bold text-slate-900 mb-4 animate-pulse">Brandia AI está pesquisando trends e memes...</h2>
            <p className="text-slate-500">Estamos acessando o que há de mais recente no Google para o seu nicho.</p>
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
