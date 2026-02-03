
import React, { useState } from 'react';
import { MarketingPlan, BusinessProfile, PostItem, Competitor, PlatformAdaptation, Platform } from '../types';

interface DashboardProps {
  plan: MarketingPlan;
  profile: BusinessProfile;
  onExportPDF: () => void;
  onSaveProject: (projectName: string) => void;
  onTogglePostStatus: (postId: string) => void;
  onExtendCalendar: () => void;
  isSaving?: boolean;
  isExtending?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  plan, 
  profile, 
  onExportPDF, 
  onSaveProject, 
  onTogglePostStatus, 
  onExtendCalendar,
  isSaving,
  isExtending
}) => {
  const [activeTab, setActiveTab] = useState<'marca' | 'conteudo' | 'execucao' | 'concorrencia' | 'canais'>('execucao');
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [tempProjectName, setTempProjectName] = useState(profile.name);

  const handleSave = () => {
    onSaveProject(tempProjectName);
    setIsRenaming(false);
  };

  const CopyButton = ({ text }: { text: string }) => (
    <button 
      onClick={() => navigator.clipboard.writeText(text)}
      className="text-[10px] bg-slate-800 hover:bg-slate-700 text-stratyx-white px-2 py-1 rounded font-bold transition-colors no-print border border-slate-700"
    >
      COPIAR
    </button>
  );

  const postsByDay = plan.calendar.reduce((acc, post) => {
    if (!acc[post.dayOfMonth]) acc[post.dayOfMonth] = [];
    acc[post.dayOfMonth].push(post);
    return acc;
  }, {} as Record<number, PostItem[]>);

  const calendarDays = Array.from({ length: Math.max(7, ...plan.calendar.map(p => p.dayOfMonth)) }, (_, i) => i + 1);

  const getPlatformIcon = (platform: Platform) => {
    switch(platform) {
      case 'Instagram': return <span className="text-[10px] bg-gradient-to-tr from-yellow-400 to-purple-600 px-2 py-0.5 rounded text-white font-bold">IG</span>;
      case 'TikTok': return <span className="text-[10px] bg-white text-black px-2 py-0.5 rounded font-bold">TK</span>;
      case 'LinkedIn': return <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded font-bold">IN</span>;
      case 'WhatsApp': return <span className="text-[10px] bg-green-500 text-white px-2 py-0.5 rounded font-bold">WA</span>;
      case 'YouTube Shorts': return <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded font-bold">YT</span>;
      default: return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20">
      
      {/* 📘 Full Document View (Visible ONLY during print) */}
      <div className="hidden print:block space-y-16">
        {/* Cover Page */}
        <div className="min-h-screen flex flex-col justify-center items-center text-center p-20 border-b-2 border-slate-200">
          <div className="w-40 h-40 bg-slate-900 rounded-3xl flex items-center justify-center text-stratyx-green text-6xl font-black mb-10 overflow-hidden shadow-2xl">
            {profile.logoUrl ? <img src={profile.logoUrl} className="w-full h-full object-contain" /> : profile.name.charAt(0)}
          </div>
          <h1 className="text-6xl font-black text-black uppercase tracking-tighter mb-4">Stratyx AI Report</h1>
          <h2 className="text-3xl font-bold text-slate-700 mb-8">{profile.name} — Plano de Crescimento</h2>
          <div className="grid grid-cols-2 gap-10 text-left mt-20 w-full max-w-2xl">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Cliente / Marca</p>
              <p className="text-xl font-bold text-black">{profile.name}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nicho de Mercado</p>
              <p className="text-xl font-bold text-black">{profile.businessType}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Objetivo Central</p>
              <p className="text-xl font-bold text-black capitalize">{profile.objective}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Data de Geração</p>
              <p className="text-xl font-bold text-black">{new Date().toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
        </div>

        {/* Strategy Executive Summary */}
        <div className="page-break p-10">
          <h2 className="text-4xl font-black text-black mb-8 border-b-4 border-stratyx-green inline-block uppercase tracking-tighter">01. Racional Estratégico</h2>
          <div className="bg-slate-50 p-10 rounded-3xl border border-slate-200">
            <p className="text-2xl font-medium text-slate-800 leading-relaxed italic">
              "{plan.summary}"
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-8">
            <div className="p-6 bg-slate-100 rounded-2xl">
              <h4 className="font-black text-[10px] uppercase text-slate-400 mb-2">Tom de Voz</h4>
              <p className="text-lg font-bold text-black capitalize">{profile.style}</p>
            </div>
            <div className="p-6 bg-slate-100 rounded-2xl">
              <h4 className="font-black text-[10px] uppercase text-slate-400 mb-2">Redes Ativas</h4>
              <p className="text-lg font-bold text-black">{profile.selectedPlatforms.join(', ')}</p>
            </div>
          </div>
        </div>

        {/* Content Plan */}
        <div className="page-break p-10">
           <h2 className="text-4xl font-black text-black mb-8 border-b-4 border-stratyx-green inline-block uppercase tracking-tighter">02. Calendário Semanal</h2>
           <div className="space-y-10">
             {calendarDays.map(day => {
               const dayPosts = postsByDay[day] || [];
               if (dayPosts.length === 0) return null;
               return (
                 <div key={day} className="avoid-break bg-white border border-slate-200 rounded-3xl p-8">
                   <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                      <h3 className="text-2xl font-black text-black uppercase">Dia {day}</h3>
                      <span className="text-sm font-bold text-slate-400">{dayPosts.length} Publicações agendadas</span>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {dayPosts.map((post, i) => (
                        <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                           <div className="flex items-center gap-2 mb-3">
                              <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded font-black">{post.platform}</span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase">{post.bestTime}</span>
                           </div>
                           <h4 className="text-lg font-black text-slate-800 mb-3 leading-tight">{post.topic}</h4>
                           <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">"{post.caption}"</p>
                        </div>
                      ))}
                   </div>
                 </div>
               );
             })}
           </div>
        </div>

        {/* Competitive Intelligence */}
        <div className="page-break p-10">
          <h2 className="text-4xl font-black text-black mb-8 border-b-4 border-stratyx-green inline-block uppercase tracking-tighter">03. Inteligência de Rivais</h2>
          <div className="grid grid-cols-1 gap-6">
            {plan.competitors.map((comp, i) => (
              <div key={i} className="p-8 bg-slate-50 rounded-3xl border border-slate-200">
                <h4 className="text-2xl font-black text-black mb-4">{comp.name}</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase">Fraqueza / Oportunidade</span>
                    <p className="text-sm text-stratyx-green font-bold mt-1">"{comp.opportunity}"</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase">Análise de Postagem</span>
                    <p className="text-sm text-slate-600 mt-1">{comp.postTypes}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 📱 Main Dashboard (Hidden during print) */}
      <div className="no-print">
        {/* Efficiency Mechanism Insight (Top Alert) */}
        <div className="mb-8 p-8 bg-stratyx-green/10 border border-stratyx-green/20 rounded-[2.5rem] animate-in fade-in duration-700">
          <h3 className="text-stratyx-green text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
            Por que esta semana será eficaz?
          </h3>
          <p className="text-stratyx-white text-lg font-medium leading-relaxed italic">
            "{plan.summary}"
          </p>
        </div>

        {/* Dashboard Header */}
        <div className="bg-black/20 backdrop-blur-md rounded-[2.5rem] p-8 mb-8 flex flex-col md:flex-row items-center gap-8 shadow-2xl border border-white/5">
          <div className="w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center text-stratyx-green text-4xl font-black overflow-hidden shadow-inner border border-white/5">
            {profile.logoUrl ? <img src={profile.logoUrl} className="w-full h-full object-contain" /> : profile.name.charAt(0)}
          </div>
          <div className="text-center md:text-left flex-1">
            <div className="flex items-center gap-3 justify-center md:justify-start group">
              <h1 className="text-3xl font-black text-stratyx-white tracking-tighter uppercase">{profile.name}</h1>
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1">{profile.businessType} • {profile.region}</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
             <button onClick={onExportPDF} className="bg-slate-800 text-stratyx-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-700 transition-all border border-white/10">
               EXPORTAR PDF
             </button>
             <button onClick={handleSave} disabled={isSaving} className="bg-stratyx-green text-slate-950 px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:brightness-110 shadow-lg shadow-stratyx-green/10">
               {isSaving ? 'SALVANDO...' : 'SALVAR NO HUB'}
             </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-black/20 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-white/5 mb-8 sticky top-4 z-10 overflow-x-auto">
          {(['marca', 'conteudo', 'concorrencia', 'canais', 'execucao'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap flex-1 py-4 px-6 rounded-xl font-black uppercase text-xs tracking-widest transition-all ${
                activeTab === tab ? 'bg-stratyx-green text-slate-950 shadow-lg shadow-stratyx-green/10' : 'text-slate-400 hover:text-stratyx-white'
              }`}
            >
              {tab === 'marca' ? 'Marca' : tab === 'conteudo' ? 'Estratégia' : tab === 'concorrencia' ? 'Rivais' : tab === 'canais' ? 'Omnichannel' : 'Calendário'}
            </button>
          ))}
        </div>

        {/* Render Active Tab Content */}
        <div className="space-y-12">
          
          {/* Brand View */}
          {activeTab === 'marca' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
              <div className="bg-black/20 p-10 rounded-[2.5rem] border border-white/5">
                <h3 className="font-black text-slate-500 uppercase text-[10px] tracking-widest mb-6">Bio de Alto Impacto</h3>
                <p className="text-2xl font-black text-stratyx-white italic tracking-tighter mb-4">"{plan.identity.bio}"</p>
                <p className="text-slate-400 text-sm leading-relaxed">{plan.identity.description}</p>
              </div>
              <div className="bg-gradient-to-br from-stratyx-green to-emerald-400 p-10 rounded-[2.5rem] text-slate-950">
                <h3 className="font-black uppercase text-[10px] tracking-widest mb-4 opacity-70">Promessa Irresistível</h3>
                <p className="text-4xl font-black tracking-tighter leading-tight">{plan.identity.promise}</p>
                <div className="mt-8 flex flex-wrap gap-2">
                  {plan.identity.keywords.map((kw, i) => (
                    <span key={i} className="px-3 py-1 bg-black/10 rounded-full text-[10px] font-bold uppercase tracking-widest">#{kw}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Calendar View */}
          {activeTab === 'execucao' && (
            <div className="animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-3xl font-black text-stratyx-white tracking-tighter uppercase">FLUXO DE EXECUÇÃO</h2>
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">
                    Configurado: {profile.postsPerDay} posts/dia por rede selecionada
                  </p>
                </div>
                <button onClick={onExtendCalendar} disabled={isExtending} className="bg-slate-800 text-stratyx-green px-8 py-3 rounded-2xl font-black uppercase text-xs hover:bg-slate-700 transition-all border border-white/10 disabled:opacity-50 flex items-center gap-3">
                  {isExtending ? 'ESTENDENDO...' : '+ Próximos 7 Dias'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {calendarDays.map((day) => {
                  const dayPosts = postsByDay[day] || [];
                  return (
                    <div key={day} className={`p-6 rounded-[2rem] border transition-all ${dayPosts.length > 0 ? 'bg-black/20 border-white/10' : 'bg-black/5 border-dashed border-white/5 opacity-10'}`}>
                      <div className="flex justify-between items-center mb-6">
                         <span className="text-[10px] font-black text-slate-600 tracking-widest uppercase">Dia {day}</span>
                         {dayPosts.length > 0 && <span className="text-[8px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-400">{dayPosts.length} POSTS</span>}
                      </div>
                      <div className="space-y-4">
                        {dayPosts.map((post, idx) => (
                          <div key={idx} onClick={() => setSelectedPost(post)} className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-stratyx-green/50 cursor-pointer group">
                            <div className="flex items-center gap-2 mb-2">
                              {getPlatformIcon(post.platform)}
                              <span className="text-[8px] font-black text-slate-500 uppercase">{post.bestTime}</span>
                            </div>
                            <p className="text-[11px] font-bold text-stratyx-white leading-tight group-hover:text-stratyx-green transition-colors uppercase tracking-tighter">{post.topic}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Rivals View */}
          {activeTab === 'concorrencia' && (
            <div className="animate-in fade-in duration-500">
              <h2 className="text-3xl font-black text-stratyx-white mb-8 tracking-tighter uppercase">MAPA DE RIVAIS</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plan.competitors.map((comp, i) => (
                  <div key={i} className="bg-black/20 p-8 rounded-[2rem] border border-white/5 hover:border-stratyx-green/30 transition-all">
                    <h4 className="font-black text-stratyx-white text-lg mb-2">{comp.name}</h4>
                    <div className="space-y-4">
                      <div className="bg-black/30 p-4 rounded-xl">
                        <span className="text-[10px] font-black text-slate-500 uppercase">Furo de Mercado</span>
                        <p className="text-xs text-stratyx-green font-bold mt-1">"{comp.opportunity}"</p>
                      </div>
                      <p className="text-xs text-slate-400 italic leading-relaxed">"{comp.recentActivity}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Omnichannel Adaptations View */}
          {activeTab === 'canais' && (
            <div className="animate-in fade-in duration-500">
               <h2 className="text-3xl font-black text-stratyx-white mb-8 tracking-tighter uppercase">HUB DE ADAPTAÇÃO</h2>
               <div className="grid grid-cols-1 gap-8">
                  {plan.adaptations?.map((adapt, i) => (
                    <div key={i} className="bg-black/10 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-xl">
                      <div className="bg-white/5 p-6 border-b border-white/5 flex justify-between items-center">
                        <p className="text-xl font-black text-stratyx-white italic">"{adapt.originalTopic}"</p>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x border-white/5">
                        {profile.selectedPlatforms.includes('TikTok') && (
                          <div className="p-8">
                            <h4 className="font-black text-stratyx-white text-[10px] mb-4 uppercase">TikTok Strategy</h4>
                            <p className="text-sm font-bold text-slate-200 bg-black/20 p-4 rounded-xl border border-white/5 mb-4">{adapt.tiktok.videoIdea}</p>
                            <p className="text-[11px] text-stratyx-green font-bold mb-4">🎵 {adapt.tiktok.audioTrendSuggestion}</p>
                            <div className="flex justify-between items-center mb-1"><label className="text-[10px] font-black text-slate-500 uppercase">Legenda</label><CopyButton text={adapt.tiktok.caption} /></div>
                            <p className="text-xs text-slate-400 italic leading-relaxed line-clamp-4">"{adapt.tiktok.caption}"</p>
                          </div>
                        )}
                        {profile.selectedPlatforms.includes('LinkedIn') && (
                          <div className="p-8">
                            <h4 className="font-black text-stratyx-white text-[10px] mb-4 uppercase">LinkedIn Flow</h4>
                            <div className="flex justify-between items-center mb-1"><label className="text-[10px] font-black text-slate-500 uppercase">Post Professional</label><CopyButton text={adapt.linkedin.postText} /></div>
                            <p className="text-xs text-slate-200 leading-relaxed font-medium line-clamp-10 italic">"{adapt.linkedin.postText}"</p>
                          </div>
                        )}
                        {profile.selectedPlatforms.includes('YouTube Shorts') && (
                          <div className="p-8">
                            <h4 className="font-black text-stratyx-white text-[10px] mb-4 uppercase">Shorts SEO</h4>
                            <div className="flex justify-between items-center mb-1"><label className="text-[10px] font-black text-slate-500 uppercase">Título</label><CopyButton text={adapt.youtubeShorts.title} /></div>
                            <p className="text-sm font-bold text-stratyx-white mb-4">{adapt.youtubeShorts.title}</p>
                            <p className="text-xs text-slate-400 line-clamp-4">{adapt.youtubeShorts.videoIdea}</p>
                          </div>
                        )}
                        {profile.selectedPlatforms.includes('WhatsApp') && (
                          <div className="p-8">
                            <h4 className="font-black text-stratyx-white text-[10px] mb-4 uppercase">Direct Status</h4>
                            <div className="flex justify-between items-center mb-1"><label className="text-[10px] font-black text-slate-500 uppercase">Mensagem</label><CopyButton text={adapt.whatsapp.message} /></div>
                            <p className="text-xs text-slate-300 italic bg-stratyx-green/5 p-4 rounded-xl border border-stratyx-green/10">"{adapt.whatsapp.message}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* Strategy View */}
          {activeTab === 'conteudo' && (
            <div className="bg-black/20 p-10 rounded-[2.5rem] border border-white/5 animate-in slide-in-from-bottom-4">
               <h2 className="text-3xl font-black text-stratyx-white mb-10 tracking-tighter uppercase">DIRETRIZES ESTRATÉGICAS</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <div className="p-6 bg-black/30 rounded-3xl border border-white/5">
                   <h4 className="text-[10px] font-black text-stratyx-green uppercase mb-2">Frequência</h4>
                   <p className="text-stratyx-white font-bold">{plan.strategy.frequency}</p>
                 </div>
                 <div className="p-6 bg-black/30 rounded-3xl border border-white/5">
                   <h4 className="text-[10px] font-black text-cyan-400 uppercase mb-2">Formatos</h4>
                   <p className="text-stratyx-white font-bold">{plan.strategy.formats.join(', ')}</p>
                 </div>
                 <div className="lg:col-span-2 p-10 bg-black/40 rounded-3xl border border-white/5 shadow-inner">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase mb-4">Racional da Agência</h4>
                    <p className="text-slate-300 italic font-medium">"{plan.strategy.rationale}"</p>
                 </div>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* 📦 Post Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 no-print animate-in fade-in duration-200">
          <div className="bg-slate-900 w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden max-h-[95vh] flex flex-col border border-white/10 scale-in duration-200">
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-4">
                  {getPlatformIcon(selectedPost.platform)}
                  <div>
                    <h4 className="font-black text-stratyx-white uppercase text-lg">{selectedPost.type}</h4>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Dia {selectedPost.dayOfMonth} • {selectedPost.bestTime}</p>
                  </div>
              </div>
              <button onClick={() => setSelectedPost(null)} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-full">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-10 overflow-y-auto space-y-10">
              <section>
                <div className="flex justify-between items-start mb-3">
                  <label className="block text-[10px] font-black text-stratyx-green uppercase tracking-widest">Tópico</label>
                  {selectedPost.reelsMetadata?.audioTrend && (
                    <span className="text-[10px] text-stratyx-green font-bold">🎵 {selectedPost.reelsMetadata.audioTrend}</span>
                  )}
                </div>
                <h3 className="text-2xl font-black text-stratyx-white mb-4 leading-tight">{selectedPost.topic}</h3>
                {selectedPost.reelsMetadata && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="p-6 bg-stratyx-green/5 border border-stratyx-green/10 rounded-2xl">
                      <label className="block text-[8px] font-black text-stratyx-green uppercase tracking-widest mb-2">Gancho Visual</label>
                      <p className="text-sm font-black text-stratyx-white italic">"{selectedPost.reelsMetadata.hook3s}"</p>
                    </div>
                    <div className="p-6 bg-cyan-500/5 border border-cyan-500/10 rounded-2xl">
                      <label className="block text-[8px] font-black text-cyan-400 uppercase tracking-widest mb-2">CTA de Fechamento</label>
                      <p className="text-sm font-black text-stratyx-white">"{selectedPost.reelsMetadata.cta}"</p>
                    </div>
                  </div>
                )}
              </section>
              <section>
                <div className="flex justify-between items-center mb-4"><label className="text-[10px] font-black text-slate-500 uppercase">Conteúdo do Post</label><CopyButton text={selectedPost.caption} /></div>
                <div className="p-8 bg-slate-800 rounded-3xl text-stratyx-white font-medium text-sm leading-relaxed">{selectedPost.caption}</div>
              </section>
            </div>
            <div className="p-8 bg-black/50 border-t border-white/10 flex gap-4">
              <button onClick={() => { onTogglePostStatus(selectedPost.id); setSelectedPost(null); }} className={`flex-1 py-5 rounded-[2rem] font-black text-lg transition-all ${selectedPost.status === 'posted' ? 'bg-slate-800 text-slate-500' : 'bg-stratyx-green text-slate-950 shadow-2xl shadow-stratyx-green/10'}`}>
                {selectedPost.status === 'posted' ? 'MARCAR COMO PENDENTE' : 'MARCAR COMO PUBLICADO ✓'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
