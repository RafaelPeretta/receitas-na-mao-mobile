// /database/db.ts
import * as SQLite from 'expo-sqlite';

// Define uma interface para o objeto Receita
export interface Receita {
  id: string;
  nome: string;
  imagemUrl: string;
  categoria: string;
  instrucoes: string;
  urlOriginal: string;
}

// Variável para armazenar a instância do banco de dados
let db: SQLite.SQLiteDatabase | null = null;

/**
 * Inicializa o banco de dados e cria a tabela 'receitas'.
 * Usa a nova API openDatabaseAsync.
 */
export const initDb = async (): Promise<void> => {
  try {
    // 1. Usa o novo 'openDatabaseAsync'
    db = await SQLite.openDatabaseAsync('receitas.db');
    console.log('Banco de dados aberto com sucesso (Mobile).');

    // 2. Executa o SQL de criação da tabela (não precisa de 'transaction' para isso)
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS receitas (
        id TEXT PRIMARY KEY NOT NULL,
        nome TEXT NOT NULL,
        imagemUrl TEXT,
        categoria TEXT,
        instrucoes TEXT,
        urlOriginal TEXT
      );
    `);
    
    console.log('Tabela "receitas" verificada/criada com sucesso (Mobile).');
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
  }
};

/**
 * (CREATE) Adiciona uma nova receita ao banco de dados.
 */
export const salvarReceita = async (receitaAPI: any): Promise<void> => {
  if (!db) throw new Error("Banco de dados não inicializado.");

  try {
    // A nova API usa 'runAsync' para INSERT/UPDATE/DELETE
    const result = await db.runAsync(
      `INSERT INTO receitas (id, nome, imagemUrl, categoria, instrucoes, urlOriginal)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         nome=excluded.nome,
         imagemUrl=excluded.imagemUrl,
         categoria=excluded.categoria,
         instrucoes=excluded.instrucoes,
         urlOriginal=excluded.urlOriginal;`,
      [ // Os parâmetros
        receitaAPI.idMeal,
        receitaAPI.strMeal,
        receitaAPI.strMealThumb,
        receitaAPI.strCategory,
        receitaAPI.strInstructions,
        receitaAPI.strSource
      ]
    );

    console.log(`Receita "${receitaAPI.strMeal}" salva com sucesso! ID: ${result.lastInsertRowId}, Alterações: ${result.changes}`);
  } catch (error) {
    console.error('Erro ao salvar receita (Mobile):', error);
  }
};

/**
 * (READ) Busca todas as receitas salvas no banco de dados.
 */
export const getReceitasSalvas = async (): Promise<Receita[]> => {
  if (!db) throw new Error("Banco de dados não inicializado.");

  try {
    // A nova API usa 'getAllAsync' para SELECT que retorna múltiplos resultados
    const receitas = await db.getAllAsync<Receita>("SELECT * FROM receitas;");
    
    console.log("Receitas lidas do banco (Mobile):", receitas);
    return receitas;
  } catch (error) {
    console.error('Erro ao ler receitas (Mobile):', error);
    return [];
  }
};

/**
 * (DELETE) Deleta uma receita do banco de dados pelo ID.
 */
export const deletarReceita = async (id: string): Promise<void> => {
  if (!db) throw new Error("Banco de dados não inicializado.");

  try {
    // Usa 'runAsync' para DELETE
    await db.runAsync("DELETE FROM receitas WHERE id = ?;", [id]);
    console.log(`Receita com ID "${id}" deletada com sucesso (Mobile)!`);
  } catch (error) {
    console.error('Erro ao deletar receita (Mobile):', error);
  }
};