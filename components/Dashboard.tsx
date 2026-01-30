
import React, { useState } from 'react';
import { MarketingPlan, BusinessProfile, PostItem, Competitor } from '../types';

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
  const [activeTab, setActiveTab] = useState<'marca' | 'conteudo' | 'execucao' | 'concorrencia'>('execucao');
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
      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded font-medium transition-colors no-print"
    >
      Copiar
    </button>
  );

  // Group posts by day for the monthly grid
  const postsByDay = plan.calendar.reduce((acc, post) => {
    acc[post.dayOfMonth] = post;
    return acc;
  }, {} as Record<number, PostItem>);

  const calendarDays = Array.from({ length: 35 }, (_, i) => i + 1);

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20">
      {/* Header Profile */}
      <div className="bg-white rounded-3xl p-6 mb-8 flex flex-col md:flex-row items-center gap-6 shadow-sm border border-slate-100">
        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-3xl font-bold overflow-hidden">
          {profile.logoUrl ? <img src={profile.logoUrl} className="w-full h-full object-contain" /> : profile.name.charAt(0)}
        </div>
        <div className="text-center md:text-left flex-1">
          {isRenaming ? (
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <input 
                type="text" 
                className="text-2xl font-extrabold text-slate-900 border-b-2 border-indigo-500 outline-none"
                value={tempProjectName}
                onChange={e => setTempProjectName(e.target.value)}
                autoFocus
              />
              <button onClick={handleSave} className="bg-indigo-600 text-white p-2 rounded-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 justify-center md:justify-start group">
              <h1 className="text-2xl font-extrabold text-slate-900">{tempProjectName}</h1>
              <button onClick={() => setIsRenaming(true)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-indigo-600 transition-all no-print">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </button>
            </div>
          )}
          <p className="text-slate-500 font-medium">{profile.businessType} • {profile.region}</p>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-4 no-print">
           <div className="flex gap-2">
             {plan.identity.suggestedColors.map((color, i) => (
               <div key={i} className="w-8 h-8 rounded-lg shadow-inner border border-slate-100" style={{ backgroundColor: color }} title={color} />
             ))}
           </div>
           <button 
            onClick={onExportPDF}
            className="bg-white border-2 border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all"
           >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
             PDF
           </button>
           <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
           >
             {isSaving ? 'Salvando...' : 'Salvar Plano'}
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
           </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="no-print flex bg-white p-2 rounded-2xl shadow-sm border border-slate-100 mb-8 sticky top-4 z-10 overflow-x-auto">
        {(['marca', 'conteudo', 'concorrencia', 'execucao'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap flex-1 py-3 px-4 rounded-xl font-bold capitalize transition-all ${
              activeTab === tab ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            {tab === 'marca' ? 'Minha Marca' : tab === 'conteudo' ? 'Estratégia' : tab === 'concorrencia' ? 'Concorrência' : 'Calendário Mensal'}
          </button>
        ))}
      </div>

      {/* PRINT VERSION (Hidden in UI) */}
      <div className="print-only p-8">
        <h1 className="text-4xl font-black mb-4">Relatório de Marketing - {tempProjectName}</h1>
        <section className="mb-10">
          <h2 className="text-2xl font-bold border-b-2 mb-4">1. Identidade</h2>
          <p><strong>Bio:</strong> {plan.identity.bio}</p>
          <p><strong>Promessa:</strong> {plan.identity.promise}</p>
        </section>
        <section className="page-break">
          <h2 className="text-2xl font-bold border-b-2 mb-4">2. Agenda Mensal ({plan.calendar.length} posts)</h2>
          <div className="space-y-4">
            {plan.calendar.map(post => (
              <div key={post.id} className="border p-4 rounded-xl">
                <p className="font-bold">Dia {post.dayOfMonth}: {post.topic} ({post.platform})</p>
                <p className="text-sm italic">{post.hook}</p>
                <p className="text-xs mt-2">{post.caption}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* INTERACTIVE UI */}
      <div className="no-print">
        {activeTab === 'marca' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-900 uppercase text-sm tracking-widest">Bio Otimizada (Instagram)</h3>
                  <CopyButton text={plan.identity.bio} />
                </div>
                <p className="text-slate-700 italic leading-relaxed whitespace-pre-line">{plan.identity.bio}</p>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-900 uppercase text-sm tracking-widest mb-4">Promessa Irresistível</h3>
                <p className="text-lg font-semibold text-indigo-600 leading-tight">"{plan.identity.promise}"</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-900 uppercase text-sm tracking-widest mb-4">Posicionamento</h3>
                <p className="text-slate-600 leading-relaxed">{plan.identity.description}</p>
              </div>
              <div className="bg-indigo-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-200">
                <h3 className="font-bold uppercase text-sm tracking-widest mb-4 opacity-80">Estilo Visual</h3>
                <p className="text-xl font-medium leading-relaxed mb-6">{plan.identity.visualStyle}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'concorrencia' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {plan.competitors.map((comp, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                <h4 className="font-bold text-slate-900 mb-2">{comp.name}</h4>
                <div className="space-y-4">
                  <p className="text-sm text-slate-600">{comp.postTypes}</p>
                  <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <p className="text-sm text-indigo-900 font-medium italic">"{comp.opportunity}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'conteudo' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold mb-6 text-slate-900">Estratégia do Mestre</h2>
              <p className="text-slate-700 leading-relaxed text-lg italic">"{plan.strategy.rationale}"</p>
            </div>
          </div>
        )}

        {activeTab === 'execucao' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Seu Calendário Mensal</h2>
                <p className="text-sm text-slate-500">Marque o que já foi postado para acompanhar seu progresso.</p>
              </div>
              <button 
                onClick={onExtendCalendar}
                disabled={isExtending}
                className="bg-indigo-100 text-indigo-700 px-6 py-2 rounded-xl font-bold hover:bg-indigo-200 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isExtending ? 'Gerando...' : '+ Gerar Mais 10 Dias'}
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
              {calendarDays.map((day) => {
                const post = postsByDay[day];
                return (
                  <div 
                    key={day}
                    className={`min-h-[120px] p-3 rounded-2xl border transition-all ${
                      post 
                        ? post.status === 'posted' 
                          ? 'bg-emerald-50 border-emerald-100 opacity-60' 
                          : 'bg-white border-slate-100 hover:border-indigo-400 cursor-pointer shadow-sm'
                        : 'bg-slate-50 border-dashed border-slate-200 opacity-50'
                    } relative`}
                    onClick={() => post && setSelectedPost(post)}
                  >
                    <span className="text-[10px] font-bold text-slate-400">DIA {day}</span>
                    {post && (
                      <div className="mt-1">
                        {post.isTrend && (
                          <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" title="Trend/Meme" />
                        )}
                        <p className="text-[11px] font-bold text-slate-800 leading-tight line-clamp-3">{post.topic}</p>
                        <div className="mt-2 flex items-center justify-between">
                           <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${
                             post.platform === 'Instagram' ? 'bg-purple-100 text-purple-600' : 'bg-black text-white'
                           }`}>
                             {post.platform.charAt(0)}
                           </span>
                           {post.status === 'posted' && (
                             <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                           )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Selected Post Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col scale-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${
                    selectedPost.platform === 'Instagram' ? 'bg-gradient-to-tr from-yellow-400 to-purple-600' : 
                    selectedPost.platform === 'TikTok' ? 'bg-black' : 'bg-green-500'
                  }`}>
                    {selectedPost.platform.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900">{selectedPost.type}</h4>
                      {selectedPost.isTrend && <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">TREND/MEME 🔥</span>}
                    </div>
                    <p className="text-xs font-medium text-slate-500">Dia {selectedPost.dayOfMonth} • {selectedPost.bestTime}</p>
                  </div>
              </div>
              <button onClick={() => setSelectedPost(null)} className="p-2 hover:bg-slate-100 rounded-full">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-8">
              <section>
                <label className="block text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-2">Tópico & Gancho</label>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{selectedPost.topic}</h3>
                <p className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl text-indigo-900 font-medium italic">"{selectedPost.hook}"</p>
              </section>

              <section>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Legenda Sugerida</label>
                  <CopyButton text={selectedPost.caption} />
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl text-slate-700 whitespace-pre-line border border-slate-100 leading-relaxed">
                  {selectedPost.caption}
                  <div className="mt-4 text-indigo-600 font-medium">
                    {selectedPost.hashtags.map(h => `#${h} `)}
                  </div>
                </div>
              </section>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 shrink-0 flex gap-4">
              <button 
                onClick={() => {
                  onTogglePostStatus(selectedPost.id);
                  setSelectedPost(null);
                }}
                className={`flex-1 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                  selectedPost.status === 'posted' 
                    ? 'bg-slate-200 text-slate-600 hover:bg-slate-300' 
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl shadow-emerald-100'
                }`}
              >
                {selectedPost.status === 'posted' ? 'Remarcar como Pendente' : 'Marcar como Postado ✓'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
