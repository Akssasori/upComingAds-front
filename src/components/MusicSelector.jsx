import React, { useState, useRef, useEffect } from 'react';
import { Info, Upload, Play, Pause, Check, ChevronLeft, ChevronRight } from 'lucide-react';

const MusicSelector = ({ musicas, musicaSelecionada, setMusicaSelecionada, toggleMusica, isPlaying }) => (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2">Selecione uma Música de Fundo</label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {musicas.map(musica => (
          <div key={musica.id} className={`p-4 border rounded-md cursor-pointer flex items-center justify-between ${musicaSelecionada === musica.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`} onClick={() => setMusicaSelecionada(musica.id)}>
            <span>{musica.nome}</span>
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200" onClick={(e) => { e.stopPropagation(); toggleMusica(musica.id); }}>
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
  
  export default MusicSelector;