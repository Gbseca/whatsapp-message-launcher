import { useState, useRef } from 'react';
import { Toaster, toast } from 'sonner';
import { 
  Zap, 
  Info, 
  MessageSquare, 
  Users, 
  Wand2, 
  LayoutGrid, 
  Kanban, 
  Phone, 
  Check, 
  MessageCircle, 
  CheckCircle2 
} from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  rawPhone: string;
  phone: string;
  displayPhone: string;
  waLink: string;
}

export default function App() {
  const [templateMsg, setTemplateMsg] = useState(
    'Olá {nome}, tudo bem? Sentimos sua falta! Temos uma condição especial para você hoje na Regional SG...'
  );
  const [rawList, setRawList] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [processedIds, setProcessedIds] = useState<Set<string>>(new Set());
  
  const cardsSectionRef = useRef<HTMLElement>(null);

  const handleGenerate = () => {
    if (!templateMsg.trim()) {
      toast.error('A mensagem padrão não pode estar vazia.');
      return;
    }

    if (!rawList.trim()) {
      toast.error('Por favor, cole sua lista de contatos.');
      return;
    }

    const lines = rawList.split('\n');
    const newContacts: Contact[] = [];
    let validCount = 0;

    lines.forEach((line, index) => {
      if (!line.trim()) return;

      const parts = line.split(';');
      if (parts.length < 2) {
        console.warn(`Linha ignorada (formato inválido): ${line}`);
        return;
      }

      const name = parts[0].trim();
      const rawPhone = parts[1].trim();
      
      // Normalização do número: remove tudo que não for dígito
      let phone = rawPhone.replace(/\D/g, '');
      
      // Regra de negócio: Adicionar '55' se for um celular do BR (11 ou 10 dígitos)
      if (phone.length === 11 || phone.length === 10) { 
        phone = '55' + phone;
      }

      // Criação da mensagem personalizada e URL
      const personalizedMsg = templateMsg.replace(/{nome}/gi, name);
      const encodedMsg = encodeURIComponent(personalizedMsg);
      const waLink = `https://api.whatsapp.com/send?phone=${phone}&text=${encodedMsg}`;

      // Formatação visual do telefone (exemplo para BR)
      let displayPhone = rawPhone;
      if (phone.length === 13 && phone.startsWith('55')) {
        const ddd = phone.substring(2, 4);
        const prefix = phone.substring(4, 9);
        const suffix = phone.substring(9);
        displayPhone = `+55 (${ddd}) ${prefix}-${suffix}`;
      }

      newContacts.push({
        id: `${index}-${phone}`,
        name,
        rawPhone,
        phone,
        displayPhone,
        waLink
      });
      validCount++;
    });

    if (validCount > 0) {
      setContacts(newContacts);
      setProcessedIds(new Set()); // Reset processed state for new list
      toast.success(`${validCount} contatos processados com sucesso!`);
      
      // Rolar suavemente para a fila no mobile
      if (window.innerWidth < 1024) {
        setTimeout(() => {
          cardsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } else {
      setContacts([]);
      toast.error('Nenhum contato válido encontrado. Revise o formato da lista.');
    }
  };

  const markAsProcessed = (id: string) => {
    setProcessedIds(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800 font-sans">
      <Toaster position="top-center" richColors />

      {/* Header */}
      <header className="bg-moove-blue text-white p-4 shadow-lg sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-moove-yellow rounded-lg flex items-center justify-center text-moove-blue shadow-inner">
              <Zap className="w-6 h-6 fill-current stroke-[3]" />
            </div>
            <h1 className="font-bold text-lg leading-tight md:text-xl">
              Gestão de Reativação<br />
              <span className="text-moove-yellow text-sm font-medium">Regional SG</span>
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 md:p-6 space-y-6 mt-2 mb-12">
        
        {/* Alerta Educativo */}
        <div className="bg-blue-50 border-l-4 border-moove-blue p-4 rounded-r-lg shadow-sm text-sm text-blue-900 flex gap-3 items-start">
          <Info className="w-5 h-5 text-moove-blue shrink-0 mt-0.5" />
          <p><strong>Dica de Produtividade:</strong> Prepare sua mensagem padrão abaixo e cole a lista de clientes. O sistema gerará botões de atalho para enviar mensagens via WhatsApp Web ou App.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Coluna de Configuração */}
          <div className="space-y-6">
            {/* Seção: Mensagem Padrão */}
            <section className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
              <h2 className="font-bold text-moove-blue mb-3 flex items-center gap-2 text-lg">
                <div className="p-2 bg-gray-50 rounded-lg text-moove-blue">
                  <MessageSquare className="w-5 h-5 fill-current" />
                </div>
                Mensagem Padrão
              </h2>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                Use a variável <strong className="text-moove-blue bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">{'{nome}'}</strong> onde quiser que o sistema insira o nome do cliente.
              </p>
              <textarea 
                rows={4} 
                className="w-full border border-gray-200 bg-gray-50 rounded-xl p-4 focus:ring-2 focus:ring-moove-yellow focus:bg-white focus:border-moove-yellow outline-none transition-all resize-none text-gray-700" 
                placeholder="Olá {nome}, tudo bem? Sentimos sua falta! Temos uma condição especial para você hoje na Regional SG..."
                value={templateMsg}
                onChange={(e) => setTemplateMsg(e.target.value)}
              />
            </section>

            {/* Seção: Input da Lista */}
            <section className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
              <h2 className="font-bold text-moove-blue mb-3 flex items-center gap-2 text-lg">
                <div className="p-2 bg-gray-50 rounded-lg text-moove-blue">
                  <Users className="w-5 h-5 fill-current" />
                </div>
                Lista Bruta
              </h2>
              <p className="text-sm text-gray-500 mb-4">Cole seus contatos no formato exato: <strong>Nome;Número</strong> (um contato por linha).</p>
              <textarea 
                rows={6} 
                className="w-full border border-gray-200 bg-gray-50 rounded-xl p-4 focus:ring-2 focus:ring-moove-yellow focus:bg-white focus:border-moove-yellow outline-none transition-all resize-y font-mono text-sm text-gray-700 whitespace-pre" 
                placeholder="Carlos Silva;21988887777&#10;Mariana Santos;(21) 97777-6666&#10;João Roberto; 21 955554444"
                value={rawList}
                onChange={(e) => setRawList(e.target.value)}
              />

              <button 
                onClick={handleGenerate}
                className="mt-5 w-full bg-moove-yellow hover:bg-yellow-400 text-moove-blue font-bold text-lg py-4 px-4 rounded-xl transition-all active:scale-[0.98] flex justify-center items-center gap-2 shadow-sm cursor-pointer"
              >
                <Wand2 className="w-6 h-6 stroke-[2.5]" /> Processar e Gerar Cartões
              </button>
            </section>
          </div>

          {/* Coluna de Output (Cards) */}
          <div className="space-y-6">
            {contacts.length > 0 ? (
              <section ref={cardsSectionRef}>
                <div className="flex justify-between items-center mb-5">
                  <h2 className="font-bold text-moove-blue text-xl flex items-center gap-2">
                    <LayoutGrid className="w-6 h-6 text-moove-yellow fill-current" /> Fila de Atendimento
                  </h2>
                  <span className="bg-moove-blue text-moove-yellow text-sm font-bold px-3 py-1 rounded-full shadow-sm">
                    {contacts.length}
                  </span>
                </div>
                
                {/* Container dos Cards com scroll no mobile/desktop se ficar muito grande */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 max-h-[800px] overflow-y-auto pb-4 pr-1 snap-y">
                  {contacts.map((contact) => {
                    const isProcessed = processedIds.has(contact.id);
                    return (
                      <div 
                        key={contact.id}
                        className={`snap-start bg-white p-5 rounded-2xl shadow-sm border flex flex-col justify-between transition-all duration-300 relative overflow-hidden group ${
                          isProcessed ? 'border-gray-200' : 'border-gray-200 hover:border-moove-yellow hover:shadow-md'
                        }`}
                      >
                        {/* Indicador de "Feito" invisível inicialmente */}
                        <div className={`absolute inset-0 bg-gray-50 transition-opacity pointer-events-none z-0 ${isProcessed ? 'opacity-100' : 'opacity-0'}`}></div>

                        <div className="relative z-10 w-full flex flex-col gap-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className={`font-bold text-lg transition-colors ${isProcessed ? 'text-gray-400' : 'text-gray-900'}`}>
                                {contact.name}
                              </h3>
                              <p className={`text-sm flex items-center gap-1.5 mt-1 font-medium ${isProcessed ? 'text-gray-400' : 'text-gray-500'}`}>
                                <Phone className={`w-4 h-4 fill-current ${isProcessed ? 'text-gray-300' : 'text-moove-yellow'}`} /> {contact.displayPhone}
                              </p>
                            </div>
                            <div className={`w-8 h-8 rounded-full bg-green-100 text-green-500 flex items-center justify-center transition-all ${isProcessed ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
                              <Check className="w-5 h-5 stroke-[3]" />
                            </div>
                          </div>
                          
                          <a 
                            href={contact.waLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={() => markAsProcessed(contact.id)}
                            className={`w-full font-bold py-3.5 px-4 rounded-xl transition-all flex justify-center items-center gap-2 active:scale-[0.98] ${
                              isProcessed 
                                ? 'bg-gray-200 text-gray-500 shadow-none' 
                                : 'bg-wpp-green hover:bg-wpp-hover text-white shadow-sm shadow-green-200'
                            }`}
                          >
                            {isProcessed ? (
                              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                            ) : (
                              <MessageCircle className="w-5 h-5 stroke-[2.5]" />
                            )}
                            <span className="tracking-wide">
                              {isProcessed ? 'MENSAGEM ENVIADA' : 'INICIAR CONVERSA'}
                            </span>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ) : (
              /* Estado Vazio */
              <div className="h-full min-h-[400px] border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-10 text-center text-gray-400">
                <Kanban className="w-16 h-16 mb-3 text-gray-300 stroke-[1.5]" />
                <p className="font-medium text-gray-500">Nenhum cartão gerado</p>
                <p className="text-sm mt-1">Preencha as informações ao lado e clique em processar.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
