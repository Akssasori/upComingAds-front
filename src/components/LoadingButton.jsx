import React, { useState, useRef, useEffect } from 'react';
import { Info, Upload, Play, Pause, Check, ChevronLeft, ChevronRight } from 'lucide-react';

// Componente para botão com estado de carregamento
const LoadingButton = ({ isLoading, onClick, text }) => (
    <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300" onClick={onClick} disabled={isLoading}>
      {isLoading ? "Carregando..." : text}
    </button>
  );
  
  export default LoadingButton;