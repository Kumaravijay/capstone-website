// Vehicle Insurance Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeNavigation();
    initializeQuoteCalculator();
    initializeFAQ();
    initializeContactForm();
    initializeScrollToTop();
    populateYearDropdown();
});

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav__link');
    const getQuoteButtons = document.querySelectorAll('#getQuoteBtn, #heroQuoteBtn');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Get quote button functionality
    getQuoteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const quoteSection = document.querySelector('#quote-calculator');
            if (quoteSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = quoteSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Quote Calculator functionality
function initializeQuoteCalculator() {
    const steps = document.querySelectorAll('.step');
    const formSteps = document.querySelectorAll('.form-step');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    const calculateButton = document.querySelector('.calculate-quote');
    
    let currentStep = 1;
    
    // Step click functionality
    steps.forEach((step, index) => {
        step.addEventListener('click', function() {
            const targetStep = index + 1;
            if (targetStep <= currentStep + 1) { // Only allow going to next step or previous steps
                goToStep(targetStep);
            }
        });
    });
    
    // Next step functionality
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (validateCurrentStep(currentStep)) {
                goToStep(currentStep + 1);
            }
        });
    });
    
    // Previous step functionality
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            goToStep(currentStep - 1);
        });
    });
    
    // Calculate quote functionality
    if (calculateButton) {
        calculateButton.addEventListener('click', function() {
            if (validateCurrentStep(currentStep)) {
                // Show loading
                this.innerHTML = '<span class="loading"></span> Calculating...';
                this.disabled = true;
                
                // Simulate calculation delay
                setTimeout(() => {
                    calculatePremium();
                    goToStep(4);
                    this.innerHTML = 'Calculate Premium';
                    this.disabled = false;
                }, 1500);
            }
        });
    }
    
    function goToStep(stepNumber) {
        if (stepNumber < 1 || stepNumber > 4) return;
        
        // Update current step
        currentStep = stepNumber;
        
        // Update step indicators
        steps.forEach((step, index) => {
            const stepNum = index + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNum === currentStep) {
                step.classList.add('active');
            } else if (stepNum < currentStep) {
                step.classList.add('completed');
            }
        });
        
        // Update form steps
        formSteps.forEach((step, index) => {
            const stepNum = index + 1;
            step.classList.remove('active');
            
            if (stepNum === currentStep) {
                step.classList.add('active');
            }
        });
    }
    
    function validateCurrentStep(step) {
        const currentFormStep = document.querySelector(`.form-step[data-step="${step}"]`);
        if (!currentFormStep) return true;
        
        const requiredFields = currentFormStep.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = 'var(--color-error)';
                isValid = false;
            } else {
                field.style.borderColor = 'var(--color-border)';
            }
        });
        
        if (!isValid) {
            alert('Please fill in all required fields before proceeding.');
        }
        
        return isValid;
    }
    
    function calculatePremium() {
        // Get form data
        const formData = {
            vehicleMake: document.getElementById('vehicleMake').value,
            vehicleModel: document.getElementById('vehicleModel').value,
            vehicleYear: parseInt(document.getElementById('vehicleYear').value),
            vehicleValue: parseFloat(document.getElementById('vehicleValue').value),
            driverAge: parseInt(document.getElementById('driverAge').value),
            drivingExperience: parseInt(document.getElementById('drivingExperience').value),
            location: document.getElementById('location').value,
            annualMileage: document.getElementById('annualMileage').value,
            coverageType: document.getElementById('coverageType').value,
            deductible: parseInt(document.getElementById('deductible').value),
            previousClaims: parseInt(document.getElementById('previousClaims').value)
        };
        
        // ML-style premium calculation
        const premium = calculateMLPremium(formData);
        const riskAssessment = calculateRiskAssessment(formData);
        
        // Display results
        displayResults(premium, riskAssessment);
    }
    
    function calculateMLPremium(data) {
        // Base premium calculation (simplified ML algorithm)
        let basePremium = 500;
        
        // Vehicle factors
        const vehicleAge = new Date().getFullYear() - data.vehicleYear;
        const vehicleValueFactor = Math.min(data.vehicleValue / 20000, 3);
        
        // Apply vehicle factors
        basePremium *= vehicleValueFactor;
        basePremium += vehicleAge * 20;
        
        // Driver factors
        const ageFactor = data.driverAge < 25 ? 1.8 : data.driverAge > 65 ? 1.3 : 1.0;
        const experienceFactor = data.drivingExperience < 5 ? 1.4 : 1.0;
        
        basePremium *= ageFactor;
        basePremium *= experienceFactor;
        
        // Location factors
        const locationMultiplier = {
            'urban': 1.3,
            'suburban': 1.0,
            'rural': 0.8
        };
        basePremium *= locationMultiplier[data.location] || 1.0;
        
        // Mileage factors
        const mileageMultiplier = {
            'low': 0.9,
            'medium': 1.0,
            'high': 1.2
        };
        basePremium *= mileageMultiplier[data.annualMileage] || 1.0;
        
        // Coverage factors
        const coverageMultiplier = {
            'comprehensive': 1.5,
            'third-party': 1.0,
            'commercial': 2.0
        };
        basePremium *= coverageMultiplier[data.coverageType] || 1.0;
        
        // Deductible factors
        const deductibleDiscount = {
            250: 1.0,
            500: 0.95,
            1000: 0.9,
            2000: 0.85
        };
        basePremium *= deductibleDiscount[data.deductible] || 1.0;
        
        // Claims history
        basePremium *= (1 + data.previousClaims * 0.3);
        
        // Add some randomness to simulate ML uncertainty
        const randomFactor = 0.9 + Math.random() * 0.2;
        basePremium *= randomFactor;
        
        return Math.round(basePremium);
    }
    
    function calculateRiskAssessment(data) {
        const factors = [];
        
        // Age risk
        if (data.driverAge < 25) {
            factors.push({ label: 'Driver Age', value: 'High', level: 'high' });
        } else if (data.driverAge > 65) {
            factors.push({ label: 'Driver Age', value: 'Medium', level: 'medium' });
        } else {
            factors.push({ label: 'Driver Age', value: 'Low', level: 'low' });
        }
        
        // Experience risk
        if (data.drivingExperience < 5) {
            factors.push({ label: 'Driving Experience', value: 'High', level: 'high' });
        } else {
            factors.push({ label: 'Driving Experience', value: 'Low', level: 'low' });
        }
        
        // Location risk
        const locationRisk = {
            'urban': { value: 'High', level: 'high' },
            'suburban': { value: 'Medium', level: 'medium' },
            'rural': { value: 'Low', level: 'low' }
        };
        factors.push({
            label: 'Location Risk',
            value: locationRisk[data.location].value,
            level: locationRisk[data.location].level
        });
        
        // Vehicle age risk
        const vehicleAge = new Date().getFullYear() - data.vehicleYear;
        if (vehicleAge > 10) {
            factors.push({ label: 'Vehicle Age', value: 'High', level: 'high' });
        } else if (vehicleAge > 5) {
            factors.push({ label: 'Vehicle Age', value: 'Medium', level: 'medium' });
        } else {
            factors.push({ label: 'Vehicle Age', value: 'Low', level: 'low' });
        }
        
        // Claims history
        if (data.previousClaims > 1) {
            factors.push({ label: 'Claims History', value: 'High', level: 'high' });
        } else if (data.previousClaims === 1) {
            factors.push({ label: 'Claims History', value: 'Medium', level: 'medium' });
        } else {
            factors.push({ label: 'Claims History', value: 'Low', level: 'low' });
        }
        
        return factors;
    }
    
    function displayResults(premium, riskFactors) {
        const monthlyPremium = Math.round(premium / 12);
        const annualPremium = premium;
        
        // Update premium display
        document.getElementById('monthlyPremium').textContent = `$${monthlyPremium}`;
        document.getElementById('annualPremium').textContent = `$${annualPremium}`;
        
        // Update risk assessment
        const riskFactorsContainer = document.querySelector('.risk-factors');
        riskFactorsContainer.innerHTML = '';
        
        riskFactors.forEach(factor => {
            const factorElement = document.createElement('div');
            factorElement.className = 'risk-factor';
            factorElement.innerHTML = `
                <span class="risk-factor__label">${factor.label}</span>
                <span class="risk-factor__value ${factor.level}">${factor.value}</span>
            `;
            riskFactorsContainer.appendChild(factorElement);
        });
    }
}

// FAQ functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
                const faqAnswer = faqItem.querySelector('.faq-answer');
                faqAnswer.style.maxHeight = '0';
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
}

// Contact form functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            // Show loading state
            submitButton.innerHTML = '<span class="loading"></span> Sending...';
            submitButton.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.style.cssText = `
                    background: rgba(var(--color-success-rgb), 0.1);
                    border: 1px solid var(--color-success);
                    color: var(--color-success);
                    padding: var(--space-16);
                    border-radius: var(--radius-base);
                    margin-bottom: var(--space-16);
                    text-align: center;
                `;
                successMessage.textContent = 'Thank you for your message! We will get back to you soon.';
                
                // Insert success message before the form
                contactForm.parentNode.insertBefore(successMessage, contactForm);
                
                // Reset form and button
                contactForm.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            }, 2000);
        });
    }
}

// Scroll to top functionality
function initializeScrollToTop() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--color-primary);
        color: var(--color-btn-primary-text);
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 20px;
        cursor: pointer;
        display: none;
        z-index: 1000;
        box-shadow: var(--shadow-lg);
        transition: all var(--duration-normal) var(--ease-standard);
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollToTopBtn.style.display = 'block';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });
    
    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effect
    scrollToTopBtn.addEventListener('mouseenter', function() {
        this.style.background = 'var(--color-primary-hover)';
        this.style.transform = 'translateY(-2px)';
    });
    
    scrollToTopBtn.addEventListener('mouseleave', function() {
        this.style.background = 'var(--color-primary)';
        this.style.transform = 'translateY(0)';
    });
}

// Populate year dropdown
function populateYearDropdown() {
    const yearSelect = document.getElementById('vehicleYear');
    if (!yearSelect) return;
    
    const currentYear = new Date().getFullYear();
    
    // Clear existing options except the first one
    yearSelect.innerHTML = '<option value="">Select Year</option>';
    
    for (let year = currentYear; year >= 1990; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
}

// Enhanced mobile navigation
function initializeMobileNav() {
    const headerContent = document.querySelector('.header__content');
    const nav = document.querySelector('.nav');
    
    if (!headerContent || !nav) return;
    
    const navToggle = document.createElement('button');
    navToggle.className = 'nav-toggle';
    navToggle.innerHTML = '☰';
    navToggle.setAttribute('aria-label', 'Toggle navigation');
    
    // Insert toggle button before nav
    headerContent.insertBefore(navToggle, nav);
    
    navToggle.addEventListener('click', function() {
        nav.classList.toggle('nav-open');
        this.innerHTML = nav.classList.contains('nav-open') ? '✕' : '☰';
    });
    
    // Close mobile nav when clicking on a link
    nav.addEventListener('click', function(e) {
        if (e.target.classList.contains('nav__link')) {
            nav.classList.remove('nav-open');
            navToggle.innerHTML = '☰';
        }
    });
}

// Add loading animation styles
const style = document.createElement('style');
style.textContent = `
    .loading {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid var(--color-border);
        border-top: 2px solid var(--color-primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-right: 8px;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .form-control.error {
        border-color: var(--color-error) !important;
        box-shadow: 0 0 0 3px rgba(192, 21, 47, 0.1) !important;
    }
    
    .nav-toggle {
        display: none;
        background: none;
        border: none;
        font-size: 24px;
        color: var(--color-text);
        cursor: pointer;
        padding: var(--space-8);
    }
    
    @media (max-width: 768px) {
        .nav-toggle {
            display: block !important;
        }
        
        .nav {
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: var(--color-surface);
            border-top: 1px solid var(--color-border);
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
            box-shadow: var(--shadow-md);
        }
        
        .nav.nav-open {
            max-height: 300px;
        }
        
        .nav__list {
            flex-direction: column !important;
            padding: var(--space-16);
            gap: var(--space-16) !important;
        }
    }
`;
document.head.appendChild(style);

// Initialize mobile navigation
initializeMobileNav();

// Initialize intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply animation to elements when page loads
setTimeout(() => {
    document.querySelectorAll('.service-card, .feature-card, .testimonial-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}, 100);

// Add real-time form validation
document.addEventListener('input', function(e) {
    if (e.target.classList.contains('form-control')) {
        if (e.target.hasAttribute('required')) {
            if (e.target.value.trim()) {
                e.target.classList.remove('error');
            }
        }
    }
});

// Smooth scrolling for all anchor links
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href') && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
});