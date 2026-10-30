document.documentElement.classList.add('js');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initStealthLinks() {
    document.querySelectorAll('a[href]').forEach((link) => {
        const href = link.getAttribute('href');
        const target = link.getAttribute('target');
        if (!href) return;

        link.dataset.href = href;
        link.removeAttribute('href');
        link.setAttribute('role', 'link');
        link.tabIndex = 0;

        const navigate = (newTab = false) => {
            if (newTab || target === '_blank') {
                window.open(href, '_blank', 'noopener,noreferrer');
                return;
            }
            window.location.href = href;
        };

        link.addEventListener('click', (event) => {
            event.preventDefault();
            navigate(event.ctrlKey || event.metaKey || event.shiftKey);
        });

        link.addEventListener('auxclick', (event) => {
            if (event.button !== 1) return;
            event.preventDefault();
            navigate(true);
        });

        link.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            navigate(event.ctrlKey || event.metaKey || event.shiftKey);
        });
    });
}

function initReveals() {
    const items = document.querySelectorAll('.reveal');

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        items.forEach((item) => item.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -48px' });

    items.forEach((item) => observer.observe(item));
}

function initSignalDiagram() {
    const diagram = document.querySelector('.signal-diagram');
    const svg = diagram?.querySelector('svg');
    const trace = diagram?.querySelector('.trace:not(.trace-soft)');
    const softTrace = diagram?.querySelector('.trace-soft');
    const nodes = [...(diagram?.querySelectorAll('.signal-node') || [])];
    if (!diagram || !svg || !trace || !softTrace || nodes.length !== 4) return;

    const limits = [
        { minX: 55, maxX: 150 },
        { minX: 175, maxX: 270 },
        { minX: 290, maxX: 370 },
        { minX: 385, maxX: 470 }
    ];
    const points = nodes.map((node) => ({
        x: Number(node.getAttribute('cx')),
        y: Number(node.getAttribute('cy'))
    }));
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    const buildPath = (yOffset = 0) => {
        const [first, second, third, fourth] = points;
        return `M18 ${first.y + yOffset}H${first.x}L${Math.min(first.x + 42, second.x)} ${second.y + yOffset}H${second.x}L${Math.min(second.x + 41, third.x)} ${third.y + yOffset}H${third.x}L${fourth.x} ${fourth.y + yOffset}H502`;
    };

    const updateNode = (index, x, y) => {
        const bounds = limits[index];
        points[index].x = clamp(x, bounds.minX, bounds.maxX);
        points[index].y = clamp(y, 30, 190);
        nodes[index].setAttribute('cx', points[index].x.toFixed(1));
        nodes[index].setAttribute('cy', points[index].y.toFixed(1));
        nodes[index].setAttribute('aria-valuenow', String(Math.round((190 - points[index].y) / 1.6)));
        nodes[index].setAttribute('aria-valuetext', `Position ${Math.round(points[index].x)}, ${Math.round(points[index].y)}`);
        trace.setAttribute('d', buildPath());
        softTrace.setAttribute('d', buildPath(28));
    };

    const pointerPosition = (event) => {
        const point = svg.createSVGPoint();
        point.x = event.clientX;
        point.y = event.clientY;
        return point.matrixTransform(svg.getScreenCTM().inverse());
    };

    const enable = () => diagram.classList.add('is-interactive');
    trace.addEventListener('animationend', enable, { once: true });
    window.setTimeout(enable, prefersReducedMotion ? 0 : 2700);

    nodes.forEach((node, index) => {
        updateNode(index, points[index].x, points[index].y);

        node.addEventListener('pointerdown', (event) => {
            if (!diagram.classList.contains('is-interactive')) return;
            node.setPointerCapture(event.pointerId);
            node.classList.add('is-dragging');
            const point = pointerPosition(event);
            updateNode(index, point.x, point.y);
        });

        node.addEventListener('pointermove', (event) => {
            if (!node.hasPointerCapture(event.pointerId)) return;
            const point = pointerPosition(event);
            updateNode(index, point.x, point.y);
        });

        const stopDragging = (event) => {
            if (node.hasPointerCapture(event.pointerId)) node.releasePointerCapture(event.pointerId);
            node.classList.remove('is-dragging');
        };
        node.addEventListener('pointerup', stopDragging);
        node.addEventListener('pointercancel', stopDragging);

        node.addEventListener('keydown', (event) => {
            if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
            event.preventDefault();
            const step = event.shiftKey ? 10 : 4;
            const x = points[index].x + (event.key === 'ArrowLeft' ? -step : event.key === 'ArrowRight' ? step : 0);
            const y = points[index].y + (event.key === 'ArrowUp' ? -step : event.key === 'ArrowDown' ? step : 0);
            updateNode(index, x, y);
        });
    });
}

function initBuddy() {
    const messages = [
        'Nice click. The logo is more dangerous.',
        'Current status: converting Energy Drink into API integrations.',
        'Cybervagten started as a side quest. It did not stay small.',
        'The P8 project censored profanity. I have no such warranty.',
        'I checked every link. Except the logo. You should check that one.',
        'This site uses no framework. Benjamin still remembers how the browser works.',
        'Need the serious version? The Work page has receipts.',
        'The four signal nodes are draggable. Go bend the data.',
        'P9 is what happens when football meets big data.',
        'Servers are just computers with stricter bedtimes.',
        'Database first, interface second, debugging somewhere in between.',
        'One missing configuration value can build a surprising amount of character.'
    ];
    let messageIndex = -1;
    let dismissTimer;

    const buddy = document.createElement('aside');
    buddy.className = 'site-buddy';
    buddy.setAttribute('aria-label', 'Portfolio assistant');
    buddy.innerHTML = `
        <p class="buddy-bubble" id="buddy-message" role="status" hidden></p>
        <button class="buddy-button" type="button" aria-label="Ask the little portfolio assistant" aria-expanded="false" aria-controls="buddy-message">
            <svg viewBox="0 0 40 40" aria-hidden="true">
                <rect x="7" y="9" width="26" height="23" rx="7" fill="none" stroke="currentColor" stroke-width="2.4"/>
                <path d="M20 4v5M14 35h12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
                <circle class="eye eye-left" cx="15" cy="20" r="2.2" fill="currentColor"/>
                <circle class="eye" cx="25" cy="20" r="2.2" fill="currentColor"/>
                <path d="M15 26c2.8 2.2 7.2 2.2 10 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
        </button>`;
    document.body.appendChild(buddy);

    const button = buddy.querySelector('.buddy-button');
    const bubble = buddy.querySelector('.buddy-bubble');

    function hideMessage() {
        window.clearTimeout(dismissTimer);
        bubble.hidden = true;
        button.setAttribute('aria-expanded', 'false');
    }

    button.addEventListener('click', () => {
        window.clearTimeout(dismissTimer);
        messageIndex = (messageIndex + 1) % messages.length;
        bubble.textContent = messages[messageIndex];
        bubble.hidden = false;
        bubble.classList.remove('is-entering');
        void bubble.offsetWidth;
        bubble.classList.add('is-entering');
        button.classList.remove('is-talking');
        void button.offsetWidth;
        button.classList.add('is-talking');
        button.setAttribute('aria-expanded', 'true');
        dismissTimer = window.setTimeout(hideMessage, 5000);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape' || bubble.hidden) return;
        hideMessage();
        button.focus();
    });
}

function initLogo() {
    const logo = document.querySelector('.logo');
    const box = logo?.querySelector('.logo-box');
    if (!logo || !box || prefersReducedMotion) return;

    logo.addEventListener('pointermove', (event) => {
        const bounds = logo.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        box.style.setProperty('--logo-rx', `${(-y * 16).toFixed(2)}deg`);
        box.style.setProperty('--logo-ry', `${(x * 18).toFixed(2)}deg`);
    });

    logo.addEventListener('pointerleave', () => {
        box.style.removeProperty('--logo-rx');
        box.style.removeProperty('--logo-ry');
    });
}

function setYear() {
    document.querySelectorAll('[data-year]').forEach((element) => {
        element.textContent = String(new Date().getFullYear());
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initStealthLinks();
    setYear();
    initReveals();
    initSignalDiagram();
    initLogo();
    initBuddy();
});
