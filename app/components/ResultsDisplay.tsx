interface Resultado {
  [key: string]: string | number;
}

interface ResultsDisplayProps {
  resultados: Resultado[];
  isLoading: boolean;
  error?: string;
}

export default function ResultsDisplay({ resultados, isLoading, error }: ResultsDisplayProps) {
  if (isLoading) {
    return (
      <div className="results-loading">
        <p>Buscando resultados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-error">
        <p>{error}</p>
      </div>
    );
  }

  if (resultados.length === 0) {
    return (
      <div className="results-empty">
        <p>No se encontraron resultados</p>
      </div>
    );
  }

  return (
    <div className="results-container">
      <h2>Resultados encontrados ({resultados.length})</h2>
      <div className="results-list">
        {resultados.map((resultado, index) => (
          <div key={index} className="result-item">
            {Object.entries(resultado).map(([campo, valor]) => (
              <p key={campo} className="result-field">
                <strong>{campo}:</strong> {valor}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
} 