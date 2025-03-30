import React from 'react';

const TextAreaInput = ({ texto, setTexto }) => (
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
);

export default TextAreaInput;