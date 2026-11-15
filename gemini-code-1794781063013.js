import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Headphones, MessageSquare, Compass, Moon, Star, 
  Settings, Search, Play, Pause, ChevronRight, User, Globe, 
  Heart, Sparkles, Send, Volume2, ShieldCheck, HelpCircle, ArrowRight, X, CheckCircle, CreditCard
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [chatMessages, setChatMessages] = useState([
    { 
      role: 'assistant', 
      content: 'السلام عليكم (As-salamu alaykum). Bienvenido a islam.official.ai. ¿En qué te puedo ayudar hoy a descubrir el conocimiento del Corán o del islam?' 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);

  // Estados del Corán
  const [surahs, setSurahs] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [ayahs, setAyahs] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const [reciter, setReciter] = useState('ar.alafasy');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutType, setCheckoutType] = useState(null);

  const chatEndRef = useRef(null);

  useEffect(() => {
    fetch('https://api.alquran.cloud/v1/surah')
      .then(res => res.json())
      .then(data => {
        if (data.code === 200) setSurahs(data.data);
      })
      .catch(err => console.error("Error cargando suras:", err));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, loadingChat]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loadingChat) return;

    const userMsg = inputMessage.trim();
    setInputMessage('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoadingChat(true);

    setTimeout(() => {
      let reply = `Hmm, sobre tu pregunta acerca de "${userMsg}", te recomiendo meditar en la sabiduría del Sagrado Corán. Recuerda que Allah es el Más Misericordioso. ¿Te gustaría que escuchemos alguna sura relacionada con esto?`;
      
      if (userMsg.toLowerCase().includes('hola') || userMsg.toLowerCase().includes('as-salamu')) {
        reply = `وعليكم السلام ورحمة الله وبركاته (Wa alaykum as-salam). ¡Hola! Es un placer hablar contigo. ¿Qué te gustaría aprender hoy sobre el islam, los profetas o el Sagrado Corán?`;
      } else if (userMsg.toLowerCase().includes('fatiha')) {
        reply = `Surat Al-Fatiha es la apertura del Libro, la madre del Corán. Consta de 7 aleyas benditas. Te recomiendo escucharla ahora mismo:`;
      }

      setChatMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      setLoadingChat(false);
    }, 1000);
  };

  const loadSurahDetails = (surahNumber) => {
    fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,es.cortes`)
      .then(res => res.json())
      .then(data => {
        if (data.code === 200) {
          const arabic = data.data[0].ayahs;
          const spanish = data.data[1].ayahs;
          const combined = arabic.map((ayah, idx) => ({
            number: ayah.numberInSurah,
            textArabic: ayah.text,
            textSpanish: spanish[idx].text,
            audio: `https://cdn.islamic.network/quran/audio/128/${reciter}/${ayah.number}.mp3`
          }));
          setSelectedSurah({ number: surahNumber, name: data.data[0].englishName, ayahs: combined });
          setActiveTab('coran');
        }
      });
  };

  const playAyahAudio = (audioUrl) => {
    if (currentAudio) {
      currentAudio.pause();
    }
    const audio = new Audio(audioUrl);
    setCurrentAudio(audio);
    audio.play();
    setIsPlaying(true);
    audio.onended = () => setIsPlaying(false);
  };

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      setIsPlaying(false);
    }
  };

  const profetas = [
    { name: "Adam (Adán)", title: "El Primer Humano y Profeta", desc: "El padre de la humanidad, creado del barro soplado con el espíritu de Allah." },
    { name: "Nuh (Noé)", title: "El Constructor del Arca", desc: "Predicó durante siglos llamando al monoteísmo antes del gran diluvio." },
    { name: "Ibrahim (Abraham)", title: "Khalilullah (Amigo de Dios)", desc: "Constructor de la Kaaba y ejemplo supremo de fe inquebrantable." },
    { name: "Musa (Moisés)", title: "Kalimullah (El que habló con Dios)", desc: "Liberó a los israelitas y recibió la Torá en el Monte Sinaí." },
    { name: "Isa (Jesús)", title: "El Mesías y Palabra de Dios", desc: "Respetado profundamente en el islam como uno de los mensajeros más grandes." },
    { name: "Muhammad ﷺ", title: "El Sello de los Profetas", desc: "Mensajero final para toda la humanidad, receptor de la revelación del Sagrado Corán." }
  ];

  return (
    <div className="flex h-screen bg-[#0A1F1C] text-[#F4F1EA] font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-[#051311] border-r border-[#1B3833] flex flex-col justify-between hidden md:flex">
        <div>
          <div className="p-6 flex items-center space-x-3 border-b border-[#1B3833]">
            <div className="bg-[#D4AF37] text-[#051311] p-2 rounded-xl font-bold">IA</div>
            <div>
              <h1 className="font-bold text-lg text-[#D4AF37]">islam.official.ai</h1>
              <p className="text-xs text-[#8FA8A3]">Conocimiento y Corán</p>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            {[
              { id: 'inicio', label: 'Inicio', icon: Compass },
              { id: 'chat', label: 'Islam AI (Chat)', icon: MessageSquare },
              { id: 'coran', label: 'El Sagrado Corán', icon: BookOpen },
              { id: 'profetas', label: 'Historias de Profetas', icon: Star },
              { id: 'pilares', label: 'Cinco Pilares', icon: ShieldCheck },
              { id: 'religiones', label: 'Otras Religiones', icon: Globe },
              { id: 'sadaqah', label: '⭐ Sadaqah & Pro', icon: Heart },
              { id: 'config', label: 'Configuración', icon: Settings },
            ].map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                    activeTab === item.id 
                      ? 'bg-[#123530] text-[#D4AF37] border border-[#D4AF37]/30' 
                      : 'text-[#C5D1CD] hover:bg-[#0D2824]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-[#1B3833]">
          <div className="bg-[#0D2824] p-3 rounded-xl border border-[#1B3833]">
            <p className="text-xs text-[#D4AF37] font-semibold">Sadaqah Jariyah</p>
            <p className="text-[11px] text-[#8FA8A3] mt-1">Apoya el mantenimiento de los servidores del Corán.</p>
            <button 
              onClick={() => setActiveTab('sadaqah')}
              className="mt-3 w-full bg-[#D4AF37] text-[#051311] py-1.5 rounded-lg text-xs font-bold hover:bg-[#e6c158] transition"
            >
              Apoyar Proyecto
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-[#071917] overflow-y-auto">
        {/* Top bar */}
        <header className="h-16 border-b border-[#1B3833] flex items-center justify-between px-6 bg-[#051311]/80 backdrop-blur sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <span className="text-xl">السلام عليكم</span>
            <span className="text-[#D4AF37] font-serif text-lg hidden sm:inline">| islam.official.ai</span>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setActiveTab('sadaqah')} 
              className="bg-[#123530] border border-[#D4AF37]/40 text-[#D4AF37] px-4 py-1.5 rounded-full text-xs font-bold hover:bg-[#1B3833] transition flex items-center space-x-1.5"
            >
              <Heart className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Pro & Donar</span>
            </button>
          </div>
        </header>

        {/* Content body */}
        <div className="p-6 md:p-10 max-w-5xl mx-auto w-full flex-1">
          {activeTab === 'inicio' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="bg-gradient-to-r from-[#0D2824] to-[#123530] p-8 md:p-12 rounded-3xl border border-[#1B3833] shadow-2xl relative overflow-hidden">
                <div className="relative z-10 max-w-xl">
                  <span className="bg-[#D4AF37]/20 text-[#D4AF37] px-3 py-1 rounded-full text-xs font-bold border border-[#D4AF37]/40">
                    Plataforma Oficial
                  </span>
                  <h2 className="text-3xl md:text-5xl font-bold font-serif text-[#F4F1EA] mt-4">
                    Descubre el conocimiento y acércate al Corán.
                  </h2>
                  <p className="text-[#A3B8B3] mt-3 text-sm md:text-base">
                    Hazle cualquier pregunta a nuestra Inteligencia Artificial especializada en el Islam, explora las suras o escucha recitaciones sagradas.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button 
                      onClick={() => setActiveTab('chat')}
                      className="bg-[#D4AF37] text-[#051311] px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#e6c158] transition flex items-center space-x-2 shadow-lg"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Hablar con Islam AI</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab('coran')}
                      className="bg-[#123530] text-[#F4F1EA] border border-[#1B3833] px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#1B3833] transition flex items-center space-x-2"
                    >
                      <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                      <span>Leer el Corán</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div 
                  onClick={() => setActiveTab('coran')}
                  className="bg-[#051311] p-6 rounded-2xl border border-[#1B3833] hover:border-[#D4AF37]/50 cursor-pointer transition shadow"
                >
                  <BookOpen className="w-8 h-8 text-[#D4AF37] mb-4" />
                  <h3 className="font-bold text-lg">114 Suras del Corán</h3>
                  <p className="text-sm text-[#8FA8A3] mt-2">Acceso completo al texto sagrado en árabe original con traducción al español y audio.</p>
                </div>
                <div 
                  onClick={() => setActiveTab('profetas')}
                  className="bg-[#051311] p-6 rounded-2xl border border-[#1B3833] hover:border-[#D4AF37]/50 cursor-pointer transition shadow"
                >
                  <Star className="w-8 h-8 text-[#D4AF37] mb-4" />
                  <h3 className="font-bold text-lg">Los 25 Profetas</h3>
                  <p className="text-sm text-[#8FA8A3] mt-2">Conoce las historias sagradas de todos los profetas mencionados en el Corán.</p>
                </div>
                <div 
                  onClick={() => setActiveTab('sadaqah')}
                  className="bg-[#051311] p-6 rounded-2xl border border-[#1B3833] hover:border-[#D4AF37]/50 cursor-pointer transition shadow"
                >
                  <Heart className="w-8 h-8 text-[#D4AF37] mb-4" />
                  <h3 className="font-bold text-lg">Sadaqah Jariyah</h3>
                  <p className="text-sm text-[#8FA8A3] mt-2">Apoya el proyecto o desbloquea funciones avanzadas en nuestra sección Pro.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="flex flex-col h-[calc(100vh-8rem)] bg-[#051311] rounded-2xl border border-[#1B3833] overflow-hidden">
              <div className="p-4 border-b border-[#1B3833] bg-[#0A1F1C] flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="font-bold text-sm">Islam AI Asistente Inteligente</span>
                </div>
                <span className="text-xs text-[#8FA8A3]">Especializado en el Islam y Corán</span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xl p-4 rounded-2xl text-sm ${
                      msg.role === 'user' 
                        ? 'bg-[#123530] text-[#F4F1EA] border border-[#1B3833]' 
                        : 'bg-[#0D2824] text-[#F4F1EA] border border-[#1B3833]'
                    }`}>
                      <p>{msg.content}</p>
                      {msg.content.includes('Surat Al-Fatiha') && (
                        <div className="mt-4 p-3 bg-[#051311] rounded-xl border border-[#D4AF37]/30">
                          <p className="text-right font-serif text-lg text-[#D4AF37]">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                          <p className="text-xs text-[#8FA8A3] mt-1">En el nombre de Dios, el Compasivo, el Misericordioso.</p>
                          <button 
                            onClick={() => playAyahAudio("https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3")}
                            className="mt-3 bg-[#D4AF37] text-[#051311] px-3 py-1 rounded-lg text-xs font-bold flex items-center space-x-1"
                          >
                            <Play className="w-3 h-3" />
                            <span>Escuchar Fatiha</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {loadingChat && (
                  <div className="flex justify-start">
                    <div className="bg-[#0D2824] p-3 rounded-2xl text-xs text-[#8FA8A3] animate-pulse">
                      Generando respuesta con conocimiento coránico...
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t border-[#1B3833] bg-[#0A1F1C] flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  placeholder="Pregunta sobre el islam, el Corán, profetas..."
                  className="flex-1 bg-[#051311] border border-[#1B3833] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D4AF37]"
                />
                <button 
                  type="submit"
                  className="bg-[#D4AF37] text-[#051311] px-5 rounded-xl font-bold flex items-center justify-center hover:bg-[#e6c158] transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {activeTab === 'coran' && (
            <div className="space-y-6">
              {!selectedSurah ? (
                <div>
                  <h2 className="text-2xl font-bold font-serif mb-4 text-[#D4AF37]">El Sagrado Corán (114 Suras)</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {surahs.map(surah => (
                      <div 
                        key={surah.number}
                        onClick={() => loadSurahDetails(surah.number)}
                        className="bg-[#051311] p-4 rounded-xl border border-[#1B3833] hover:border-[#D4AF37] cursor-pointer transition flex items-center justify-between"
                      >
                        <div>
                          <span className="text-xs text-[#D4AF37] font-bold">Suras {surah.number}</span>
                          <h4 className="font-bold text-base">{surah.englishName}</h4>
                          <p className="text-xs text-[#8FA8A3]">{surah.englishNameTranslation}</p>
                        </div>
                        <span className="font-serif text-lg text-[#D4AF37]">{surah.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-[#051311] p-4 rounded-xl border border-[#1B3833]">
                    <button 
                      onClick={() => setSelectedSurah(null)}
                      className="text-xs bg-[#123530] text-[#D4AF37] px-3 py-1.5 rounded-lg border border-[#D4AF37]/30"
                    >
                      ← Volver a las Suras
                    </button>
                    <h3 className="font-bold text-lg text-[#D4AF37]">{selectedSurah.name}</h3>
                  </div>

                  <div className="space-y-3">
                    {selectedSurah.ayahs.map(ayah => (
                      <div key={ayah.number} className="bg-[#051311] p-5 rounded-xl border border-[#1B3833] space-y-3">
                        <div className="flex justify-between items-center text-xs text-[#8FA8A3]">
                          <span>Aya {ayah.number}</span>
                          <button 
                            onClick={() => playAyahAudio(ayah.audio)}
                            className="bg-[#123530] text-[#D4AF37] px-3 py-1 rounded-lg flex items-center space-x-1 hover:bg-[#1B3833]"
                          >
                            <Play className="w-3 h-3" />
                            <span>Escuchar</span>
                          </button>
                        </div>
                        <p className="text-right font-serif text-2xl text-[#D4AF37] leading-loose">{ayah.textArabic}</p>
                        <p className="text-sm text-[#C5D1CD]">{ayah.textSpanish}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'profetas' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold font-serif text-[#D4AF37]">Los 25 Profetas del Corán</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profetas.map((p, i) => (
                  <div key={i} className="bg-[#051311] p-6 rounded-2xl border border-[#1B3833] space-y-2">
                    <span className="text-xs text-[#D4AF37] font-bold">Profeta {i + 1}</span>
                    <h3 className="text-xl font-bold font-serif">{p.name}</h3>
                    <p className="text-xs text-[#8FA8A3] italic">{p.title}</p>
                    <p className="text-sm text-[#C5D1CD] pt-2">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'sadaqah' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold font-serif text-[#D4AF37]">Sadaqah Jariyah & Pro</h2>
                <p className="text-sm text-[#8FA8A3]">Apoya el mantenimiento de islam.official.ai o desbloquea funciones avanzadas.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-[#051311] p-6 rounded-2xl border border-[#1B3833] space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                    <Heart className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-lg">Donación Voluntaria</h3>
                  <p className="text-xs text-[#8FA8A3]">Contribuye para mantener los servidores y APIs abiertos.</p>
                  <div className="flex gap-2">
                    <button onClick={() => { setCheckoutType('Donación $5'); setShowCheckout(true); }} className="flex-1 bg-[#123530] py-2 rounded-xl text-xs font-bold text-[#D4AF37] border border-[#D4AF37]/30">$5</button>
                    <button onClick={() => { setCheckoutType('Donación $15'); setShowCheckout(true); }} className="flex-1 bg-[#123530] py-2 rounded-xl text-xs font-bold text-[#D4AF37] border border-[#D4AF37]/30">$15</button>
                    <button onClick={() => { setCheckoutType('Donación $50'); setShowCheckout(true); }} className="flex-1 bg-[#123530] py-2 rounded-xl text-xs font-bold text-[#D4AF37] border border-[#D4AF37]/30">$50</button>
                  </div>
                </div>

                <div className="bg-[#051311] p-6 rounded-2xl border border-[#D4AF37]/50 space-y-4 relative">
                  <div className="absolute top-4 right-4 bg-[#D4AF37] text-[#051311] text-[10px] font-bold px-2 py-0.5 rounded">PRO</div>
                  <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                    <Star className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-lg">Islam AI Pro</h3>
                  <p className="text-xs text-[#8FA8A3]">Consultas ilimitadas y recitaciones en alta fidelidad offline.</p>
                  <button 
                    onClick={() => { setCheckoutType('Suscripción Pro ($4.99/mes)'); setShowCheckout(true); }}
                    className="w-full bg-[#D4AF37] text-[#051311] py-2.5 rounded-xl text-xs font-bold hover:bg-[#e6c158] transition"
                  >
                    Obtener Pro ($4.99/mes)
                  </button>
                </div>
              </div>

              {showCheckout && (
                <div className="bg-[#051311] p-6 rounded-2xl border border-[#D4AF37] space-y-4 animate-fadeIn">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-[#D4AF37]">Pasarela de Pago Segura ({checkoutType})</h4>
                    <button onClick={() => setShowCheckout(false)} className="text-[#8FA8A3] hover:text-white"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-[#8FA8A3]">Número de Tarjeta</label>
                      <input type="text" placeholder="4242 •••• •••• ••••" className="w-full bg-[#0A1F1C] border border-[#1B3833] rounded-xl p-2 text-sm mt-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" placeholder="MM / AA" className="bg-[#0A1F1C] border border-[#1B3833] rounded-xl p-2 text-sm" />
                      <input type="text" placeholder="CVC" className="bg-[#0A1F1C] border border-[#1B3833] rounded-xl p-2 text-sm" />
                    </div>
                    <button 
                      onClick={() => { alert('¡Jazakallah Khair! Simulación de pago completada con éxito.'); setShowCheckout(false); }}
                      className="w-full bg-[#D4AF37] text-[#051311] py-3 rounded-xl font-bold text-sm hover:bg-[#e6c158]"
                    >
                      Pagar y Confirmar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'config' && (
            <div className="space-y-6 max-w-xl mx-auto">
              <h2 className="text-2xl font-bold font-serif text-[#D4AF37]">Configuración de la Aplicación</h2>
              <div className="bg-[#051311] p-6 rounded-2xl border border-[#1B3833] space-y-4">
                <div>
                  <label className="text-xs text-[#8FA8A3]">Seleccionar Recitador Preferido</label>
                  <select 
                    value={reciter} 
                    onChange={e => setReciter(e.target.value)}
                    className="w-full bg-[#0A1F1C] border border-[#1B3833] rounded-xl p-3 text-sm mt-1 text-[#F4F1EA]"
                  >
                    <option value="ar.alafasy">Mishary Rashid Alafasy</option>
                    <option value="ar.abdulbasit">Abdul Basit Abdul Samad</option>
                    <option value="ar.minshawi">Mohamed Siddiq El-Minshawi</option>
                  </select>
                </div>
                <div className="pt-4 border-t border-[#1B3833]">
                  <p className="text-xs text-[#8FA8A3]">Versión de la App: 1.0.0 (Producción)</p>
                  <p className="text-xs text-[#8FA8A3] mt-1">Nombre oficial: islam.official.ai</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}