import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, identificador } = body;

    if (!nombre && !identificador) {
      return NextResponse.json(
        { error: 'Debe proporcionar al menos un criterio de búsqueda' },
        { status: 400 }
      );
    }

    // ID de tu hoja de Google Sheets
    const spreadsheetId = '15yImWHSJkVCp39TiAD_zeaULzRRgRWpmhc02Iwtkuus';
    const sheetId = 0;

    // Construir la URL de la API pública
    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&gid=${sheetId}`;

    const response = await fetch(url);
    const text = await response.text();
    
    if (!response.ok) {
      throw new Error('Error al acceder a la hoja de cálculo');
    }

    // Limpiar el texto de la respuesta
    const json = JSON.parse(text.substring(47).slice(0, -2));

    // Obtener los primeros 15 encabezados de las columnas
    const headers = json.table.cols
      .slice(0, 15)
      .map((col: any) => col.label || '');

    // Extraer las filas con solo las primeras 15 columnas
    const rows = json.table.rows.map((row: any) => {
      const rowData: any = {};
      // Mapear solo las primeras 15 columnas
      row.c.slice(0, 15).forEach((cell: any, index: number) => {
        rowData[headers[index] || `columna${index + 1}`] = cell?.v || '';
      });
      return rowData;
    });

    // Filtrar resultados usando las columnas D y E
    const resultados = rows.filter((row: any) => {
      const rowNombre = String(row[headers[3]] || '').toLowerCase(); // Columna D
      const rowId = String(row[headers[4]] || '').toLowerCase();     // Columna E
      const searchNombre = nombre?.toLowerCase() || '';
      const searchId = identificador?.toLowerCase() || '';

      return (
        (searchNombre && rowNombre.includes(searchNombre)) ||
        (searchId && rowId.includes(searchId))
      );
    });

    console.log('Resultados encontrados:', resultados.length);
    return NextResponse.json(resultados);
  } catch (error) {
    console.error('Error en la búsqueda:', error);
    return NextResponse.json(
      { error: 'Error al realizar la búsqueda. Asegúrate de que la hoja esté compartida públicamente.' },
      { status: 500 }
    );
  }
} 