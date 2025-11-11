// /services/api.ts

// A URL base da TheMealDB
const API_URL = 'https://www.themealdb.com/api/json/v1/1';

/**
 * Busca receitas na API usando um termo de descrição.
 * @param {string} termo - O termo a ser buscado (ex: "Feijoada", "Chicken").
 * @returns {Promise<any[]>} - Uma promessa que resolve para um array de receitas.
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
 * Busca UMA receita aleatória
 * @returns {Promise<any | null>} - Uma promessa que resolve para um objeto de receita ou null.
 */
export const buscarReceitaAleatoria = async (): Promise<any | null> => {
  const url = `${API_URL}/random.php`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Retorna APENAS o primeiro objeto da receita, ou null
    return data.meals && data.meals.length > 0 ? data.meals[0] : null;

  } catch (error) {
    console.error("Falha ao buscar receita aleatória:", error);
    return null;
  }
};