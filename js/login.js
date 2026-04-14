// Formulário de Login Corporativo JavaScript
class CorporateLoginForm {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.passwordToggle = document.getElementById('passwordToggle');
        this.submitButton = this.form.querySelector('.login-btn');
        this.successMessage = document.getElementById('successMessage');
        this.ssoButtons = document.querySelectorAll('.sso-btn');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupPasswordToggle();
        this.setupSSOButtons();
    }
    
    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.emailInput.addEventListener('blur', () => this.validateEmail());
        this.passwordInput.addEventListener('blur', () => this.validatePassword());
        this.emailInput.addEventListener('input', () => this.clearError('email'));
        this.passwordInput.addEventListener('input', () => this.clearError('password'));
    }
    
    setupPasswordToggle() {
        this.passwordToggle.addEventListener('click', () => {
            const type = this.passwordInput.type === 'password' ? 'text' : 'password';
            this.passwordInput.type = type;
            
            const icon = this.passwordToggle.querySelector('.toggle-icon');
            icon.classList.toggle('show-password', type === 'text');
        });
    }
    
    setupSSOButtons() {
        this.ssoButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const provider = button.classList.contains('google-btn') ? 'Google' : 'Apple';
                this.handleSSOLogin(provider);
            });
        });
    }
    
    validateEmail() {
        const email = this.emailInput.value.trim();
        const businessEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            this.showError('email', 'O email corporativo é obrigatório');
            return false;
        }
        
        if (!businessEmailRegex.test(email)) {
            this.showError('email', 'Por favor, insira um email corporativo válido');
            return false;
        }
        
        this.clearError('email');
        return true;
    }
    
    validatePassword() {
        const password = this.passwordInput.value;
        
        if (!password) {
            this.showError('password', 'A senha é obrigatória');
            return false;
        }
        
        if (password.length < 8) {
            this.showError('password', 'A senha deve ter pelo menos 8 caracteres');
            return false;
        }
        
        // Verificação de segurança da senha corporativa
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
            this.showError('password', 'A senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais');
            return false;
        }
        
        this.clearError('password');
        return true;
    }
    
    showError(field, message) {
        const formGroup = document.getElementById(field).closest('.form-group');
        const errorElement = document.getElementById(`${field}Error`);
        
        formGroup.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    
    clearError(field) {
        const formGroup = document.getElementById(field).closest('.form-group');
        const errorElement = document.getElementById(`${field}Error`);
        
        formGroup.classList.remove('error');
        errorElement.classList.remove('show');
        setTimeout(() => {
            errorElement.textContent = '';
        }, 300);
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const isEmailValid = this.validateEmail();
        const isPasswordValid = this.validatePassword();
        
        if (!isEmailValid || !isPasswordValid) {
            return;
        }
        
        this.setLoading(true);
        
        try {
            // Simular autenticação corporativa com verificação MFA
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const email = this.emailInput.value.trim().toLowerCase();
            const password = this.passwordInput.value;
            let doctorName = "";

            // Lógica de verificação para permitir apenas 2 acessos específicos
            if (email === "carlos.silva@clinica.com" && password === "Senha@123") {
                doctorName = "Dr. Carlos Silva";
            } else if (email === "ana.costa@clinica.com" && password === "Senha@123") {
                doctorName = "Dra. Ana Costa";
            } else {
                // Rejeita qualquer outro acesso gerando um erro
                throw new Error("Credenciais inválidas");
            }
            
            // Mostra estado de sucesso e passa o nome
            this.showSuccess(doctorName);
        } catch (error) {
            this.showError('password', 'Falha na autenticação. E-mail ou senha incorretos.');
        } finally {
            this.setLoading(false);
        }
    }
    
    async handleSSOLogin(provider) {
        console.log(`Initiating SSO login with ${provider}...`);
        
        // Simular redirecionamento SSO
        const ssoButton = document.querySelector(`.${provider.toLowerCase().replace(' ', '-')}-btn`);
        ssoButton.style.opacity = '0.6';
        ssoButton.style.pointerEvents = 'none';
        
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log(`Redirecting to ${provider} authentication...`);
            // window.location.href = `/auth/${provider.toLowerCase()}`;
        } catch (error) {
            console.error(`SSO authentication failed: ${error.message}`);
        } finally {
            ssoButton.style.opacity = '1';
            ssoButton.style.pointerEvents = 'auto';
        }
    }
    
    setLoading(loading) {
        this.submitButton.classList.toggle('loading', loading);
        this.submitButton.disabled = loading;
        
        // Desabilitar botões SSO durante o login
        this.ssoButtons.forEach(button => {
            button.style.pointerEvents = loading ? 'none' : 'auto';
            button.style.opacity = loading ? '0.6' : '1';
        });
    }
    
    showSuccess(doctorName) {
        this.form.style.display = 'none';
        document.querySelector('.sso-options').style.display = 'none';
        document.querySelector('.footer-links').style.display = 'none';
        this.successMessage.style.display = 'flex';
        this.successMessage.classList.add('show');
        
        // Simular redirecionamento após 1.5 segundos
        setTimeout(() => {
            // salva sessão
            localStorage.setItem("usuarioLogado", "true");

            // salva o nome do médico
            if (doctorName) {
                localStorage.setItem("doctorName", doctorName);
            }

            // redireciona para o dashboard
            window.location.href = "index.html";
        }, 1500);
    }
}

// Inicializar o formulário quando o DOM for carregado
document.addEventListener('DOMContentLoaded', () => {
    new CorporateLoginForm();
});