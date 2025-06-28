function detectDiscordTokens(text) {
  const pattern = /\b[a-zA-Z0-9_-]{23,28}\.[a-zA-Z0-9_-]{6,7}\.[a-zA-Z0-9_-]{27,}\b/g;
  const matches = text.match(pattern);
  return matches ? [...new Set(matches)] : [];
}

function copyTokensToClipboard(tokens) {
  const formatted = tokens.join('\n'); // each token on a new line
  navigator.clipboard.writeText(formatted)
    .then(() => {
      console.log("Copied Discord tokens1!:", formatted);
      showDarkNotification(`✅ Copied ${tokens.length} token${tokens.length > 1 ? 's' : ''}`);
    })
    .catch(err => {
      console.error("❌ Failed to copy tokens:", err);
    });
}

function showDarkNotification(message) {
  const notif = document.createElement('div');
  notif.textContent = message;

  Object.assign(notif.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    background: '#111827',
    color: '#e5e7eb',
    padding: '12px 18px',
    borderRadius: '10px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.35)',
    fontSize: '14px',
    fontWeight: '500',
    fontFamily: 'Segoe UI, sans-serif',
    zIndex: '99999',
    opacity: '0',
    transform: 'translateY(-10px)',
    transition: 'opacity 0.3s ease, transform 0.3s ease',
    pointerEvents: 'none'
  });

  document.body.appendChild(notif);
  requestAnimationFrame(() => {
    notif.style.opacity = '1';
    notif.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    notif.style.opacity = '0';
    notif.style.transform = 'translateY(-10px)';
    setTimeout(() => notif.remove(), 300);
  }, 4000);
}

let lastCopiedTokens = [];

function scanAndCopyAllTokens() {
  const textContent = document.body.innerText;
  const tokens = detectDiscordTokens(textContent);

  const newTokens = tokens.filter(t => !lastCopiedTokens.includes(t));

  if (newTokens.length > 0) {
    lastCopiedTokens.push(...newTokens);
    copyTokensToClipboard(newTokens);
  }
}

const observer = new MutationObserver(() => {
  scanAndCopyAllTokens();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: true
});

window.addEventListener("load", scanAndCopyAllTokens);
