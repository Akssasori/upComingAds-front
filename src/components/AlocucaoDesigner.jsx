import React, { useState, useRef } from 'react';
import { Info, Upload, Play, Pause, Check, ChevronLeft, ChevronRight } from 'lucide-react';

const AlocucaoDesigner = () => {
  const [criarAlocucao, setCriarAlocucao] = useState(false);
  const [texto, setTexto] = useState('');
  const [locutorSelecionado, setLocutorSelecionado] = useState('');
  const [musicaSelecionada, setMusicaSelecionada] = useState(null);
  const [videoSelecionado, setVideoSelecionado] = useState(null);
  const [logo, setLogo] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [fileName, setFileName] = useState(''); // Nome do arquivo para exibição
  const [videoAtual, setVideoAtual] = useState(0);

  // Estados adicionados para o request da API e exibição da resposta
  const [loading, setLoading] = useState(false);
  const [locucaoGerada, setLocucaoGerada] = useState('');
  const [erroApi, setErroApi] = useState('');

  // Referência e estado para o controle de áudio
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Dados simulados
  const locutores = [
    { id: 1, nome: 'Ligia', uuid:'6x8ch2QacbiwlJdYqYSb' },
    { id: 2, nome: 'Luciano Hulk', uuid:'6x8ch2QacbiwlJdYqYSb' },
    { id: 3, nome: 'Thiago Silva', uuid:'DSoWrn9GzoeY4u0knKuw' },
    { id: 4, nome: 'Ana Pereira', uuid:'DSoWr' }
  ];
  
  // Música local específica
  const musicaLocal = {
    id: 1,
    nome: 'Trilha Sonora',
    caminho: '/trilhaSonora.mp3'
  };

  const musicas = [
    musicaLocal,
    { id: 2, nome: 'Música Corporativa Moderna' },
    { id: 3, nome: 'Música Inspiradora' }
  ];

  // Vídeo local específica
  const videoLocal = {
    id: 1,
    nome: 'Template',
    thumbnail: '/template.jpg',
    videoPath: '/template.mp4'
  };
  
  const videos = [
    videoLocal,
    { id: 2, nome: 'Video Natureza', thumbnail: '/api/placeholder/240/135', videoPath: '/video-natureza.mp4'},
    { id: 3, nome: 'Video Tecnologia', thumbnail: '/api/placeholder/240/135', videoPath: '/video-tecnologia.mp4'},
    { id: 4, nome: 'Video Abstrato', thumbnail: '/api/placeholder/240/135', videoPath: '/video-abstrato.mp4' },
    { id: 5, nome: 'Video Cidade', thumbnail: '/api/placeholder/240/135', videoPath: '/video-cidade.mp4' }
  ];
  
  const handleLogoUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    
    const fileUrl = URL.createObjectURL(uploadedFile);
    setLogo(fileUrl);
    setFileType(uploadedFile.type);
    setFileName(uploadedFile.name);
  };
  
  // const reproduzirMusica = (musicaId) => {
  //   // Simulação de reprodução de música
  //   console.log(`Reproduzindo música ${musicaId}`);
  // };

    // Função para reproduzir ou pausar a música
    const toggleMusica = (musicaId) => {
      console.log("Toggle música:", musicaId);
      // Se for a música local
      if (musicaId === musicaLocal.id) {
        if (!audioRef.current) {
          try {
            console.log("Iniciando áudio local:", musicaLocal.caminho);
            // Criação do objeto de áudio
            audioRef.current = new Audio(musicaLocal.caminho);
            
            // Adiciona evento para quando a música terminar
            audioRef.current.addEventListener('ended', () => {
              setIsPlaying(false);
            });
            
            // Reproduz o áudio
            audioRef.current.play()
              .then(() => {
                setIsPlaying(true);
                console.log("Reproduzindo música local:", musicaLocal.caminho);
              })
              .catch(error => {
                console.error("Erro ao reproduzir áudio:", error);
                alert("Não foi possível reproduzir o arquivo de áudio local. Verifique se o caminho está correto e se o navegador tem permissão para acessar arquivos locais.");
              });
          } catch (error) {
            console.error("Erro detalhado:", error.message, error.name);
            alert(`Erro ao reproduzir: ${error.message}`);
          }
        } else {
          // Se o áudio já está inicializado, alterna entre reproduzir e pausar
          if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
          } else {
            audioRef.current.play()
              .then(() => {
                setIsPlaying(true);
              })
              .catch(error => {
                console.error("Erro ao reproduzir áudio:", error);
              });
          }
        }
      } else {
        // Para outras músicas (simulação)
        console.log(`Reproduzindo música ${musicaId}`);
      }
    };
    
    // Limpa o áudio quando o componente for desmontado
    React.useEffect(() => {
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    }, []);
  
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
  // const handleRegenarLocucao = () => {
  //   setLocucaoGerada('');
    // Opcionalmente: Manter o texto atual ou limpar
    // setTexto('');
  // };
  
  const enviarParaBackend = async () => {
    // Verifica se todos os campos necessários estão preenchidos
    if (!texto || !locutorSelecionado || !musicaSelecionada || !videoSelecionado || !logo) {
      alert("Por favor, preencha todos os campos antes de enviar.");
      return;
    }
    
    // Define o estado de carregamento
    setLoading(true);
    
    try {
      // Busca o locutor selecionado para obter o UUID
      const locutorObj = locutores.find(loc => loc.id === parseInt(locutorSelecionado));
      if (!locutorObj) {
        throw new Error("Locutor não encontrado");
      }
      
      // Busca o caminho da música
      const musicaObj = musicas.find(mus => mus.id === musicaSelecionada);
      const musicaCaminho = musicaObj?.caminho || ""; // Se não tiver caminho, envia string vazia
      
      // Busca o caminho do vídeo
      const videoObj = videos.find(vid => vid.id === videoSelecionado);
      const videoPath = videoObj?.videoPath || "";
      
      // Prepara o arquivo de logo para upload
      let logoFile = null;
      
      // Verifica se é uma string URL (criada por URL.createObjectURL)
      if (logo && logo.startsWith('blob:')) {
        // Função auxiliar para converter Blob URL para File
        const blobToFile = async (blobUrl, fileName) => {
          const response = await fetch(blobUrl);
          const blob = await response.blob();
          return new File([blob], fileName, { type: blob.type });
        };
        
        try {
          logoFile = await blobToFile(logo, fileName || 'logo');
        } catch (error) {
          console.error("Erro ao converter blob para arquivo:", error);
          throw new Error("Não foi possível processar o arquivo de logo");
        }
      }
      
      // Cria um objeto FormData para enviar os dados, incluindo o arquivo
      const formData = new FormData();
      formData.append('texto', texto);
      formData.append('locutorUuid', locutorObj.uuid);
      formData.append('musicaCaminho', musicaCaminho);
      formData.append('videoPath', videoPath);
      
      if (logoFile) {
        formData.append('logo', logoFile);
      }
      
      // Envia os dados para a API
      const response = await fetch('http://localhost:1993/create-video', {
        method: 'POST',
        body: formData, // Não defina Content-Type ao usar FormData, o navegador fará isso automaticamente
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Erro ao enviar dados: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      // Mostra mensagem de sucesso
      alert("Alocução criada com sucesso! ID do vídeo: " + (result.videoId || "N/A"));
      
      // Opcionalmente: limpar o formulário ou redirecionar
      // clearForm();
      // ou
      // window.location.href = `/video/${result.videoId}`;
      
    } catch (error) {
      console.error("Erro ao enviar para o backend:", error);
      alert(`Erro ao criar vídeo: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderPreview = () => {
    if (!logo) return null;
    
    if (fileType && fileType.startsWith('video/')) {
      return (
        <video 
          src={logo}
          className="h-32 w-full object-contain mb-2" 
          controls
          autoPlay 
          muted
        />
      );
    } else {
      return (
        <img
          src={logo}
          alt="Preview do arquivo"
          className="h-32 w-full object-contain mb-2"
        />
      );
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">upComingAds</h1>
      
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
                    {musica.id === musicaLocal.id && (
                      <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Local</span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMusica(musica.id);
                      }}
                    >
                      {musica.id === musicaLocal.id && isPlaying ? (
                        <Pause size={16} />
                      ) : (
                        <Play size={16} />
                      )}
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
            
            {/* Nota informativa sobre arquivo local */}
            {musicas.some(m => m.id === musicaLocal.id) && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-100 text-sm text-yellow-700 rounded">
                <strong>Nota:</strong> A reprodução de arquivos locais pode requerer configurações especiais do navegador.
                Se o arquivo não reproduzir, verifique se o navegador tem permissão para acessar arquivos locais.
              </div>
            )}
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
                  <video
                    src={`/${videos[videoAtual].nome.toLowerCase().replace(/\s+/g, '-')}.mp4`}
                    poster={videos[videoAtual].thumbnail}
                    className="h-48 w-full object-cover rounded-md"
                    autoPlay
                    muted
                    loop
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
              Importar Logo ou Mídia
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
              {logo ? (
                <div className="flex flex-col items-center">
                  {/* Área de preview */}
                  <div className="w-full mb-2">
                    {renderPreview()}
                  </div>
                  <span className="text-sm text-gray-500">{fileName}</span>
                  <button
                    className="mt-2 text-red-500 text-sm"
                    onClick={() => {
                      URL.revokeObjectURL(logo); // Libera a URL do objeto
                      setLogo(null);
                      setFileType(null);
                      setFileName('');
                    }}
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
                    accept="image/*, video/mp4"
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
              className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!texto || !locutorSelecionado || !musicaSelecionada || !videoSelecionado || !logo || loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </div>
              ) : (
                "Gerar Video para exibição"
              )}
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

// import React, { useState, useRef, useEffect } from 'react';
// import { Info, Upload, Play, Pause, Check, ChevronLeft, ChevronRight } from 'lucide-react';
// import TextAreaInput from './TextAreaInput';
// import LoadingButton from './LoadingButton';
// import ErrorMessage from './ErrorMessage';
// import LocutorSelector from './LocutorSelector';
// import MusicSelector from './MusicSelector';


// const AlocucaoDesigner = () => {
//   const [criarAlocucao, setCriarAlocucao] = useState(false);
//   const [texto, setTexto] = useState('');
//   const [locutorSelecionado, setLocutorSelecionado] = useState('');
//   const [musicaSelecionada, setMusicaSelecionada] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [locucaoGerada, setLocucaoGerada] = useState('');
//   const [erroApi, setErroApi] = useState('');
//   const [isPlaying, setIsPlaying] = useState(false);

//   const locutores = [
//     { id: 1, nome: 'Ligia' },
//     { id: 2, nome: 'Luciano Hulk' },
//     { id: 3, nome: 'Thiago Silva' },
//     { id: 4, nome: 'Ana Pereira' }
//   ];

//   const musicas = [
//     { id: 1, nome: 'Trilha Sonora' },
//     { id: 2, nome: 'Música Corporativa' },
//     { id: 3, nome: 'Música Inspiradora' }
//   ];

//   const toggleMusica = (musicaId) => {
//     setIsPlaying(prev => !prev);
//     console.log(`Tocando música ${musicaId}`);
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
//       <h1 className="text-2xl font-bold mb-6 text-center">upComingAds</h1>
//       <div className="mb-6">
//         <h2 className="text-lg font-semibold">Deseja criar uma alocução?</h2>
//         <label className="ml-4 inline-flex items-center">
//           <input type="radio" checked={criarAlocucao} onChange={() => setCriarAlocucao(true)} className="h-4 w-4" /> Sim
//         </label>
//         <label className="ml-4 inline-flex items-center">
//           <input type="radio" checked={!criarAlocucao} onChange={() => setCriarAlocucao(false)} className="h-4 w-4" /> Não
//         </label>
//       </div>
//       {criarAlocucao && (
//         <>
//           <TextAreaInput texto={texto} setTexto={setTexto} />
//           <LoadingButton isLoading={loading} onClick={() => console.log("Gerando locução...")} text="Gerar Locução" />
//           <ErrorMessage message={erroApi} />
//           <LocutorSelector locutorSelecionado={locutorSelecionado} setLocutorSelecionado={setLocutorSelecionado} locutores={locutores} />
//           <MusicSelector musicas={musicas} musicaSelecionada={musicaSelecionada} setMusicaSelecionada={setMusicaSelecionada} toggleMusica={toggleMusica} isPlaying={isPlaying} />
//         </>
//       )}
//     </div>
//   );
// };

// export default AlocucaoDesigner;