import React, { useState } from 'react';
import { Info, Upload, Play, Check, ChevronLeft, ChevronRight } from 'lucide-react';

const AlocucaoDesigner = () => {
  const [criarAlocucao, setCriarAlocucao] = useState(false);
  const [texto, setTexto] = useState('');
  const [locutorSelecionado, setLocutorSelecionado] = useState('');
  const [musicaSelecionada, setMusicaSelecionada] = useState(null);
  const [videoSelecionado, setVideoSelecionado] = useState(null);
  const [logo, setLogo] = useState(null);
  const [videoAtual, setVideoAtual] = useState(0);

  // Estados adicionados para o request da API e exibição da resposta
  const [loading, setLoading] = useState(false);
  const [locucaoGerada, setLocucaoGerada] = useState('');
  const [erroApi, setErroApi] = useState('');
  
  // Dados simulados
  const locutores = [
    { id: 1, nome: 'João Silva' },
    { id: 2, nome: 'Maria Oliveira' },
    { id: 3, nome: 'Pedro Santos' },
    { id: 4, nome: 'Ana Pereira' }
  ];
  
  const musicas = [
    { id: 1, nome: 'Música Clássica Suave' },
    { id: 2, nome: 'Música Corporativa Moderna' },
    { id: 3, nome: 'Música Inspiradora' }
  ];
  
  const videos = [
    { id: 1, nome: 'Video Corporativo 1', thumbnail: '/api/placeholder/240/135' },
    { id: 2, nome: 'Video Natureza', thumbnail: '/api/placeholder/240/135' },
    { id: 3, nome: 'Video Tecnologia', thumbnail: '/api/placeholder/240/135' },
    { id: 4, nome: 'Video Abstrato', thumbnail: '/api/placeholder/240/135' },
    { id: 5, nome: 'Video Cidade', thumbnail: '/api/placeholder/240/135' }
  ];
  
  const handleLogoUpload = (e) => {
    // Simula o upload de logo
    setLogo('logo-simulado.png');
  };
  
  const reproduzirMusica = (musicaId) => {
    // Simulação de reprodução de música
    console.log(`Reproduzindo música ${musicaId}`);
  };
  
  const avancarVideo = () => {
    setVideoAtual((prev) => (prev === videos.length - 1 ? 0 : prev + 1));
  };
  
  const voltarVideo = () => {
    setVideoAtual((prev) => (prev === 0 ? videos.length - 1 : prev - 1));
  };

  // Função para enviar o texto para a API e obter a locução gerada
  const handleGerarLocucao = async () => {
    if (!texto.trim()) {
      setErroApi('Por favor, digite um texto para gerar a locução.');
      return;
    }
    
    setLoading(true);
    setErroApi('');
    
    try {
      const response = await fetch('http://localhost:8970/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ texto }),
      });
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.statusText}`);
      }
      
      const data = await response.json();
      setLocucaoGerada(data.resposta || data.message || JSON.stringify(data));
    } catch (error) {
      console.error("Erro ao gerar locução:", error);
      setErroApi(`Falha ao conectar com a API: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Função para limpar a locução gerada e permitir gerar uma nova
  const handleRegenarLocucao = () => {
    setLocucaoGerada('');
    // Opcionalmente: Manter o texto atual ou limpar
    // setTexto('');
  };
  
  const enviarParaBackend = () => {
    const dados = {
      texto,
      locutor: locutorSelecionado,
      musica: musicaSelecionada,
      video: videoSelecionado,
      logo
    };
    
    console.log("Enviando para o backend:", dados);
    alert("Alocução criada com sucesso!");
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Designer de Alocução</h1>
      
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <h2 className="text-lg font-semibold">Deseja criar uma alocução?</h2>
          <div className="ml-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                checked={criarAlocucao}
                onChange={() => setCriarAlocucao(true)}
                className="h-4 w-4"
              />
              <span className="ml-2">Sim</span>
            </label>
            <label className="inline-flex items-center ml-4">
              <input
                type="radio"
                checked={!criarAlocucao}
                onChange={() => setCriarAlocucao(false)}
                className="h-4 w-4"
              />
              <span className="ml-2">Não</span>
            </label>
          </div>
        </div>
      </div>
      
      {criarAlocucao && (
        <>
          {/* Área de texto */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Texto da Alocução
            </label>
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md h-32"
              placeholder="Digite o texto que será falado pelo locutor..."
            />
          </div>

          {/* Botões para gerar/regenerar locução */}
          <div className="flex space-x-4 mb-6">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
              onClick={handleGerarLocucao}
              disabled={loading || !texto.trim()}
            >
              {loading ? "Gerando..." : locucaoGerada ? "Gerar Novamente" : "Gerar Locução"}
            </button>
            
            {/* {locucaoGerada && (
              <button
                className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
                onClick={handleRegenarLocucao}
              >
                Regerar Locução
              </button>
            )} */}
          </div>

          {/* Área para exibir a locução gerada */}
          {locucaoGerada && (
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
              <h3 className="font-medium mb-2">Locução Gerada:</h3>
              <div className="p-3 bg-white border border-gray-300 rounded-md">
                {locucaoGerada}
              </div>
            </div>
          )}
          
          {/* Mensagem de erro da API */}
          {erroApi && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
              {erroApi}
            </div>
          )}
          
          {/* Seleção de locutor */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Selecione o Locutor
            </label>
            <select
              value={locutorSelecionado}
              onChange={(e) => setLocutorSelecionado(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
            >
              <option value="">Selecione um locutor</option>
              {locutores.map(locutor => (
                <option key={locutor.id} value={locutor.id}>
                  {locutor.nome}
                </option>
              ))}
            </select>
          </div>
          
          {/* Seleção de música */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Selecione uma Música de Fundo
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {musicas.map(musica => (
                <div
                  key={musica.id}
                  className={`p-4 border rounded-md cursor-pointer flex items-center justify-between ${
                    musicaSelecionada === musica.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                  onClick={() => setMusicaSelecionada(musica.id)}
                >
                  <div className="flex items-center">
                    <span>{musica.nome}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        reproduzirMusica(musica.id);
                      }}
                    >
                      <Play size={16} />
                    </button>
                    {musicaSelecionada === musica.id && (
                      <div className="text-blue-500">
                        <Check size={20} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Carrossel de vídeos */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Selecione um Vídeo de Fundo
            </label>
            <div className="relative">
              <div className="flex justify-center items-center mb-2">
                <button
                  onClick={voltarVideo}
                  className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 mr-2"
                >
                  <ChevronLeft size={20} />
                </button>
                
                <div className="relative">
                  <img
                    src={videos[videoAtual].thumbnail}
                    alt={videos[videoAtual].nome}
                    className="h-48 w-full object-cover rounded-md"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-center">
                    {videos[videoAtual].nome}
                  </div>
                  {videoSelecionado === videos[videoAtual].id && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                      <Check size={16} />
                    </div>
                  )}
                </div>
                
                <button
                  onClick={avancarVideo}
                  className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 ml-2"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              
              <div className="flex justify-center">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  onClick={() => setVideoSelecionado(videos[videoAtual].id)}
                >
                  Selecionar Este Vídeo
                </button>
              </div>
            </div>
          </div>
          
          {/* Upload de logo */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Importar Logo
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
              {logo ? (
                <div className="flex flex-col items-center">
                  <img
                    src="/api/placeholder/100/100"
                    alt="Logo Preview"
                    className="h-16 w-16 object-contain mb-2"
                  />
                  <span className="text-sm text-gray-500">{logo}</span>
                  <button
                    className="mt-2 text-red-500 text-sm"
                    onClick={() => setLogo(null)}
                  >
                    Remover
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-2">
                    Clique para selecionar ou arraste um arquivo aqui
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
                  >
                    Selecionar Arquivo
                  </label>
                </div>
              )}
            </div>
          </div>
          
          {/* Botão de envio */}
          <div className="flex justify-center">
            <button
              onClick={enviarParaBackend}
              className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 font-medium"
              disabled={!texto || !locutorSelecionado || !musicaSelecionada || !videoSelecionado || !logo}
            >
              Gerar Video para exibição
            </button>
          </div>
        </>
      )}
      
      {!criarAlocucao && (
        <div className="text-center p-10 bg-gray-50 rounded-md">
          <Info className="mx-auto h-12 w-12 text-gray-400 mb-2" />
          <p>Selecione "Sim" para começar a criar uma alocução.</p>
        </div>
      )}
    </div>
  );
};

export default AlocucaoDesigner;