# Projeto: Receitas na Mão (Plataforma Mobile)

Este é o componente Mobile do projeto de conclusão da disciplina de "Desenvolvimento Web e Mobile", construído com **React Native e Expo**.

## 🚀 Sobre o Projeto

"Receitas na Mão" é um assistente de culinária nativo para iOS e Android. Ele permite ao usuário descobrir receitas (com uma funcionalidade de "Receita do Dia" na Home), buscar pratos específicos, e gerenciar seu livro de receitas pessoal diretamente no dispositivo.

---

## ✨ Funcionalidades Implementadas

O projeto cumpre todos os requisitos técnicos obrigatórios da disciplina:

* **Consumo de API Externa:** A aba "Buscar Receitas" consome a API `TheMealDB`. A tela "Início" também consome a API para buscar uma "Receita do Dia" aleatória.
* **Banco de Dados Local (CRUD Completo):** O aplicativo utiliza **SQLite** (via `expo-sqlite`) para persistência de dados nativa no dispositivo.
    * **Create:** Salvar receitas da API no livro local.
    * **Read:** Exibir as receitas salvas na aba "Meu Livro".
    * **Update:** Editar o nome e as instruções de uma receita salva (em uma tela modal de edição).
    * **Delete:** Remover receitas do livro com confirmação.
* **Navegação Multi-telas (Abas):** O projeto utiliza **Expo Router** (construído sobre React Navigation) para implementar uma navegação por Abas Inferiores (Bottom Tab Navigator) com 3 telas: Início, Busca e Meu Livro, além de uma tela modal para Edição.
* **UI/UX Polido:** A interface utiliza notificações "toast" (via `react-native-toast-message`) para feedback, `useFocusEffect` para atualização de dados em tempo real, e componentes `<LoadingSpinner>` reutilizáveis para estados de carregamento.

---

## 💻 Tecnologias Utilizadas

* **React Native**
* **Expo (SDK 50+)**
* **Expo Router** (para navegação baseada em arquivos)
* **Expo SQLite (Nova API Async)**
* **TypeScript**
* **React Native Toast Message**

---

## 🏃 Como Rodar o Projeto

1.  Clone o repositório.
2.  Navegue até a pasta `mobile/app` (ou a pasta que contém o `package.json` do mobile).
3.  Instale as dependências: `npx expo install` (ou `npm install`)
4.  Inicie o servidor de desenvolvimento: `npx expo start`
5.  Escaneie o QR code com o aplicativo **Expo Go** no seu celular.

*Observação: Se estiver rodando em um ambiente de nuvem (como o Firebase Studio), use `npx expo start --tunnel`.*