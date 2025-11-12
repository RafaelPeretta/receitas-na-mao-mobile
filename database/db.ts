// /database/db.ts
import * as SQLite from 'expo-sqlite';

// --- INTERFACES ---
export interface Receita {
  id: string;
  nome: string;
  imagemUrl: string;
  categoria: string;
  instrucoes: string;
  urlOriginal: string;
}

export interface SlotPlanejamento {
  slotId: string; // ex: "Segunda-almoco"
  receitaId: string;
}

let db: SQLite.SQLiteDatabase | null = null;

/**
 * Inicializa o banco de dados e cria as tabelas.
 */
export const initDb = async (): Promise<void> => {
  try {
    db = await SQLite.openDatabaseAsync('receitas.db');
    console.log('Banco de dados aberto com sucesso (Mobile).');

    // Tabela de Receitas
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS receitas (
        id TEXT PRIMARY KEY NOT NULL, nome TEXT NOT NULL, imagemUrl TEXT, 
        categoria TEXT, instrucoes TEXT, urlOriginal TEXT
      );
    `);
    console.log('Tabela "receitas" verificada/criada.');

    // Tabela "PLANEJAMENTO"
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS planejamento (
        slotId TEXT PRIMARY KEY NOT NULL, -- "Segunda-almoco"
        receitaId TEXT NOT NULL,
        FOREIGN KEY (receitaId) REFERENCES receitas(id) ON DELETE CASCADE
      );
    `);
    console.log('Tabela "planejamento" verificada/criada.');
    
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
  }
};

// --- FUNÇÕES CRUD DE RECEITAS ---

/**
 * (CREATE) Adiciona uma nova receita ao banco de dados.
 */
export const salvarReceita = async (receitaAPI: any): Promise<void> => {
  if (!db) throw new Error("Banco de dados não inicializado.");
  try {
    await db.runAsync(
      `INSERT INTO receitas (id, nome, imagemUrl, categoria, instrucoes, urlOriginal)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         nome=excluded.nome, imagemUrl=excluded.imagemUrl, categoria=excluded.categoria,
         instrucoes=excluded.instrucoes, urlOriginal=excluded.urlOriginal;`,
      [ 
        receitaAPI.idMeal, receitaAPI.strMeal, receitaAPI.strMealThumb,
        receitaAPI.strCategory, receitaAPI.strInstructions, receitaAPI.strSource
      ]
    );
    console.log(`Receita "${receitaAPI.strMeal}" salva com sucesso!`);
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
    const receitas = await db.getAllAsync<Receita>("SELECT * FROM receitas;");
    console.log("Receitas lidas do banco (Mobile):", receitas);
    return receitas;
  } catch (error) {
    console.error('Erro ao ler receitas (Mobile):', error);
    return [];
  }
};

/**
 * (READ) Busca UMA receita salva pelo ID.
 */
export const getReceitaPorId = async (id: string): Promise<Receita | null> => {
  if (!db) throw new Error("Banco de dados não inicializado.");
  try {
    const receita = await db.getFirstAsync<Receita>("SELECT * FROM receitas WHERE id = ?", [id]);
    console.log(`Receita com ID "${id}" lida do banco:`, receita);
    return receita || null;
  } catch (error) {
    console.error('Erro ao ler receita por ID (Mobile):', error);
    return null;
  }
};

/**
 * (UPDATE) Atualiza uma receita no banco de dados.
 */
export const updateReceita = async (id: string, nome: string, instrucoes: string): Promise<void> => {
  if (!db) throw new Error("Banco de dados não inicializado.");
  try {
    await db.runAsync(
      "UPDATE receitas SET nome = ?, instrucoes = ? WHERE id = ?", 
      [nome, instrucoes, id]
    );
    console.log(`Receita com ID "${id}" atualizada com sucesso (Mobile)!`);
  } catch (error) {
    console.error('Erro ao atualizar receita (Mobile):', error);
  }
};

/**
 * (DELETE) Deleta uma receita do banco de dados pelo ID.
 */
export const deletarReceita = async (id: string): Promise<void> => {
  if (!db) throw new Error("Banco de dados não inicializado.");
  try {
    await db.runAsync("DELETE FROM receitas WHERE id = ?;", [id]);
    console.log(`Receita com ID "${id}" deletada com sucesso (Mobile)!`);
  } catch (error) {
    console.error('Erro ao deletar receita (Mobile):', error);
  }
};

// --- FUNÇÕES CRUD DO PLANEJADOR ---

/**
 * (READ) Busca o planejamento semanal completo.
 */
export const getPlanejamento = async (): Promise<Map<string, string>> => {
  if (!db) throw new Error("Banco de dados não inicializado.");
  try {
    const planoDB = await db.getAllAsync<SlotPlanejamento>("SELECT * FROM planejamento;");
    const planoMap = new Map<string, string>();
    planoDB.forEach(slot => {
      planoMap.set(slot.slotId, slot.receitaId);
    });
    console.log("Planejamento lido do banco:", planoMap);
    return planoMap;
  } catch (error) {
    console.error('Erro ao ler planejamento:', error);
    return new Map();
  }
};

/**
 * (CREATE/UPDATE) Salva ou atualiza um slot no planejamento.
 */
export const setPlanejamento = async (slotId: string, receitaId: string): Promise<void> => {
  if (!db) throw new Error("Banco de dados não inicializado.");
  try {
    await db.runAsync(
      `INSERT INTO planejamento (slotId, receitaId) VALUES (?, ?)
       ON CONFLICT(slotId) DO UPDATE SET receitaId=excluded.receitaId;`,
      [slotId, receitaId]
    );
    console.log(`Slot ${slotId} salvo com a receita ${receitaId}`);
  } catch (error) {
    console.error('Erro ao salvar planejamento:', error);
  }
};

/**
 * (DELETE) Remove um slot do planejamento.
 */
export const removerDoPlanejamento = async (slotId: string): Promise<void> => {
  if (!db) throw new Error("Banco de dados não inicializado.");
  try {
    await db.runAsync("DELETE FROM planejamento WHERE slotId = ?;", [slotId]);
    console.log(`Slot ${slotId} removido do planejamento.`);
  } catch (error) {
    console.error('Erro ao remover do planejamento:', error);
  }
};