const canvas = document.getElementById("canvas");

function initPageTransitions() {
    document.querySelectorAll('a[href]').forEach(function(link) {
        if (link.closest('.chatbot-widget')) return;
        if (link.dataset.stealthReady === 'true') return;

        const href = link.getAttribute('href');
        const target = link.getAttribute('target');
        link.dataset.href = href;
        link.dataset.target = target || '';
        link.dataset.stealthReady = 'true';
        link.removeAttribute('href');
        link.setAttribute('role', 'link');
        if (!link.hasAttribute('tabindex')) {
            link.setAttribute('tabindex', '0');
        }

        function navigate() {
            const storedHref = link.dataset.href;
            const storedTarget = link.dataset.target;

            if (!storedHref) {
                return;
            }

            if (storedHref.startsWith('mailto:') || storedHref.startsWith('tel:')) {
                window.location.href = storedHref;
                return;
            }

            if (storedTarget === '_blank' || storedHref.startsWith('http')) {
                window.open(storedHref, '_blank', 'noopener,noreferrer');
                return;
            }

            if (storedHref.startsWith('#')) {
                window.location.hash = storedHref;
                return;
            }

            document.body.classList.remove('loaded');
            setTimeout(function() {
                window.location.href = storedHref;
            }, 180);
        }

        link.addEventListener('click', function(e) {
            e.preventDefault();
            navigate();
        });

        link.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate();
            }
        });
    });
}

function initScrollReveal() {
    const revealItems = document.querySelectorAll('.reveal-on-scroll');

    if (!('IntersectionObserver' in window)) {
        revealItems.forEach(function(item) {
            item.classList.add('is-visible');
        });
        return;
    }

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.16,
        rootMargin: '0px 0px -40px 0px'
    });

    revealItems.forEach(function(item) {
        observer.observe(item);
    });
}

function initInteractivePanels() {
    const panels = document.querySelectorAll('.hero-copy, .page-title, .glass-panel, .signal-panel, .content-band, .feature-card, .timeline, .contact-card, .sound-group');

    panels.forEach(function(panel) {
        panel.addEventListener('pointermove', function(event) {
            const rect = panel.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const px = x / rect.width;
            const py = y / rect.height;

            panel.style.setProperty('--mx', (px * 100).toFixed(2) + '%');
            panel.style.setProperty('--my', (py * 100).toFixed(2) + '%');
            panel.style.setProperty('--rx', ((0.5 - py) * 4).toFixed(2) + 'deg');
            panel.style.setProperty('--ry', ((px - 0.5) * 5).toFixed(2) + 'deg');
        });

        panel.addEventListener('pointerleave', function() {
            panel.style.removeProperty('--rx');
            panel.style.removeProperty('--ry');
        });
    });
}

function initAiNetwork() {
    const aiCanvas = document.getElementById('ai-network');
    if (!aiCanvas) return;

    const context = aiCanvas.getContext('2d');
    const particles = Array.from({ length: 34 }, function(_, index) {
        return {
            angle: (Math.PI * 2 * index) / 34,
            radius: 0.18 + (index % 7) * 0.055,
            speed: 0.0010 + (index % 5) * 0.00026,
            phase: index * 0.43
        };
    });

    function resize() {
        const rect = aiCanvas.getBoundingClientRect();
        const ratio = window.devicePixelRatio || 1;
        aiCanvas.width = Math.max(1, Math.floor(rect.width * ratio));
        aiCanvas.height = Math.max(1, Math.floor(rect.height * ratio));
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function draw(frame) {
        const width = aiCanvas.clientWidth;
        const height = aiCanvas.clientHeight;
        const cx = width / 2;
        const cy = height / 2;
        const size = Math.min(width, height);

        context.clearRect(0, 0, width, height);

        const points = particles.map(function(particle) {
            const pulse = Math.sin(frame * 0.00115 + particle.phase) * 0.045;
            const angle = particle.angle + frame * particle.speed;
            const radius = size * (particle.radius + pulse);
            return {
                x: cx + Math.cos(angle) * radius,
                y: cy + Math.sin(angle * 1.18) * radius,
                glow: 0.55 + Math.sin(frame * 0.0024 + particle.phase) * 0.45
            };
        });

        context.lineWidth = 1;
        for (let i = 0; i < points.length; i += 1) {
            for (let j = i + 1; j < points.length; j += 1) {
                const dx = points[i].x - points[j].x;
                const dy = points[i].y - points[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < size * 0.26) {
                    const alpha = (1 - distance / (size * 0.26)) * 0.34;
                    context.strokeStyle = `rgba(94, 234, 212, ${alpha})`;
                    context.beginPath();
                    context.moveTo(points[i].x, points[i].y);
                    context.lineTo(points[j].x, points[j].y);
                    context.stroke();
                }
            }
        }

        const sweep = (frame * 0.00072) % (Math.PI * 2);
        context.strokeStyle = 'rgba(255, 159, 122, 0.42)';
        context.lineWidth = 3;
        context.beginPath();
        context.arc(cx, cy, size * 0.37, sweep, sweep + Math.PI * 0.85);
        context.stroke();

        points.forEach(function(point, index) {
            const radius = 2.4 + point.glow * 2.8;
            context.fillStyle = index % 3 === 0 ? 'rgba(255, 159, 122, 0.95)' : 'rgba(156, 255, 203, 0.95)';
            context.shadowColor = context.fillStyle;
            context.shadowBlur = 16;
            context.beginPath();
            context.arc(point.x, point.y, radius, 0, Math.PI * 2);
            context.fill();
        });
        context.shadowBlur = 0;

        requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(draw);
}

function initDatasetWave() {
    const waveCanvas = document.getElementById('dataset-wave');
    if (!waveCanvas) return;

    const context = waveCanvas.getContext('2d');

    function resize() {
        const rect = waveCanvas.getBoundingClientRect();
        const ratio = window.devicePixelRatio || 1;
        waveCanvas.width = Math.max(1, Math.floor(rect.width * ratio));
        waveCanvas.height = Math.max(1, Math.floor(rect.height * ratio));
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function draw(frame) {
        const width = waveCanvas.clientWidth;
        const height = waveCanvas.clientHeight;
        const mid = height / 2;

        context.clearRect(0, 0, width, height);

        const gradient = context.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, 'rgba(94, 234, 212, 0.1)');
        gradient.addColorStop(0.35, 'rgba(94, 234, 212, 0.95)');
        gradient.addColorStop(0.7, 'rgba(255, 159, 122, 0.95)');
        gradient.addColorStop(1, 'rgba(185, 167, 255, 0.25)');

        for (let layer = 0; layer < 3; layer += 1) {
            context.beginPath();
            const amplitude = height * (0.16 + layer * 0.055);
            const frequency = 0.015 + layer * 0.006;
            const speed = frame * (0.004 + layer * 0.0012);

            for (let x = 0; x <= width; x += 4) {
                const y = mid
                    + Math.sin(x * frequency + speed) * amplitude
                    + Math.sin(x * frequency * 2.2 - speed * 0.8) * amplitude * 0.34;

                if (x === 0) {
                    context.moveTo(x, y);
                } else {
                    context.lineTo(x, y);
                }
            }

            context.strokeStyle = layer === 0 ? gradient : `rgba(255, 255, 255, ${0.2 - layer * 0.045})`;
            context.lineWidth = layer === 0 ? 3 : 1.5;
            context.shadowColor = 'rgba(94, 234, 212, 0.45)';
            context.shadowBlur = layer === 0 ? 18 : 4;
            context.stroke();
        }

        context.shadowBlur = 0;

        requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(draw);
}

function hideLoader(onHidden) {
    setTimeout(function() {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.classList.add('is-hidden');
            setTimeout(function() {
                loader.style.display = 'none';
            }, 420);
        }
        document.body.classList.add('loaded');
        if (typeof onHidden === 'function') {
            requestAnimationFrame(function() {
                setTimeout(onHidden, 80);
            });
        }
    }, 260);
}

function initWebGLBackground() {
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const gl = canvas.getContext('webgl');
    if (!gl) {
        canvas.style.display = 'none';
        return;
    }

    let time = 0.0;

    const vertexSource = `
attribute vec2 position;
void main() {
    gl_Position = vec4(position, 0.0, 1.0);
}
`;

    const fragmentSource = `
precision highp float;

uniform float width;
uniform float height;
vec2 resolution = vec2(width, height);

uniform float time;

float getWaveGlow(vec2 pos, float radius, float intensity, float speed, float amplitude, float frequency, float shift) {
    float dist = abs(pos.y + amplitude * sin(shift + speed * time + pos.x * frequency));
    dist = 1.0 / max(dist, 0.002);
    dist *= radius;
    dist = pow(dist, intensity);
    return dist;
}

float grid(vec2 uv) {
    vec2 lines = abs(fract(uv * 18.0) - 0.5);
    float line = min(lines.x, lines.y);
    return 1.0 - smoothstep(0.0, 0.018, line);
}

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    float widthHeightRatio = resolution.x / resolution.y;
    vec2 centre = vec2(0.5, 0.5);
    vec2 pos = centre - uv;
    pos.y /= widthHeightRatio;

    float intensity = 1.55;
    float radius = 0.018;

    vec3 col = vec3(0.015, 0.055, 0.065);
    float dist = 0.0;

    dist = getWaveGlow(pos, radius, intensity, 2.0, 0.018, 3.7, 0.0);
    col += dist * vec3(0.20, 0.95, 0.82);

    dist = getWaveGlow(pos, radius, intensity, 4.0, 0.018, 6.0, 2.0);
    col += dist * vec3(1.00, 0.48, 0.34);

    dist = getWaveGlow(pos, radius * 0.6, intensity, -5.0, 0.018, 4.0, 1.0);
    col += dist * vec3(0.55, 0.50, 1.00);

    float vignette = smoothstep(0.86, 0.22, distance(uv, centre));
    col += grid(uv + vec2(time * 0.025, 0.0)) * 0.018;
    col *= vignette;
    col = 1.0 - exp(-col);
    col = pow(col, vec3(0.4545));

    gl_FragColor = vec4(col, 1.0);
}
`;

    function compileShader(shaderSource, shaderType) {
        const shader = gl.createShader(shaderType);
        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw new Error("Shader compile failed: " + gl.getShaderInfoLog(shader));
        }
        return shader;
    }

    let program;
    try {
        const vertexShader = compileShader(vertexSource, gl.VERTEX_SHADER);
        const fragmentShader = compileShader(fragmentSource, gl.FRAGMENT_SHADER);

        program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new Error("Shader link failed: " + gl.getProgramInfoLog(program));
        }

        gl.useProgram(program);
    } catch (error) {
        console.error(error);
        canvas.style.display = 'none';
        return;
    }

    const vertexData = new Float32Array([
        -1.0,  1.0,
        -1.0, -1.0,
         1.0,  1.0,
         1.0, -1.0,
    ]);

    const vertexDataBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexDataBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

    const positionHandle = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionHandle);
    gl.vertexAttribPointer(positionHandle, 2, gl.FLOAT, false, 2 * 4, 0);

    const timeHandle = gl.getUniformLocation(program, 'time');
    const widthHandle = gl.getUniformLocation(program, 'width');
    const heightHandle = gl.getUniformLocation(program, 'height');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform1f(widthHandle, window.innerWidth);
        gl.uniform1f(heightHandle, window.innerHeight);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let lastFrame = Date.now();

    function draw() {
        const thisFrame = Date.now();
        time += (thisFrame - lastFrame) / 3000;
        lastFrame = thisFrame;

        gl.uniform1f(timeHandle, time);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        requestAnimationFrame(draw);
    }

    draw();
}

document.addEventListener('DOMContentLoaded', function() {
    initPageTransitions();
    initInteractivePanels();
    initAiNetwork();
    initDatasetWave();
    initWebGLBackground();
    hideLoader(initScrollReveal);
});
