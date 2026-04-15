// Espera o DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    // Carrega o nome do médico logado
    const savedDoctorName = localStorage.getItem('doctorName');
    if (savedDoctorName) {
        const doctorNameDisplay = document.getElementById('doctorNameDisplay');
        if (doctorNameDisplay) {
            doctorNameDisplay.textContent = savedDoctorName;
        }
    }

    // Elementos do DOM
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');
    const pageTitle = document.getElementById('pageTitle');

    // Dados globais para gráficos (usados nos gráficos gerais e nos específicos de pacientes)
    const globalPressureData = {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'],
        systolic: [140, 145, 150, 155, 160, 165, 170, 175],
        diastolic: [90, 92, 95, 98, 100, 102, 105, 108]
    };

    const globalGlucoseData = {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'],
        fasting: [95, 105, 115, 125, 135, 145, 155, 165],
        postprandial: [140, 150, 160, 170, 180, 190, 200, 210]
    };

    // =============================================
    // US01 - Dashboard de Indicadores
    // =============================================

    // Dados clínicos centralizados do dashboard
    const dashboardData = {
        totalPacientes:  { value: 2156, trend: '+45 este mês',           alert: false },
        hipertensao:     { value: 456,  trend: '21.2% da população',     alert: false },
        diabetes:        { value: 312,  trend: '14.5% da população',     alert: false },
        diagnosticosIA:  { value: 234,  trend: '96% precisão',           alert: false },
        comorbidades:    { value: 89,   trend: 'Hipertensão + Diabetes', alert: true  },
        alertasCriticos: { value: 18,   trend: 'Requerem atenção',       alert: true  }
    };

    // Injeta os valores nos cards do dashboard via JS (US01 - item 1)
    function renderDashboardCards() {
        const cards = document.querySelectorAll('#dashboard .card');
        const keys  = Object.keys(dashboardData);

        cards.forEach((card, index) => {
            const key = keys[index];
            if (!key) return;

            const data     = dashboardData[key];
            const numberEl = card.querySelector('.number');
            const trendEl  = card.querySelector('.trend');

            if (numberEl) numberEl.textContent = data.value.toLocaleString('pt-BR');
            if (trendEl)  trendEl.textContent  = data.trend;

            // Aplica estado de alerta visual (US01 - item 2)
            if (data.alert) {
                card.classList.add('card--alert');
            } else {
                card.classList.remove('card--alert');
            }
        });
    }

    // Atualiza apenas os cards do dashboard com novos dados simulados (US01)
    function updateDashboardNumbers() {
        dashboardData.totalPacientes.value  += Math.floor(Math.random() * 3);
        dashboardData.alertasCriticos.value += Math.floor(Math.random() * 2);

        // Marca como crítico dinamicamente se alertas ultrapassar 20
        dashboardData.alertasCriticos.alert = dashboardData.alertasCriticos.value > 20;

        renderDashboardCards();
    }

    // =============================================
    // US03 - Lista de Pacientes
    // =============================================

    // Array de objetos JSON com os dados dos pacientes (US03 - item 1)
    const patientsData = [
        {
            id: 'maria-silva',
            name: 'Maria Silva',
            age: '45 anos | Feminino',
            avatar: 'assets/avatar/premium_photo-1688572454849-4348982edf7d.jpg',
            status: 'alto-risco',
            statusText: 'Alto Risco',
            systolic: 140,
            glucose: 95,
            riskFactors: ['Obesidade', 'Sedentarismo', 'Histórico Familiar'],
            aiSummary: 'Hipertensão Grau 1 - Pressão arterial elevada com múltiplos fatores de risco. Recomenda-se monitoramento contínuo e ajuste de medicação.',
            aiConfidence: '94%',
            risks: [
                { disease: 'Hipertensão', percentage: 85 },
                { disease: 'Diabetes', percentage: 45 },
                { disease: 'Doença Cardíaca', percentage: 30 },
                { disease: 'AVC', percentage: 15 }
            ]
        },
        {
            id: 'joao-santos',
            name: 'João Santos',
            age: '58 anos | Masculino',
            avatar: 'assets/avatar/premium_photo-1689568126014-06fea9d5d341.jpg',
            status: 'critico',
            statusText: 'Crítico',
            systolic: 160,
            glucose: 180,
            riskFactors: ['Diabetes Tipo 2', 'Tabagismo', 'Estresse'],
            aiSummary: 'Diabetes Tipo 2 + Hipertensão - Comorbidade grave com risco cardiovascular alto. Necessita intervenção imediata e ajuste de medicação.',
            aiConfidence: '97%',
            risks: [
                { disease: 'Diabetes', percentage: 95 },
                { disease: 'Hipertensão', percentage: 90 },
                { disease: 'Doença Cardíaca', percentage: 75 },
                { disease: 'Insuficiência Renal', percentage: 40 }
            ]
        },
        {
            id: 'ana-pereira',
            name: 'Ana Pereira',
            age: '52 anos | Feminino',
            avatar: 'assets/avatar/1708135913769.jpg',
            status: 'moderado',
            statusText: 'Moderado',
            systolic: 135,
            glucose: 110,
            riskFactors: ['Pré-Diabetes', 'Sedentarismo', 'Dieta Rica em Sódio'],
            aiSummary: 'Pré-Diabetes + Pré-Hipertensão - Estado pré-mórbido com alto risco de progressão. Recomenda-se mudanças no estilo de vida e monitoramento preventivo.',
            aiConfidence: '89%',
            risks: [
                { disease: 'Diabetes', percentage: 65 },
                { disease: 'Hipertensão', percentage: 60 },
                { disease: 'Doença Cardíaca', percentage: 25 },
                { disease: 'AVC', percentage: 15 }
            ]
        },
        {
            id: 'carlos-pinto',
            name: 'Carlos Pinto',
            age: '65 anos | Masculino',
            avatar: 'assets/avatar/download.jpg',
            status: 'critico',
            statusText: 'Crítico',
            systolic: 175,
            glucose: 220,
            riskFactors: ['Diabetes Tipo 2', 'Hipertensão Grave', 'Obesidade'],
            aiSummary: 'Síndrome Metabólica Grave - Hipertensão descontrolada + Diabetes descompensado. Risco cardiovascular extremamente alto. Intervenção urgente necessária.',
            aiConfidence: '99%',
            risks: [
                { disease: 'Diabetes', percentage: 98 },
                { disease: 'Hipertensão', percentage: 95 },
                { disease: 'Doença Cardíaca', percentage: 85 },
                { disease: 'Insuficiência Renal', percentage: 60 }
            ]
        },
        {
            id: 'roberto-oliveira',
            name: 'Roberto Oliveira',
            age: '71 anos | Masculino',
            avatar: 'https://ui-avatars.com/api/?name=Roberto+Oliveira&background=0F1923&color=fff&size=150',
            status: 'moderado',
            statusText: 'Moderado',
            systolic: 145,
            glucose: 120,
            riskFactors: ['Idade Avançada', 'Sobrepeso', 'Histórico Familiar'],
            aiSummary: 'Risco cardiovascular moderado devido à idade e sobrepeso. Pressão arterial levemente alterada. Necessário acompanhamento bimestral e controle dietético preventivo.',
            aiConfidence: '88%',
            risks: [
                { disease: 'Doença Cardíaca', percentage: 55 },
                { disease: 'Hipertensão', percentage: 70 },
                { disease: 'Diabetes', percentage: 40 }
            ]
        },
        {
            id: 'lucia-souza',
            name: 'Lúcia Souza',
            age: '63 anos | Feminino',
            avatar: 'https://ui-avatars.com/api/?name=Lucia+Souza&background=7B2CBF&color=fff&size=150',
            status: 'alto-risco',
            statusText: 'Alto Risco',
            systolic: 155,
            glucose: 145,
            riskFactors: ['Obesidade', 'Dislipidemia', 'Sedentarismo'],
            aiSummary: 'Quadro sugestivo de Síndrome Metabólica em desenvolvimento. Glicemia de jejum e pressão arterial consistentemente altas nas últimas medições. Risco elevado de progressão.',
            aiConfidence: '92%',
            risks: [
                { disease: 'Síndrome Metabólica', percentage: 85 },
                { disease: 'Diabetes', percentage: 75 },
                { disease: 'AVC', percentage: 35 }
            ]
        },
        {
            id: 'fernando-costa',
            name: 'Fernando Costa',
            age: '39 anos | Masculino',
            avatar: 'https://ui-avatars.com/api/?name=Fernando+Costa&background=17a2b8&color=fff&size=150',
            status: 'baixo-risco',
            statusText: 'Baixo Risco',
            systolic: 120,
            glucose: 90,
            riskFactors: ['Estresse', 'Tabagismo Leve'],
            aiSummary: 'Paciente apresenta parâmetros clínicos dentro da normalidade. Fator de estresse e tabagismo representam risco em longo prazo. Recomenda-se acompanhamento anual e MEV.',
            aiConfidence: '96%',
            risks: [
                { disease: 'Doença Pulmonar', percentage: 20 },
                { disease: 'Hipertensão', percentage: 15 }
            ]
        },
        {
            id: 'marcia-alves',
            name: 'Márcia Alves',
            age: '55 anos | Feminino',
            avatar: 'https://ui-avatars.com/api/?name=Marcia+Alves&background=FF4655&color=fff&size=150',
            status: 'critico',
            statusText: 'Crítico',
            systolic: 185,
            glucose: 195,
            riskFactors: ['Hipertensão Resistente', 'Diabetes Tipo 2', 'Nefropatia Inicial'],
            aiSummary: 'Descontrole pressórico e glicêmico graves associados a sinais de lesão de órgão-alvo. Indicação de intervenção médica imediata e ajustes contínuos de protocolo medicamentoso.',
            aiConfidence: '98%',
            risks: [
                { disease: 'Insuficiência Renal', percentage: 88 },
                { disease: 'Infarto', percentage: 80 },
                { disease: 'AVC', percentage: 75 }
            ]
        },
        {
            id: 'patricia-gomes',
            name: 'Patrícia Gomes',
            age: '28 anos | Feminino',
            avatar: 'https://ui-avatars.com/api/?name=Patricia+Gomes&background=28a745&color=fff&size=150',
            status: 'baixo-risco',
            statusText: 'Baixo Risco',
            systolic: 115,
            glucose: 85,
            riskFactors: ['Sedentarismo Leve'],
            aiSummary: 'Paciente jovem com exames dentro dos padrões de normalidade. Risco cardiovascular muito baixo. Orientada a manter hábitos saudáveis.',
            aiConfidence: '99%',
            risks: [
                { disease: 'Hipertensão', percentage: 5 },
                { disease: 'Diabetes', percentage: 8 }
            ]
        }
    ];

    // Renderiza os cards de pacientes dinamicamente via forEach (US03 - item 2)
    function renderPatientCards() {
        const grid = document.getElementById('patients-grid');
        if (!grid) return;

        grid.innerHTML = '';

        patientsData.forEach(patient => {
            const tagsHTML = patient.riskFactors
                .map(tag => `<span class="tag">${tag}</span>`)
                .join('');

            const card = document.createElement('div');
            card.className = 'fan-card';
            card.onclick = () => openPatientDetails(patient.id);

            card.innerHTML = `
                <div class="fan-header">
                    <img src="${patient.avatar}" alt="Avatar" class="fan-avatar">
                    <div class="fan-info">
                        <h3>${patient.name}</h3>
                        <p class="fan-location">${patient.age}</p>
                    </div>
                </div>
                <div class="fan-stats">
                    <div class="stat">
                        <span class="label">Pressão Sistólica</span>
                        <span class="value">${patient.systolic} mmHg</span>
                    </div>
                    <div class="stat">
                        <span class="label">Glicemia</span>
                        <span class="value">${patient.glucose} mg/dL</span>
                    </div>
                </div>
                <div class="fan-interests">
                    <h4>Fatores de Risco</h4>
                    <div class="tags">${tagsHTML}</div>
                </div>
            `;

            grid.appendChild(card);
        });
    }

    // Navegação entre abas
    function navigateToSection(sectionId) {
        // Remove active de todas as seções
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // Remove active de todos os nav items
        navItems.forEach(item => {
            item.classList.remove('active');
        });

        // Adiciona active na seção e nav item correspondente
        const targetSection = document.getElementById(sectionId);
        const targetNavItem = document.querySelector(`[data-section="${sectionId}"]`);

        if (targetSection) {
            targetSection.classList.add('active');
        }

        if (targetNavItem) {
            targetNavItem.classList.add('active');
        }

        // Atualiza o título da página
        updatePageTitle(sectionId);

        // Fecha o menu mobile se estiver aberto
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('open');
        }
    }

    // Atualiza o título da página
    function updatePageTitle(sectionId) {
        const titles = {
            'dashboard': 'Dashboard',
            'pacientes': 'Pacientes',
            'consultas': 'Consultas Realizadas'
        };

        if (titles[sectionId]) {
            pageTitle.textContent = titles[sectionId];
        }
    }

    // Event listeners para navegação
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            navigateToSection(sectionId);
        });
    });

    // Menu mobile toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
    }

    // Fecha o menu mobile ao clicar fora
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });

    // Animação dos cards ao entrar na viewport
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.card, .fan-card, .chart-card, .campaign-card').forEach(card => {
        observer.observe(card);
    });

    // Configuração dos gráficos médicos
    // Gráfico de Evolução da Pressão Arterial
    const pressureCtx = document.getElementById('pressureChart');
    if (pressureCtx) {
        const pressureChart = new Chart(pressureCtx.getContext('2d'), {
        type: 'line',
        data: {
                labels: globalPressureData.labels,
            datasets: [{
                label: 'Pressão Sistólica (mmHg)',
                    data: globalPressureData.systolic,
                borderColor: '#FF4655',
                backgroundColor: 'rgba(255, 70, 85, 0.1)',
                fill: true,
                tension: 0.4,
                yAxisID: 'y'
            }, {
                label: 'Pressão Diastólica (mmHg)',
                    data: globalPressureData.diastolic,
                borderColor: '#0F1923',
                backgroundColor: 'rgba(15, 25, 35, 0.1)',
                fill: true,
                tension: 0.4,
                yAxisID: 'y'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    beginAtZero: false,
                    min: 80,
                    max: 200,
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });
    }

    // Gráfico de Evolução da Glicemia
    const glucoseCtx = document.getElementById('glucoseChart');
    if (glucoseCtx) {
        const glucoseChart = new Chart(glucoseCtx.getContext('2d'), {
        type: 'line',
        data: {
                labels: globalGlucoseData.labels,
            datasets: [{
                label: 'Glicemia em Jejum (mg/dL)',
                    data: globalGlucoseData.fasting,
                borderColor: '#7B2CBF',
                backgroundColor: 'rgba(123, 44, 191, 0.1)',
                fill: true,
                tension: 0.4,
                yAxisID: 'y'
            }, {
                label: 'Glicemia Pós-Prandial (mg/dL)',
                    data: globalGlucoseData.postprandial,
                borderColor: '#28a745',
                backgroundColor: 'rgba(40, 167, 69, 0.1)',
                fill: true,
                tension: 0.4,
                yAxisID: 'y'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    beginAtZero: false,
                    min: 70,
                    max: 250,
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });
    }

    // Gráfico de Fatores de Risco
    const riskFactorsCtx = document.getElementById('riskFactorsChart');
    if (riskFactorsCtx) {
        const riskFactorsChart = new Chart(riskFactorsCtx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['Obesidade', 'Sedentarismo', 'Histórico Familiar', 'Diabetes', 'Tabagismo', 'Estresse', 'Dieta Rica em Sódio', 'Dislipidemia'],
            datasets: [{
                data: [35, 25, 20, 15, 10, 15, 12, 18],
                backgroundColor: [
                    '#FF4655',
                    '#0F1923',
                    '#7B2CBF',
                    '#28a745',
                    '#ffc107',
                    '#17a2b8',
                    '#6f42c1',
                    '#fd7e14'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
    }

    // Gráfico de Medicações
    const medicationsCtx = document.getElementById('medicationsChart');
    if (medicationsCtx) {
        const medicationsChart = new Chart(medicationsCtx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Captopril', 'Losartana', 'Amlodipina', 'Metformina', 'Gliclazida', 'Insulina', 'Hidroclorotiazida', 'Enalapril'],
            datasets: [{
                label: 'Pacientes em Uso',
                data: [45, 38, 32, 28, 25, 22, 20, 18],
                backgroundColor: [
                    '#FF4655',
                    '#0F1923',
                    '#7B2CBF',
                    '#28a745',
                    '#ffc107',
                    '#17a2b8',
                    '#6f42c1',
                    '#fd7e14'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    }

    // Gráfico de Comorbidades
    const comorbiditiesCtx = document.getElementById('comorbiditiesChart');
    if (comorbiditiesCtx) {
        const comorbiditiesChart = new Chart(comorbiditiesCtx.getContext('2d'), {
        type: 'pie',
        data: {
            labels: ['Apenas Hipertensão', 'Apenas Diabetes', 'Hipertensão + Diabetes', 'Síndrome Metabólica', 'Sem Doenças'],
            datasets: [{
                data: [367, 223, 89, 67, 1410],
                backgroundColor: [
                    '#FF4655',
                    '#7B2CBF',
                    '#28a745',
                    '#ffc107',
                    '#17a2b8'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
    }

    // Adiciona interatividade aos cards de diagnóstico
    document.querySelectorAll('.campaign-card').forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('expanded');
        });
    });

    // Animação das barras de progresso
    function animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress');
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 500);
        });
    }

    // Executa animação das barras de progresso quando a seção de diagnóstico estiver visível
    const diagnosisSection = document.querySelector('#diagnostico');
    if (diagnosisSection) {
        const diagnosisObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateProgressBars();
                    diagnosisObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        diagnosisObserver.observe(diagnosisSection);
    }

    // US01 - Inicializa dashboard com dados e agenda atualização periódica
    renderDashboardCards();
    setInterval(updateDashboardNumbers, 10000);

    // US03 - Renderiza os cards de pacientes via forEach
    renderPatientCards();

    // Inicializa com a seção dashboard ativa
    navigateToSection('dashboard');

    // Resize handler para responsividade
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('open');
        }
    });

    // Função para abrir detalhes do paciente
    window.openPatientDetails = function(patientId) {
        // US03: busca o paciente no array pelo id
        const patient = patientsData.find(p => p.id === patientId);
        if (!patient) return;

        // Atualiza informações do paciente
        document.getElementById('patient-avatar').src = patient.avatar;
        document.getElementById('patient-name').textContent = patient.name;
        document.getElementById('patient-age').textContent = patient.age;
        document.getElementById('patient-status').textContent = patient.statusText;
        document.getElementById('patient-status').className = `status ${patient.status}`;

        // Atualiza diagnóstico IA
        document.getElementById('ai-summary-text').textContent = patient.aiSummary;
        document.getElementById('ai-confidence').textContent = patient.aiConfidence;

        // Atualiza riscos de doenças
        const riskContainer = document.getElementById('ai-risk-percentages');
        riskContainer.innerHTML = '';

        patient.risks.forEach(risk => {
            const riskItem = document.createElement('div');
            riskItem.className = 'risk-item';
            riskItem.innerHTML = `
                <span>${risk.disease}: ${risk.percentage}%</span>
                <div class="progress-bar">
                    <div class="progress" style="width: ${risk.percentage}%"></div>
                </div>
            `;
            riskContainer.appendChild(riskItem);
        });

        // Atualiza o texto do diagnóstico
        const diagnosisText = document.getElementById('diagnosis-text');
        const currentDate = new Date().toLocaleDateString('pt-BR');
        diagnosisText.value = diagnosisText.value.replace('[Nome do Paciente]', patient.name);
        diagnosisText.value = diagnosisText.value.replace('[Idade]', patient.age.split(' ')[0]);
        diagnosisText.value = diagnosisText.value.replace('[Gênero]', patient.age.includes('Feminino') ? 'Feminino' : 'Masculino');
        diagnosisText.value = diagnosisText.value.replace('[Data Atual]', currentDate);

        // Navega para a página de detalhes
        navigateToSection('patient-details');

        // Atualiza o título da página
        document.getElementById('pageTitle').textContent = patient.name;

        // Cria os gráficos específicos do paciente
        // Adiciona um pequeno delay para garantir que o canvas esteja visível antes de desenhar.
        setTimeout(() => createPatientCharts(patientId), 100);
        
        // Armazena paciente atual para o modal de exame
        window.currentPatientId = patientId;
    };

    // Função para fechar detalhes do paciente
    window.closePatientDetails = function() {
        navigateToSection('pacientes');
    };

    // Função para criar gráficos específicos do paciente
    function createPatientCharts(patientId) {
        const patient = patientsData.find(p => p.id === patientId);
        if (!patient) return;

        const labelsLocal = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'];
        
        // Puxa os dados reais registrados no card do paciente para o ponto final (mês atual)
        const currentSystolic = patient.systolic;
        const currentDiastolic = Math.round(patient.systolic * 0.6); // Estimativa clínica da diastólica
        const currentGlucose = patient.glucose;
        const currentPostGlucose = Math.round(patient.glucose * 1.4); // Estimativa pós-prandial
        
        // Função inteligente para gerar um histórico retroativo 
        function generateHistoricalData(currentValue, volatility) {
            const data = [currentValue];
            let val = currentValue;
            
            // Simula os 7 meses anteriores (andando de trás para frente)
            for (let i = 0; i < 7; i++) {
                val = val + (Math.random() * volatility * 2) - volatility;
                data.unshift(Math.round(val)); // Adiciona sempre antes do último no array
            }
            return data;
        }

        // Gera as séries baseadas 100% no paciente selecionado
        const systolicSeries = generateHistoricalData(currentSystolic, 6);
        const diastolicSeries = generateHistoricalData(currentDiastolic, 4);
        const fastingSeries = generateHistoricalData(currentGlucose, 10);
        const postSeries = generateHistoricalData(currentPostGlucose, 15);

        // Gráfico de Pressão Arterial do Paciente
        const patientPressureCtx = document.getElementById('patientPressureChart');
        if (patientPressureCtx) {
            if (window.patientPressureChart) {
                window.patientPressureChart.destroy();
            }

            window.patientPressureChart = new Chart(patientPressureCtx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: labelsLocal,
                    datasets: [{
                        label: 'Pressão Sistólica (mmHg)',
                        data: systolicSeries,
                        borderColor: '#FF4655',
                        backgroundColor: 'rgba(255, 70, 85, 0.1)',
                        fill: true,
                        tension: 0.4,
                        yAxisID: 'y'
                    }, {
                        label: 'Pressão Diastólica (mmHg)',
                        data: diastolicSeries,
                        borderColor: '#0F1923',
                        backgroundColor: 'rgba(15, 25, 35, 0.1)',
                        fill: true,
                        tension: 0.4,
                        yAxisID: 'y'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            beginAtZero: false,
                            min: Math.min(...diastolicSeries) - 10,
                            max: Math.max(...systolicSeries) + 10,
                            grid: { color: 'rgba(0,0,0,0.1)' }
                        }
                    },
                    plugins: { legend: { position: 'top' } }
                }
            });
        }

        // Gráfico de Glicemia do Paciente
        const patientGlucoseCtx = document.getElementById('patientGlucoseChart');
        if (patientGlucoseCtx) {
            if (window.patientGlucoseChart) {
                window.patientGlucoseChart.destroy();
            }

            window.patientGlucoseChart = new Chart(patientGlucoseCtx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: labelsLocal,
                    datasets: [{
                        label: 'Glicemia em Jejum (mg/dL)',
                        data: fastingSeries,
                        borderColor: '#7B2CBF',
                        backgroundColor: 'rgba(123, 44, 191, 0.1)',
                        fill: true,
                        tension: 0.4,
                        yAxisID: 'y'
                    }, {
                        label: 'Glicemia Pós-Prandial (mg/dL)',
                        data: postSeries,
                        borderColor: '#28a745',
                        backgroundColor: 'rgba(40, 167, 69, 0.1)',
                        fill: true,
                        tension: 0.4,
                        yAxisID: 'y'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            beginAtZero: false,
                            min: Math.min(...fastingSeries) - 15,
                            max: Math.max(...postSeries) + 15,
                            grid: { color: 'rgba(0,0,0,0.1)' }
                        }
                    },
                    plugins: { legend: { position: 'top' } }
                }
            });
        }
    }

// US05 - Gerador de IA Melhorado (Laudo Realista e Dinâmico)
window.generateAIDiagnosis = function() {
    const diagnosisText = document.getElementById('diagnosis-text');

    // 1. Tenta pegar o paciente pelo ID global que foi salvo ao abrir a tela
    let patient = null;
    if (window.currentPatientId) {
        patient = patientsData.find(p => p.id === window.currentPatientId);
    }

    // 2. PLANO B (Fallback Salvador): Se a variável global se perdeu, 
    // procuramos o paciente pelo nome que está aparecendo no HTML da tela!
    if (!patient) {
        const patientNameEl = document.getElementById('patient-name');
        if (patientNameEl) {
            const nomeNaTela = patientNameEl.textContent.trim();
            patient = patientsData.find(p => p.name === nomeNaTela);
            
            // Restaura o ID global para consertar o erro para as próximas ações (como abrir exames)
            if (patient) {
                window.currentPatientId = patient.id;
            }
        }
    }

    // Se mesmo com o Plano B não achar ninguém, aí sim barramos a execução
    if (!patient) {
        alert('Erro: Não foi possível identificar o paciente aberto na tela. Tente voltar e abrir o paciente novamente.');
        return;
    }

    // =========================================================
    // 🧠 MOTOR DE IA SIMULADA: GERANDO TEXTOS CLÍNICOS REAIS
    // =========================================================

    // 1. Queixa Principal baseada na condição real do paciente
    let queixa = "Consulta de rotina para acompanhamento de quadro metabólico e cardiovascular.";
    if (patient.glucose > 150) {
        queixa = "Paciente relata episódios de fadiga intensa, poliúria (aumento do volume da urina) e polidipsia (sede excessiva) nas últimas semanas, sugestivo de descompensação glicêmica.";
    } else if (patient.systolic >= 150) {
        queixa = "Paciente queixa-se de cefaleia (dor de cabeça) occipital esporádica e episódios de tontura, principalmente no período da manhã.";
    } else if (patient.status === 'moderado') {
        queixa = "Paciente assintomático(a) no momento, comparece para reavaliação de exames de rotina e acompanhamento preventivo.";
    }

    // 2. Histórico Médico puxando os Fatores de Risco
    const historico = patient.riskFactors.length > 0 
        ? `Paciente apresenta histórico prévio significativo para: ${patient.riskFactors.join(', ')}.` 
        : `Paciente nega comorbidades prévias além das diagnosticadas no quadro atual.`;

    // 3. Exame Físico simulado (calcula uma diastólica coerente para ficar real)
    const diastolicaCalculada = Math.round(patient.systolic * 0.6); 
    const exameFisico = `Bom estado geral (BEG), corado(a), hidratado(a), acianótico(a) e anictérico(a).\n- Pressão Arterial aferida: ${patient.systolic} x ${diastolicaCalculada} mmHg.\n- Ritmo Cardíaco Regular em 2 tempos (RCR 2T), bulhas normofonéticas sem sopros.\n- Murmúrio vesicular presente (MVP), sem ruídos adventícios.`;

    // 4. Exames Complementares (dando direcionamento de acordo com o caso)
    const exames = `Glicemia capilar aferida no consultório: ${patient.glucose} mg/dL.\nSugere-se solicitar para a próxima consulta: Hemograma Completo, Hemoglobina Glicada (HbA1c), Perfil Lipídico (Colesterol Total e Frações), Ureia, Creatinina e EAS.`;

    // 5. Plano Terapêutico dinâmico avaliando o Risco
    let plano = "";
    if (patient.status === 'critico') {
        plano = "1. Ajuste imediato do protocolo medicamentoso (avaliar introdução/aumento de anti-hipertensivos e hipoglicemiantes).\n2. Encaminhamento de urgência para cardiologia e endocrinologia.\n3. Retorno obrigatório em 15 dias com novos exames laboratoriais.";
    } else if (patient.status === 'alto-risco') {
        plano = "1. Otimização terapêutica das medicações em uso.\n2. Início de intervenção nutricional focada em reeducação alimentar.\n3. Prescrição de rotina de exercícios físicos leves sob supervisão.\n4. Retorno em 30 dias para acompanhamento.";
    } else {
        plano = "1. Conduta conservadora com foco em Mudança de Estilo de Vida (MEV).\n2. Orientação para dieta hipossódica e restrição de carboidratos simples.\n3. Manutenção das medicações atuais (se houver).\n4. Retorno de rotina em 3 meses.";
    }

    // =========================================================

    // Monta listas formatadas
    const risksFormatted = patient.risks.map(r => `  - ${r.disease}: ${r.percentage}%`).join('\n');
    const riskFactorsFormatted = patient.riskFactors.map(f => `  - ${f}`).join('\n');

    // String template final aplicando a formatação Markdown que a função de impressão lê
    const aiDiagnosis = `# DIAGNÓSTICO MÉDICO COMPLETO

## DADOS DO PACIENTE
- Nome: ${patient.name}
- Idade/Gênero: ${patient.age}
- Status Clínico: ${patient.statusText}
- Data da Consulta: ${new Date().toLocaleDateString('pt-BR')}

## PARÂMETROS CLÍNICOS ATUAIS
- Pressão Sistólica: ${patient.systolic} mmHg
- Glicemia: ${patient.glucose} mg/dL

## ANÁLISE IA E DIAGNÓSTICO BASE (Confiança: ${patient.aiConfidence})
${patient.aiSummary}

## QUEIXA PRINCIPAL
${queixa}

## HISTÓRICO MÉDICO
${historico}

## EXAME FÍSICO
${exameFisico}

## EXAMES COMPLEMENTARES
${exames}

## PLANO TERAPÊUTICO CONDUTA
${plano}

## PROBABILIDADE DE DOENÇAS FUTURAS (IA)
${risksFormatted}

## FATORES DE RISCO IDENTIFICADOS
${riskFactorsFormatted}

## OBSERVAÇÕES
Este laudo foi gerado e pré-preenchido com auxílio de Inteligência Artificial para otimizar o tempo de consulta. O médico responsável deve revisar, alterar (se necessário) e validar as informações contidas acima antes da emissão final e assinatura.`;

    // Injeta o laudo montado no textarea
    diagnosisText.value = aiDiagnosis;
};

    // Função para salvar diagnóstico
    window.saveDiagnosis = function() {
        const diagnosisText = document.getElementById('diagnosis-text').value;
        const patientName = document.getElementById('patient-name').textContent;
        alert(`Diagnóstico de ${patientName} salvo com sucesso!`);
        console.log('Diagnóstico salvo:', diagnosisText);
    };

window.printDiagnosis = function() {
    const diagnosisText = document.getElementById('diagnosis-text').value;
    const patientName = document.getElementById('patient-name').textContent || 'Paciente';

    // 1. "Limpando" e formatando o texto (Converte o Markdown para HTML)
    // Isso remove os símbolos # e cria títulos bonitos, além de respeitar as quebras de linha
    let formattedText = diagnosisText
        .replace(/^# (.*$)/gim, '<h2 class="main-title">$1</h2>')         // Transforma '# Titulo' em <h2>
        .replace(/^## (.*$)/gim, '<h3 class="section-title">$1</h3>')     // Transforma '## Subtitulo' em <h3>
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')                 // Transforma '**negrito**' em <strong>
        .replace(/\n/g, '<br>');                                          // Troca quebras de linha reais por <br>

    // 2. Pegando a data de hoje para o laudo
    const today = new Date().toLocaleDateString('pt-BR');

    // 3. Montando a janela de impressão
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <title>Laudo Médico - ${patientName}</title>
                <style>
                    /* Define o tamanho da folha A4 e zera margens de sistema */
                    @page { 
                        size: A4; 
                        margin: 2cm; 
                    }
                    
                    /* Estilo base com fonte mais profissional (semelhante ao Word) */
                    body { 
                        font-family: 'Segoe UI', Arial, sans-serif; 
                        color: #111; 
                        line-height: 1.6; 
                        margin: 0; 
                        padding: 0;
                    }

                    /* Cabeçalho do Laudo */
                    .document-header {
                        text-align: center;
                        border-bottom: 2px solid #2c3e50;
                        padding-bottom: 10px;
                        margin-bottom: 20px;
                    }
                    .document-header h1 {
                        margin: 0;
                        color: #2c3e50;
                        font-size: 24px;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    }
                    .document-header p {
                        margin: 5px 0 0 0;
                        color: #555;
                        font-size: 14px;
                    }

                    /* Caixinha de informações do paciente */
                    .patient-info {
                        background-color: #f8f9fa;
                        border: 1px solid #e9ecef;
                        border-radius: 6px;
                        padding: 15px;
                        margin-bottom: 30px;
                        display: flex;
                        justify-content: space-between;
                        font-size: 14px;
                    }
                    .patient-info p { 
                        margin: 0; 
                    }

                    /* Área principal do conteúdo */
                    .content {
                        font-size: 12pt; /* Tamanho ideal para leitura em papel */
                        text-align: justify;
                    }

                    /* Estilização dos títulos que vieram do Markdown */
                    .main-title {
                        text-align: center;
                        font-size: 16pt;
                        margin-top: 0;
                        margin-bottom: 20px;
                        display: none; /* Ocultamos o "# DIAGNÓSTICO MÉDICO COMPLETO" original porque já temos o cabeçalho novo */
                    }
                    .section-title {
                        color: #2c3e50;
                        border-bottom: 1px solid #eee;
                        padding-bottom: 5px;
                        margin-top: 30px;
                        margin-bottom: 15px;
                        font-size: 14pt;
                        text-transform: uppercase;
                    }

                    /* Área de Assinatura ao final do documento */
                    .signature-area {
                        margin-top: 60px;
                        text-align: center;
                        page-break-inside: avoid; /* Evita que a linha de assinatura fique separada na folha seguinte */
                    }
                    .signature-area hr {
                        width: 50%;
                        border: none;
                        border-top: 1px solid #000;
                        margin-bottom: 8px;
                    }
                    .signature-area p {
                        margin: 0;
                        font-size: 14px;
                        color: #333;
                    }
                </style>
            </head>
            <body>
                <div class="document-header">
                    <h1>Clínica Médica</h1>
                    <p>Laudo e Avaliação Clínica</p>
                </div>

                <div class="patient-info">
                    <div>
                        <p><strong>Paciente:</strong> ${patientName}</p>
                    </div>
                    <div>
                        <p><strong>Data da Emissão:</strong> ${today}</p>
                    </div>
                </div>

                <div class="content">
                    ${formattedText}
                </div>

                <div class="signature-area">
                    <hr>
                    <p>Assinatura e Carimbo do(a) Médico(a)</p>
                </div>
            </body>
        </html>
    `);
    printWindow.document.close();
    
    // Pequeno delay para garantir que o navegador renderize o HTML antes de chamar a caixa de impressão
    setTimeout(() => {
        printWindow.print();
    }, 250);
};
    // Funções do Modal de Exame
    const examBaseByPatient = {
        default: 'assets/images/resultado-do-exame-de-sangue-v0-0wk34izw0f1d1'
    };

    function loadExamImageWithFallback(imgEl, basePath, onDone) {
        const exts = ['.jpg', '.jpeg', '.png', '.webp'];
        let idx = 0;
        function tryNext() {
            if (idx >= exts.length) {
                imgEl.src = 'https://via.placeholder.com/900x600?text=Laudo+nao+encontrado';
                if (onDone) onDone(false);
                return;
            }
            const candidate = basePath + exts[idx++];
            imgEl.onerror = tryNext;
            imgEl.onload = () => { imgEl.onerror = null; if (onDone) onDone(true); };
            imgEl.src = candidate;
        }
        tryNext();
    }

    window.openExamImage = function() {
        const modal = document.getElementById('examModal');
        const img = document.getElementById('examImage');
        const caption = document.getElementById('examCaption');
        const patientId = window.currentPatientId;
        const base = (examBaseByPatient[patientId] || examBaseByPatient.default);
        loadExamImageWithFallback(img, base);
        const patient = patientsData.find(p => p.id === patientId);
        caption.textContent = patient ? `Exame médico de ${patient.name}` : 'Exame médico';
        modal.classList.add('open');
    };

    window.closeExamModal = function() {
        const modal = document.getElementById('examModal');
        const img = document.getElementById('examImage');
        modal.classList.remove('open');
        img.src = '';
    };

    window.handleExamBackdropClick = function(event) {
        if (event.target && event.target.id === 'examModal') {
            window.closeExamModal();
        }
    };

    // =============================================
    // Funções do Modal de Agendamento
    // =============================================
    
    window.openScheduleModal = function() {
        document.getElementById('scheduleModal').classList.add('open');
    };

    window.closeScheduleModal = function() {
        document.getElementById('scheduleModal').classList.remove('open');
        document.getElementById('scheduleForm').reset();
    };

    window.handleScheduleBackdropClick = function(event) {
        if (event.target && event.target.id === 'scheduleModal') {
            window.closeScheduleModal();
        }
    };

    window.handleScheduleSubmit = function(event) {
        event.preventDefault(); // Evita recarregar a página

        // 1. Pega os valores preenchidos
        const name = document.getElementById('schedName').value;
        const dateInput = document.getElementById('schedDate').value;
        const statusValue = document.getElementById('schedStatus').value;
        const complaint = document.getElementById('schedComplaint').value;

        // Verifica se o paciente já está cadastrado no sistema
        const patientExists = patientsData.some(p => p.name.toLowerCase() === name.trim().toLowerCase());
        
        if (!patientExists) {
            alert('Paciente não encontrado no sistema! Verifique o nome digitado ou cadastre o paciente primeiro.');
            return; // Interrompe o processo de agendamento
        }

        // 2. Formata a data (Ex: 25/12/2023 às 14:30)
        const dateObj = new Date(dateInput);
        const formattedDate = dateObj.toLocaleDateString('pt-BR') + ' às ' + dateObj.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});

        // 3. Define textos bonitos dependendo da urgência escolhida
        let statusText = statusValue === 'baixo-risco' ? 'Agendada (Rotina)' 
                       : statusValue === 'moderado' ? 'Acompanhamento' 
                       : 'Urgência';
        
        // 4. Puxa o nome do médico da sessão
        const doctorName = localStorage.getItem('doctorName') || 'Dr(a). Logado';

        // 5. Monta o HTML do novo cartão seguindo o design do site
        const newCard = document.createElement('div');
        newCard.className = 'campaign-card';
        newCard.style.animation = 'fadeIn 0.6s ease-out'; // Pequena animação para mostrar que foi adicionado
        
        newCard.innerHTML = `
            <div class="campaign-header">
                <h3>${name}</h3>
                <span class="status ${statusValue}">${statusText}</span>
            </div>
            <div class="campaign-content">
                <div class="diagnosis-content">
                    <h4>Detalhes do Agendamento:</h4>
                    <p><strong>Data:</strong> ${formattedDate}</p>
                    <p><strong>Médico(a):</strong> ${doctorName}</p>
                    <p><strong>Queixa/Motivo:</strong> ${complaint}</p>
                    <p><strong>Status Atual:</strong> Consulta marcada. Aguardando paciente.</p>
                </div>
            </div>
        `;

        // 6. Insere o cartão no TOPO da grade de consultas
        const grid = document.querySelector('#consultas .campaigns-grid');
        grid.insertBefore(newCard, grid.firstChild);

        // 7. Fecha o modal
        window.closeScheduleModal();
    };

    // Dropdown do Perfil na barra lateral
    const profileBtn = document.getElementById("profileBtn");
    const dropdown = document.getElementById("profileDropdown");

    if (profileBtn && dropdown) {
        // abrir/fechar ao clicar
        profileBtn.addEventListener("click", () => {
           dropdown.classList.toggle("show");
        });

        // fechar se clicar fora
        document.addEventListener("click", (e) => {
            if (!profileBtn.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.remove("show");
            }
        });
    }

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
    }
    
    function logout() {
        // limpa sessão
        localStorage.clear();

        // força redirecionamento
        window.location.href = "login.html";
    }

    document.addEventListener('DOMContentLoaded', () => {
    const notiBtn = document.getElementById('notiBtn');
    const notiDropdown = document.getElementById('notiDropdown');

    // Alternar exibição ao clicar no botão
    notiBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Impede de fechar ao clicar no próprio botão
        notiDropdown.classList.toggle('active');
    });

    // Fechar ao clicar em qualquer lugar fora do menu
    document.addEventListener('click', (e) => {
        if (!notiDropdown.contains(e.target) && e.target !== notiBtn) {
            notiDropdown.classList.remove('active');
        }
    });
});

(function() {
    const setupNotifications = () => {
        const btn = document.getElementById('notiBtn');
        const dropdown = document.getElementById('notiDropdown');

        if (!btn || !dropdown) return;

        // Remove qualquer listener antigo e adiciona o novo
        btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropdown.classList.toggle('active');
            console.log("Status do menu:", dropdown.classList.contains('active'));
        };

        // Fecha se clicar em qualquer outro lugar da tela
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target) && e.target !== btn) {
                dropdown.classList.remove('active');
            }
        });
    };

    // Tenta rodar imediatamente e também quando a janela carregar totalmente
    setupNotifications();
    window.addEventListener('load', setupNotifications);
})();
});