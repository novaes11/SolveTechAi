/**
 * SolveTechAi — script.js
 * Arquitetura: POO com ES6+ Classes
 * Classes: DashboardApp | ChartRenderer | PatientManager
 * Dados: Mockados com perfil realista de paciente cardiológico
 */

'use strict';

/* ================================================================
   CONSTANTES GLOBAIS — Paleta e Tokens
   Espelha o CSS :root para uso nos datasets do Chart.js
================================================================ */
const COLORS = Object.freeze({
  bgDeep:       '#04091A',
  bgCard:       '#0C1530',
  primary:      '#0052FF',
  secondary:    '#00D4FF',
  danger:       '#FF3B6F',
  warning:      '#FFB800',
  success:      '#00C896',
  purple:       '#8B5CF6',
  textPrimary:  '#E8F0FF',
  textSecondary:'#7A8BB5',
  textMuted:    '#3D4F72',
  border:       '#162040',
});

/* ================================================================
   MOCK DATA — Fonte de verdade para todos os componentes
================================================================ */
const MOCK_DATA = Object.freeze({

  /** Pressão Arterial — 24 pontos horários (00h–23h) */
  bloodPressure: {
    labels: [
      '00h','01h','02h','03h','04h','05h','06h','07h',
      '08h','09h','10h','11h','12h','13h','14h','15h',
      '16h','17h','18h','19h','20h','21h','22h','23h',
    ],
    systolic:  [122, 120, 118, 125, 178, 155, 148, 138,
                132, 128, 126, 130, 124, 122, 120, 124,
                128, 132, 135, 130, 126, 124, 122, 120],
    diastolic: [ 78,  76,  74,  80,  98,  90,  86,  82,
                 80,  78,  76,  80,  78,  76,  74,  78,
                 82,  85,  86,  82,  78,  76,  74,  72],
    anomalyIndex: 4, // índice do pico
  },

  /** Glicemia — 7 dias, 3 leituras por dia */
  glucose: {
    labels: [
      'Seg\n7h','Seg\n12h','Seg\n19h',
      'Ter\n7h','Ter\n12h','Ter\n19h',
      'Qua\n7h','Qua\n12h','Qua\n19h',
      'Qui\n7h','Qui\n12h','Qui\n19h',
      'Sex\n7h','Sex\n12h','Sex\n19h',
      'Sáb\n7h','Sáb\n12h','Sáb\n19h',
      'Dom\n7h','Dom\n12h','Dom\n19h',
    ],
    values: [
       98, 145, 162,
      102, 218, 175,   // pico pós-prandial ← anomalia
      108, 188, 164,
       95, 172, 155,
      100, 195, 168,   // segundo pico
       92, 160, 148,
       98, 155, 142,
    ],
    refHigh: 180, // limite superior de referência
    refLow:  70,  // limite inferior de referência
  },

  /** Score de Risco Multifatorial — Radar */
  riskRadar: {
    labels: ['Cardio', 'Metab.', 'Renal', 'Neuro', 'Respirat.', 'Psíquico'],
    patient: [72, 45, 28, 35, 22, 40],  // paciente João
    ref:     [30, 30, 30, 30, 30, 30],  // linha de referência saudável
  },

  /** Sparklines dos KPI Cards */
  sparklines: {
    patients: [210, 218, 225, 230, 228, 235, 240, 248],
  },

  /** Pacientes em monitoramento */
  patients: [
    {
      id: 'PAC-001',
      name: 'João P. Almeida',
      age: 58,
      cid: 'I10 — HAS',
      bp: '178/98',
      glucose: 145,
      riskScore: 72,
      status: 'critical',
      lastReading: '04:12 hoje',
      avatarColor: ['#0052FF', '#00D4FF'],
    },
    {
      id: 'PAC-002',
      name: 'Maria C. Santos',
      age: 43,
      cid: 'E11 — DM2',
      bp: '124/78',
      glucose: 218,
      riskScore: 58,
      status: 'monitoring',
      lastReading: '09:45 hoje',
      avatarColor: ['#8B5CF6', '#EC4899'],
    },
    {
      id: 'PAC-003',
      name: 'Carlos E. Ferreira',
      age: 61,
      cid: 'I25 — DAC',
      bp: '132/84',
      glucose: 112,
      riskScore: 65,
      status: 'monitoring',
      lastReading: '08:30 hoje',
      avatarColor: ['#F59E0B', '#EF4444'],
    },
    {
      id: 'PAC-004',
      name: 'Ana L. Rodrigues',
      age: 35,
      cid: 'J45 — Asma',
      bp: '118/72',
      glucose: 98,
      riskScore: 22,
      status: 'stable',
      lastReading: '07:00 hoje',
      avatarColor: ['#00C896', '#0052FF'],
    },
    {
      id: 'PAC-005',
      name: 'Pedro H. Oliveira',
      age: 70,
      cid: 'I50 — IC',
      bp: '145/90',
      glucose: 134,
      riskScore: 81,
      status: 'critical',
      lastReading: '10:02 hoje',
      avatarColor: ['#EF4444', '#F59E0B'],
    },
    {
      id: 'PAC-006',
      name: 'Beatriz M. Lima',
      age: 52,
      cid: 'N18 — DRC',
      bp: '148/92',
      glucose: 108,
      riskScore: 47,
      status: 'monitoring',
      lastReading: '09:15 hoje',
      avatarColor: ['#06B6D4', '#8B5CF6'],
    },
    {
      id: 'PAC-007',
      name: 'Roberto A. Souza',
      age: 48,
      cid: 'K29 — Gastrite',
      bp: '120/76',
      glucose: 95,
      riskScore: 18,
      status: 'stable',
      lastReading: 'Ontem 18h',
      avatarColor: ['#10B981', '#06B6D4'],
    },
    {
      id: 'PAC-008',
      name: 'Luciana T. Costa',
      age: 66,
      cid: 'M79 — Fibromialgia',
      bp: '126/80',
      glucose: 102,
      riskScore: 35,
      status: 'stable',
      lastReading: 'Ontem 20h',
      avatarColor: ['#F472B6', '#A78BFA'],
    },
  ],
});

/* ================================================================
   CLASSE: ChartRenderer
   Responsável por instanciar e gerenciar todos os gráficos Chart.js
================================================================ */
class ChartRenderer {
  /** @type {Map<string, Chart>} Registro de instâncias Chart.js */
  #charts = new Map();

  constructor() {
    this.#configureChartDefaults();
  }

  /**
   * Configura defaults globais do Chart.js para o tema dark.
   * Evita repetição em cada instância.
   */
  #configureChartDefaults() {
    Chart.defaults.color          = COLORS.textSecondary;
    Chart.defaults.font.family    = "'IBM Plex Mono', monospace";
    Chart.defaults.font.size      = 11;
    Chart.defaults.borderColor    = COLORS.border;
    Chart.defaults.plugins.legend.display = false; // legendas customizadas no HTML
  }

  /**
   * Cria um gradiente vertical para uso como backgroundColor.
   * @param {CanvasRenderingContext2D} ctx
   * @param {string} colorTop  - Cor superior (com alpha)
   * @param {string} colorBottom - Cor inferior (transparente)
   * @param {number} [height=300]
   * @returns {CanvasGradient}
   */
  #createGradient(ctx, colorTop, colorBottom, height = 300) {
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0,   colorTop);
    gradient.addColorStop(1,   colorBottom);
    return gradient;
  }

  /**
   * Destrói uma instância Chart.js existente antes de recriar.
   * @param {string} id
   */
  #destroyIfExists(id) {
    if (this.#charts.has(id)) {
      this.#charts.get(id).destroy();
      this.#charts.delete(id);
    }
  }

  /* ────────────────────────────────────────────────────────────
     GRÁFICO 1 — Pressão Arterial (Line Chart — 2 datasets)
  ──────────────────────────────────────────────────────────── */
  renderBloodPressure(canvasId, data) {
    this.#destroyIfExists(canvasId);

    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Gradientes
    const gradSystolic  = this.#createGradient(ctx, 'rgba(255,59,111,0.30)', 'rgba(255,59,111,0.00)', 280);
    const gradDiastolic = this.#createGradient(ctx, 'rgba(0,82,255,0.22)',   'rgba(0,82,255,0.00)',   280);

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [
          {
            label: 'Sistólica',
            data:  data.systolic,
            borderColor:     COLORS.danger,
            backgroundColor: gradSystolic,
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointRadius: data.systolic.map((_, i) => i === data.anomalyIndex ? 7 : 3),
            pointBackgroundColor: data.systolic.map((_, i) =>
              i === data.anomalyIndex ? COLORS.danger : COLORS.bgDeep
            ),
            pointBorderColor: data.systolic.map((_, i) =>
              i === data.anomalyIndex ? '#fff' : COLORS.danger
            ),
            pointBorderWidth: data.systolic.map((_, i) => i === data.anomalyIndex ? 2 : 1.5),
            pointHoverRadius: 6,
            order: 1,
          },
          {
            label: 'Diastólica',
            data:  data.diastolic,
            borderColor:     COLORS.primary,
            backgroundColor: gradDiastolic,
            borderWidth: 1.8,
            tension: 0.4,
            fill: true,
            pointRadius: 3,
            pointBackgroundColor: COLORS.bgDeep,
            pointBorderColor: COLORS.primary,
            pointBorderWidth: 1.5,
            pointHoverRadius: 5,
            order: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          tooltip: this.#buildTooltipStyle({
            callbacks: {
              label: (ctx) => {
                const unit = 'mmHg';
                return `  ${ctx.dataset.label}: ${ctx.parsed.y} ${unit}`;
              },
              afterBody: (items) => {
                const i = items[0].dataIndex;
                if (i === data.anomalyIndex) {
                  return ['', '  ⚠ Pico hipertensivo detectado'];
                }
                return [];
              },
            },
          }),
          annotation: undefined, // sem plugin externo
        },
        scales: {
          x: this.#buildScaleX(),
          y: {
            ...this.#buildScaleY(),
            min: 55,
            max: 190,
            ticks: {
              ...this.#buildScaleY().ticks,
              callback: (v) => `${v}`,
              stepSize: 30,
            },
            title: {
              display: true,
              text: 'mmHg',
              color: COLORS.textMuted,
              font: { size: 10 },
            },
          },
        },
      },
    });

    this.#charts.set(canvasId, chart);
    return chart;
  }

  /* ────────────────────────────────────────────────────────────
     GRÁFICO 2 — Glicemia (Line Chart com faixas de referência)
  ──────────────────────────────────────────────────────────── */
  renderGlucose(canvasId, data) {
    this.#destroyIfExists(canvasId);

    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const gradGlucose = this.#createGradient(ctx, 'rgba(255,184,0,0.25)', 'rgba(255,184,0,0.00)', 260);

    // Identifica pontos acima do limite
    const isAnomaly = data.values.map(v => v > data.refHigh);

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [
          {
            label: 'Glicemia',
            data:  data.values,
            borderColor: (ctx2) => {
              // Linha fica vermelha se o segmento estiver acima do limite
              return COLORS.warning;
            },
            segment: {
              borderColor: (ctx2) =>
                data.values[ctx2.p1DataIndex] > data.refHigh ? COLORS.danger : COLORS.warning,
            },
            backgroundColor: gradGlucose,
            borderWidth: 2,
            tension: 0.35,
            fill: true,
            pointRadius: isAnomaly.map(a => a ? 7 : 3),
            pointBackgroundColor: isAnomaly.map(a => a ? COLORS.danger : COLORS.bgDeep),
            pointBorderColor: isAnomaly.map(a => a ? '#fff' : COLORS.warning),
            pointBorderWidth: isAnomaly.map(a => a ? 2 : 1.5),
            pointHoverRadius: 6,
          },
          // Linha de limite superior
          {
            label: 'Limite Superior',
            data: new Array(data.labels.length).fill(data.refHigh),
            borderColor: 'rgba(255,59,111,0.35)',
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderDash: [6, 3],
            pointRadius: 0,
            tension: 0,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          tooltip: this.#buildTooltipStyle({
            callbacks: {
              label: (ctx) => {
                if (ctx.datasetIndex === 1) return null;
                const v = ctx.parsed.y;
                const flag = v > data.refHigh ? '  ⚠ Acima do limite' : '';
                return `  Glicemia: ${v} mg/dL${flag}`;
              },
            },
            filter: (item) => item.datasetIndex === 0,
          }),
        },
        scales: {
          x: {
            ...this.#buildScaleX(),
            ticks: {
              ...this.#buildScaleX().ticks,
              maxTicksLimit: 7,
            },
          },
          y: {
            ...this.#buildScaleY(),
            min: 60,
            max: 240,
            ticks: {
              ...this.#buildScaleY().ticks,
              callback: (v) => `${v}`,
              stepSize: 40,
            },
            title: {
              display: true,
              text: 'mg/dL',
              color: COLORS.textMuted,
              font: { size: 10 },
            },
          },
        },
      },
    });

    this.#charts.set(canvasId, chart);
    return chart;
  }

  /* ────────────────────────────────────────────────────────────
     GRÁFICO 3 — Risk Radar (Radar Chart)
  ──────────────────────────────────────────────────────────── */
  renderRiskRadar(canvasId, data) {
    this.#destroyIfExists(canvasId);

    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const gradPatient = this.#createGradient(ctx, 'rgba(255,184,0,0.3)', 'rgba(255,184,0,0.05)', 220);

    const chart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: data.labels,
        datasets: [
          {
            label: 'Paciente',
            data: data.patient,
            borderColor: COLORS.warning,
            backgroundColor: gradPatient,
            borderWidth: 2,
            pointBackgroundColor: COLORS.warning,
            pointBorderColor: COLORS.bgDeep,
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: 'Referência saudável',
            data: data.ref,
            borderColor: 'rgba(0, 200, 150, 0.45)',
            backgroundColor: 'rgba(0, 200, 150, 0.06)',
            borderWidth: 1.5,
            borderDash: [4, 2],
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'point' },
        plugins: {
          tooltip: this.#buildTooltipStyle({
            callbacks: {
              label: (ctx) => `  ${ctx.dataset.label}: ${ctx.parsed.r}%`,
            },
          }),
        },
        scales: {
          r: {
            min: 0,
            max: 100,
            backgroundColor: 'transparent',
            grid: {
              color: COLORS.border,
              lineWidth: 1,
            },
            angleLines: {
              color: COLORS.border,
              lineWidth: 1,
            },
            pointLabels: {
              color: COLORS.textSecondary,
              font: { size: 10, family: "'IBM Plex Mono', monospace" },
            },
            ticks: {
              color: COLORS.textMuted,
              backdropColor: 'transparent',
              font: { size: 9 },
              stepSize: 25,
              callback: (v) => `${v}%`,
            },
          },
        },
      },
    });

    this.#charts.set(canvasId, chart);
    return chart;
  }

  /* ────────────────────────────────────────────────────────────
     GRÁFICO 4 — Sparkline KPI Card (mini Line sem eixos)
  ──────────────────────────────────────────────────────────── */
  renderSparkline(canvasId, values, color = COLORS.primary) {
    this.#destroyIfExists(canvasId);

    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const grad = this.#createGradient(ctx, `${color}40`, `${color}00`, 40);

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: values.map(() => ''),
        datasets: [{
          data: values,
          borderColor: color,
          backgroundColor: grad,
          borderWidth: 1.5,
          tension: 0.4,
          fill: true,
          pointRadius: 0,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        events: [], // sem interação
        plugins: {
          tooltip: { enabled: false },
          legend:  { display: false },
        },
        scales: {
          x: { display: false },
          y: { display: false },
        },
        animation: { duration: 600, easing: 'easeInOutCubic' },
      },
    });

    this.#charts.set(canvasId, chart);
    return chart;
  }

  /* ────────────────────────────────────────────────────────────
     BUILDERS PRIVADOS — Estilos reutilizáveis
  ──────────────────────────────────────────────────────────── */

  /** Tooltip com estilo dark padrão da aplicação */
  #buildTooltipStyle(overrides = {}) {
    return {
      enabled: true,
      backgroundColor: '#0C1530',
      titleColor: COLORS.textPrimary,
      bodyColor:  COLORS.textSecondary,
      borderColor: COLORS.border,
      borderWidth: 1,
      cornerRadius: 8,
      padding: 12,
      titleFont: { family: "'Syne', sans-serif", size: 12, weight: '700' },
      bodyFont:  { family: "'IBM Plex Mono', monospace", size: 11 },
      boxPadding: 4,
      ...overrides,
    };
  }

  /** Configuração padrão de eixo X */
  #buildScaleX() {
    return {
      border: { display: false },
      grid: {
        color: COLORS.border,
        lineWidth: 0.5,
        drawTicks: false,
      },
      ticks: {
        color: COLORS.textMuted,
        maxRotation: 0,
        padding: 8,
        font: { size: 10 },
      },
    };
  }

  /** Configuração padrão de eixo Y */
  #buildScaleY() {
    return {
      position: 'right',
      border: { display: false },
      grid: {
        color: COLORS.border,
        lineWidth: 0.5,
        drawTicks: false,
      },
      ticks: {
        color: COLORS.textMuted,
        padding: 8,
        font: { size: 10 },
      },
    };
  }

  /**
   * Retorna instância Chart.js pelo ID do canvas.
   * @param {string} id
   * @returns {Chart|undefined}
   */
  getChart(id) {
    return this.#charts.get(id);
  }

  /**
   * Destrói todos os gráficos (útil em unmount / SPA navigation).
   */
  destroyAll() {
    this.#charts.forEach(chart => chart.destroy());
    this.#charts.clear();
  }
}

/* ================================================================
   CLASSE: PatientManager
   Responsável pelo estado e renderização da lista de pacientes
================================================================ */
class PatientManager {
  /** @type {Array} Lista completa de pacientes */
  #patients = [];

  /** @type {string} Filtro ativo */
  #activeFilter = 'all';

  /** @type {HTMLElement} Elemento da tabela */
  #tableBody;

  /** @type {HTMLElement} Contador de pacientes */
  #countEl;

  /**
   * @param {Array}       patients   - Array de pacientes mock
   * @param {HTMLElement} tableBody  - tbody da tabela
   * @param {HTMLElement} countEl    - span com o count
   */
  constructor(patients, tableBody, countEl) {
    this.#patients    = patients;
    this.#tableBody   = tableBody;
    this.#countEl     = countEl;
  }

  /** Inicializa: renderiza tabela e associa filtros */
  init() {
    this.#render();
    this.#bindFilterTabs();
  }

  /**
   * Filtra a lista de pacientes pelo status.
   * @param {string} filter - 'all' | 'critical' | 'stable' | 'monitoring'
   */
  setFilter(filter) {
    this.#activeFilter = filter;
    this.#render();
  }

  /** Retorna pacientes filtrados */
  #getFiltered() {
    if (this.#activeFilter === 'all') return this.#patients;
    return this.#patients.filter(p => p.status === this.#activeFilter);
  }

  /** Renderiza as linhas da tabela */
  #render() {
    const filtered = this.#getFiltered();

    // Atualiza contador
    if (this.#countEl) {
      this.#countEl.textContent = `${filtered.length} paciente${filtered.length !== 1 ? 's' : ''}`;
    }

    if (!this.#tableBody) return;

    // Fragment para evitar reflows repetidos
    const fragment = document.createDocumentFragment();

    if (filtered.length === 0) {
      const tr = document.createElement('tr');
      tr.className = 'patients-table__row';
      tr.innerHTML = `<td class="patients-table__td" colspan="8" style="text-align:center;color:var(--color-text-muted);padding:2rem;">
        Nenhum paciente encontrado nesta categoria.
      </td>`;
      fragment.appendChild(tr);
    } else {
      filtered.forEach(patient => {
        fragment.appendChild(this.#createRow(patient));
      });
    }

    this.#tableBody.innerHTML = '';
    this.#tableBody.appendChild(fragment);
  }

  /**
   * Cria um elemento <tr> para um paciente.
   * @param {Object} patient
   * @returns {HTMLTableRowElement}
   */
  #createRow(patient) {
    const tr = document.createElement('tr');
    tr.className = 'patients-table__row';
    tr.setAttribute('data-patient-id', patient.id);

    const initials = this.#getInitials(patient.name);
    const statusLabel = this.#statusLabel(patient.status);
    const riskClass   = this.#riskClass(patient.riskScore);

    tr.innerHTML = `
      <td class="patients-table__td">
        <div class="patient-cell">
          <div class="patient-cell__avatar"
               style="background: linear-gradient(135deg, ${patient.avatarColor[0]}, ${patient.avatarColor[1]})"
               aria-hidden="true">
            ${initials}
          </div>
          <div>
            <p class="patient-cell__name">${this.#escapeHtml(patient.name)}</p>
            <p class="patient-cell__id">${this.#escapeHtml(patient.id)}</p>
          </div>
        </div>
      </td>
      <td class="patients-table__td">
        <span style="color:var(--color-text-primary);font-weight:500">${patient.age}a</span>
        <br>
        <span style="font-family:var(--font-mono);font-size:var(--text-xs);color:var(--color-text-muted)">${this.#escapeHtml(patient.cid)}</span>
      </td>
      <td class="patients-table__td patients-table__td--hide-sm">
        <span style="font-family:var(--font-mono);font-weight:500;
              color:${this.#bpColor(patient.bp)}">${patient.bp}</span>
      </td>
      <td class="patients-table__td patients-table__td--hide-sm">
        <span style="font-family:var(--font-mono);font-weight:500;
              color:${patient.glucose > 180 ? 'var(--color-accent-danger)' : 'var(--color-text-secondary)'}">
          ${patient.glucose} <span style="font-size:var(--text-xs);opacity:.6">mg/dL</span>
        </span>
      </td>
      <td class="patients-table__td patients-table__td--hide-md">
        <div class="risk-bar-cell">
          <div class="risk-bar" aria-hidden="true">
            <div class="risk-bar__fill risk-bar__fill--${riskClass}"
                 style="width:${patient.riskScore}%"></div>
          </div>
          <span class="risk-bar-cell__value">${patient.riskScore}%</span>
        </div>
      </td>
      <td class="patients-table__td">
        <span class="status-badge status-badge--${patient.status}" role="status">
          ${statusLabel}
        </span>
      </td>
      <td class="patients-table__td patients-table__td--hide-md">
        <span style="font-family:var(--font-mono);font-size:var(--text-xs);color:var(--color-text-muted)">
          ${this.#escapeHtml(patient.lastReading)}
        </span>
      </td>
      <td class="patients-table__td">
        <button class="row-action-btn" aria-label="Ver prontuário de ${this.#escapeHtml(patient.name)}"
                data-action="view" data-patient="${this.#escapeHtml(patient.id)}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
      </td>
    `;

    return tr;
  }

  /** Extrai iniciais do nome (máx. 2 chars) */
  #getInitials(name) {
    return name
      .split(' ')
      .slice(0, 2)
      .map(w => w[0])
      .join('')
      .toUpperCase();
  }

  /** Label localizado de status */
  #statusLabel(status) {
    const map = {
      critical:   'Crítico',
      stable:     'Estável',
      monitoring: 'Atenção',
    };
    return map[status] ?? status;
  }

  /** Classe CSS da barra de risco */
  #riskClass(score) {
    if (score >= 60) return 'high';
    if (score >= 35) return 'medium';
    return 'low';
  }

  /** Cor da pressão arterial */
  #bpColor(bp) {
    const systolic = parseInt(bp.split('/')[0], 10);
    if (systolic >= 160) return 'var(--color-accent-danger)';
    if (systolic >= 140) return 'var(--color-accent-warning)';
    return 'var(--color-text-secondary)';
  }

  /** Previne XSS escapando HTML */
  #escapeHtml(str) {
    const map = { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' };
    return String(str).replace(/[&<>"']/g, c => map[c]);
  }

  /** Associa eventos de clique nos filter-tabs */
  #bindFilterTabs() {
    const tabs = document.querySelectorAll('[data-filter]');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('filter-tabs__btn--active'));
        tab.classList.add('filter-tabs__btn--active');
        this.setFilter(tab.dataset.filter);
      });
    });
  }
}

/* ================================================================
   CLASSE: DashboardApp
   Orquestrador principal — inicializa e conecta todos os módulos
================================================================ */
class DashboardApp {
  /** @type {ChartRenderer} */
  #chartRenderer;

  /** @type {PatientManager} */
  #patientManager;

  constructor() {
    this.#chartRenderer  = new ChartRenderer();
    this.#patientManager = new PatientManager(
      MOCK_DATA.patients,
      document.getElementById('patientsTableBody'),
      document.getElementById('patientCount')
    );
  }

  /** Ponto de entrada público */
  init() {
    // Garante execução após DOM pronto
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.#bootstrap());
    } else {
      this.#bootstrap();
    }
  }

  /** Inicialização interna após DOM */
  #bootstrap() {
    this.#setCurrentDate();
    this.#renderAllCharts();
    this.#patientManager.init();
    this.#bindSidebarToggle();
    this.#bindPeriodTabs();
    this.#bindPatientActions();
    this.#animateKpiValues();

    console.info('[SolveTechAi] Dashboard inicializado com sucesso.');
  }

  /** Exibe a data atual no topbar */
  #setCurrentDate() {
    const el = document.getElementById('currentDate');
    if (!el) return;

    const now = new Date();
    el.textContent = now.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  /** Instancia todos os gráficos */
  #renderAllCharts() {
    // 1. Pressão Arterial
    this.#chartRenderer.renderBloodPressure(
      'bloodPressureChart',
      MOCK_DATA.bloodPressure
    );

    // 2. Glicemia
    this.#chartRenderer.renderGlucose(
      'glucoseChart',
      MOCK_DATA.glucose
    );

    // 3. Radar de Risco IA
    this.#chartRenderer.renderRiskRadar(
      'riskRadarChart',
      MOCK_DATA.riskRadar
    );

    // 4. Sparkline KPI Pacientes
    this.#chartRenderer.renderSparkline(
      'sparklinePatients',
      MOCK_DATA.sparklines.patients,
      COLORS.secondary
    );
  }

  /** Sidebar toggle (hamburger mobile) */
  #bindSidebarToggle() {
    const btn     = document.getElementById('hamburgerBtn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    if (!btn || !sidebar || !overlay) return;

    const open = () => {
      overlay.style.display = 'block';
      // Força o reflow do DOM para que a animação de opacidade funcione
      void overlay.offsetWidth; 
      
      sidebar.classList.add('sidebar--open');
      overlay.classList.add('sidebar-overlay--visible');
      btn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };

    const close = () => {
      sidebar.classList.remove('sidebar--open');
      overlay.classList.remove('sidebar-overlay--visible');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      
      // Remove o elemento do fluxo apenas DEPOS que a transição terminar
      setTimeout(() => { 
        if (!sidebar.classList.contains('sidebar--open')) {
          overlay.style.display = 'none'; 
        }
      }, 250); 
    };

    btn.addEventListener('click', () => {
      const isOpen = sidebar.classList.contains('sidebar--open');
      isOpen ? close() : open();
    });

    overlay.addEventListener('click', close);

    // Fecha com ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar.classList.contains('sidebar--open')) {
        close();
      }
    });
  }

  /** Period tabs — troca de período do gráfico de PA */
  #bindPeriodTabs() {
    const tabs = document.querySelectorAll('.period-tabs__btn');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => {
          t.classList.remove('period-tabs__btn--active');
          t.setAttribute('aria-pressed', 'false');
        });
        tab.classList.add('period-tabs__btn--active');
        tab.setAttribute('aria-pressed', 'true');

        // Neste MVP, apenas simula recarregamento com os mesmos dados
        // Em produção: buscar dados da API conforme o período selecionado
        const period = tab.textContent.trim();
        this.#simulatePeriodChange(period);
      });
    });
  }

  /**
   * Simula mudança de período — perturba levemente os dados.
   * @param {string} period
   */
  #simulatePeriodChange(period) {
    const chart = this.#chartRenderer.getChart('bloodPressureChart');
    if (!chart) return;

    // Aplica variação aleatória suave para simular período diferente
    const jitter = (arr, factor = 8) =>
      arr.map(v => Math.round(v + (Math.random() - 0.5) * factor));

    chart.data.datasets[0].data = jitter(MOCK_DATA.bloodPressure.systolic);
    chart.data.datasets[1].data = jitter(MOCK_DATA.bloodPressure.diastolic);
    chart.update('active');
  }

  /** Ações nas linhas da tabela (ver prontuário) */
  #bindPatientActions() {
    const tableBody = document.getElementById('patientsTableBody');
    if (!tableBody) return;

    tableBody.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action="view"]');
      if (!btn) return;

      const id = btn.dataset.patient;
      const patient = MOCK_DATA.patients.find(p => p.id === id);
      if (!patient) return;

      // Neste MVP: log. Em produção: abrir modal/página de prontuário
      console.info(`[PatientManager] Abrindo prontuário: ${patient.name} (${id})`);
      // Futura implementação: this.#openPatientModal(patient);
    });
  }
  
  /**
   * Anima os valores dos KPI Cards de 0 até o valor real.
   * Usa requestAnimationFrame para suavidade.
   */
  #animateKpiValues() {
    const kpiTargets = {
      patients: 248,
      alerts:   7,
      consults: 14,
      risk:     34,
    };

    const duration = 1200;
    const start = performance.now();
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const step = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOutCubic(progress);

      document.querySelectorAll('[data-kpi]').forEach(el => {
        const key    = el.dataset.kpi;
        const target = kpiTargets[key];
        if (target === undefined) return;

        const current = Math.round(eased * target);
        
        // Forma segura: atualiza apenas os dígitos iniciais do nó de texto,
        // mantendo intocados eventuais elementos filhos (como a tag <span>%).
        Array.from(el.childNodes).forEach(node => {
          if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim().length > 0) {
            node.nodeValue = String(current);
          }
        });
      });

      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }
}

/* ================================================================
   INICIALIZAÇÃO
================================================================ */
const app = new DashboardApp();
app.init();
