
import React, { useState } from 'react';
import { MarketingPlan, BusinessProfile, PostItem, Competitor, PlatformAdaptation, Platform, Project } from '../types';
import { storageService } from '../services/storageService';
import { LogoComponent } from '../constants';

interface DashboardProps {
  plan: MarketingPlan;
  profile: BusinessProfile;
  onExportPDF: () => void;
  onSaveProject: (projectName: string) => void;
  onTogglePostStatus: (postId: string) => void;
  onExtendCalendar: () => void;
  onUpdateProfile: (profile: BusinessProfile) => void;
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
  onUpdateProfile,
  isSaving,
  isExtending
}) => {
  const [activeTab, setActiveTab] = useState<'marca' | 'conteudo' | 'execucao' | 'concorrencia' | 'canais' | 'config'>('execucao');
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [tempProjectName, setTempProjectName] = useState(profile.name);
  const [editProfile, setEditProfile] = useState<BusinessProfile>({ ...profile });

  const handleSave = () => {
    onSaveProject(tempProjectName);
    setIsRenaming(false);
  };

  const handleJSONExport = () => {
    const project: Project = {
      id: 'export',
      projectName: tempProjectName,
      createdAt: new Date().toISOString(),
      profile: profile,
      plan: plan
    };
    storageService.exportPlanAsJSON(project);
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
    switch (platform) {
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
      {/* Strategy Efficiency Summary & Grounding Sources */}
      <div className="mb-8 p-8 bg-stratyx-green/10 border border-stratyx-green/20 rounded-[2.5rem] animate-in fade-in duration-700 avoid-break">
        <h3 className="text-stratyx-green text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          SÍNTESE DA EFICIÊNCIA ESTRATÉGICA
        </h3>
        <p className="text-stratyx-white text-lg font-medium leading-relaxed italic mb-6">
          "{plan.summary}"
        </p>

        {/* Displaying Google Search grounding Sources to satisfy API requirements */}
        {plan.groundingSources && plan.groundingSources.length > 0 && (
          <div className="pt-6 border-t border-stratyx-green/10">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Fontes de Pesquisa (Google)</h4>
            <div className="flex flex-wrap gap-2">
              {plan.groundingSources.map((chunk, idx) => (
                chunk.web && (
                  <a
                    key={idx}
                    href={chunk.web.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 bg-black/40 border border-white/5 px-3 py-1.5 rounded-xl text-[10px] text-stratyx-green font-bold hover:bg-stratyx-green/10 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    {chunk.web.title || 'Referência Externa'}
                  </a>
                )
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md rounded-[2.5rem] p-8 mb-8 flex flex-col md:flex-row items-center gap-8 shadow-2xl border border-white/5 avoid-break">
        <div className="w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center text-stratyx-green text-4xl font-black overflow-hidden shadow-inner border border-white/5">
          {profile.logoUrl ? <img src={profile.logoUrl} className="w-full h-full object-contain" /> : <LogoComponent className="h-10" />}
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
          <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{profile.businessType}</p>
            <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
            <p className="text-stratyx-green font-black uppercase tracking-widest text-[10px]">{isSaving ? 'Salvando...' : 'Nuvem Ativa'}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 no-print">
          <button onClick={handleJSONExport} className="bg-slate-800/50 text-slate-400 p-3 rounded-2xl hover:bg-slate-800 transition-all border border-white/5" title="Exportar JSON">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          </button>
          <button onClick={onExportPDF} className="bg-slate-800 text-stratyx-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-700 transition-all border border-white/10">
            PDF
          </button>
          <button onClick={handleSave} disabled={isSaving} className="bg-stratyx-green text-slate-950 px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:brightness-110 shadow-lg shadow-stratyx-green/10">
            {isSaving ? 'SALVANDO...' : 'SALVAR PLANO'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="no-print flex bg-black/20 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-white/5 mb-8 sticky top-4 z-10 overflow-x-auto">
        {(['marca', 'conteudo', 'concorrencia', 'canais', 'execucao', 'config'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap flex-1 py-4 px-6 rounded-xl font-black uppercase text-xs tracking-widest transition-all ${activeTab === tab ? 'bg-stratyx-green text-slate-950 shadow-lg shadow-stratyx-green/10' : 'text-slate-400 hover:text-stratyx-white'
              }`}
          >
            {tab === 'marca' ? 'Marca' : tab === 'conteudo' ? 'Estratégia' : tab === 'concorrencia' ? 'Rivais' : tab === 'canais' ? 'Omnichannel' : tab === 'execucao' ? 'Calendário' : 'Config'}
          </button>
        ))}
      </div>

      <div className="main-content-area">
        {/* Canais */}
        {(activeTab === 'canais' || window.matchMedia('print').matches) && (
          <div className="space-y-8 animate-in fade-in duration-500 page-break">
            <div className="bg-black/10 border border-white/5 p-10 rounded-[2.5rem]">
              <h2 className="text-3xl font-black text-stratyx-white mb-2 tracking-tighter">ADAPTAÇÕES MULTIPLATAFORMA</h2>
              <p className="text-slate-400">Distribuição estratégica baseada no público e canais selecionados.</p>
            </div>
            <div className="grid grid-cols-1 gap-8">
              {plan.adaptations?.map((adapt, i) => (
                <div key={i} className="bg-black/10 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-xl avoid-break">
                  <div className="bg-white/5 p-6 border-b border-white/5">
                    <p className="text-xl font-black text-stratyx-white italic">"{adapt.originalTopic}"</p>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x border-white/5">
                    {/* TikTok */}
                    {profile.selectedPlatforms.includes('TikTok') && (
                      <div className="p-8">
                        <div className="flex items-center gap-3 mb-6"><div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-black">T</div><h4 className="font-black text-stratyx-white text-xs uppercase">TikTok</h4></div>
                        <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Conceito Visual</p>
                        <p className="text-sm font-bold text-slate-200 bg-black/20 p-4 rounded-xl border border-white/5 mb-4">{adapt.tiktok.videoIdea}</p>
                        <p className="text-[11px] text-stratyx-green font-bold mb-4">🎵 {adapt.tiktok.audioTrendSuggestion}</p>
                        <CopyButton text={adapt.tiktok.caption} />
                      </div>
                    )}
                    {/* LinkedIn */}
                    {profile.selectedPlatforms.includes('LinkedIn') && (
                      <div className="p-8">
                        <div className="flex items-center gap-3 mb-6"><div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-sm">In</div><h4 className="font-black text-stratyx-white text-xs uppercase">LinkedIn</h4></div>
                        <div className="mb-2"><CopyButton text={adapt.linkedin.postText} /></div>
                        <p className="text-xs text-slate-200 leading-relaxed font-medium line-clamp-10 italic">{adapt.linkedin.postText}</p>
                      </div>
                    )}
                    {/* YouTube */}
                    {profile.selectedPlatforms.includes('YouTube Shorts') && (
                      <div className="p-8">
                        <div className="flex items-center gap-3 mb-6"><div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-black text-xs">YT</div><h4 className="font-black text-stratyx-white text-xs uppercase">Shorts</h4></div>
                        <p className="text-sm font-bold text-slate-100 mb-4">{adapt.youtubeShorts.title}</p>
                        <p className="text-xs text-slate-400 bg-black/20 p-3 rounded-lg border border-white/5">{adapt.youtubeShorts.videoIdea}</p>
                      </div>
                    )}
                    {/* WhatsApp */}
                    {profile.selectedPlatforms.includes('WhatsApp') && (
                      <div className="p-8">
                        <div className="flex items-center gap-3 mb-6"><div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-slate-950 font-black text-sm">W</div><h4 className="font-black text-stratyx-white text-xs uppercase">Zap</h4></div>
                        <div className="mb-2"><CopyButton text={adapt.whatsapp.message} /></div>
                        <p className="text-xs text-slate-300 italic bg-stratyx-green/5 p-4 rounded-xl border border-stratyx-green/10">"{adapt.whatsapp.message}"</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Calendário */}
        {(activeTab === 'execucao' || window.matchMedia('print').matches) && (
          <div className="animate-in fade-in duration-500 page-break">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-black text-stratyx-white tracking-tighter uppercase">FLUXO DE EXECUÇÃO</h2>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">Calendário para {profile.selectedPlatforms.length} canais ativos</p>
              </div>
              <button onClick={onExtendCalendar} disabled={isExtending} className="bg-slate-800 text-stratyx-green px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-700 transition-all border border-white/10 disabled:opacity-50 flex items-center gap-3 no-print">
                {isExtending ? 'CALCULANDO NOVOS DIAS...' : '+ Escalar Planejamento'}
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {calendarDays.map((day) => {
                const dayPosts = postsByDay[day] || [];
                return (
                  <div key={day} className={`min-h-[140px] p-5 rounded-3xl border transition-all avoid-break ${dayPosts.length > 0 ? 'bg-black/20 border-white/10 hover:border-stratyx-green/50 cursor-pointer shadow-xl' : 'bg-black/5 border-dashed border-white/5 opacity-20'}`}>
                    <span className="text-[10px] font-black text-slate-600 mb-3 tracking-widest block">DIA {day}</span>
                    <div className="space-y-3">
                      {dayPosts.map((post, idx) => (
                        <div key={idx} onClick={() => setSelectedPost(post)} className="p-2 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all">
                          <p className="text-[10px] font-black text-stratyx-white leading-tight line-clamp-2 uppercase mb-2">{post.topic}</p>
                          {getPlatformIcon(post.platform)}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Marca */}
        {activeTab === 'marca' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
            <div className="bg-black/20 p-10 rounded-[2.5rem] border border-white/5">
              <h3 className="font-black text-slate-500 uppercase text-[10px] tracking-widest mb-6">Identidade de Bio</h3>
              <p className="text-2xl font-black text-stratyx-white italic tracking-tighter mb-4 leading-tight">"{plan.identity.bio}"</p>
              <p className="text-slate-400 text-sm leading-relaxed">{plan.identity.description}</p>
            </div>
            <div className="bg-gradient-to-br from-stratyx-green to-emerald-400 p-10 rounded-[2.5rem] text-slate-950">
              <h3 className="font-black uppercase text-[10px] tracking-widest mb-4 opacity-70">A Grande Promessa</h3>
              <p className="text-4xl font-black tracking-tighter leading-tight">{plan.identity.promise}</p>
            </div>
          </div>
        )}

        {/* Estratégia (conteudo) */}
        {activeTab === 'conteudo' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-black/20 p-10 rounded-[2.5rem] border border-white/5">
              <h2 className="text-3xl font-black text-stratyx-white mb-6 uppercase tracking-tighter">Diretrizes Estratégicas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <h4 className="text-stratyx-green font-black text-xs uppercase tracking-widest mb-4">Formatos Recomendados</h4>
                  <div className="flex flex-wrap gap-2">
                    {plan.strategy.formats.map((f, i) => (
                      <span key={i} className="bg-white/5 px-4 py-2 rounded-xl text-xs font-bold text-slate-300 border border-white/5">{f}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-stratyx-green font-black text-xs uppercase tracking-widest mb-4">Tópicos Quentes (2025)</h4>
                  <div className="flex flex-wrap gap-2">
                    {plan.strategy.hotTopics.map((t, i) => (
                      <span key={i} className="bg-stratyx-green/10 px-4 py-2 rounded-xl text-xs font-black text-stratyx-green border border-stratyx-green/20"># {t}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-10 pt-10 border-t border-white/5">
                <h4 className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-4">Racional de Dominação</h4>
                <p className="text-slate-300 leading-relaxed italic">"{plan.strategy.rationale}"</p>
              </div>
            </div>
          </div>
        )}

        {/* Concorrentes (concorrencia) */}
        {activeTab === 'concorrencia' && (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-3xl font-black text-stratyx-white mb-8 tracking-tighter uppercase">MAPA DE RIVAIS & OPORTUNIDADES</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plan.competitors?.map((comp, i) => (
                <div key={i} className="bg-black/20 p-8 rounded-[2.5rem] border border-white/5 hover:border-stratyx-green transition-all group overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-4">
                    <span className="text-[10px] font-black text-stratyx-green bg-stratyx-green/10 px-3 py-1 rounded-full uppercase italic">{comp.engagementLevel}</span>
                  </div>
                  <h3 className="text-2xl font-black text-stratyx-white mb-2 group-hover:text-stratyx-green transition-colors">{comp.name}</h3>
                  <p className="text-slate-500 text-[10px] font-black uppercase mb-6">{comp.postTypes}</p>

                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-black text-slate-600 uppercase mb-1">Atividade Recente</p>
                      <p className="text-xs text-slate-400 font-medium">{comp.recentActivity}</p>
                    </div>
                    <div className="p-4 bg-stratyx-green/5 rounded-2xl border border-stratyx-green/20">
                      <p className="text-[10px] font-black text-stratyx-green uppercase mb-1">Ponto de Ruptura / Oportunidade</p>
                      <p className="text-xs text-stratyx-white font-bold italic">"{comp.opportunity}"</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Configurações */}
        {activeTab === 'config' && (
          <div className="animate-in fade-in duration-500">
            <div className="bg-black/20 p-10 rounded-[2.5rem] border border-white/5 max-w-2xl mx-auto">
              <h2 className="text-3xl font-black text-stratyx-white mb-2 tracking-tighter uppercase">CONFIGURAÇÕES ESTRATÉGICAS</h2>
              <p className="text-slate-500 mb-10 font-medium">Ajuste o motor STRATYX para novos objetivos.</p>

              <div className="space-y-8 text-left">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 mb-3 uppercase tracking-widest">Objetivo Principal</label>
                  <select
                    className="w-full p-4 bg-black/40 rounded-2xl border-2 border-white/5 text-stratyx-white font-bold outline-none focus:border-stratyx-green transition-all"
                    value={editProfile.objective}
                    onChange={e => setEditProfile({ ...editProfile, objective: e.target.value as any })}
                  >
                    <option value="vender">Conversão Bruta (Vendas)</option>
                    <option value="atrair">Expansão de Audiência (Atrair)</option>
                    <option value="autoridade">Posicionamento de Autoridade</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 mb-3 uppercase tracking-widest">Tom de Voz & Estilo</label>
                  <select
                    className="w-full p-4 bg-black/40 rounded-2xl border-2 border-white/5 text-stratyx-white font-bold outline-none focus:border-stratyx-green transition-all"
                    value={editProfile.style}
                    onChange={e => setEditProfile({ ...editProfile, style: e.target.value as any })}
                  >
                    <option value="popular">Impacto Direto (Popular)</option>
                    <option value="descontraido">Criatividade Disruptiva (Descontraído)</option>
                    <option value="serio">Executivo Premium (Sério)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 mb-3 uppercase tracking-widest">Frequência Diária ({editProfile.postsPerDay} posts)</label>
                  <input
                    type="range" min="1" max="5"
                    className="w-full accent-stratyx-green mb-2"
                    value={editProfile.postsPerDay}
                    onChange={e => setEditProfile({ ...editProfile, postsPerDay: parseInt(e.target.value) })}
                  />
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => onUpdateProfile(editProfile)}
                    className="w-full bg-gradient-to-r from-stratyx-green to-emerald-400 text-slate-950 py-5 rounded-[2rem] font-black text-lg hover:brightness-110 shadow-xl shadow-stratyx-green/20 transition-all"
                  >
                    REGENERAR ESTRATÉGIA COMPLETA 🚀
                  </button>
                  <p className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-4">
                    ⚠️ Ao regenerar, o calendário atual será substituído pela nova estratégia.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Detalhe */}
      {selectedPost && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 no-print">
          <div className="bg-slate-900 w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden max-h-[95vh] flex flex-col border border-white/10">
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-4">
                {getPlatformIcon(selectedPost.platform)}
                <h4 className="font-black text-stratyx-white uppercase text-lg">Detalhes do Post</h4>
              </div>
              <button onClick={() => setSelectedPost(null)} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-full transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-10 overflow-y-auto space-y-8">
              <section>
                <label className="block text-[10px] font-black text-stratyx-green uppercase mb-2">Tópico</label>
                <h3 className="text-2xl font-black text-stratyx-white leading-tight">{selectedPost.topic}</h3>
                {selectedPost.reelsMetadata && (
                  <div className="mt-4 p-4 bg-stratyx-green/5 border border-stratyx-green/10 rounded-2xl">
                    <p className="text-xs text-stratyx-green font-black">Gancho: {selectedPost.reelsMetadata.hook3s}</p>
                  </div>
                )}
              </section>
              <section>
                <div className="flex justify-between items-center mb-3"><label className="text-[10px] font-black text-slate-500 uppercase">Legenda Estratégica</label><CopyButton text={selectedPost.caption} /></div>
                <div className="p-6 bg-slate-800 rounded-2xl text-stratyx-white text-sm leading-relaxed italic">{selectedPost.caption}</div>
              </section>
            </div>
            <div className="p-8 bg-black/50 border-t border-white/10 flex gap-4">
              <button onClick={() => { onTogglePostStatus(selectedPost.id); setSelectedPost(null); }} className={`flex-1 py-5 rounded-[2rem] font-black text-lg transition-all ${selectedPost.status === 'posted' ? 'bg-slate-800 text-slate-500' : 'bg-stratyx-green text-slate-950 shadow-2xl'}`}>
                {selectedPost.status === 'posted' ? 'Marcar como Pendente' : 'Marcar como Publicado ✓'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
