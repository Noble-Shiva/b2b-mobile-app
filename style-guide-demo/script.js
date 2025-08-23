// Theme Management
let currentTheme = 'light';

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Update theme toggle icon
    const themeToggle = document.querySelector('.theme-toggle i');
    if (currentTheme === 'dark') {
        themeToggle.className = 'fas fa-sun';
    } else {
        themeToggle.className = 'fas fa-moon';
    }
    
    // Save theme preference
    localStorage.setItem('theme', currentTheme);
}

// Load saved theme on page load
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        currentTheme = savedTheme;
        document.documentElement.setAttribute('data-theme', currentTheme);
        
        const themeToggle = document.querySelector('.theme-toggle i');
        if (currentTheme === 'dark') {
            themeToggle.className = 'fas fa-sun';
        } else {
            themeToggle.className = 'fas fa-moon';
        }
    }
}

// Modal Management
function showModal() {
    const modal = document.getElementById('modal');
    modal.classList.add('show');
    
    // Focus first focusable element in modal
    const firstFocusable = modal.querySelector('button, input, textarea, select');
    if (firstFocusable) {
        firstFocusable.focus();
    }
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function hideModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('show');
    
    // Restore body scroll
    document.body.style.overflow = '';
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        hideModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        hideModal();
    }
});

// Navigation Item Click Handlers
function handleNavClick(element) {
    // Remove active class from all nav items
    const navItems = element.parentElement.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    // Add active class to clicked item
    element.classList.add('active');
    
    // Add ripple effect
    addRippleEffect(element);
}

// Add ripple effect to buttons and nav items
function addRippleEffect(element) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.3)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.left = '50%';
    ripple.style.top = '50%';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.marginLeft = '-10px';
    ripple.style.marginTop = '-10px';
    ripple.style.pointerEvents = 'none';
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Button click handlers
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('btn')) {
        addRippleEffect(event.target);
    }
    
    if (event.target.classList.contains('nav-item') || event.target.parentElement.classList.contains('nav-item')) {
        const navItem = event.target.classList.contains('nav-item') ? event.target : event.target.parentElement;
        handleNavClick(navItem);
    }
});

// Simulate loading states
function simulateLoading() {
    const buttons = document.querySelectorAll('.btn-primary');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.disabled && !this.classList.contains('loading')) {
                this.classList.add('loading');
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                this.disabled = true;
                
                setTimeout(() => {
                    this.classList.remove('loading');
                    this.innerHTML = this.getAttribute('data-original-text') || 'Button';
                    this.disabled = false;
                }, 2000);
            }
        });
        
        // Store original text
        button.setAttribute('data-original-text', button.textContent);
    });
}

// Form validation
function setupFormValidation() {
    const inputs = document.querySelectorAll('.input');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                this.style.borderColor = 'var(--error)';
            } else {
                this.style.borderColor = 'var(--accent)';
            }
        });
        
        input.addEventListener('focus', function() {
            this.style.borderColor = 'var(--primary)';
        });
    });
}

// Smooth scrolling for navigation
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Touch gestures for mobile
function setupTouchGestures() {
    let startY = 0;
    let startX = 0;
    
    document.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
        startX = e.touches[0].clientX;
    });
    
    document.addEventListener('touchmove', function(e) {
        if (!startY || !startX) return;
        
        const currentY = e.touches[0].clientY;
        const currentX = e.touches[0].clientX;
        const diffY = startY - currentY;
        const diffX = startX - currentX;
        
        // Swipe down to close modal
        if (diffY < -50 && Math.abs(diffX) < 100) {
            const modal = document.getElementById('modal');
            if (modal.classList.contains('show')) {
                hideModal();
            }
        }
        
        startY = null;
        startX = null;
    });
}

// Accessibility improvements
function setupAccessibility() {
    // Add ARIA labels and roles
    document.querySelectorAll('.nav-item').forEach(item => {
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        
        // Add keyboard navigation
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Add focus indicators
    document.querySelectorAll('button, input, .nav-item').forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--primary)';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    simulateLoading();
    setupFormValidation();
    setupSmoothScrolling();
    setupTouchGestures();
    setupAccessibility();
    
    // Add some interactive feedback
    console.log('🎨 Style Guide Demo loaded successfully!');
    console.log('💡 Try toggling the theme with the button in the top-right corner');
    console.log('📱 This demo showcases React Native style guide components');
});

// Performance monitoring
function logPerformance() {
    if (performance.mark) {
        performance.mark('style-guide-loaded');
        console.log('⚡ Performance metrics available in DevTools');
    }
}

// Call performance logging after a short delay
setTimeout(logPerformance, 100); 