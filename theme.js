/**
 * MediCalc AI - Global Navigation & UX Controller
 * Handles responsive mobile navigation drawer, auth state, and toast feedback.
 */

document.addEventListener('DOMContentLoaded', () => {
    setupNavbarAuth();
    setupMobileMenu();
});

// Setup User Auth State in Navbar
function setupNavbarAuth() {
    const authContainers = document.querySelectorAll('.nav-auth-container');
    const activeUser = sessionStorage.getItem('activeUser');

    authContainers.forEach(container => {
        if (activeUser) {
            container.innerHTML = `
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <a href="dashboard.html" class="user-badge" title="View Dashboard">
                        
                        <span>${escapeHtml(activeUser)}</span>
                    </a>
                    <button onclick="handleLogout()" class="btn-logout" title="Sign Out">
                        Sign Out
                    </button>
                </div>
            `;
        } else {
            container.innerHTML = `
                <a href="sample.html" class="btn-auth">
                    <span>Sign In</span>
                    <span>&rarr;</span>
                </a>
            `;
        }
    });
}

// Logout handler
function handleLogout() {
    sessionStorage.removeItem('activeUser');
    showToast('Signed out successfully', 'info');
    setTimeout(() => {
        window.location.href = 'sample.html';
    }, 400);
}

// Setup Mobile Menu Toggle (closes on link click or outside click)
function setupMobileMenu() {
    const mobileBtn = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileBtn && navMenu) {
        mobileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('open');
            mobileBtn.innerText = navMenu.classList.contains('open') ? 'Close' : 'Menu';
        });

        // Close on clicking any nav-link
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                mobileBtn.innerText = 'Menu';
            });
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileBtn.contains(e.target)) {
                navMenu.classList.remove('open');
                mobileBtn.innerText = 'Menu';
            }
        });
    }
}

// Helper: Escape HTML strings
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// Clean Toast Notification UI
function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 8px;
            max-width: calc(100vw - 40px);
            pointer-events: none;
        `;
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const colors = {
        success: { border: '#16a34a', bg: '#f0fdf4', text: '#15803d', icon: '✓' },
        danger: { border: '#dc2626', bg: '#fef2f2', text: '#b91c1c', icon: '!' },
        warning: { border: '#d97706', bg: '#fffbeb', text: '#b45309', icon: '*' },
        info: { border: '#0284c7', bg: '#f0f9ff', text: '#0369a1', icon: 'i' }
    };
    const c = colors[type] || colors.info;

    toast.style.cssText = `
        background-color: ${c.bg};
        color: ${c.text};
        border: 1px solid ${c.border};
        border-left: 5px solid ${c.border};
        padding: 10px 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.1);
        display: flex;
        align-items: center;
        gap: 10px;
        font-family: inherit;
        font-size: 0.9rem;
        font-weight: 600;
        transform: translateY(15px);
        opacity: 0;
        transition: all 0.25s ease-out;
        pointer-events: auto;
    `;

    toast.innerHTML = `<span>${c.icon}</span><span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
    });

    setTimeout(() => {
        toast.style.transform = 'translateY(10px)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 250);
    }, 3200);
}
