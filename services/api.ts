// /services/api.ts

// A URL base da TheMealDB
const API_URL = 'https://www.themealdb.com/api/json/v1/1';

/**
 * Busca receitas na API usando um termo de descrição.
 * @param {string} termo - O termo a ser buscado (ex: "Feijoada", "Chicken").
 * @returns {Promise<Array<any>>} - Uma promessa que resolve para um array de receitas.
 */
export const buscarReceitasPorDescricao = async (termo: string): Promise<any[]> => {
  if (!termo || termo.trim() === '') {
    return [];
  }

  // O endpoint de busca
  const url = `${API_URL}/search.php?s=${encodeURIComponent(termo)}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.statusText}`);
    }

    const data = await response.json();

    // A API retorna os dados em uma chave chamada "meals"
    return data.meals || []; 

  } catch (error) {
    console.error("Falha ao buscar receitas:", error);
    return [];
  }
};

/**
 * Busca uma receita aleatória
 */
export const buscarReceitaAleatoria = async (): Promise<any[]> => {
  const url = `${API_URL}/random.php`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.statusText}`);
    }

    const data = await response.json();
    return data.meals || [];

  } catch (error) {
    console.error("Falha ao buscar receita aleatória:", error);
    return [];
  }
};