import React, { useState, useRef, useEffect } from 'react';
import { Info, Upload, Play, Pause, Check, ChevronLeft, ChevronRight } from 'lucide-react';

const LocutorSelector = ({ locutorSelecionado, setLocutorSelecionado, locutores }) => (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2">Selecione o Locutor</label>
      <select
        value={locutorSelecionado}
        onChange={(e) => setLocutorSelecionado(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md"
      >
        <option value="">Selecione um locutor</option>
        {locutores.map(locutor => (
          <option key={locutor.id} value={locutor.id}>{locutor.nome}</option>
        ))}
      </select>
    </div>
  );
  
  export default LocutorSelector;