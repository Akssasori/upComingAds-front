import React from 'react';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';

const VideoCarousel = ({ 
  videos, 
  videoAtual, 
  videoSelecionado, 
  setVideoSelecionado, 
  voltarVideo, 
  avancarVideo 
}) => {
  return (
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
  );
};

export default VideoCarousel;