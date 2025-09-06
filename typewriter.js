// Single-caret typewriter for one container per page
(function(){
  const box = document.querySelector('[data-typewriter]');
  if (!box) return;

  // Gather source text from existing headings/paras inside the box
  const sourceNodes = Array.from(box.querySelectorAll('h1, h2, p'));
  const lines = sourceNodes.map(n => n.textContent.trim()).filter(Boolean);
  const full = lines.join('\n');

  // Compute final height to lock layout before typing (prevents jumps)
  const shadow = document.createElement('div');
  shadow.className = 'typewriter-shadow';
  shadow.style.position = 'absolute';
  shadow.style.visibility = 'hidden';
  shadow.style.pointerEvents = 'none';
  shadow.style.whiteSpace = 'pre-wrap';
  shadow.style.inset = '0 auto auto 0';
  shadow.style.maxWidth = getComputedStyle(box).maxWidth || '60ch';
  shadow.style.font = getComputedStyle(box).font;
  shadow.style.lineHeight = getComputedStyle(box).lineHeight;
  shadow.textContent = full;
  document.body.appendChild(shadow);
  box.style.minHeight = shadow.scrollHeight + 'px';
  shadow.remove();

  // Prepare target
  box.innerHTML = '<span class="tw-text"></span><span class="tw-caret" aria-hidden="true"></span>';
  const target = box.querySelector('.tw-text');
  const caret = box.querySelector('.tw-caret');

  let i = 0;
  const speed = 18; // ms per char (tweak as you like)
  function tick(){
    if (i <= full.length){
      const slice = full.slice(0, i).replace(/\n/g, '<br>');
      target.innerHTML = slice;
      i++;
      requestAnimationFrame(()=>setTimeout(tick, speed));
    } else {
      caret.classList.add('steady');
    }
  }
  tick();
})();
