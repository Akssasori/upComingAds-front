import React, { useState, useRef, useEffect } from "react";
import { Info, Upload, Play, Pause, Check, ChevronLeft,ChevronRight } from "lucide-react";

// Componentes importados
import ErrorMessage from "./ErrorMessage";
import LoadingButton from "./LoadingButton";
import LocutorSelector from "./LocutorSelector";
import MusicSelector from "./MusicSelector";
import TextAreaInput from "./TextAreaInput";
import VideoCarousel from "./VideoCarousel";
import LogoUploader from "./LogoUploader";

const AlocucaoDesigner = () => {
  // Estados principais
  const [criarAlocucao, setCriarAlocucao] = useState(false);
  const [texto, setTexto] = useState("");
  const [locutorSelecionado, setLocutorSelecionado] = useState("");
  const [musicaSelecionada, setMusicaSelecionada] = useState(null);
  const [videoSelecionado, setVideoSelecionado] = useState(null);
  const [logo, setLogo] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [fileName, setFileName] = useState("");
  const [videoAtual, setVideoAtual] = useState(0);

  // Estados para API e feedback
  const [loading, setLoading] = useState(false);
  const [locucaoGerada, setLocucaoGerada] = useState("");
  const [erroApi, setErroApi] = useState("");

  // Referência para áudio
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Dados simulados
  const locutores = [
    { id: 1, nome: "Ligia", uuid: "6x8ch2QacbiwlJdYqYSb" },
    { id: 2, nome: "Luciano Hulk", uuid: "6x8ch2QacbiwlJdYqYSb" },
    { id: 3, nome: "Thiago Silva", uuid: "DSoWrn9GzoeY4u0knKuw" },
    { id: 4, nome: "Ana Pereira", uuid: "DSoWr" },
  ];

  const musicaLocal = {
    id: 1,
    nome: "Trilha Sonora",
    caminho: "/trilhaSonora.mp3",
  };

  const musicas = [
    musicaLocal,
    { id: 2, nome: "Música Corporativa Moderna" },
    { id: 3, nome: "Música Inspiradora" },
  ];

  const videos = [
    {
      id: 1,
      nome: "Template",
      thumbnail: "/template.jpg",
      videoPath: "/template.mp4",
    },
    {
      id: 2,
      nome: "Video Natureza",
      thumbnail: "/api/placeholder/240/135",
      videoPath: "/video-natureza.mp4",
    },
    {
      id: 3,
      nome: "Video Tecnologia",
      thumbnail: "/api/placeholder/240/135",
      videoPath: "/video-tecnologia.mp4",
    },
    {
      id: 4,
      nome: "Video Abstrato",
      thumbnail: "/api/placeholder/240/135",
      videoPath: "/video-abstrato.mp4",
    },
    {
      id: 5,
      nome: "Video Cidade",
      thumbnail: "/api/placeholder/240/135",
      videoPath: "/video-cidade.mp4",
    },
  ];

  // Funções de manipulação de áudio
  const toggleMusica = (musicaId) => {
    if (musicaId === musicaLocal.id) {
      if (!audioRef.current) {
        try {
          audioRef.current = new Audio(musicaLocal.caminho);
          audioRef.current.addEventListener("ended", () => {
            setIsPlaying(false);
          });

          audioRef.current.play()
            .then(() => {
              setIsPlaying(true);
            })
            .catch((error) => {
              console.error("Erro ao reproduzir áudio:", error);
              alert("Não foi possível reproduzir o arquivo de áudio local.");
            });
        } catch (error) {
          console.error("Erro detalhado:", error.message, error.name);
          alert(`Erro ao reproduzir: ${error.message}`);
        }
      } else {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          audioRef.current.play()
            .then(() => {
              setIsPlaying(true);
            })
            .catch((error) => {
              console.error("Erro ao reproduzir áudio:", error);
            });
        }
      }
    } else {
      console.log(`Reproduzindo música ${musicaId}`);
    }
  };

  // Limpar áudio ao desmontar
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Funções de navegação do carrossel
  const avancarVideo = () => {
    setVideoAtual((prev) => (prev === videos.length - 1 ? 0 : prev + 1));
  };

  const voltarVideo = () => {
    setVideoAtual((prev) => (prev === 0 ? videos.length - 1 : prev - 1));
  };

  // Função para upload de logo
  const handleLogoUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    const fileUrl = URL.createObjectURL(uploadedFile);
    setLogo(fileUrl);
    setFileType(uploadedFile.type);
    setFileName(uploadedFile.name);
  };

  // Função para gerar locução
  const handleGerarLocucao = async () => {
    if (!texto.trim()) {
      setErroApi("Por favor, digite um texto para gerar a locução.");
      return;
    }

    setLoading(true);
    setErroApi("");

    try {
      const response = await fetch("http://localhost:8970/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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

  // Função para enviar dados ao backend
  const enviarParaBackend = async () => {
    if (!texto || !locutorSelecionado || !musicaSelecionada || !videoSelecionado || !logo) {
      alert("Por favor, preencha todos os campos antes de enviar.");
      return;
    }

    setLoading(true);

    try {
      const locutorObj = locutores.find(
        (loc) => loc.id === parseInt(locutorSelecionado)
      );
      if (!locutorObj) {
        throw new Error("Locutor não encontrado");
      }

      const musicaObj = musicas.find((mus) => mus.id === musicaSelecionada);
      const musicaCaminho = musicaObj?.caminho || "";

      const videoObj = videos.find((vid) => vid.id === videoSelecionado);
      const videoPath = videoObj?.videoPath || "";

      let logoData = logo;

      if (logo && logo.startsWith("blob:")) {
        try {
          const response = await fetch(logo);
          const blob = await response.blob();

          const reader = new FileReader();
          logoData = await new Promise((resolve) => {
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
        } catch (error) {
          console.error("Erro ao processar logo:", error);
          throw new Error("Não foi possível processar o arquivo de logo");
        }
      }

      const jsonData = {
        texto: texto,
        locutorUuid: locutorObj.uuid,
        musicaCaminho: musicaCaminho,
        videoPath: videoPath,
        logo: logoData,
        fileName: fileName,
      };

      const response = await fetch("http://localhost:8970/video/create-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message ||
            `Erro ao enviar dados: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();

      alert(
        "Alocução criada com sucesso! ID do vídeo: " + (result.videoId || "N/A")
      );
    } catch (error) {
      console.error("Erro ao enviar para o backend:", error);
      alert(`Erro ao criar vídeo: ${error.message}`);
    } finally {
      setLoading(false);
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

      {criarAlocucao ? (
        <>
          {/* Área de texto */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Me fale sobre seu produto, serviço e me diga o contexto da campanha publicitária e irei criar sua locução!
            </label>
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md h-32"
              placeholder="Digite o texto que será falado pelo locutor..."
            />
          </div>

          {/* Botões para gerar locução */}
          <div className="flex space-x-4 mb-6">
            <LoadingButton 
              isLoading={loading} 
              onClick={handleGerarLocucao} 
              text={locucaoGerada ? "Gerar Novamente" : "Gerar Locução"} 
            />
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
          <ErrorMessage message={erroApi} />

          {/* Seleção de locutor */}
          <LocutorSelector 
            locutorSelecionado={locutorSelecionado}
            setLocutorSelecionado={setLocutorSelecionado}
            locutores={locutores}
          />

          {/* Seleção de música */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Selecione uma Música de Fundo
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {musicas.map((musica) => (
                <div
                  key={musica.id}
                  className={`p-4 border rounded-md cursor-pointer flex items-center justify-between ${
                    musicaSelecionada === musica.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  }`}
                  onClick={() => setMusicaSelecionada(musica.id)}
                >
                  <div className="flex items-center">
                    <span>{musica.nome}</span>
                    {musica.id === musicaLocal.id && (
                      <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        Local
                      </span>
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
            {musicas.some((m) => m.id === musicaLocal.id) && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-100 text-sm text-yellow-700 rounded">
                <strong>Nota:</strong> A reprodução de arquivos locais pode
                requerer configurações especiais do navegador.
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
                    src={videos[videoAtual].videoPath}
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
                    {fileType && fileType.startsWith("video/") ? (
                      <video
                        src={logo}
                        className="h-32 w-full object-contain mb-2"
                        controls
                        autoPlay
                        muted
                      />
                    ) : (
                      <img
                        src={logo}
                        alt="Preview do arquivo"
                        className="h-32 w-full object-contain mb-2"
                      />
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{fileName}</span>
                  <button
                    className="mt-2 text-red-500 text-sm"
                    onClick={() => {
                      URL.revokeObjectURL(logo);
                      setLogo(null);
                      setFileType(null);
                      setFileName("");
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
              disabled={
                !texto ||
                !locutorSelecionado ||
                !musicaSelecionada ||
                !videoSelecionado ||
                !logo ||
                loading
              }
            >
              {loading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Enviando...
                </div>
              ) : (
                "Gerar Video para exibição"
              )}
            </button>
          </div>
        </>
      ) : (
        <div className="text-center p-10 bg-gray-50 rounded-md">
          <Info className="mx-auto h-12 w-12 text-gray-400 mb-2" />
          <p>Selecione "Sim" para começar a criar uma alocução.</p>
        </div>
      )}
    </div>
  );
};

export default AlocucaoDesigner;