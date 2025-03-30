import React from 'react';
import { Play, Pause, Check } from 'lucide-react';

const MusicSelector = ({ 
  musicas, 
  musicaSelecionada, 
  setMusicaSelecionada, 
  toggleMusica, 
  isPlaying,
  musicaLocal 
}) => (
  <div className="mb-6">
    <label className="block text-sm font-medium mb-2">Selecione uma Música de Fundo</label>
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
  </div>
);

export default MusicSelector;