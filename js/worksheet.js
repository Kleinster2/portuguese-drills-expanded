/**
 * Worksheet Generator
 *
 * Adds a "Worksheet" button to every drill card and handles the
 * modal form + API call + result display flow.
 */

// Drills that shouldn't get a worksheet button
const WORKSHEET_EXCLUDED = [
  'diagnostic-test',
  'a1-simplifier', 'a2-simplifier', 'b1-simplifier', 'b2-simplifier',
  'tutor-chat'
];

/**
 * Open the worksheet modal for a given drill
 */
function generateWorksheet(drillId) {
  // Get drill name from the card
  const startBtn = document.querySelector(`[onclick="openDrillChat('${drillId}')"]`);
  const card = startBtn ? startBtn.closest('.drill-card') : null;
  const drillName = card ? card.querySelector('h2').textContent.replace(/^[^\w]*/, '') : drillId;

  // Create modal if it doesn't exist
  let modal = document.getElementById('worksheet-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'worksheet-modal';
    modal.innerHTML = `
      <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" id="worksheet-overlay">
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-slate-900" id="worksheet-title">Generate Worksheet</h3>
            <button onclick="closeWorksheetModal()" class="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
          </div>
          <p class="text-sm text-slate-500 mb-4" id="worksheet-drill-name"></p>

          <div id="worksheet-form">
            <label class="block text-sm font-medium text-slate-700 mb-1">Student Name <span class="text-red-500">*</span></label>
            <input type="text" id="worksheet-student-name" placeholder="e.g. Amanda"
              class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">

            <label class="block text-sm font-medium text-slate-700 mb-1">Student Notes <span class="text-slate-400">(optional)</span></label>
            <textarea id="worksheet-student-notes" rows="3"
              placeholder="e.g. Upper A1, focus on irregular verbs, lives in NYC"
              class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"></textarea>

            <button onclick="submitWorksheet()" id="worksheet-submit-btn"
              class="w-full bg-indigo-600 text-white rounded-lg px-4 py-2.5 font-semibold hover:bg-indigo-700 transition-colors text-sm">
              Generate Worksheet
            </button>
          </div>

          <div id="worksheet-loading" class="hidden text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-200 border-t-indigo-600 mb-3"></div>
            <p class="text-sm text-slate-600">Generating worksheet...</p>
            <p class="text-xs text-slate-400 mt-1">This takes about 30-60 seconds</p>
          </div>

          <div id="worksheet-error" class="hidden">
            <div class="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p class="text-sm text-red-700" id="worksheet-error-msg"></p>
            </div>
            <button onclick="resetWorksheetModal()" class="w-full bg-slate-200 text-slate-700 rounded-lg px-4 py-2 font-medium hover:bg-slate-300 transition-colors text-sm">
              Try Again
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Close on overlay click
    document.getElementById('worksheet-overlay').addEventListener('click', function(e) {
      if (e.target === this) closeWorksheetModal();
    });

    // Close on Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.style.display !== 'none') {
        closeWorksheetModal();
      }
    });
  }

  // Store drill ID for submission
  modal.dataset.drillId = drillId;

  // Set title
  document.getElementById('worksheet-drill-name').textContent = drillName;

  // Reset state
  resetWorksheetModal();

  // Show modal
  modal.style.display = 'block';

  // Focus name input
  setTimeout(() => document.getElementById('worksheet-student-name').focus(), 100);
}

function closeWorksheetModal() {
  const modal = document.getElementById('worksheet-modal');
  if (modal) modal.style.display = 'none';
}

function resetWorksheetModal() {
  document.getElementById('worksheet-form').classList.remove('hidden');
  document.getElementById('worksheet-loading').classList.add('hidden');
  document.getElementById('worksheet-error').classList.add('hidden');
}

async function submitWorksheet() {
  const modal = document.getElementById('worksheet-modal');
  const drillId = modal.dataset.drillId;
  const studentName = document.getElementById('worksheet-student-name').value.trim();
  const studentNotes = document.getElementById('worksheet-student-notes').value.trim();

  if (!studentName) {
    document.getElementById('worksheet-student-name').focus();
    document.getElementById('worksheet-student-name').classList.add('border-red-500');
    return;
  }
  document.getElementById('worksheet-student-name').classList.remove('border-red-500');

  // Open window immediately (during user click) to avoid popup blocker
  const worksheetWindow = window.open('about:blank', '_blank');

  // Show loading
  document.getElementById('worksheet-form').classList.add('hidden');
  document.getElementById('worksheet-loading').classList.remove('hidden');
  document.getElementById('worksheet-error').classList.add('hidden');

  try {
    const resp = await fetch('/api/worksheet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ drillId, studentName, studentNotes })
    });

    if (!resp.ok) {
      let errorMsg = 'Failed to generate worksheet';
      try {
        const errData = await resp.json();
        errorMsg = errData.error || errorMsg;
      } catch (e) {
        errorMsg = `Server error (${resp.status})`;
      }
      throw new Error(errorMsg);
    }

    const html = await resp.text();

    // Write HTML to the pre-opened window
    if (worksheetWindow && !worksheetWindow.closed) {
      worksheetWindow.document.open();
      worksheetWindow.document.write(html);
      worksheetWindow.document.close();
    } else {
      // Fallback: try blob URL if window was closed
      const blob = new Blob([html], { type: 'text/html; charset=utf-8' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    }

    // Close modal
    closeWorksheetModal();

  } catch (err) {
    console.error('Worksheet generation error:', err);
    // Close the pre-opened blank window on error
    if (worksheetWindow && !worksheetWindow.closed) worksheetWindow.close();
    document.getElementById('worksheet-loading').classList.add('hidden');
    document.getElementById('worksheet-error').classList.remove('hidden');
    document.getElementById('worksheet-error-msg').textContent = err.message;
  }
}

/**
 * Inject worksheet buttons into all drill cards on page load
 */
function injectWorksheetButtons() {
  document.querySelectorAll('[onclick^="openDrillChat"]').forEach(btn => {
    const match = btn.getAttribute('onclick').match(/openDrillChat\('([^']+)'\)/);
    if (!match) return;

    const drillId = match[1];
    if (WORKSHEET_EXCLUDED.includes(drillId)) return;

    const container = btn.parentElement;

    // Don't double-inject
    if (container.querySelector('.worksheet-btn')) return;

    const wsBtn = document.createElement('button');
    wsBtn.textContent = '\u{1F4DD} Worksheet';
    wsBtn.className = 'worksheet-btn w-full text-center bg-indigo-100 text-indigo-700 rounded-lg px-4 py-2 font-medium hover:bg-indigo-200 transition-colors text-sm mt-2';
    wsBtn.onclick = (e) => {
      e.stopPropagation();
      generateWorksheet(drillId);
    };

    container.appendChild(wsBtn);
  });
}

// Run injection when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectWorksheetButtons);
} else {
  injectWorksheetButtons();
}
