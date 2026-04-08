/**
 * SolveTechAi — app.js
 * Arquitetura: Modular Orientada a Objetos (ES6+ Classes) SPA
 * Classes: ViewManager | ChartManager | PatientManager | App
 */

'use strict';

const COLORS = Object.freeze({
  bgDeep:       '#04091A',
  primary:      '#0052FF',
  danger:       '#FF3B6F',
  warning:      '#FFB800',
  textSecondary:'#7A8BB5',
  textMuted:    '#3D4F72',
  border:       '#162040',
});

const MOCK_DATA = Object.freeze({
  bloodPressure: {
    labels: ['00h','01h','02h','03h','04h','05h','06h','07h','08h','09h','10h','11h','12h','13h','14h','15h','16h','17h','18h','19h','20h','21h','22h','23h'],
    systolic:  [122, 120, 118, 125, 178, 155, 148, 138, 132, 128, 126, 130, 124, 122, 120, 124, 128, 132, 135, 130, 126, 124, 122, 120],
    diastolic: [ 78,  76,  74,  80,  98,  90,  86,  82,  80,  78,  76,  80,  78,  76,  74,  78,  82,  85,  86,  82,  78,  76,  74,  72],
  },
  glucose: {
    labels: ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],
    values: [105, 218, 142, 115, 195, 98, 110], // Exibe anomalias (218, 195)
    refHigh: 180
  },
  patients: [
    { id: 'PAC-001', name: 'João P. Almeida', age: 58, cid: 'I10 — HAS', bp: '178/98', glucose: 145, riskScore: 72, status: 'critical', lastReading: '04:12 hoje', avatarColor: ['#0052FF', '#00D4FF'] },
    { id: 'PAC-002', name: 'Maria C. Santos', age: 43, cid: 'E11 — DM2', bp: '124/78', glucose: 218, riskScore: 58, status: 'monitoring', lastReading: '09:45 hoje', avatarColor: ['#8B5CF6', '#EC4899'] },
    { id: 'PAC-003', name: 'Carlos E. Ferreira', age: 61, cid: 'I25 — DAC', bp: '132/84', glucose: 112, riskScore: 65, status: 'monitoring', lastReading: '08:30 hoje', avatarColor: ['#F59E0B', '#EF4444'] },
    { id: 'PAC-004', name: 'Ana L. Rodrigues', age: 35, cid: 'J45 — Asma', bp: '118/72', glucose: 98, riskScore: 22, status: 'stable', lastReading: '07:00 hoje', avatarColor: ['#00C896', '#0052FF'] },
    { id: 'PAC-005', name: 'Pedro H. Oliveira', age: 70, cid: 'I50 — IC', bp: '145/90', glucose: 134, riskScore: 81, status: 'critical', lastReading: '10:02 hoje', avatarColor: ['#EF4444', '#F59E0B'] },
    { id: 'PAC-006', name: 'Beatriz M. Lima', age: 52, cid: 'N18 — DRC', bp: '148/92', glucose: 108, riskScore: 47, status: 'monitoring', lastReading: '09:15 hoje', avatarColor: ['#06B6D4', '#8B5CF6'] },
    { id: 'PAC-007', name: 'Roberto A. Souza', age: 48, cid: 'K29 — Gastrite', bp: '120/76', glucose: 95, riskScore: 18, status: 'stable', lastReading: 'Ontem 18h', avatarColor: ['#10B981', '#06B6D4'] },
    { id: 'PAC-008', name: 'Luciana T. Costa', age: 66, cid: 'M79 — Fibromialgia', bp: '126/80', glucose: 102, riskScore: 35, status: 'stable', lastReading: 'Ontem 20h', avatarColor: ['#F472B6', '#A78BFA'] },
    { id: 'PAC-009', name: 'Fernando T. Silva', age: 59, cid: 'E78 — Dislipidemia', bp: '135/85', glucose: 110, riskScore: 40, status: 'monitoring', lastReading: 'Hoje 07h', avatarColor: ['#0052FF', '#8B5CF6'] },
    { id: 'PAC-010', name: 'Juliana R. Castro', age: 41, cid: 'I10 — HAS', bp: '115/70', glucose: 90, riskScore: 15, status: 'stable', lastReading: 'Hoje 10h', avatarColor: ['#10B981', '#00C896'] }
  ],
  consults: [
    { id: 'CON-001', date: 'Hoje', time: '08:30', patientName: 'Carlos E. Ferreira', type: 'Retorno', cid: 'I25 — DAC', status: 'Realizada', avatarColor: ['#F59E0B', '#EF4444'] },
    { id: 'CON-002', date: 'Hoje', time: '09:45', patientName: 'Maria C. Santos', type: 'Primeira Consulta', cid: 'E11 — DM2', status: 'Realizada', avatarColor: ['#8B5CF6', '#EC4899'] },
    { id: 'CON-003', date: 'Hoje', time: '10:30', patientName: 'João P. Almeida', type: 'Emergência', cid: 'I10 — HAS', status: 'Aguardando', avatarColor: ['#0052FF', '#00D4FF'] },
    { id: 'CON-004', date: 'Ontem', time: '14:00', patientName: 'Ana L. Rodrigues', type: 'Exames de Rotina', cid: 'J45 — Asma', status: 'Realizada', avatarColor: ['#00C896', '#0052FF'] },
    { id: 'CON-005', date: 'Ontem', time: '15:30', patientName: 'Pedro H. Oliveira', type: 'Retorno', cid: 'I50 — IC', status: 'Faltou', avatarColor: ['#EF4444', '#F59E0B'] }
  ]
});

/* ================================================================
   CLASSE: ViewManager (Navegação SPA)
================================================================ */
class ViewManager {
  constructor() {
    this.navLinks = document.querySelectorAll('[data-target]');
    this.views = document.querySelectorAll('.view');
    this.bindEvents();
  }

  bindEvents() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('data-target');
        
        // Atualiza estado dos links
        this.navLinks.forEach(l => l.classList.remove('sidebar__nav-link--active'));
        link.classList.add('sidebar__nav-link--active');
        
        // Atualiza visibilidade das rotas (SPA)
        this.views.forEach(view => {
          view.classList.remove('active');
          view.classList.add('hidden');
        });
        
        const targetView = document.getElementById(targetId);
        if(targetView) {
          targetView.classList.remove('hidden');
          targetView.classList.add('active');
        }
      });
    });
  }
}

/* ================================================================
   CLASSE: ChartManager (Integração Limpa Dark Mode)
================================================================ */
class ChartManager {
  constructor() {
    if (typeof Chart !== 'undefined') {
      Chart.defaults.color          = COLORS.textSecondary;
      Chart.defaults.font.family    = "'IBM Plex Mono', monospace";
      Chart.defaults.borderColor    = COLORS.border;
      Chart.defaults.plugins.legend.display = false;
    } else {
      console.warn("Chart.js não detectado. Os gráficos não serão exibidos.");
    }
  }

  renderBP() {
    if (typeof Chart === 'undefined') return;
    const canvas = document.getElementById('bloodPressureChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const gradSys = ctx.createLinearGradient(0, 0, 0, 280);
    gradSys.addColorStop(0, 'rgba(255,59,111,0.30)');
    gradSys.addColorStop(1, 'rgba(255,59,111,0.00)');

    const gradDia = ctx.createLinearGradient(0, 0, 0, 280);
    gradDia.addColorStop(0, 'rgba(0,82,255,0.22)');
    gradDia.addColorStop(1, 'rgba(0,82,255,0.00)');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: MOCK_DATA.bloodPressure.labels,
        datasets: [
          {
            label: 'Sistólica',
            data: MOCK_DATA.bloodPressure.systolic,
            borderColor: COLORS.danger,
            backgroundColor: gradSys,
            tension: 0.4, fill: true, borderWidth: 2,
            pointBackgroundColor: COLORS.bgDeep,
            pointRadius: 3
          },
          {
            label: 'Diastólica',
            data: MOCK_DATA.bloodPressure.diastolic,
            borderColor: COLORS.primary,
            backgroundColor: gradDia,
            tension: 0.4, fill: true, borderWidth: 2,
            pointBackgroundColor: COLORS.bgDeep,
            pointRadius: 3
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: {
          x: { border: {display: false}, grid: {display: false}, ticks: {color: COLORS.textMuted} },
          y: { border: {display: false}, grid: {display: false}, ticks: {color: COLORS.textMuted} }
        }
      }
    });
  }

  renderGlucose() {
    if (typeof Chart === 'undefined') return;
    const canvas = document.getElementById('glucoseChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const isAnomaly = MOCK_DATA.glucose.values.map(v => v > MOCK_DATA.glucose.refHigh);

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: MOCK_DATA.glucose.labels,
        datasets: [
          {
            label: 'Glicemia',
            data: MOCK_DATA.glucose.values,
            backgroundColor: isAnomaly.map(a => a ? COLORS.danger : COLORS.warning),
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: {
          x: { border: {display: false}, grid: {display: false}, ticks: {color: COLORS.textMuted} },
          y: { border: {display: false}, grid: {display: false}, ticks: {color: COLORS.textMuted} }
        }
      }
    });
  }

  renderEcg() {
    if (typeof Chart === 'undefined') return;
    const canvas = document.getElementById('ecgChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const dataLength = 150;
    const dataArr = new Array(dataLength).fill(0);
    const labelsArr = new Array(dataLength).fill('');

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labelsArr,
        datasets: [{
          label: 'ECG',
          data: dataArr,
          borderColor: COLORS.danger,
          borderWidth: 2,
          tension: 0.3, // Curvas suaves para o complexo do batimento
          pointRadius: 0,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, animation: false,
        scales: { x: { display: false }, y: { display: false, min: -5, max: 15 } },
        plugins: { tooltip: { enabled: false } }
      }
    });

    let tick = 0;
    setInterval(() => {
      dataArr.shift(); // Remove o ponto mais antigo
      let val = 0;
      const c = tick % 30; // Ciclo cardíaco
      
      if (c === 4) val = 1.5;         // Onda P
      else if (c === 9) val = -1.5;   // Onda Q
      else if (c === 10) val = 12;    // Onda R (Pico)
      else if (c === 11) val = -3;    // Onda S
      else if (c === 17) val = 2.5;   // Onda T
      else val = (Math.random() * 0.4 - 0.2); // Ruído base do ECG

      dataArr.push(val);
      chart.update();
      tick++;
      
      // Simula uma leve variação nos batimentos cardíacos no painel
      if (c === 10) { document.getElementById('liveBpm').innerText = 82 + Math.floor(Math.random() * 5 - 2); }
    }, 30);
  }

  renderPopulationChart() {
    if (typeof Chart === 'undefined') return;
    const canvas = document.getElementById('populationChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['I10 (Hipertensão)', 'E11 (Diabetes Tipo 2)', 'E78 (Dislipidemia)', 'I25 (Doença Isquêmica)', 'J45 (Asma)', 'Outros'],
        datasets: [{
          label: 'Pacientes Ativos',
          data: [85, 62, 45, 28, 18, 10],
          backgroundColor: [COLORS.danger, COLORS.warning, COLORS.primary, '#8B5CF6', COLORS.success, COLORS.border],
          borderRadius: 4
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true, maintainAspectRatio: false,
        scales: {
          x: { border: {display: false}, grid: {display: false}, ticks: {color: COLORS.textMuted} },
          y: { border: {display: false}, grid: {display: false}, ticks: {color: COLORS.textSecondary, font: {family: "'IBM Plex Mono', monospace"}} }
        }
      }
    });
  }
}

/* ================================================================
   CLASSE: PatientManager (Gerenciamento de Dados e Renderização)
================================================================ */
class PatientManager {
  constructor() {
    this.patients = MOCK_DATA.patients;
  }

  getInitials(name) {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }

  statusLabel(status) {
    const map = { critical: 'Crítico', stable: 'Estável', monitoring: 'Atenção' };
    return map[status] || status;
  }

  renderDashboardTable() {
    // Tolera eventuais erros de digitação na tag como id="patientsTablebody"
    const tbody = document.getElementById('patientsTableBody') || document.querySelector('[id="patientsTablebody" i]');
    if (!tbody) return;
    
    let html = '';
    // Limita aos 8 para a view principal (comportamento original)
    this.patients.slice(0, 8).forEach(patient => {
      const riskClass = patient.riskScore >= 60 ? 'high' : (patient.riskScore >= 35 ? 'medium' : 'low');
      html += `
        <tr class="patients-table__row">
          <td class="patients-table__td">
            <div class="patient-cell">
              <div class="patient-cell__avatar" style="background: linear-gradient(135deg, ${patient.avatarColor[0]}, ${patient.avatarColor[1]})">
                ${this.getInitials(patient.name)}
              </div>
              <div><p class="patient-cell__name">${patient.name}</p><p class="patient-cell__id">${patient.id}</p></div>
            </div>
          </td>
          <td class="patients-table__td blurrable">${patient.age}a<br><span style="font-family:var(--font-mono);font-size:var(--text-xs);color:var(--color-text-muted)">${patient.cid}</span></td>
          <td class="patients-table__td patients-table__td--hide-sm blurrable"><span style="font-family:var(--font-mono);font-weight:500;">${patient.bp}</span></td>
          <td class="patients-table__td patients-table__td--hide-sm blurrable"><span style="font-family:var(--font-mono);font-weight:500;">${patient.glucose} mg/dL</span></td>
          <td class="patients-table__td patients-table__td--hide-md">
            <div class="risk-bar-cell"><div class="risk-bar"><div class="risk-bar__fill risk-bar__fill--${riskClass}" style="width:${patient.riskScore}%"></div></div><span class="risk-bar-cell__value">${patient.riskScore}%</span></div>
          </td>
          <td class="patients-table__td"><span class="status-badge status-badge--${patient.status}">${this.statusLabel(patient.status)}</span></td>
          <td class="patients-table__td patients-table__td--hide-md"><span style="font-family:var(--font-mono);font-size:var(--text-xs);color:var(--color-text-muted)">${patient.lastReading}</span></td>
          <td class="patients-table__td">
            <button class="row-action-btn" aria-label="Ocultar/Exibir dados" onclick="this.closest('tr').classList.toggle('is-blurred')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
          </td>
        </tr>
      `;
    });
    tbody.innerHTML = html;
  }

  renderFullTable() {
    const tbody = document.getElementById('fullPatientsTableBody');
    if (!tbody) return;
    
    let html = '';
    // Rende a lista completa para a nova View de Pacientes (10 items)
    this.patients.forEach(patient => {
      html += `
        <tr class="patients-table__row">
          <td class="patients-table__td">
            <div class="patient-cell">
              <div class="patient-cell__avatar" style="background: linear-gradient(135deg, ${patient.avatarColor[0]}, ${patient.avatarColor[1]})">
                ${this.getInitials(patient.name)}
              </div>
              <span class="patient-cell__name">${patient.name}</span>
            </div>
          </td>
          <td class="patients-table__td blurrable">${patient.age} anos</td>
          <td class="patients-table__td blurrable"><span style="font-family:var(--font-mono); color:var(--color-text-muted)">${patient.cid}</span></td>
          <td class="patients-table__td"><span class="status-badge status-badge--${patient.status}">${this.statusLabel(patient.status)}</span></td>
          <td class="patients-table__td">
            <button class="row-action-btn" aria-label="Ocultar/Exibir dados" onclick="this.closest('tr').classList.toggle('is-blurred')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
          </td>
        </tr>
      `;
    });
    tbody.innerHTML = html;
  }
}

/* ================================================================
   CLASSE: ConsultManager (Gerenciamento da View de Consultas)
================================================================ */
class ConsultManager {
  constructor() {
    this.consults = MOCK_DATA.consults;
  }

  getInitials(name) {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }

  renderTable() {
    const tbody = document.getElementById('consultsTableBody');
    if (!tbody) return;
    
    let html = '';
    this.consults.forEach(consult => {
      const statusClass = consult.status === 'Realizada' ? 'stable' : (consult.status === 'Faltou' ? 'critical' : 'monitoring');
      html += `
        <tr class="patients-table__row">
          <td class="patients-table__td">
            <span style="color:var(--color-text-primary);font-weight:500">${consult.date}</span><br>
            <span style="font-family:var(--font-mono);font-size:var(--text-xs);color:var(--color-text-muted)">${consult.time}</span>
          </td>
          <td class="patients-table__td">
            <div class="patient-cell">
              <div class="patient-cell__avatar" style="background: linear-gradient(135deg, ${consult.avatarColor[0]}, ${consult.avatarColor[1]})">
                ${this.getInitials(consult.patientName)}
              </div>
              <span class="patient-cell__name">${consult.patientName}</span>
            </div>
          </td>
          <td class="patients-table__td"><span style="font-family:var(--font-mono); color:var(--color-text-secondary)">${consult.type}</span></td>
          <td class="patients-table__td"><span style="font-family:var(--font-mono); color:var(--color-text-muted)">${consult.cid}</span></td>
          <td class="patients-table__td"><span class="status-badge status-badge--${statusClass}">${consult.status}</span></td>
        </tr>
      `;
    });
    tbody.innerHTML = html;
  }
}

/* ================================================================
   CLASSE: App (Orquestrador Base)
================================================================ */
class App {
  constructor() {
    this.viewManager = new ViewManager();
    this.chartManager = new ChartManager();
    this.patientManager = new PatientManager();
    this.consultManager = new ConsultManager();
  }

  init() {
    // Renderizar a tabela primeiro garante que falhas no CDN do Chart.js não afetem a injeção da tabela
    try {
      this.patientManager.renderDashboardTable();
      this.patientManager.renderFullTable();
      this.consultManager.renderTable();
    } catch(e) { console.error("Erro ao processar pacientes:", e); }

    this.chartManager?.renderBP();
    this.chartManager?.renderGlucose();
    this.chartManager?.renderEcg();
    this.chartManager?.renderPopulationChart();
  }
}

const initApp = () => {
  const app = new App();
  app.init();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
