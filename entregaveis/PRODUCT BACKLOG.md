# 📑 Status de Desenvolvimento: Product Backlog

Este documento apresenta o mapeamento real do que foi implementado no sistema **IA Diagnóstico** em comparação ao Product Backlog planejado. 

---

## ✅ Funcionalidades Concluídas (Done)
*Itens validados no código fonte e interface funcional.*

| ID | User Story | Prioridade | Esforço (SP) | Observação Técnica |
| :--- | :--- | :--- | :--- | :--- |
| **US01** | Dashboard com 6 indicadores | Altíssima | 5 | Implementado via JS dinâmico e CSS de alerta. |
| **US02** | Navegação entre abas (SPA) | Altíssima | 3 | Lógica de `display: block/none` sem recarregar página. |
| **US03** | Lista de pacientes com avatares/tags | Alta | 5 | Renderização via `forEach` a partir de base JSON. |
| **US04** | Gráficos de evolução (Chart.js) | Alta | 8 | Gráficos de linha para Pressão e Glicemia no perfil. |
| **US05** | Gerador de diagnóstico via IA | Alta | 8 | Motor de concatenação lógica baseado em dados clínicos. |
| **US06** | Edição de laudo gerado pela IA | Média | 3 | Campo `textarea` que permite alteração manual do laudo. |
| **US07** | Visualização de correlações/riscos | Média | 5 | Barras de progresso dinâmicas no perfil do paciente. |
| **US08** | Modal com imagem do exame | Média | 3 | Estrutura de Modal com overlay e fallback de imagem. |
| **US09** | Impressão de diagnóstico | Média | 5 | Função `printDiagnosis` com formatação @media print. |
| **US10** | Badge de notificações | Baixa | 2 | Elemento visual implementado no Top Bar. |
| **US11** | Simulação de atualização de dados | Baixa | 5 | Loop `setInterval` funcional (Ajustado para 10s no código). |
| **US13** | Login com senha (LGPD) | Futuro | 13 | **Antecipado.** Tela de login e lógica de sessão funcional. |

---

## ⏳ Funcionalidades Pendentes (To Do / In Progress)
*Itens que constam no backlog mas não possuem código funcional correspondente.*

| ID | User Story | Prioridade | Esforço (SP) | Motivo da Pendência |
| :--- | :--- | :--- | :--- | :--- |
| **US12** | Filtrar pacientes (Gênero/Idade) | Baixa | 3 | Lógica de busca e `filter()` no array não implementada. |
| **US14** | Exportar dados em PDF | Futuro | 8 | Apenas a impressão nativa foi feita; falta biblioteca PDF. |
| **US15** | Cadastrar novos pacientes | Futuro | 5 | Não há formulário de input para salvar novos objetos no JSON. |

---

## 📊 Resumo da Sprint 01
* **Story Points Planejados (Sprint Goal):** 24 SP
* **Story Points Entregues:** 62 SP
* **Taxa de Conclusão:** 258% do planejamento inicial.

> **⚠️ Alerta de PO (Product Owner):** Embora a velocidade tenha sido alta, houve o desenvolvimento de itens de "Futuro" (US13) em detrimento de itens de prioridade "Baixa" (US12). Recomenda-se focar na funcionalidade de **Busca e Filtro** na próxima interação para garantir usabilidade com grandes volumes de dados.

---
*Relatório gerado em: 14/04/2026*