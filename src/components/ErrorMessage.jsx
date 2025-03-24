import React, { useState, useRef, useEffect } from 'react';
import { Info, Upload, Play, Pause, Check, ChevronLeft, ChevronRight } from 'lucide-react';

const ErrorMessage = ({ message }) => (
    message ? <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">{message}</div> : null
  );
  
  export default ErrorMessage;