// Espera o DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');
    const pageTitle = document.getElementById('pageTitle');

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
            'laudos': 'Laudos',
            'diagnostico': 'Diagnóstico IA',
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
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'],
                datasets: [{
                    label: 'Pressão Sistólica (mmHg)',
                    data: [140, 145, 150, 155, 160, 165, 170, 175],
                    borderColor: '#FF4655',
                    backgroundColor: 'rgba(255, 70, 85, 0.1)',
                    fill: true,
                    tension: 0.4,
                    yAxisID: 'y'
                }, {
                    label: 'Pressão Diastólica (mmHg)',
                    data: [90, 92, 95, 98, 100, 102, 105, 108],
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
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'],
                datasets: [{
                    label: 'Glicemia em Jejum (mg/dL)',
                    data: [95, 105, 115, 125, 135, 145, 155, 165],
                    borderColor: '#7B2CBF',
                    backgroundColor: 'rgba(123, 44, 191, 0.1)',
                    fill: true,
                    tension: 0.4,
                    yAxisID: 'y'
                }, {
                    label: 'Glicemia Pós-Prandial (mg/dL)',
                    data: [140, 150, 160, 170, 180, 190, 200, 210],
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

    // Gráfico de Resultados Laboratoriais
    const labResultsCtx = document.getElementById('labResultsChart');
    if (labResultsCtx) {
        const labResultsChart = new Chart(labResultsCtx.getContext('2d'), {
            type: 'radar',
            data: {
                labels: ['Glicemia', 'Colesterol Total', 'HDL', 'LDL', 'Triglicerídeos', 'Creatinina', 'HbA1c', 'Microalbuminúria'],
                datasets: [{
                    label: 'Valores Atuais',
                    data: [120, 220, 45, 140, 180, 1.2, 7.5, 30],
                    borderColor: '#FF4655',
                    backgroundColor: 'rgba(255, 70, 85, 0.2)',
                    pointBackgroundColor: '#FF4655',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#FF4655'
                }, {
                    label: 'Valores Normais',
                    data: [100, 200, 50, 130, 150, 1.0, 5.7, 30],
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.2)',
                    pointBackgroundColor: '#28a745',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#28a745'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 250
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
}); 