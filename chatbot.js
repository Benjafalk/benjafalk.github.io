(function () {
    const KNOWLEDGE_URL = 'chatbot-knowledge.json';
    const SITE_PAGES = ['index.html', 'about.html', 'work.html', 'contact.html', 'sound-examples.html'];
    const SUGGESTIONS = [
        'how old are you?',
        'what are you studying?',
        'what projects have you made?',
        'do you have siblings?',
        'what football team do you support?',
        'what is your favorite food?'
    ];

    let knowledge = { entries: [], settings: {} };
    let siteDocuments = [];
    let isTyping = false;

    const normalize = (text) => text
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    function tokenSet(text) {
        return new Set(normalize(text).split(' ').filter(Boolean));
    }

    function sentenceCase(text) {
        return text.replace(/\s+/g, ' ').trim();
    }

    // Explicit knowledge entries always get checked before page text.
    function scoreEntry(question, entry) {
        const normalizedQuestion = normalize(question);
        const questionTokens = tokenSet(question);
        let evidence = 0;

        (entry.aliases || []).forEach((alias) => {
            const normalizedAlias = normalize(alias);
            if (normalizedQuestion === normalizedAlias) evidence += 160;
            else if (normalizedQuestion.includes(normalizedAlias)) evidence += 95;
        });

        (entry.keywords || []).forEach((keyword) => {
            const normalizedKeyword = normalize(keyword);
            if (!normalizedKeyword) return;
            if (normalizedQuestion.includes(normalizedKeyword)) {
                evidence += normalizedKeyword.includes(' ') ? 38 : 24;
                return;
            }

            const parts = normalizedKeyword.split(' ');
            const matches = parts.filter((part) => questionTokens.has(part)).length;
            if (matches > 0 && parts.length > 1) evidence += matches * 7;
        });

        return evidence > 0 ? evidence + (entry.priority || 0) * 0.2 : 0;
    }

    function searchKnowledge(question) {
        const ranked = knowledge.entries
            .map((entry) => ({ entry, score: scoreEntry(question, entry) }))
            .sort((a, b) => b.score - a.score);

        return ranked[0] && ranked[0].score >= 42 ? ranked[0].entry.answer : null;
    }

    // Lightweight fallback: search text extracted from the existing static pages.
    function searchSiteContent(question) {
        const queryTokens = [...tokenSet(question)].filter((token) => token.length > 2);
        if (!queryTokens.length) return null;

        const ranked = siteDocuments
            .map((doc) => {
                let score = 0;
                queryTokens.forEach((token) => {
                    if (doc.normalized.includes(token)) score += 1;
                });
                return { doc, score };
            })
            .filter((item) => item.score >= Math.min(2, queryTokens.length))
            .sort((a, b) => b.score - a.score);

        if (!ranked.length) return null;

        const best = ranked[0].doc;
        const lowerText = best.text.toLowerCase();
        const sentence = best.sentences.find((candidate) => {
            const normalizedCandidate = normalize(candidate);
            return queryTokens.some((token) => normalizedCandidate.includes(token));
        });

        if (sentence && sentence.length < 260) {
            return `based on my ${best.title.toLowerCase()} page: ${sentenceCase(sentence)}`;
        }

        if (lowerText.includes('project')) {
            return 'you can find my semester projects and side projects on the work page.';
        }

        return `that is covered on my ${best.title.toLowerCase()} page.`;
    }

    function getAnswer(question) {
        const explicitAnswer = searchKnowledge(question);
        if (explicitAnswer) return explicitAnswer;

        const siteAnswer = searchSiteContent(question);
        if (siteAnswer) return siteAnswer;

        return knowledge.settings.fallback || 'i am not sure. ask another question';
    }

    function createWidget() {
        const root = document.createElement('section');
        root.className = 'chatbot-widget';
        root.setAttribute('aria-label', 'chat assistant');
        root.innerHTML = `
            <button class="chatbot-toggle" type="button" aria-label="open chat" aria-expanded="false">
                <i class="fas fa-message"></i>
            </button>
            <div class="chatbot-panel" aria-hidden="true">
                <div class="chatbot-header">
                    <div>
                        <span class="chatbot-kicker">Benjamin's assistant</span>
                        <strong>ask me anything</strong>
                    </div>
                    <button class="chatbot-close" type="button" aria-label="close chat">
                        <i class="fas fa-xmark"></i>
                    </button>
                </div>
                <div class="chatbot-messages" role="log" aria-live="polite"></div>
                <div class="chatbot-suggestions" aria-label="suggested questions"></div>
                <form class="chatbot-form">
                    <input class="chatbot-input" type="text" autocomplete="off" placeholder="ask about me..." aria-label="chat message">
                    <button class="chatbot-send" type="submit" aria-label="send message">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </form>
            </div>
        `;
        document.body.appendChild(root);
        return root;
    }

    function addMessage(messages, text, sender, stream) {
        const row = document.createElement('div');
        row.className = `chatbot-message ${sender}`;
        const bubble = document.createElement('div');
        bubble.className = 'chatbot-bubble';
        row.appendChild(bubble);
        messages.appendChild(row);
        messages.scrollTop = messages.scrollHeight;

        if (!stream) {
            bubble.textContent = text;
            return Promise.resolve();
        }

        return typeMessage(bubble, text, messages);
    }

    function showTyping(messages) {
        const row = document.createElement('div');
        row.className = 'chatbot-message bot typing-row';
        row.innerHTML = '<div class="chatbot-bubble typing"><span></span><span></span><span></span></div>';
        messages.appendChild(row);
        messages.scrollTop = messages.scrollHeight;
        return row;
    }

    function typeMessage(element, text, messages) {
        return new Promise((resolve) => {
            let index = 0;
            const speed = text.length > 140 ? 10 : 16;
            const tick = () => {
                element.textContent = text.slice(0, index);
                messages.scrollTop = messages.scrollHeight;
                index += 1;

                if (index <= text.length) {
                    window.setTimeout(tick, speed);
                } else {
                    resolve();
                }
            };
            tick();
        });
    }

    async function handleQuestion(question, elements) {
        if (!question || isTyping) return;

        isTyping = true;
        elements.input.value = '';
        addMessage(elements.messages, question, 'user', false);

        const typing = showTyping(elements.messages);
        window.setTimeout(async () => {
            typing.remove();
            await addMessage(elements.messages, getAnswer(question), 'bot', true);
            isTyping = false;
            elements.input.focus();
        }, 520);
    }

    function bindWidget(root) {
        const panel = root.querySelector('.chatbot-panel');
        const toggle = root.querySelector('.chatbot-toggle');
        const close = root.querySelector('.chatbot-close');
        const messages = root.querySelector('.chatbot-messages');
        const suggestions = root.querySelector('.chatbot-suggestions');
        const form = root.querySelector('.chatbot-form');
        const input = root.querySelector('.chatbot-input');

        const elements = { messages, input };

        function setOpen(open) {
            root.classList.toggle('is-open', open);
            panel.setAttribute('aria-hidden', open ? 'false' : 'true');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            if (open) window.setTimeout(() => input.focus(), 220);
        }

        toggle.addEventListener('click', () => setOpen(!root.classList.contains('is-open')));
        close.addEventListener('click', () => setOpen(false));

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            handleQuestion(input.value.trim(), elements);
        });

        SUGGESTIONS.forEach((question) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = question;
            button.addEventListener('click', () => handleQuestion(question, elements));
            suggestions.appendChild(button);
        });

        addMessage(messages, 'hi, i can answer questions about me, my studies, projects, work, and a few personal facts.', 'bot', false);
    }

    async function fetchTextPage(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) return null;
            const html = await response.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const title = (doc.querySelector('title')?.textContent || path).replace('Benjamin Falk | ', '');
            const text = [...doc.querySelectorAll('main h1, main h2, main h3, main p, main span, main strong')]
                .map((node) => node.textContent.trim())
                .filter(Boolean)
                .join('. ');
            return {
                title,
                text,
                normalized: normalize(text),
                sentences: text.split(/[.!?]\s+/).filter((item) => item.trim().length > 20)
            };
        } catch (error) {
            return null;
        }
    }

    // Everything is fetched statically, so this works on localhost and GitHub Pages.
    async function loadKnowledge() {
        try {
            const response = await fetch(KNOWLEDGE_URL);
            if (response.ok) {
                knowledge = await response.json();
            }
        } catch (error) {
            knowledge = { entries: [], settings: { fallback: 'i am not sure. ask another question' } };
        }

        const pages = await Promise.all(SITE_PAGES.map(fetchTextPage));
        siteDocuments = pages.filter(Boolean);
    }

    document.addEventListener('DOMContentLoaded', async () => {
        await loadKnowledge();
        const widget = createWidget();
        bindWidget(widget);
    });
}());
