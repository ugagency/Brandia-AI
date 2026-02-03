
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

  const handleExport = () => {
    // We invoke the parent's print function which uses window.print()
    // The CSS in index.html handles the formatting for PDF
    onExportPDF();
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

  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);

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
      {/* Strategy Efficiency Summary (Visible top) */}
      <div className="mb-8 p-8 bg-stratyx-green/10 border border-stratyx-green/20 rounded-[2.5rem] animate-in fade-in duration-700">
        <h3 className="text-stratyx-green text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          Por que esta estratégia funciona?
        </h3>
        <p className="text-stratyx-white text-lg font-medium leading-relaxed italic">
          "{plan.summary}"
        </p>
      </div>

      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md rounded-[2.5rem] p-8 mb-8 flex flex-col md:flex-row items-center gap-8 shadow-2xl border border-white/5 avoid-break">
        <div className="w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center text-stratyx-green text-4xl font-black overflow-hidden shadow-inner border border-white/5">
          {profile.logoUrl ? <img src={profile.logoUrl} className="w-full h-full object-contain" /> : profile.name.charAt(0)}
        </div>
        <div className="text-center md:text-left flex-1">
          {isRenaming ? (
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <input 
                type="text" 
                className="text-3xl font-black text-stratyx-white border-b-2 border-stratyx-green outline-none bg-transparent max-w-xs"
                value={tempProjectName}
                onChange={e => setTempProjectName(e.target.value)}
                autoFocus
              />
              <button onClick={handleSave} className="bg-stratyx-green text-slate-950 p-2 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 justify-center md:justify-start group">
              <h1 className="text-3xl font-black text-stratyx-white tracking-tighter">{tempProjectName}</h1>
              <button onClick={() => setIsRenaming(true)} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-stratyx-green transition-all no-print">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </button>
            </div>
          )}
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1">{profile.businessType} • {profile.region}</p>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-4 no-print">
           <div className="flex gap-2">
             {plan.identity.suggestedColors.map((color, i) => (
               <div key={i} className="w-10 h-10 rounded-xl shadow-lg border-2 border-slate-800" style={{ backgroundColor: color }} />
             ))}
           </div>
           <button onClick={handleExport} className="bg-slate-800 text-stratyx-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-700 transition-all border border-white/10">
             PDF
           </button>
           <button onClick={handleSave} disabled={isSaving} className="bg-stratyx-green text-slate-950 px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:brightness-110 shadow-lg shadow-stratyx-green/10">
             {isSaving ? 'SALVANDO...' : 'SALVAR PLANO'}
           </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="no-print flex bg-black/20 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-white/5 mb-8 sticky top-4 z-10 overflow-x-auto">
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

      <div className="main-content-area">
        {/* Render Channels Adaptations */}
        {(activeTab === 'canais' || window.matchMedia('print').matches) && (
          <div className="space-y-8 animate-in fade-in duration-500 page-break">
             <div className="bg-black/10 border border-white/5 p-10 rounded-[2.5rem]">
                <h2 className="text-3xl font-black text-stratyx-white mb-2 tracking-tighter">ADAPTAÇÕES MULTIPLATAFORMA</h2>
                <p className="text-slate-400">Distribuição estratégica para o ecossistema {profile.selectedPlatforms.join(', ')}.</p>
             </div>
             <div className="grid grid-cols-1 gap-8">
                {plan.adaptations?.map((adapt, i) => (
                  <div key={i} className="bg-black/10 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-xl avoid-break">
                    <div className="bg-white/5 p-6 border-b border-white/5 flex justify-between items-center">
                      <p className="text-xl font-black text-stratyx-white">"{adapt.originalTopic}"</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x border-white/5">
                      {/* TikTok */}
                      {profile.selectedPlatforms.includes('TikTok') && (
                        <div className="p-8">
                          <div className="flex items-center gap-3 mb-6"><div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-black">T</div><h4 className="font-black text-stratyx-white text-xs uppercase">TikTok</h4></div>
                          <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Ideia Viral</p>
                          <p className="text-sm font-bold text-slate-200 bg-black/20 p-4 rounded-xl border border-white/5 mb-4">{adapt.tiktok.videoIdea}</p>
                          <div className="flex justify-between items-center mb-1"><label className="text-[10px] font-black text-slate-500 uppercase">Áudio</label></div>
                          <p className="text-[11px] text-stratyx-green font-bold mb-4">🎵 {adapt.tiktok.audioTrendSuggestion}</p>
                          <div className="flex justify-between items-center mb-1"><label className="text-[10px] font-black text-slate-500 uppercase">Legenda</label><CopyButton text={adapt.tiktok.caption} /></div>
                          <p className="text-xs text-slate-400 italic leading-relaxed line-clamp-4">{adapt.tiktok.caption}</p>
                        </div>
                      )}
                      {/* LinkedIn */}
                      {profile.selectedPlatforms.includes('LinkedIn') && (
                        <div className="p-8">
                          <div className="flex items-center gap-3 mb-6"><div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-sm">In</div><h4 className="font-black text-stratyx-white text-xs uppercase">LinkedIn</h4></div>
                          <div className="flex justify-between items-center mb-1"><label className="text-[10px] font-black text-slate-500 uppercase">Post Profissional</label><CopyButton text={adapt.linkedin.postText} /></div>
                          <p className="text-xs text-slate-200 leading-relaxed font-medium line-clamp-10">{adapt.linkedin.postText}</p>
                        </div>
                      )}
                      {/* YouTube Shorts */}
                      {profile.selectedPlatforms.includes('YouTube Shorts') && (
                        <div className="p-8">
                          <div className="flex items-center gap-3 mb-6"><div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-black text-xs">YT</div><h4 className="font-black text-stratyx-white text-xs uppercase">YouTube Shorts</h4></div>
                          <div className="flex justify-between items-center mb-1"><label className="text-[10px] font-black text-slate-500 uppercase">Título</label><CopyButton text={adapt.youtubeShorts.title} /></div>
                          <p className="text-sm font-bold text-slate-100 mb-4">{adapt.youtubeShorts.title}</p>
                          <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Ideia</p>
                          <p className="text-xs text-slate-400 bg-black/20 p-3 rounded-lg border border-white/5">{adapt.youtubeShorts.videoIdea}</p>
                        </div>
                      )}
                      {/* WhatsApp */}
                      {profile.selectedPlatforms.includes('WhatsApp') && (
                        <div className="p-8">
                          <div className="flex items-center gap-3 mb-6"><div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-slate-950 font-black text-sm">W</div><h4 className="font-black text-stratyx-white text-xs uppercase">WhatsApp</h4></div>
                          <div className="flex justify-between items-center mb-1"><label className="text-[10px] font-black text-slate-500 uppercase">Mensagem</label><CopyButton text={adapt.whatsapp.message} /></div>
                          <p className="text-xs text-slate-300 italic bg-stratyx-green/5 p-4 rounded-xl border border-stratyx-green/10 mb-4">"{adapt.whatsapp.message}"</p>
                          <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Status</p>
                          <p className="text-xs text-slate-400">{adapt.whatsapp.statusIdea}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {(activeTab === 'execucao' || window.matchMedia('print').matches) && (
          <div className="animate-in fade-in duration-500 page-break">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-black text-stratyx-white tracking-tighter uppercase">CALENDÁRIO MENSAL</h2>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">Frequência: {profile.postsPerDay}x/dia • {profile.selectedDaysOfWeek.join(', ')}</p>
              </div>
              <button 
                onClick={onExtendCalendar}
                disabled={isExtending}
                className="bg-slate-800 text-stratyx-green px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-700 transition-all border border-white/10 disabled:opacity-50 flex items-center gap-3 no-print"
              >
                {isExtending ? 'GERANDO...' : '+ Próximos 10 Dias'}
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {calendarDays.map((day) => {
                const dayPosts = postsByDay[day] || [];
                return (
                  <div 
                    key={day}
                    className={`min-h-[140px] p-5 rounded-3xl border transition-all avoid-break ${
                      dayPosts.length > 0
                        ? 'bg-black/20 border-white/10 hover:border-stratyx-green/50 cursor-pointer shadow-xl hover:-translate-y-1'
                        : 'bg-black/5 border-dashed border-white/5 opacity-20'
                    } relative flex flex-col group`}
                  >
                    <span className="text-[10px] font-black text-slate-600 mb-3 tracking-widest">DIA {day}</span>
                    <div className="flex-1 flex flex-col gap-3">
                      {dayPosts.map((post, idx) => (
                        <div key={idx} onClick={() => setSelectedPost(post)} className="p-2 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all">
                          {post.isTrend && (
                            <div className="absolute top-4 right-4 flex h-2 w-2 rounded-full bg-stratyx-green shadow-[0_0_8px_rgba(57,255,106,0.6)]" />
                          )}
                          <p className="text-[10px] font-black text-stratyx-white leading-tight line-clamp-2 uppercase tracking-tighter mb-2">{post.topic}</p>
                          <div className="flex items-center justify-between">
                             {getPlatformIcon(post.platform)}
                             {post.status === 'posted' && (
                               <svg className="w-4 h-4 text-stratyx-green" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                             )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Existing Tabs: Marca, Concorrencia, Conteudo */}
        {activeTab === 'marca' && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
             <div className="bg-black/20 p-10 rounded-[2.5rem] border border-white/5">
               <h3 className="font-black text-slate-500 uppercase text-[10px] tracking-widest mb-6">Bio & Posicionamento</h3>
               <p className="text-2xl font-black text-stratyx-white italic tracking-tighter mb-4">"{plan.identity.bio}"</p>
               <p className="text-slate-400 text-sm leading-relaxed">{plan.identity.description}</p>
             </div>
             <div className="bg-gradient-to-br from-stratyx-green to-emerald-400 p-10 rounded-[2.5rem] text-slate-950">
               <h3 className="font-black uppercase text-[10px] tracking-widest mb-4 opacity-70">Promessa Irresistível</h3>
               <p className="text-4xl font-black tracking-tighter leading-tight">{plan.identity.promise}</p>
             </div>
           </div>
        )}
        
        {activeTab === 'concorrencia' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in">
            {plan.competitors.map((comp, i) => (
              <div key={i} className="bg-black/20 p-8 rounded-[2rem] border border-white/5 hover:border-stratyx-green/30 transition-all avoid-break">
                <h4 className="font-black text-stratyx-white text-lg mb-2">{comp.name}</h4>
                <div className="space-y-4">
                  <div className="bg-black/30 p-4 rounded-xl">
                    <span className="text-[10px] font-black text-slate-500 uppercase">Atividade Recente</span>
                    <p className="text-xs text-slate-200 mt-1 italic leading-relaxed">"{comp.recentActivity}"</p>
                  </div>
                  <div className="p-4 bg-stratyx-green/5 rounded-xl border border-stratyx-green/10">
                     <span className="text-[10px] font-black text-stratyx-green uppercase">Oportunidade</span>
                     <p className="text-xs text-stratyx-green font-bold mt-1">"{comp.opportunity}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'conteudo' && (
          <div className="bg-black/20 p-10 rounded-[2.5rem] border border-white/5 animate-in slide-in-from-bottom-4">
             <h2 className="text-3xl font-black text-stratyx-white mb-10 tracking-tighter">DIRETRIZES ESTRATÉGICAS</h2>
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

      {/* Detail Modal */}
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
                  <label className="block text-[10px] font-black text-stratyx-green uppercase tracking-widest">Tópico Central</label>
                  {selectedPost.reelsMetadata?.audioTrend && (
                    <span className="text-[10px] text-stratyx-green font-bold">🎵 Sugestão de Áudio: {selectedPost.reelsMetadata.audioTrend}</span>
                  )}
                </div>
                <h3 className="text-2xl font-black text-stratyx-white mb-4 leading-tight">{selectedPost.topic}</h3>
                
                {selectedPost.reelsMetadata && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="p-6 bg-stratyx-green/5 border border-stratyx-green/10 rounded-2xl">
                      <label className="block text-[8px] font-black text-stratyx-green uppercase tracking-widest mb-2">Gancho (Primeiros 3s)</label>
                      <p className="text-sm font-black text-stratyx-white italic">"{selectedPost.reelsMetadata.hook3s}"</p>
                    </div>
                    <div className="p-6 bg-cyan-500/5 border border-cyan-500/10 rounded-2xl">
                      <label className="block text-[8px] font-black text-cyan-400 uppercase tracking-widest mb-2">CTA Otimizado</label>
                      <p className="text-sm font-black text-stratyx-white">"{selectedPost.reelsMetadata.cta}"</p>
                    </div>
                  </div>
                )}
                
                <div className="p-6 bg-black/30 border border-white/5 rounded-2xl italic font-bold text-slate-400 text-xs">Gancho: "{selectedPost.hook}"</div>
              </section>
              
              <section>
                <div className="flex justify-between items-center mb-4"><label className="text-[10px] font-black text-slate-500 uppercase">Legenda Sugerida</label><CopyButton text={selectedPost.caption} /></div>
                <div className="p-8 bg-slate-800 rounded-3xl text-stratyx-white whitespace-pre-line border border-slate-700 font-medium text-sm leading-relaxed">{selectedPost.caption}</div>
                <div className="mt-4 text-cyan-400 font-black tracking-tighter">{selectedPost.hashtags.map(h => `#${h} `)}</div>
              </section>
              
              {selectedPost.script && (
                <section>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-4">Roteiro / Orientação Visual</label>
                  <div className="p-6 bg-black/40 border border-white/5 rounded-2xl text-xs font-mono text-slate-400 leading-relaxed whitespace-pre-line">
                    {selectedPost.script}
                  </div>
                </section>
              )}
            </div>
            <div className="p-8 bg-black/50 border-t border-white/10 flex gap-4">
              <button onClick={() => { onTogglePostStatus(selectedPost.id); setSelectedPost(null); }} className={`flex-1 py-5 rounded-[2rem] font-black text-lg transition-all ${selectedPost.status === 'posted' ? 'bg-slate-800 text-slate-500' : 'bg-stratyx-green text-slate-950 shadow-2xl shadow-stratyx-green/10'}`}>
                {selectedPost.status === 'posted' ? 'REMARCAR COMO PENDENTE' : 'MARCAR COMO PUBLICADO ✓'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
