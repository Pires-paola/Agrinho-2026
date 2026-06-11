/**
 * Agro Forte - Futuro Sustentável
 * Script principal com todas as interações
 */

// ============================================
// INICIALIZAÇÃO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initSimulator();
    initQuiz();
    initCounters();
    initCards();
    initModal();
    initMobileMenu();
    initSmoothScroll();
});

// ============================================
// NAVEGAÇÃO
// ============================================
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            scrollToSection(target);
            
            // Atualiza link ativo
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Fecha menu mobile se aberto
            const navLinksContainer = document.getElementById('navLinks');
            if (navLinksContainer.classList.contains('show')) {
                navLinksContainer.classList.remove('show');
            }
        });
    });
    
    // Atualiza link ativo no scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = ['inicio', 'praticas', 'simulador-section', 'quiz-section', 'estatisticas'];
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = sectionId;
            }
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const onclickAttr = link.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes(current)) {
            link.classList.add('active');
        }
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offset = 80; // Altura do header
        const top = section.offsetTop - offset;
        window.scrollTo({
            top: top,
            behavior: 'smooth'
        });
    }
}

function initSmoothScroll() {
    // Adiciona scroll suave para todos os links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            if (target && target !== '#') {
                const element = document.querySelector(target);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

// ============================================
// MENU MOBILE
// ============================================
function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('show');
            this.textContent = navLinks.classList.contains('show') ? '✕' : '☰';
        });
    }
    
    // Fecha menu ao clicar fora
    document.addEventListener('click', function(e) {
        if (!e.target.closest('nav') && navLinks.classList.contains('show')) {
            navLinks.classList.remove('show');
            if (menuBtn) menuBtn.textContent = '☰';
        }
    });
}

// ============================================
// CARDS DE PRÁTICAS (EXPANDIR/RECOLLHER)
// ============================================
function initCards() {
    const cards = document.querySelectorAll('.practice-card');
    
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Não expande se clicou no botão "Saiba Mais"
            if (e.target.closest('.btn')) return;
            
            toggleCard(this);
        });
    });
}

function toggleCard(card) {
    const wasExpanded = card.classList.contains('expanded');
    
    // Fecha todos os outros cards
    document.querySelectorAll('.practice-card').forEach(c => {
        c.classList.remove('expanded');
    });
    
    // Se não estava expandido, expande
    if (!wasExpanded) {
        card.classList.add('expanded');
        
        // Scroll suave para o card
        setTimeout(() => {
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
}

// ============================================
// SIMULADOR DE IMPACTO
// ============================================
function initSimulator() {
    const areaSlider = document.getElementById('areaSlider');
    const praticasSlider = document.getElementById('praticasSlider');
    const tecSlider = document.getElementById('tecSlider');
    
    if (areaSlider) areaSlider.addEventListener('input', updateSimulator);
    if (praticasSlider) praticasSlider.addEventListener('input', updateSimulator);
    if (tecSlider) tecSlider.addEventListener('input', updateSimulator);
    
    // Inicializa com valores padrão
    updateSimulator();
}

function updateSimulator() {
    const area = parseInt(document.getElementById('areaSlider').value) || 100;
    const praticas = parseInt(document.getElementById('praticasSlider').value) || 50;
    const tec = parseInt(document.getElementById('tecSlider').value) || 60;
    
    // Atualiza labels
    document.getElementById('areaValue').textContent = area;
    document.getElementById('praticasValue').textContent = praticas + '%';
    document.getElementById('tecValue').textContent = tec + '%';
    
    // Calcula índice de sustentabilidade
    const score = Math.round((praticas * 0.4 + tec * 0.35 + Math.min(area / 10, 25) * 0.25));
    document.getElementById('impactScore').textContent = score;
    
    // Calcula economia de água
    const aguaEconomia = (area * praticas * tec * 0.5).toLocaleString('pt-BR');
    document.getElementById('aguaEconomia').textContent = aguaEconomia;
    
    // Calcula redução de carbono
    const carbonoReducao = (area * praticas * tec * 0.0025).toFixed(1);
    document.getElementById('carbonoReducao').textContent = carbonoReducao;
    
    // Calcula economia financeira
    const economia = (area * praticas * tec * 0.5).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
    document.getElementById('economyValue').textContent = economia + '/ano';
    
    // Adiciona classe de animação
    const resultBox = document.querySelector('.result-score');
    if (resultBox) {
        resultBox.style.transform = 'scale(1.1)';
        setTimeout(() => {
            resultBox.style.transform = 'scale(1)';
        }, 200);
    }
}

// ============================================
// QUIZ INTERATIVO
// ============================================
const quizData = [
    {
        question: 'Qual é o principal benefício do plantio direto?',
        options: [
            'Aumentar o uso de agrotóxicos',
            'Reduzir a erosão do solo em até 90%',
            'Aumentar o desmatamento',
            'Diminuir a produtividade das culturas'
        ],
        correct: 1,
        hint: 'Pense na proteção que a cobertura do solo oferece contra a chuva e o vento...',
        explanation: 'O plantio direto mantém a palhada no solo, reduzindo drasticamente a erosão e preservando os nutrientes.'
    },
    {
        question: 'Quanto de água a irrigação inteligente pode economizar?',
        options: [
            'Até 10%',
            'Até 30%',
            'Até 60%',
            'Até 90%'
        ],
        correct: 2,
        hint: 'É mais da metade, mas não chega a eliminar completamente o consumo...',
        explanation: 'Sistemas de irrigação inteligente com sensores podem economizar até 60% de água comparado a métodos tradicionais.'
    },
    {
        question: 'O que é controle biológico de pragas?',
        options: [
            'Uso intensivo de agrotóxicos',
            'Uso de predadores naturais das pragas',
            'Queima controlada de plantações',
            'Modificação genética de plantas'
        ],
        correct: 1,
        hint: 'Envolve o uso de organismos vivos benéficos para a agricultura...',
        explanation: 'O controle biológico utiliza insetos benéficos como joaninhas para controlar pragas naturalmente.'
    },
    {
        question: 'Qual tipo de energia é gerada por biodigestores em propriedades rurais?',
        options: [
            'Energia nuclear',
            'Energia solar',
            'Biogás',
            'Energia eólica'
        ],
        correct: 2,
        hint: 'É produzido a partir da decomposição de resíduos orgânicos...',
        explanation: 'Biodigestores transformam resíduos orgânicos em biogás, uma fonte de energia limpa e renovável.'
    },
    {
        question: 'Qual prática ajuda a preservar os polinizadores?',
        options: [
            'Uso intensivo de pesticidas',
            'Manutenção de áreas naturais e diversidade de plantas',
            'Monocultura extensiva',
            'Queimadas controladas'
        ],
        correct: 1,
        hint: 'Polinizadores como abelhas precisam de ambientes diversificados...',
        explanation: 'Manter áreas naturais e diversidade de plantas é essencial para a sobrevivência dos polinizadores.'
    }
];

let currentQuestion = 0;
let quizScore = 0;
let answered = false;

function initQuiz() {
    // Event listeners dos botões do quiz
    const nextBtn = document.getElementById('nextBtn');
    const hintBtn = document.getElementById('hintBtn');
    
    if (nextBtn) nextBtn.addEventListener('click', nextQuestion);
    if (hintBtn) hintBtn.addEventListener('click', showHint);
    
    // Carrega primeira pergunta
    loadQuestion();
}

function loadQuestion() {
    if (currentQuestion >= quizData.length) {
        showQuizResults();
        return;
    }
    
    answered = false;
    const quiz = quizData[currentQuestion];
    
    // Atualiza progresso
    document.getElementById('currentQuestionNum').textContent = currentQuestion + 1;
    document.getElementById('totalQuestions').textContent = quizData.length;
    document.getElementById('scoreDisplay').textContent = quizScore;
    
    // Barra de progresso
    const progress = (currentQuestion / quizData.length) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    
    // Atualiza pergunta
    document.getElementById('questionBadge').textContent = `Pergunta ${currentQuestion + 1}`;
    document.getElementById('questionText').textContent = quiz.question;
    
    // Gera cards de opções
    const optionsGrid = document.getElementById('optionsGrid');
    const letters = ['A', 'B', 'C', 'D'];
    
    optionsGrid.innerHTML = quiz.options.map((option, index) => `
        <div class="quiz-option-card" onclick="selectQuizAnswer(${index})" id="optionCard${index}">
            <div class="option-letter">${letters[index]}</div>
            <div class="option-text">${option}</div>
        </div>
    `).join('');
    
    // Reseta feedback
    const feedbackBox = document.getElementById('feedbackBox');
    feedbackBox.className = 'quiz-feedback-box';
    feedbackBox.textContent = '';
    
    // Reseta botões
    document.getElementById('nextBtn').disabled = true;
    document.getElementById('hintBtn').disabled = false;
}

function selectQuizAnswer(selectedIndex) {
    if (answered) return;
    
    answered = true;
    const quiz = quizData[currentQuestion];
    const cards = document.querySelectorAll('.quiz-option-card');
    
    // Desabilita todos os cards
    cards.forEach(card => card.classList.add('disabled'));
    
    // Marca o selecionado
    cards[selectedIndex].classList.add('selected');
    
    const feedbackBox = document.getElementById('feedbackBox');
    
    if (selectedIndex === quiz.correct) {
        // Resposta correta
        cards[selectedIndex].classList.add('correct');
        feedbackBox.textContent = '✅ Correto! ' + quiz.explanation;
        feedbackBox.className = 'quiz-feedback-box correct show';
        quizScore++;
        document.getElementById('scoreDisplay').textContent = quizScore;
        
        // Efeito sonoro visual
        pulseElement(cards[selectedIndex]);
    } else {
        // Resposta errada
        cards[selectedIndex].classList.add('wrong');
        cards[quiz.correct].classList.add('correct');
        feedbackBox.textContent = '❌ Incorreto! ' + quiz.explanation;
        feedbackBox.className = 'quiz-feedback-box wrong show';
        
        // Efeito de shake
        shakeElement(cards[selectedIndex]);
    }
    
    // Habilita botão próximo
    document.getElementById('nextBtn').disabled = false;
    document.getElementById('hintBtn').disabled = true;
}

function nextQuestion() {
    if (!answered && currentQuestion < quizData.length) {
        showToast('Selecione uma resposta primeiro!', 'warning');
        return;
    }
    
    currentQuestion++;
    
    if (currentQuestion < quizData.length) {
        loadQuestion();
        // Scroll suave para o topo do quiz
        document.getElementById('quizWrapper').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        showQuizResults();
    }
}

function showHint() {
    if (answered) return;
    
    const quiz = quizData[currentQuestion];
    const feedbackBox = document.getElementById('feedbackBox');
    
    feedbackBox.textContent = '💡 Dica: ' + quiz.hint;
    feedbackBox.className = 'quiz-feedback-box hint show';
    
    // Esconde a dica após 4 segundos
    setTimeout(() => {
        if (!answered) {
            feedbackBox.className = 'quiz-feedback-box';
            feedbackBox.textContent = '';
        }
    }, 4000);
}

function showQuizResults() {
    const quizWrapper = document.getElementById('quizWrapper');
    const percentage = Math.round((quizScore / quizData.length) * 100);
    
    let icon, title, message, emoji;
    
    if (percentage === 100) {
        icon = '🏆';
        title = 'Excelente!';
        message = 'Você é um especialista em agricultura sustentável!';
        emoji = '🌟';
    } else if (percentage >= 80) {
        icon = '🎉';
        title = 'Muito Bom!';
        message = 'Você tem ótimos conhecimentos sobre sustentabilidade!';
        emoji = '👏';
    } else if (percentage >= 60) {
        icon = '👍';
        title = 'Bom Trabalho!';
        message = 'Você está no caminho certo. Continue aprendendo!';
        emoji = '📚';
    } else if (percentage >= 40) {
        icon = '📖';
        title = 'Continue Estudando!';
        message = 'Há muito para aprender sobre práticas sustentáveis.';
        emoji = '💪';
    } else {
        icon = '🌱';
        title = 'Hora de Aprender!';
        message = 'Cada conhecimento adquirido faz diferença para o futuro!';
        emoji = '🌍';
    }
    
    quizWrapper.innerHTML = `
        <div class="quiz-header-bar">
            <h2>${icon} Quiz Concluído!</h2>
            <p>${title}</p>
        </div>
        <div class="quiz-body">
            <div class="quiz-final-result">
                <div class="quiz-final-icon">${emoji}</div>
                <div class="quiz-final-score">${quizScore}/${quizData.length}</div>
                <div class="quiz-final-message">${message}</div>
                
                <div class="quiz-final-stats">
                    <div class="quiz-final-stat">
                        <div class="value">${percentage}%</div>
                        <div class="label">Aproveitamento</div>
                    </div>
                    <div class="quiz-final-stat">
                        <div class="value">${quizScore}</div>
                        <div class="label">Acertos</div>
                    </div>
                    <div class="quiz-final-stat">
                        <div class="value">${quizData.length - quizScore}</div>
                        <div class="label">Erros</div>
                    </div>
                </div>
                
                <button class="btn btn-accent" onclick="resetQuiz()" style="margin-right: 10px;">
                    🔄 Tentar Novamente
                </button>
                <button class="btn btn-outline" onclick="scrollToSection('praticas')" style="border-color: var(--primary); color: var(--primary);">
                    📚 Estudar Mais
                </button>
            </div>
        </div>
    `;
    
    // Scroll para o resultado
    quizWrapper.scrollIntoView({ behavior: 'smooth' });
    
    // Confete para notas altas
    if (percentage >= 80) {
        createConfetti();
    }
}

function resetQuiz() {
    currentQuestion = 0;
    quizScore = 0;
    answered = false;
    
    // Recria a estrutura do quiz
    const quizWrapper = document.getElementById('quizWrapper');
    quizWrapper.innerHTML = `
        <div class="quiz-header-bar">
            <h2>🧠 Agricultura Sustentável</h2>
            <p>Clique nos cards para responder cada pergunta</p>
        </div>
        <div class="quiz-body">
            <div class="quiz-progress-wrapper">
                <div class="quiz-progress-info">
                    <span>Pergunta <strong id="currentQuestionNum">1</strong> de <strong id="totalQuestions">5</strong></span>
                    <span>Acertos: <strong id="scoreDisplay">0</strong></span>
                </div>
                <div class="quiz-progress-bar-outer">
                    <div class="quiz-progress-bar-inner" id="progressBar"></div>
                </div>
            </div>
            
            <div class="quiz-question-card">
                <span class="quiz-question-number" id="questionBadge">Pergunta 1</span>
                <p class="quiz-question-text" id="questionText">Carregando pergunta...</p>
            </div>
            
            <div class="quiz-options-grid" id="optionsGrid"></div>
            
            <div class="quiz-feedback-box" id="feedbackBox"></div>
            
            <div class="quiz-actions">
                <button class="btn btn-outline btn-sm" id="hintBtn">💡 Dica</button>
                <button class="btn btn-accent" id="nextBtn" disabled>Próxima Pergunta ➡️</button>
            </div>
        </div>
    `;
    
    // Re-inicializa os event listeners
    document.getElementById('nextBtn').addEventListener('click', nextQuestion);
    document.getElementById('hintBtn').addEventListener('click', showHint);
    
    // Carrega a primeira pergunta
    loadQuestion();
    quizWrapper.scrollIntoView({ behavior: 'smooth' });
}

// ============================================
// CONTADORES ANIMADOS
// ============================================
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    // Usa Intersection Observer para animar quando visível
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(counter, target) {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    let step = 0;
    
    const timer = setInterval(() => {
        step++;
        current += increment;
        
        if (step >= steps) {
            clearInterval(timer);
            current = target;
        }
        
        counter.textContent = Math.round(current);
        
        // Adiciona formatação para números grandes
        if (target >= 1000) {
            counter.textContent = Math.round(current).toLocaleString('pt-BR');
        }
    }, duration / steps);
}

function animateStatCard(card) {
    // Efeito visual ao clicar no card de estatística
    card.style.transform = 'scale(0.95)';
    setTimeout(() => {
        card.style.transform = 'scale(1)';
    }, 150);
    
    // Reanima o contador
    const counter = card.querySelector('.counter');
    if (counter) {
        const target = parseInt(counter.getAttribute('data-target'));
        counter.textContent = '0';
        animateCounter(counter, target);
    }
    
    // Muda a tendência aleatoriamente
    const trend = card.querySelector('.stat-trend');
    if (trend) {
        const trends = ['↑ 12%', '↑ 15%', '↑ 18%', '↑ 22%', '→ Estável'];
        const randomTrend = trends[Math.floor(Math.random() * trends.length)];
        trend.textContent = randomTrend;
    }
    
    showToast('Estatística atualizada! 📊', 'success');
}

// ============================================
// MODAL
// ============================================
function initModal() {
    const modal = document.getElementById('modalOverlay');
    const closeBtn = document.getElementById('modalClose');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Fecha ao clicar fora
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    // Fecha com tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function openModal(practice) {
    const modalData = {
        rotacao: {
            icon: '🔄',
            title: 'Rotação de Culturas',
            description: 'A rotação de culturas é uma técnica milenar que consiste em alternar diferentes espécies vegetais numa mesma área agrícola ao longo do tempo. Esta prática é fundamental para a agricultura sustentável.',
            benefits: [
                'Reduz pragas e doenças em até 40%',
                'Melhora a estrutura e fertilidade do solo',
                'Aumenta a produtividade em até 25%',
                'Reduz a necessidade de fertilizantes químicos',
                'Promove a biodiversidade do solo'
            ]
        },
        plantio: {
            icon: '🌾',
            title: 'Plantio Direto',
            description: 'O plantio direto é um sistema de cultivo que mantém a cobertura do solo (palhada) protegendo-o contra erosão. É uma das práticas mais importantes para a conservação do solo.',
            benefits: [
                'Reduz a erosão do solo em até 90%',
                'Aumenta a infiltração de água em 50%',
                'Sequestra carbono atmosférico',
                'Preserva a umidade do solo por mais tempo',
                'Reduz custos com preparo do solo'
            ]
        },
        irrigacao: {
            icon: '💧',
            title: 'Irrigação Inteligente',
            description: 'Sistemas de irrigação inteligente utilizam tecnologia como sensores de umidade, estações meteorológicas e automação para aplicar água apenas quando e onde necessário.',
            benefits: [
                'Economiza até 60% de água',
                'Reduz custos operacionais significativamente',
                'Aumenta a eficiência da irrigação',
                'Monitoramento em tempo real das condições',
                'Evita desperdícios e encharcamento'
            ]
        },
        biologico: {
            icon: '🐞',
            title: 'Controle Biológico',
            description: 'O controle biológico é um método natural de manejo de pragas que utiliza organismos vivos (predadores, parasitoides e patógenos) para controlar populações de pragas.',
            benefits: [
                'Elimina a necessidade de agrotóxicos',
                'Preserva a biodiversidade local',
                'Produz alimentos mais saudáveis',
                'Sem resíduos químicos nos alimentos',
                'Custo-benefício favorável a longo prazo'
            ]
        },
        integracao: {
            icon: '🐄',
            title: 'Integração Lavoura-Pecuária',
            description: 'Sistema que integra agricultura e pecuária na mesma área, alternando ou consorciando culturas agrícolas com pastagens e animais.',
            benefits: [
                'Recupera pastagens degradadas',
                'Melhora a fertilidade do solo naturalmente',
                'Aumenta a renda do produtor em até 30%',
                'Uso mais eficiente dos recursos naturais',
                'Reduz a pressão por desmatamento'
            ]
        },
        energia: {
            icon: '☀️',
            title: 'Energia Renovável no Campo',
            description: 'A adoção de fontes de energia limpa como painéis solares e biodigestores nas propriedades rurais reduz custos e a pegada de carbono.',
            benefits: [
                'Reduz custos de energia em até 40%',
                'Torna a propriedade energeticamente independente',
                'Baixa emissão de carbono',
                'Aproveitamento de resíduos para biogás',
                'Retorno do investimento em 3-5 anos'
            ]
        }
    };
    
    const data = modalData[practice];
    if (!data) return;
    
    document.getElementById('modalIcon').textContent = data.icon;
    document.getElementById('modalTitle').textContent = data.title;
    document.getElementById('modalDescription').textContent = data.description;
    
    const benefitsList = document.getElementById('modalBenefitsList');
    benefitsList.innerHTML = data.benefits.map(benefit => `<li>${benefit}</li>`).join('');
    
    document.getElementById('modalOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
    document.body.style.overflow = '';
}

// ============================================
// TOAST / NOTIFICAÇÕES
// ============================================
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    
    // Configura cores baseado no tipo
    const colors = {
        success: '#2d5a27',
        warning: '#f4a261',
        error: '#f44336',
        info: '#2196F3'
    };
    
    toast.textContent = message;
    toast.style.background = colors[type] || colors.success;
    toast.style.display = 'block';
    
    // Remove toast existente
    clearTimeout(toast.timeout);
    
    // Animação de entrada
    toast.style.animation = 'none';
    toast.offsetHeight; // Trigger reflow
    toast.style.animation = 'slideInRight 0.4s ease';
    
    // Esconde após 3 segundos
    toast.timeout = setTimeout(() => {
        toast.style.animation = 'fadeOut 0.4s ease forwards';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 400);
    }, 3000);
}

// ============================================
// EFEITOS VISUAIS
// ============================================
function pulseElement(element) {
    element.style.transform = 'scale(1.05)';
    setTimeout(() => {
        element.style.transform = 'scale(1)';
    }, 300);
}

function shakeElement(element) {
    element.style.animation = 'none';
    element.offsetHeight;
    element.style.animation = 'wrongShake 0.6s ease';
}

function createConfetti() {
    const colors = ['#f4a261', '#4caf50', '#2196F3', '#ff9800', '#9C27B0', '#00BCD4'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                top: -20px;
                left: ${Math.random() * 100}%;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                z-index: 9999;
                pointer-events: none;
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
                animation-delay: ${Math.random() * 0.5}s;
            `;
            
            document.body.appendChild(confetti);
            
            // Remove após animação
            setTimeout(() => {
                confetti.remove();
            }, 4000);
        }, i * 30);
    }
    
    // Adiciona keyframes dinamicamente se não existirem
    if (!document.getElementById('confetti-style')) {
        const style = document.createElement('style');
        style.id = 'confetti-style';
        style.textContent = `
            @keyframes confettiFall {
                0% {
                    transform: translateY(-20px) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ============================================
// TECLADO - ATALHOS
// ============================================
document.addEventListener('keydown', function(e) {
    // Tecla 'Q' para ir para o Quiz
    if (e.key === 'q' || e.key === 'Q') {
        if (!e.ctrlKey && !e.altKey && !e.metaKey && document.activeElement === document.body) {
            scrollToSection('quiz-section');
            showToast('Atalho: Indo para o Quiz! 🧠', 'info');
        }
    }
    
    // Tecla 'S' para o Simulador
    if (e.key === 's' || e.key === 'S') {
        if (!e.ctrlKey && !e.altKey && !e.metaKey && document.activeElement === document.body) {
            scrollToSection('simulador-section');
            showToast('Atalho: Indo para o Simulador! 🧮', 'info');
        }
    }
    
    // Tecla 'P' para Práticas
    if (e.key === 'p' || e.key === 'P') {
        if (!e.ctrlKey && !e.altKey && !e.metaKey && document.activeElement === document.body) {
            scrollToSection('praticas');
            showToast('Atalho: Indo para Práticas! 🌿', 'info');
        }
    }
});

// ============================================
// LOG NO CONSOLE
// ============================================
console.log('🌱 Agro Forte - Futuro Sustentável');
console.log('✅ Site carregado com sucesso!');
console.log('💡 Dica: Use as teclas Q, S e P para navegar rapidamente!');
console.log('📊 Experimente o simulador e o quiz interativo!');

// ============================================
// EXPORTAÇÃO PARA USO GLOBAL
// ============================================
// Torna funções disponíveis globalmente para onclick no HTML
window.scrollToSection = scrollToSection;
window.toggleCard = toggleCard;
window.selectQuizAnswer = selectQuizAnswer;
window.nextQuestion = nextQuestion;
window.showHint = showHint;
window.resetQuiz = resetQuiz;
window.openModal = openModal;
window.closeModal = closeModal;
window.animateStatCard = animateStatCard;
