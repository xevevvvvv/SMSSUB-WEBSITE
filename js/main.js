// Main JavaScript for SMS Subscription Site

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function () {
    // Handle navigation links
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Handle package selection
    window.selectPackage = function (amount, packageName) {
        // Store selected package in sessionStorage
        sessionStorage.setItem('selectedPackage', JSON.stringify({
            amount: amount,
            name: packageName,
            credits: amount // $1 = 1 credit
        }));

        // Redirect to login page
        window.location.href = 'login.html';
    };

    // FAQ accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        // Initially hide all answers
        answer.style.display = 'none';

        question.addEventListener('click', function () {
            // Toggle current answer
            if (answer.style.display === 'none') {
                answer.style.display = 'block';
                question.style.fontWeight = 'bold';
            } else {
                answer.style.display = 'none';
                question.style.fontWeight = 'normal';
            }
        });
    });

    // Add animation to pricing cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe pricing cards
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Add hover effects to CTA button
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });

        ctaButton.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    }
});

// Interactive Demo Logic
window.runDemo = function () {
    const phoneInput = document.getElementById('demoPhone');
    const demoBtn = document.getElementById('demoBtn');
    const demoStatus = document.getElementById('demoStatus');
    const demoMessage = document.getElementById('demoMessage');
    const demoNotification = document.getElementById('demoNotification');
    const demoPhoneDisplay = document.getElementById('demoPhoneDisplay');

    // Validate input
    let phoneNumber = phoneInput.value.trim();
    if (!phoneNumber) {
        phoneNumber = '(555) 123-4567';
        phoneInput.value = phoneNumber;
    }

    // Update button state
    const originalText = demoBtn.textContent;
    demoBtn.textContent = 'Sending...';
    demoBtn.disabled = true;

    // Reset animations
    demoMessage.style.opacity = '0';
    demoMessage.style.transform = 'translateY(100px)';
    demoNotification.style.opacity = '0';
    demoNotification.style.transform = 'translateX(-50%) translateY(-20px)';

    // Simulate network delay
    setTimeout(() => {
        // 1. Message Delivered Animation
        demoBtn.textContent = 'Sent!';
        demoBtn.style.background = '#00ff88';
        demoBtn.style.color = '#0f1014';

        demoPhoneDisplay.textContent = phoneNumber;
        demoMessage.style.opacity = '1';
        demoMessage.style.transform = 'translateY(0)';

        // 2. Notification Popup
        setTimeout(() => {
            demoNotification.style.opacity = '1';
            demoNotification.style.transform = 'translateX(-50%) translateY(0)';

            // Play sound (optional, browser policy might block)
            // const audio = new Audio('assets/notification.mp3');
            // audio.play().catch(e => console.log('Audio blocked'));

            // 3. Reset UI after delay
            setTimeout(() => {
                demoBtn.textContent = originalText;
                demoBtn.disabled = false;
                demoBtn.style.background = '';
                demoBtn.style.color = '';

                demoStatus.textContent = 'Demo completed! Try another number.';
                demoStatus.style.opacity = '1';

                setTimeout(() => {
                    demoNotification.style.opacity = '0';
                    demoNotification.style.transform = 'translateX(-50%) translateY(-20px)';
                    demoStatus.style.opacity = '0';
                }, 3000);
            }, 2000);
        }, 500);
    }, 800);
};

// Utility functions
function showSignup() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
}

function showLogin() {
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

// Handle form submissions
function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const loginBtn = document.getElementById('loginBtn');
    const buttonText = loginBtn.querySelector('.button-text');
    const buttonLoading = loginBtn.querySelector('.button-loading');

    // Show loading state
    buttonText.style.display = 'none';
    buttonLoading.style.display = 'inline';
    loginBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Check if email exists in main app's local storage
        // This would be replaced with actual API call
        const userExists = checkUserExists(email);

        if (userExists) {
            // Store user email and redirect to dashboard
            sessionStorage.setItem('userEmail', email);
            window.location.href = 'dashboard.html';
        } else {
            // Show error
            showError('emailError', 'Email not found. Please use the same email from your Ticketmaster app.');
            buttonText.style.display = 'inline';
            buttonLoading.style.display = 'none';
            loginBtn.disabled = false;
        }
    }, 1500);
}

function handleSignup(event) {
    event.preventDefault();

    const email = document.getElementById('signupEmail').value;
    const confirmEmail = document.getElementById('confirmEmail').value;
    const signupBtn = document.getElementById('signupBtn');
    const buttonText = signupBtn.querySelector('.button-text');
    const buttonLoading = signupBtn.querySelector('.button-loading');

    // Validate emails match
    if (email !== confirmEmail) {
        showError('confirmEmailError', 'Emails do not match');
        return;
    }

    // Show loading state
    buttonText.style.display = 'none';
    buttonLoading.style.display = 'inline';
    signupBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Create new user account
        createUserAccount(email);

        // Store user email and redirect to dashboard
        sessionStorage.setItem('userEmail', email);
        window.location.href = 'dashboard.html';
    }, 1500);
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';

    // Hide error after 5 seconds
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 5000);
}

// Mock functions - these would be replaced with actual API calls
function checkUserExists(email) {
    // In a real implementation, this would check against the main app's user database
    // For now, we'll simulate by checking if email contains '@'
    return email.includes('@');
}

function createUserAccount(email) {
    // In a real implementation, this would create a new user account
    console.log('Creating account for:', email);
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
});
