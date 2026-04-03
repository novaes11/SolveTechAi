// Espera o DOM carregar
document.addEventListener('DOMContentLoaded', function() {
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
            'correlacoes': 'Correlações'
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

    // Simulação de dados em tempo real para dados médicos
    function updateMedicalNumbers() {
        const numbers = document.querySelectorAll('.number');
        numbers.forEach(number => {
            const currentValue = parseInt(number.textContent.replace(/,/g, ''));
            const newValue = currentValue + Math.floor(Math.random() * 5);
            number.textContent = newValue.toLocaleString();
        });
    }

    // Atualiza os números a cada 10 segundos
    setInterval(updateMedicalNumbers, 10000);

    // Adiciona interatividade aos cards de pacientes
    document.querySelectorAll('.fan-card').forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('expanded');
        });
    });

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

    // Executa animação das barras de progresso quando a seção de correlações estiver visível
    const correlationsSection = document.querySelector('#correlacoes');
    if (correlationsSection) {
    const correlationsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateProgressBars();
                correlationsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    correlationsObserver.observe(correlationsSection);
    }

    // Simulação de alertas médicos em tempo real
    function simulateMedicalAlerts() {
        const alertCard = document.querySelector('.card:last-child .number');
        if (alertCard) {
            const currentAlerts = parseInt(alertCard.textContent);
            const newAlerts = currentAlerts + Math.floor(Math.random() * 3);
            alertCard.textContent = newAlerts;
            
            // Adiciona efeito visual para novos alertas
            alertCard.style.color = '#dc3545';
            setTimeout(() => {
                alertCard.style.color = '';
            }, 2000);
        }
    }

    // Simula alertas médicos a cada 15 segundos
    setInterval(simulateMedicalAlerts, 15000);

    // Simulação de correlações em tempo real
    function simulateCorrelations() {
        const correlationValues = document.querySelectorAll('#correlacoes .value');
        correlationValues.forEach(value => {
            if (value.textContent.includes('0.')) {
                const currentValue = parseFloat(value.textContent);
                const newValue = currentValue + (Math.random() * 0.02 - 0.01);
                value.textContent = newValue.toFixed(2);
            }
        });
    }

    // Simula atualizações de correlações a cada 20 segundos
    setInterval(simulateCorrelations, 20000);

    // Inicializa com a seção dashboard ativa
    navigateToSection('dashboard');

    // Resize handler para responsividade
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('open');
        }
    });

    // Dados dos pacientes
    const patientsData = {
        'maria-silva': {
            name: 'Maria Silva',
            age: '45 anos | Feminino',
            avatar: 'https://via.placeholder.com/80x80/FF4655/ffffff?text=MS',
            status: 'alto-risco',
            statusText: 'Alto Risco',
            aiSummary: 'Hipertensão Grau 1 - Pressão arterial elevada com múltiplos fatores de risco. Recomenda-se monitoramento contínuo e ajuste de medicação.',
            aiConfidence: '94%',
            risks: [
                { disease: 'Hipertensão', percentage: 85 },
                { disease: 'Diabetes', percentage: 45 },
                { disease: 'Doença Cardíaca', percentage: 30 },
                { disease: 'AVC', percentage: 15 }
            ]
        },
        'joao-santos': {
            name: 'João Santos',
            age: '58 anos | Masculino',
            avatar: 'https://via.placeholder.com/80x80/0F1923/ffffff?text=JS',
            status: 'critico',
            statusText: 'Crítico',
            aiSummary: 'Diabetes Tipo 2 + Hipertensão - Comorbidade grave com risco cardiovascular alto. Necessita intervenção imediata e ajuste de medicação.',
            aiConfidence: '97%',
            risks: [
                { disease: 'Diabetes', percentage: 95 },
                { disease: 'Hipertensão', percentage: 90 },
                { disease: 'Doença Cardíaca', percentage: 75 },
                { disease: 'Insuficiência Renal', percentage: 40 }
            ]
        },
        'ana-pereira': {
            name: 'Ana Pereira',
            age: '52 anos | Feminino',
            avatar: 'https://via.placeholder.com/80x80/7B2CBF/ffffff?text=AP',
            status: 'moderado',
            statusText: 'Moderado',
            aiSummary: 'Pré-Diabetes + Pré-Hipertensão - Estado pré-mórbido com alto risco de progressão. Recomenda-se mudanças no estilo de vida e monitoramento preventivo.',
            aiConfidence: '89%',
            risks: [
                { disease: 'Diabetes', percentage: 65 },
                { disease: 'Hipertensão', percentage: 60 },
                { disease: 'Doença Cardíaca', percentage: 25 },
                { disease: 'AVC', percentage: 15 }
            ]
        },
        'carlos-pinto': {
            name: 'Carlos Pinto',
            age: '65 anos | Masculino',
            avatar: 'https://via.placeholder.com/80x80/28a745/ffffff?text=CP',
            status: 'critico',
            statusText: 'Crítico',
            aiSummary: 'Síndrome Metabólica Grave - Hipertensão descontrolada + Diabetes descompensado. Risco cardiovascular extremamente alto. Intervenção urgente necessária.',
            aiConfidence: '99%',
            risks: [
                { disease: 'Diabetes', percentage: 98 },
                { disease: 'Hipertensão', percentage: 95 },
                { disease: 'Doença Cardíaca', percentage: 85 },
                { disease: 'Insuficiência Renal', percentage: 60 }
            ]
        }
    };

    // Função para abrir detalhes do paciente
    window.openPatientDetails = function(patientId) {
        const patient = patientsData[patientId];
        if (!patient) return;

        // Tenta obter o avatar diretamente da lista de pacientes (caso tenha sido personalizado pelo usuário)
        let avatarSrcFromList = null;
        try {
            const cards = document.querySelectorAll('.fan-card');
            for (const card of cards) {
                const nameEl = card.querySelector('.fan-info h3');
                const imgEl = card.querySelector('.fan-avatar');
                if (nameEl && imgEl && nameEl.textContent.trim() === patient.name) {
                    avatarSrcFromList = imgEl.getAttribute('src');
                    break;
                }
            }
        } catch (e) {}

        // Atualiza informações do paciente
        document.getElementById('patient-avatar').src = avatarSrcFromList || patient.avatar;
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
        // Aguarda layout e tenta com retries até os canvases terem tamanho
        createPatientChartsWithRetry(patientId, 0);

        // Armazena paciente atual para o modal de exame
        window.currentPatientId = patientId;
    };

    // Função para fechar detalhes do paciente
    window.closePatientDetails = function() {
        navigateToSection('pacientes');
    };

    // Função para criar gráficos específicos do paciente
    function createPatientCharts(patientId) {
        const patient = patientsData[patientId];
        if (!patient) return;

        // Gera séries temporais fictícias por paciente (8 pontos)
        const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'];
        function generateSeries(start, trendPerStep, noiseRange, min, max, len = 8) {
            const series = [];
            let value = start;
            for (let i = 0; i < len; i++) {
                const noise = (Math.random() * 2 - 1) * noiseRange;
                value = Math.max(min, Math.min(max, value + trendPerStep + noise));
                series.push(Math.round(value));
            }
            return series;
        }

        // Dados fixos para Maria Silva
        const fixedData = {
            'maria-silva': {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'],
                systolic:   [138, 140, 142, 145, 147, 150, 152, 155],
                diastolic:  [ 88,  90,  91,  92,  93,  94,  95,  96],
                fasting:    [ 92,  95,  98, 100, 104, 107, 110, 112],
                post:       [135, 140, 145, 150, 155, 160, 165, 170]
            }
        };

        // Baselines por paciente (fallback para demais pacientes)
        const baselines = {
            'maria-silva': {
                systolic: 140, diastolic: 90, fasting: 95, post: 140,
                trends: { sys: 1.5, dia: 1, fast: 2, post: 3 }
            },
            'joao-santos': {
                systolic: 165, diastolic: 100, fasting: 185, post: 230,
                trends: { sys: 3, dia: 2, fast: 4, post: 5 }
            },
            'ana-pereira': {
                systolic: 135, diastolic: 85, fasting: 110, post: 155,
                trends: { sys: 1, dia: 0.8, fast: 1.5, post: 2 }
            },
            'carlos-pinto': {
                systolic: 175, diastolic: 110, fasting: 220, post: 265,
                trends: { sys: 3.5, dia: 2.5, fast: 4.5, post: 5.5 }
            }
        };

        const base = baselines[patientId] || baselines['maria-silva'];

        let labelsLocal = labels;
        let systolicSeries, diastolicSeries, fastingSeries, postSeries;

        if (fixedData[patientId]) {
            labelsLocal    = fixedData[patientId].labels;
            systolicSeries = fixedData[patientId].systolic;
            diastolicSeries= fixedData[patientId].diastolic;
            fastingSeries  = fixedData[patientId].fasting;
            postSeries     = fixedData[patientId].post;
        } else {
            systolicSeries = generateSeries(base.systolic, base.trends.sys, 3, 90, 220, labels.length);
            diastolicSeries= generateSeries(base.diastolic, base.trends.dia, 2, 60, 140, labels.length);
            fastingSeries  = generateSeries(base.fasting, base.trends.fast, 5, 70, 260, labels.length);
            postSeries     = generateSeries(base.post, base.trends.post, 6, 90, 320, labels.length);
        }

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

    // Retry helper para aguardar layout antes de criar gráficos
    function createPatientChartsWithRetry(patientId, attempt) {
        const pressureCanvas = document.getElementById('patientPressureChart');
        const glucoseCanvas = document.getElementById('patientGlucoseChart');
        const maxAttempts = 10;
        const ready = pressureCanvas && glucoseCanvas && pressureCanvas.clientHeight > 0 && glucoseCanvas.clientHeight > 0;
        if (ready) {
            createPatientCharts(patientId);
        } else if (attempt < maxAttempts) {
            setTimeout(() => createPatientChartsWithRetry(patientId, attempt + 1), 60);
        }
    }

    // Função para gerar diagnóstico com IA
    window.generateAIDiagnosis = function() {
        const diagnosisText = document.getElementById('diagnosis-text');
        const patientName = document.getElementById('patient-name').textContent;
        const aiSummary = document.getElementById('ai-summary-text').textContent;
        
        // Simula geração de diagnóstico com IA
        const aiDiagnosis = `# DIAGNÓSTICO MÉDICO COMPLETO - ${patientName}

## DADOS DO PACIENTE
- Nome: ${patientName}
- Data da Consulta: ${new Date().toLocaleDateString('pt-BR')}

## ANÁLISE IA
${aiSummary}

## QUEIXA PRINCIPAL
Paciente apresenta alterações nos parâmetros clínicos que indicam necessidade de monitoramento contínuo.

## HISTÓRICO MÉDICO
Baseado na análise de dados clínicos e histórico do paciente.

## EXAME FÍSICO
A ser realizado pelo médico durante a consulta.

## EXAMES COMPLEMENTARES
Resultados de exames laboratoriais e de imagem devem ser analisados em conjunto.

## DIAGNÓSTICO
Diagnóstico baseado na análise de IA e dados clínicos disponíveis.

## PLANO TERAPÊUTICO
Tratamento deve ser prescrito pelo médico responsável.

## OBSERVAÇÕES
Este diagnóstico foi gerado com auxílio de inteligência artificial e deve ser revisado pelo médico.`;

        diagnosisText.value = aiDiagnosis;
    };

    // Função para salvar diagnóstico
    window.saveDiagnosis = function() {
        const diagnosisText = document.getElementById('diagnosis-text').value;
        const patientName = document.getElementById('patient-name').textContent;
        
        // Simula salvamento
        alert(`Diagnóstico de ${patientName} salvo com sucesso!`);
        
        // Aqui você pode implementar o salvamento real
        console.log('Diagnóstico salvo:', diagnosisText);
    };

    // Função para imprimir diagnóstico
    window.printDiagnosis = function() {
        const diagnosisText = document.getElementById('diagnosis-text').value;
        const patientName = document.getElementById('patient-name').textContent;
        
        // Cria uma nova janela para impressão
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Diagnóstico - ${patientName}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        pre { white-space: pre-wrap; font-family: 'Courier New', monospace; }
                    </style>
                </head>
                <body>
                    <h1>Diagnóstico Médico</h1>
                    <h2>Paciente: ${patientName}</h2>
                    <pre>${diagnosisText}</pre>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    // Funções do Modal de Exame
    // Base do arquivo (sem extensão). Vamos tentar extensões comuns (.jpg, .jpeg, .png, .webp)
    const examBaseByPatient = {
        default: 'images/resultado-do-exame-de-sangue-v0-0wk34izw0f1d1'
    };

    function loadExamImageWithFallback(imgEl, basePath, onDone) {
        const exts = ['.jpg', '.jpeg', '.png', '.webp'];
        let idx = 0;
        function tryNext() {
            if (idx >= exts.length) {
                // fallback final: placeholder
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
        // Carrega tentando .jpg primeiro e caindo para outros formatos
        loadExamImageWithFallback(img, base);
        caption.textContent = patientId ? `Exame médico de ${patientsData[patientId].name}` : 'Exame médico';
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
}); 