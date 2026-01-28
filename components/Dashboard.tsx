
import React, { useState } from 'react';
import { MarketingPlan, BusinessProfile, PostItem } from '../types';

interface DashboardProps {
  plan: MarketingPlan;
  profile: BusinessProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ plan, profile }) => {
  const [activeTab, setActiveTab] = useState<'marca' | 'conteudo' | 'execucao'>('marca');
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);

  const CopyButton = ({ text }: { text: string }) => (
    <button 
      onClick={() => navigator.clipboard.writeText(text)}
      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded font-medium transition-colors"
    >
      Copiar
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20">
      {/* Header Profile */}
      <div className="bg-white rounded-3xl p-6 mb-8 flex flex-col md:flex-row items-center gap-6 shadow-sm border border-slate-100">
        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-3xl font-bold">
          {profile.name.charAt(0)}
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-extrabold text-slate-900">{profile.name}</h1>
          <p className="text-slate-500 font-medium">{profile.businessType} • {profile.region}</p>
        </div>
        <div className="md:ml-auto flex gap-2">
           {plan.identity.suggestedColors.map((color, i) => (
             <div key={i} className="w-8 h-8 rounded-lg shadow-inner" style={{ backgroundColor: color }} title={color} />
           ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-slate-100 mb-8 sticky top-4 z-10">
        {(['marca', 'conteudo', 'execucao'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 px-4 rounded-xl font-bold capitalize transition-all ${
              activeTab === tab ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            {tab === 'marca' ? 'Minha Marca' : tab === 'conteudo' ? 'Estratégia' : 'Agenda de Posts'}
          </button>
        ))}
      </div>

      {/* Tab Content: Marca */}
      {activeTab === 'marca' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-900 uppercase text-sm tracking-widest mb-4">Palavras-Chave</h3>
              <div className="flex flex-wrap gap-2">
                {plan.identity.keywords.map((kw, i) => (
                  <span key={i} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-medium">#{kw}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-900 uppercase text-sm tracking-widest mb-4">Posicionamento de Mercado</h3>
              <p className="text-slate-600 leading-relaxed">{plan.identity.description}</p>
            </div>
            <div className="bg-indigo-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-200">
              <h3 className="font-bold uppercase text-sm tracking-widest mb-4 opacity-80">Estilo Visual Sugerido</h3>
              <p className="text-xl font-medium leading-relaxed mb-6">{plan.identity.visualStyle}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 p-4 rounded-2xl">
                  <span className="block text-xs uppercase font-bold mb-1 opacity-70">Fotos</span>
                  <span className="text-sm">Humanizadas e reais</span>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl">
                  <span className="block text-xs uppercase font-bold mb-1 opacity-70">Textos</span>
                  <span className="text-sm">Diretos e fortes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Conteúdo */}
      {activeTab === 'conteudo' && (
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold mb-6 text-slate-900">Onde Focar sua Energia?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border-2 border-indigo-50 p-6 rounded-2xl bg-indigo-50/30">
                <h4 className="font-bold text-indigo-600 mb-2">Tipos de Conteúdo</h4>
                <ul className="space-y-2">
                  {plan.strategy.idealTypes.map((type, i) => (
                    <li key={i} className="text-slate-600 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      {type}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-2 border-emerald-50 p-6 rounded-2xl bg-emerald-50/30">
                <h4 className="font-bold text-emerald-600 mb-2">Formatos Favoritos</h4>
                <ul className="space-y-2">
                  {plan.strategy.formats.map((fmt, i) => (
                    <li key={i} className="text-slate-600 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {fmt}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-2 border-amber-50 p-6 rounded-2xl bg-amber-50/30">
                <h4 className="font-bold text-amber-600 mb-2">Frequência Ideal</h4>
                <p className="text-slate-700 font-medium">{plan.strategy.frequency}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-8 rounded-3xl">
            <h3 className="text-xl font-bold mb-4">Estratégia do Mestre</h3>
            <p className="text-slate-300 leading-relaxed text-lg italic">"{plan.strategy.rationale}"</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold mb-4 text-slate-900">Temas que Estão em Alta no seu Nicho</h3>
            <div className="flex flex-wrap gap-3">
              {plan.strategy.hotTopics.map((topic, i) => (
                <div key={i} className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl font-semibold border border-indigo-100">
                  {topic}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Execucao */}
      {activeTab === 'execucao' && (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {plan.calendar.map((post, index) => (
            <div 
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all group relative"
            >
              <div className="absolute top-2 right-2 text-[10px] font-bold bg-slate-100 px-1.5 py-0.5 rounded uppercase text-slate-500">
                D{index + 1}
              </div>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 text-white ${
                post.platform === 'Instagram' ? 'bg-gradient-to-tr from-yellow-400 to-purple-600' : 
                post.platform === 'TikTok' ? 'bg-black' : 'bg-green-500'
              }`}>
                {post.platform.charAt(0)}
              </div>
              <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-tighter">{post.type}</p>
              <p className="text-sm font-semibold text-slate-800 line-clamp-2 leading-tight group-hover:text-indigo-600">{post.topic}</p>
              <p className="text-[10px] mt-2 font-medium text-slate-400">{post.bestTime}</p>
            </div>
          ))}

          {/* Post Detail Modal Overlay */}
          {selectedPost && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-3">
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${
                        selectedPost.platform === 'Instagram' ? 'bg-gradient-to-tr from-yellow-400 to-purple-600' : 
                        selectedPost.platform === 'TikTok' ? 'bg-black' : 'bg-green-500'
                      }`}>
                        {selectedPost.platform.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{selectedPost.type}</h4>
                        <p className="text-xs font-medium text-slate-500">Post pronto para usar</p>
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

                  {selectedPost.script && (
                    <section>
                       <div className="flex justify-between items-center mb-2">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Roteiro Sugerido</label>
                        <CopyButton text={selectedPost.script} />
                      </div>
                      <div className="p-6 bg-slate-50 rounded-2xl text-slate-700 whitespace-pre-line border border-slate-100 leading-relaxed font-mono text-sm">
                        {selectedPost.script}
                      </div>
                    </section>
                  )}

                  <section>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Legenda</label>
                      <CopyButton text={selectedPost.caption} />
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl text-slate-700 whitespace-pre-line border border-slate-100 leading-relaxed">
                      {selectedPost.caption}
                      <div className="mt-4 text-indigo-600 font-medium">
                        {selectedPost.hashtags.map(h => `#${h} `)}
                      </div>
                    </div>
                  </section>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-100 p-4 rounded-2xl">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Melhor Horário</span>
                      <span className="font-bold text-slate-700">{selectedPost.bestTime}</span>
                    </div>
                    <div className="bg-slate-100 p-4 rounded-2xl">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Formato</span>
                      <span className="font-bold text-slate-700">{selectedPost.platform}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 shrink-0">
                  <button onClick={() => setSelectedPost(null)} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all">
                    Entendi, vou postar!
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
