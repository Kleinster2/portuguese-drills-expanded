// Filter and search functionality for drill cards
document.addEventListener('DOMContentLoaded', () => {
    const cefrFilterControls = document.getElementById('cefr-filter-controls');
    const topicFilterControls = document.getElementById('topic-filter-controls');
    const drillCards = document.querySelectorAll('.drill-card');
    const searchInput = document.getElementById('search-input');
    const noResultsMessage = document.getElementById('no-results');

    // NEW: Path display logic variables
    const pathTriggers = document.getElementById('path-triggers');
    const pathDisplayContainer = document.getElementById('path-display-container');
    const pathButtons = pathTriggers.querySelectorAll('.path-btn');

    function filterAndSearch() {
        const activeCefrFilter = cefrFilterControls.querySelector('.active').dataset.filter;
        const activeTopicFilter = topicFilterControls.querySelector('.active').dataset.filter;
        const searchTerm = searchInput.value.toLowerCase().trim();
        let visibleCount = 0;

        drillCards.forEach(card => {
            const cardCefr = card.dataset.cefr;
            const cardTopic = card.dataset.topic;
            const cardTitle = card.querySelector('h2').textContent.toLowerCase();
            const cardDescription = card.querySelector('p').textContent.toLowerCase();

            const matchesCefr = activeCefrFilter === 'all' || cardCefr === activeCefrFilter;
            const matchesTopic = activeTopicFilter === 'all' || cardTopic === activeTopicFilter;
            const matchesSearch = cardTitle.includes(searchTerm) || cardDescription.includes(searchTerm);

            if (matchesCefr && matchesTopic && matchesSearch) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        noResultsMessage.classList.toggle('hidden', visibleCount > 0);
    }

    function setupFilter(controlsId, buttonClass, activeBgColor) {
        const controls = document.getElementById(controlsId);
        const buttons = controls.querySelectorAll(`.${buttonClass}`);

        controls.addEventListener('click', (event) => {
            const targetButton = event.target.closest(`.${buttonClass}`);
            if (!targetButton) return;

            buttons.forEach(button => {
                const isActive = button === targetButton;
                button.classList.toggle('active', isActive);
                button.classList.toggle(activeBgColor, isActive);
                button.classList.toggle('text-white', isActive);
                button.classList.toggle('bg-white', !isActive);
                button.classList.toggle('text-slate-700', !isActive);
                button.setAttribute('aria-pressed', isActive);
            });

            filterAndSearch();
        });
    }

    setupFilter('cefr-filter-controls', 'cefr-filter-btn', 'bg-indigo-600');
    setupFilter('topic-filter-controls', 'topic-filter-btn', 'bg-blue-600');

    searchInput.addEventListener('input', filterAndSearch);

    // NEW: Learning Path display logic
    pathTriggers.addEventListener('click', (event) => {
        const targetButton = event.target.closest('.path-btn');
        if (!targetButton) return;

        const pathId = targetButton.dataset.pathId;
        const wasActive = targetButton.classList.contains('bg-indigo-600');

        // Reset all path buttons
        pathButtons.forEach(btn => {
            btn.classList.remove('bg-indigo-600', 'text-white');
            btn.classList.add('bg-white', 'text-slate-700');
        });

        // Clear the display container
        pathDisplayContainer.innerHTML = '';

        // If the button was not active, make it active and show the path
        if (!wasActive) {
            targetButton.classList.add('bg-indigo-600', 'text-white');
            targetButton.classList.remove('bg-white', 'text-slate-700');
            const pathTemplate = document.getElementById(pathId);
            if (pathTemplate) {
                pathDisplayContainer.innerHTML = pathTemplate.outerHTML;
            }
        }
    });

    // Event delegation for path-link clicks
    pathDisplayContainer.addEventListener('click', (event) => {
        const pathLink = event.target.closest('.path-link');
        if (pathLink) {
            event.preventDefault();
            const targetId = pathLink.dataset.targetId;
            const targetCard = document.getElementById(targetId);

            // Remove highlight from any other card
            const currentlyHighlighted = document.querySelector('.drill-card.highlight');
            if (currentlyHighlighted) {
                currentlyHighlighted.classList.remove('highlight');
            }

            if (targetCard) {
                targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                targetCard.classList.add('highlight');
            }
        }
    });

    filterAndSearch();

    // Check for drill URL parameters and auto-open chat
    const urlParams = new URLSearchParams(window.location.search);
    const drillParam = urlParams.get('drill');        // Single drill
    const drillsParam = urlParams.get('drills');      // Multiple drills (comma-separated)
    const simplifierParam = urlParams.get('simplifier'); // Simplifier with level (a1 or a2)

    if (drillParam) {
        // Single drill mode
        setTimeout(() => {
            openDrillChat(drillParam);

            // Scroll to and highlight the drill card
            const targetCard = document.getElementById('drill-' + drillParam);
            if (targetCard) {
                targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                targetCard.classList.add('highlight');
            }
        }, 300);
    } else if (drillsParam) {
        // Multiple drills mode
        const drillIds = drillsParam.split(',').map(id => id.trim()).filter(id => id);

        if (drillIds.length > 0) {
            setTimeout(async () => {
                // Open empty session first
                openEmptySession();

                // Small delay to let empty session initialize
                await new Promise(resolve => setTimeout(resolve, 500));

                // Add each drill to the session sequentially
                for (const drillId of drillIds) {
                    try {
                        await addDrillToChat(drillId);
                        // Small delay between adding drills
                        await new Promise(resolve => setTimeout(resolve, 300));
                    } catch (error) {
                        console.error(`Failed to add drill ${drillId}:`, error);
                    }
                }

                // Scroll to and highlight the first drill card
                const targetCard = document.getElementById('drill-' + drillIds[0]);
                if (targetCard) {
                    targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    targetCard.classList.add('highlight');
                }
            }, 300);
        }
    }

    // Check for simplifier URL parameter
    if (simplifierParam && ['a1', 'a2', 'b1', 'b2'].includes(simplifierParam)) {
        setTimeout(() => {
            // Open simplifier section if it's closed
            const content = document.getElementById('simplifier-content');
            const chevron = document.getElementById('simplifier-chevron');

            if (content.classList.contains('hidden')) {
                content.classList.remove('hidden');
                chevron.classList.add('rotate-180');
            }

            // Select the appropriate level radio button
            const radioButton = document.querySelector(`input[name="simplifier-level"][value="${simplifierParam}"]`);
            if (radioButton) {
                radioButton.checked = true;
                // Update all labels and features to match selected level
                updateSimplifierLabels();
            }

            // Scroll to simplifier section
            const simplifierSection = content.closest('section');
            if (simplifierSection) {
                simplifierSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 300);
    }
});
