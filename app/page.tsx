'use client';

import { useState } from 'react';
import ResultsDisplay from './components/ResultsDisplay';

interface Resultado {
  nombre: string;
  identificador: string;
}

export default function Home() {
  const [nombre, setNombre] = useState('');
  const [identificador, setIdentificador] = useState('');
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre && !identificador) {
      setError('Debe ingresar al menos un criterio de búsqueda');
      return;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, identificador }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al realizar la búsqueda');
      }

      setResultados(data);
    } catch (err) {
      console.error('Error en la búsqueda:', err);
      setError(err instanceof Error ? err.message : 'Error al realizar la búsqueda');
      setResultados([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Sistema de Búsqueda</h1>
      
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nombre de RN</label>
            <input 
              type="text" 
              className="form-input"
              placeholder="Ingrese el nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">DNI/CUI/Código de Afiliación</label>
            <input 
              type="text" 
              className="form-input"
              placeholder="Ingrese el identificador"
              value={identificador}
              onChange={(e) => setIdentificador(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="button"
            disabled={isLoading}
          >
            {isLoading ? 'Buscando...' : 'Buscar'}
          </button>
        </form>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <ResultsDisplay 
        resultados={resultados}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
