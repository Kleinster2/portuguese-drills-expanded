// Annotator page logic — extracted from annotator.html inline script
// Requires pronunciation-annotator.js to be loaded first

const examples = [
    "Eu sou americana. Eu moro em São Paulo.",
    "O Brasil é legal.",
    "Eles falam português e cantam músicas.",
    "Os professores portugueses são diferentes."
];

function loadExample(index) {
    document.getElementById('input-text').value = examples[index];
    annotateText();
}

function annotateText() {
    const input = document.getElementById('input-text').value.trim();
    const outputDiv = document.getElementById('output-text');
    const copyBtn = document.getElementById('copy-btn');
    const showHtml = document.getElementById('show-html').checked;

    if (!input) {
        outputDiv.innerHTML = '<span class="text-slate-400 italic">Enter text to annotate...</span>';
        copyBtn.classList.add('hidden');
        return;
    }

    // Use the pronunciation annotator
    const annotated = annotatePronunciation(input, false);

    if (showHtml) {
        // Show raw format
        outputDiv.textContent = annotated;
    } else {
        // Format for display
        const formatted = annotated
            // Convert [_xxx_] to styled spans
            .replace(/\[_([^_]+)_\]/g, '<span class="annotation">[$1]</span>')
            // Convert ~~x~~ to strikethrough
            .replace(/~~([^~]+)~~/g, '<span class="strikethrough">$1</span>');
        outputDiv.innerHTML = formatted;
    }

    copyBtn.classList.remove('hidden');
}

function copyOutput() {
    const outputDiv = document.getElementById('output-text');
    const showHtml = document.getElementById('show-html').checked;

    let textToCopy;
    if (showHtml) {
        textToCopy = outputDiv.textContent;
    } else {
        // Get the raw annotated text
        const input = document.getElementById('input-text').value.trim();
        textToCopy = annotatePronunciation(input, false);
    }

    navigator.clipboard.writeText(textToCopy).then(() => {
        const copyBtn = document.getElementById('copy-btn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    });
}

// Re-annotate when checkbox changes
document.getElementById('show-html').addEventListener('change', () => {
    const input = document.getElementById('input-text').value.trim();
    if (input) annotateText();
});

// Allow Ctrl+Enter to annotate
document.getElementById('input-text').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        annotateText();
    }
});
