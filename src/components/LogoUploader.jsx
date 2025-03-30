import React from 'react';
import { Upload } from 'lucide-react';

const LogoUploader = ({ 
  logo, 
  fileType, 
  fileName, 
  handleLogoUpload, 
  handleRemoveLogo 
}) => {
  const renderPreview = () => {
    if (!logo) return null;

    if (fileType && fileType.startsWith("video/")) {
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
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2">
        Importar Logo ou Mídia
      </label>
      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
        {logo ? (
          <div className="flex flex-col items-center">
            <div className="w-full mb-2">{renderPreview()}</div>
            <span className="text-sm text-gray-500">{fileName}</span>
            <button
              className="mt-2 text-red-500 text-sm"
              onClick={handleRemoveLogo}
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
  );
};

export default LogoUploader;