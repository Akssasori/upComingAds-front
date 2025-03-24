const TextAreaInput = ({ texto, setTexto }) => (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2">Texto da Alocução</label>
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md h-32"
        placeholder="Digite o texto que será falado pelo locutor..."
      />
    </div>
  );
  
  export default TextAreaInput;
  