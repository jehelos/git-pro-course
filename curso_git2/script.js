// Initialize Highlight.js for syntax highlighting
document.addEventListener('DOMContentLoaded', function() {
    hljs.highlightAll();

    // Initialize the page
    initNavigation();
    initProgressBar();
    initScrollSpy();
    initMobileMenu();

    // Show intro section by default
    showSection('intro');
});

// Navigation handling
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();

            // Get section ID from data attribute
            const sectionId = this.getAttribute('data-section');

            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            // Show corresponding section
            showSection(sectionId);

            // Scroll to top smoothly
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            // Update progress
            updateProgress();

            // Close mobile menu if open
            closeMobileMenu();
        });
    });
}

// Show/hide sections
function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section, .hero-section');

    sections.forEach(section => {
        if (section.id === sectionId) {
            section.classList.add('active-section');
            section.style.display = section.classList.contains('hero-section') ? 'flex' : 'block';
        } else {
            section.classList.remove('active-section');
            section.style.display = 'none';
        }
    });
}

// Progress bar
function initProgressBar() {
    updateProgress();
}

function updateProgress() {
    const navItems = document.querySelectorAll('.nav-item');
    const activeItem = document.querySelector('.nav-item.active');

    if (!activeItem) return;

    // Find index of active item
    const activeIndex = Array.from(navItems).indexOf(activeItem);
    const totalLessons = navItems.length;
    const progressPercentage = ((activeIndex + 1) / totalLessons) * 100;

    // Update progress bar
    const progressBar = document.getElementById('progressBar');
    const currentLesson = document.getElementById('currentLesson');

    if (progressBar) {
        progressBar.style.width = progressPercentage + '%';
    }

    if (currentLesson) {
        currentLesson.textContent = activeIndex + 1;
    }
}

// Scroll spy for auto-updating navigation
function initScrollSpy() {
    // Optional: Add scroll spy if needed for manual scrolling
    // Currently using click-based navigation which is cleaner for this use case
}

// Mobile menu handling
function initMobileMenu() {
    // Create mobile menu toggle button
    if (window.innerWidth <= 768) {
        createMobileToggle();
    }

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768 && !document.querySelector('.mobile-toggle')) {
            createMobileToggle();
        } else if (window.innerWidth > 768) {
            const toggle = document.querySelector('.mobile-toggle');
            if (toggle) {
                toggle.remove();
            }
            document.querySelector('.sidebar').classList.remove('mobile-open');
        }
    });
}

function createMobileToggle() {
    const toggle = document.createElement('button');
    toggle.className = 'mobile-toggle';
    toggle.innerHTML = '☰';
    toggle.setAttribute('aria-label', 'Toggle Menu');

    // Styles for mobile toggle
    toggle.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 1000;
        background: var(--git-orange);
        color: white;
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(240, 80, 50, 0.4);
        transition: all 0.3s ease;
    `;

    toggle.addEventListener('click', toggleMobileMenu);
    document.body.appendChild(toggle);

    // Add hover effect
    toggle.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
    });

    toggle.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
}

function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('mobile-open');

    const toggle = document.querySelector('.mobile-toggle');
    if (sidebar.classList.contains('mobile-open')) {
        toggle.innerHTML = '✕';
        // Add overlay
        createOverlay();
    } else {
        toggle.innerHTML = '☰';
        removeOverlay();
    }
}

function closeMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    const toggle = document.querySelector('.mobile-toggle');

    if (sidebar && sidebar.classList.contains('mobile-open')) {
        sidebar.classList.remove('mobile-open');
        if (toggle) {
            toggle.innerHTML = '☰';
        }
        removeOverlay();
    }
}

function createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'mobile-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 99;
        backdrop-filter: blur(4px);
    `;

    overlay.addEventListener('click', closeMobileMenu);
    document.body.appendChild(overlay);
}

function removeOverlay() {
    const overlay = document.querySelector('.mobile-overlay');
    if (overlay) {
        overlay.remove();
    }
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    const navItems = Array.from(document.querySelectorAll('.nav-item'));
    const activeItem = document.querySelector('.nav-item.active');
    const activeIndex = navItems.indexOf(activeItem);

    // Arrow keys navigation
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        if (activeIndex < navItems.length - 1) {
            navItems[activeIndex + 1].click();
        }
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (activeIndex > 0) {
            navItems[activeIndex - 1].click();
        }
    } else if (e.key === 'Home') {
        e.preventDefault();
        navItems[0].click();
    } else if (e.key === 'End') {
        e.preventDefault();
        navItems[navItems.length - 1].click();
    }
});

// Smooth scroll for hash links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Add copy button to code blocks
function addCopyButtons() {
    const codeBlocks = document.querySelectorAll('pre code');

    codeBlocks.forEach(codeBlock => {
        const pre = codeBlock.parentElement;

        // Create copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = '📋';
        copyButton.setAttribute('aria-label', 'Copy code');

        copyButton.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: var(--dark-bg-tertiary);
            border: 1px solid var(--dark-border);
            color: var(--text-secondary);
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1rem;
            opacity: 0;
            transition: all 0.3s ease;
        `;

        pre.style.position = 'relative';

        pre.addEventListener('mouseenter', () => {
            copyButton.style.opacity = '1';
        });

        pre.addEventListener('mouseleave', () => {
            copyButton.style.opacity = '0';
        });

        copyButton.addEventListener('click', async () => {
            const code = codeBlock.textContent;

            try {
                await navigator.clipboard.writeText(code);
                copyButton.innerHTML = '✓';
                copyButton.style.background = 'var(--accent-green)';
                copyButton.style.color = 'white';

                setTimeout(() => {
                    copyButton.innerHTML = '📋';
                    copyButton.style.background = 'var(--dark-bg-tertiary)';
                    copyButton.style.color = 'var(--text-secondary)';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy code:', err);
                copyButton.innerHTML = '✕';
                setTimeout(() => {
                    copyButton.innerHTML = '📋';
                }, 2000);
            }
        });

        pre.appendChild(copyButton);
    });
}

// Initialize copy buttons after a short delay to ensure code blocks are rendered
setTimeout(addCopyButtons, 100);

// Track lesson completion (optional - could be saved to localStorage)
function trackProgress() {
    const completedLessons = new Set(
        JSON.parse(localStorage.getItem('completedLessons') || '[]')
    );

    const activeItem = document.querySelector('.nav-item.active');
    if (activeItem) {
        const sectionId = activeItem.getAttribute('data-section');
        completedLessons.add(sectionId);
        localStorage.setItem('completedLessons', JSON.stringify([...completedLessons]));
    }
}

// Mark completed lessons visually (optional enhancement)
function markCompletedLessons() {
    const completedLessons = new Set(
        JSON.parse(localStorage.getItem('completedLessons') || '[]')
    );

    document.querySelectorAll('.nav-item').forEach(item => {
        const sectionId = item.getAttribute('data-section');
        if (completedLessons.has(sectionId)) {
            item.classList.add('completed');
            // Could add a checkmark icon here
        }
    });
}

// Call on load
markCompletedLessons();

// Update completion tracking when section changes
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        setTimeout(trackProgress, 1000); // Track after 1 second on page
    });
});

// Console easter egg
console.log('%c🚀 Git Pro Course', 'font-size: 24px; color: #F05032; font-weight: bold;');
console.log('%cHecho con ❤️ para profesionales del desarrollo', 'font-size: 14px; color: #8b949e;');
console.log('%cTip: Usa las flechas del teclado para navegar entre lecciones', 'font-size: 12px; color: #58a6ff;');
