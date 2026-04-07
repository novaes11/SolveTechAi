# SolveTechAi - Inteligência de Suporte à Decisão Clínica

O **SolveTechAi** é uma plataforma de monitoramento clínico e auxílio diagnóstico especializada em doenças crônicas (Hipertensão e Diabetes). O foco do projeto é centralizar dados dispersos para identificar correlações críticas e fornecer uma visão analítica rápida para profissionais de saúde através de uma interface intuitiva e de alta performance.

> **Nota:** Este repositório contém o MVP (Minimum Viable Product) focado na interface e lógica de front-end.

---

## 🚀 Proposta de Valor

Médicos enfrentam sobrecarga de informações e dificuldade em visualizar a evolução temporal de pacientes crônicos. O SolveTechAi resolve isso através de:
* **Visualização de Dados Dinâmica:** Gráficos de tendência que cruzam glicemia e pressão arterial em tempo real.
* **Análise de Correlações:** Identificação automática de riscos cruzados (ex: probabilidade de progressão para Síndrome Metabólica em pacientes hipertensos).
* **Automação de Laudos:** Gerador de diagnósticos estruturado baseado em padrões clínicos simulados por lógica de IA.

---

## 🛠️ Tecnologias e Arquitetura

O projeto foi construído para ser leve, rápido e sem dependências pesadas de backend nesta fase inicial, utilizando uma stack puramente voltada para performance de interface:

* **Front-end Core:** HTML5 semântico e CSS3 modularizado (Flexbox/Grid).
* **Lógica de Negócio:** JavaScript (ES6+) orientado a classes (POO) para maior manutenibilidade.
* **Visualização:** [Chart.js](https://www.chartjs.org/) para renderização gráfica de dados clínicos.
* **Ícones:** FontAwesome 6.0 para uma interface médica padronizada.
* **Persistência de Sessão:** `localStorage` para controle de autenticação e simulação de estado do usuário.

---

## 📋 Funcionalidades Principais

### 1. Autenticação Corporativa
* **Validação de Credenciais:** Verificação de e-mail corporativo via Regex e política de senhas fortes (8+ caracteres, símbolos, maiúsculas e minúsculas).
* **Simulação de MFA:** Fluxo de autenticação simulando latência de rede e redirecionamento seguro após sucesso.
* **SSO Ready:** Interface visual preparada para integração com Google e Apple ID.

### 2. Dashboard de Gestão Populacional
* **Métricas Agregadas:** Visualização rápida do total de pacientes, prevalência de patologias e taxa de confiança da IA.
* **Alertas Críticos:** Identificação imediata de pacientes que requerem intervenção prioritária.

### 3. Perfil Detalhado do Paciente
* **Evolução Clínica:** Gráficos de linha sobrepostos para comparar a eficácia de tratamentos ao longo do tempo.
* **AI Summary:** Geração automática de resumos clínicos e cálculos de probabilidade de comorbidades.
* **Editor de Diagnóstico Profissional:** Ferramenta integrada com suporte a markdown para redação e impressão de laudos.

---

## 📂 Estrutura Recomendada do Projeto

Para garantir a escalabilidade e organização profissional que este projeto exige, a estrutura segue o padrão:

```text
/SolveTechAi
├── /assets              # Imagens, Avatares de pacientes e Ícones
├── /css                 # Estilos (styles.css para o painel e login.css para o portal)
├── /js                  # Inteligência (script.js para lógica geral e login.js para segurança)
├── index.html           # Dashboard principal (Dashboard Médico)
├── login.html           # Portal de entrada (Login Corporativo)
└── README.md            # Documentação técnica
```
## ⚙️ Como Executar

O projeto utiliza uma **Vanilla Stack** (tecnologias nativas), portanto não requer instalação de pacotes externos ou servidores complexos para demonstração.

1.  Clone este repositório:
    ```bash
    git clone [https://github.com/novaes11/SolveTechAi.git](https://github.com/novaes11/SolveTechAi.git)
    ```
2.  Navegue até a pasta do projeto.
3.  Abra o arquivo `login.html` em qualquer navegador moderno.
4.  **Credenciais de Teste:** No formulário de login, insira um e-mail com formato `@corporativo.com` e uma senha forte que contenha letras maiúsculas, números e caracteres especiais.

---

## 📈 Roadmap de Desenvolvimento

- [ ] Migração para Backend em **Node.js/Next.js** para persistência real em banco de dados SQL.
- [ ] Integração via API com modelos de linguagem (OpenAI/Gemini) para processamento de linguagem natural em prontuários.
- [ ] Módulo de exportação de laudos médicos em formato PDF com assinatura digital.
- [ ] Implementação de sistema de teleconsulta com criptografia ponta-a-ponta.

---

## ⚠️ Isenção de Responsabilidade (Disclaimer)

Este software é um **protótipo funcional** desenvolvido para fins de demonstração técnica de interface e experiência do usuário (UX). As análises de "IA" e as correlações apresentadas são baseadas em lógica simulada. **Não deve ser utilizado para diagnósticos médicos reais** sem a devida integração com bases de dados clínicas validadas e supervisão médica profissional.
