# 🗓️ Planejamento da Sprint (Sprint Planning)

## 🎯 1. Objetivo da Sprint (Sprint Goal)
Implementar a navegabilidade entre seções e a lógica de exibição dinâmica de dados dos pacientes, permitindo que o médico visualize informações clínicas e gere laudos simulados com suporte de IA.

---

## 📑 2. Backlog da Sprint (Selecionado)

| User Story Selecionada | Tarefas Técnicas (Subtasks) | Story Points |
| :--- | :--- | :---: |
| **US01: Dashboard de Indicadores**<br>Resumo geral de hipertensão, diabetes e comorbidades. | 1. Criar função para injetar valores nos cards via JS.<br>2. Estilizar estados de alerta (CSS) para casos críticos. | 5 |
| **US02: Navegação SPA**<br>Alternância entre abas sem recarregar a página. | 1. Implementar Event Listeners na sidebar.<br>2. Criar lógica de toggle da classe `.active`. | 3 |
| **US03: Lista de Pacientes**<br>Exibição triada por status de risco. | 1. Criar Array de objetos JSON (Database fake).<br>2. Implementar `forEach` para renderização dinâmica. | 5 |
| **US05: Gerador de IA**<br>Geração automática de laudo clínico. | 1. Criar função `generateAIDiagnosis()` com template string.<br>2. Lógica de captura de contexto do paciente atual. | 8 |
| **US09: Impressão de Laudo**<br>Entrega física do diagnóstico ao paciente. | 1. Configurar `@media print` no CSS.<br>2. Adicionar `window.print()` ao botão de ação. | 3 |

**💰 Total de Story Points Planejados:** 24 SP

---

## 📋 3. Quadro Kanban (Estado Inicial)

| TO DO (A Fazer) | DOING (Em Execução) | TESTING (Em Teste) | DONE (Concluído) |
| :--- | :--- | :--- | :--- |
| [US09] Configurar @media print | [US02] Navegação SPA | [US07] Barras de Correlação | [Setup] Estrutura HTML/CSS |
| [US08] Criar Modal de Exames | [US01] Injeção de Dados | | [US11] Loop de Atualização |
| [US05] Template IA | [Setup] Importação Chart.js | | |
| | [US04] Gráficos de Evolução | | |

---

## 🛠️ Critérios de Aceite Gerais
- A navegação não deve gerar recarregamento de página (comportamento SPA).
- O diagnóstico gerado pela IA deve ser editável antes da impressão.
- O sistema deve rodar inteiramente no navegador (Client-side), utilizando o `localStorage` para persistência temporária da sessão.

---
*Documento de Planejamento - IA Diagnóstico*