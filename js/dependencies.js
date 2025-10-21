// Dependencies and Learning Path Manager
class DependencyManager {
    constructor() {
        this.dependencies = null;
        this.userProgress = this.loadUserProgress();
    }

    async loadDependencies() {
        try {
            const response = await fetch('/config/dependencies.json');
            this.dependencies = await response.json();
            return this.dependencies;
        } catch (error) {
            console.error('Failed to load dependencies:', error);
            return null;
        }
    }

    loadUserProgress() {
        const saved = localStorage.getItem('userProgress');
        return saved ? JSON.parse(saved) : {};
    }

    saveUserProgress() {
        localStorage.setItem('userProgress', JSON.stringify(this.userProgress));
    }

    markDrillCompleted(drillId) {
        if (!this.userProgress[drillId]) {
            this.userProgress[drillId] = {
                completed: true,
                completedAt: new Date().toISOString(),
                attempts: 1
            };
        } else {
            this.userProgress[drillId].attempts++;
            this.userProgress[drillId].lastAttempt = new Date().toISOString();
        }
        this.saveUserProgress();
    }

    isDrillCompleted(drillId) {
        return this.userProgress[drillId]?.completed || false;
    }

    canAccessDrill(drillId) {
        if (!this.dependencies) return true;

        const drillMeta = this.dependencies.drillMetadata[drillId];
        if (!drillMeta || !drillMeta.prerequisites || drillMeta.prerequisites.length === 0) {
            return true;
        }

        // Check if all prerequisites are completed
        return drillMeta.prerequisites.every(prereqId => this.isDrillCompleted(prereqId));
    }

    getPrerequisites(drillId) {
        if (!this.dependencies) return [];
        return this.dependencies.drillMetadata[drillId]?.prerequisites || [];
    }

    getUnlocks(drillId) {
        if (!this.dependencies) return [];
        return this.dependencies.drillMetadata[drillId]?.unlocks || [];
    }

    getDrillLevel(drillId) {
        if (!this.dependencies) return 'A1';
        return this.dependencies.drillMetadata[drillId]?.level || 'A1';
    }

    getDrillDifficulty(drillId) {
        if (!this.dependencies) return 1;
        return this.dependencies.drillMetadata[drillId]?.difficulty || 1;
    }

    getEstimatedTime(drillId) {
        if (!this.dependencies) return 'N/A';
        return this.dependencies.drillMetadata[drillId]?.estimatedTime || 'N/A';
    }

    getLearningTrack(drillId) {
        if (!this.dependencies) return null;

        for (const [trackId, track] of Object.entries(this.dependencies.learningTracks)) {
            if (track.drills.includes(drillId)) {
                return { id: trackId, ...track };
            }
        }
        return null;
    }

    getNextRecommendedDrill(currentPath = 'beginner') {
        if (!this.dependencies) return null;

        const path = this.dependencies.learningPaths[currentPath];
        if (!path) return null;

        // Find first incomplete drill in recommended order
        for (const drillId of path.recommendedOrder) {
            if (!this.isDrillCompleted(drillId) && this.canAccessDrill(drillId)) {
                return drillId;
            }
        }
        return null;
    }

    getProgressStats() {
        const totalDrills = Object.keys(this.dependencies?.drillMetadata || {}).length;
        const completedDrills = Object.keys(this.userProgress).filter(id =>
            this.userProgress[id].completed
        ).length;

        return {
            total: totalDrills,
            completed: completedDrills,
            percentage: totalDrills > 0 ? Math.round((completedDrills / totalDrills) * 100) : 0
        };
    }

    getDrillBadgeHTML(drillId) {
        const level = this.getDrillLevel(drillId);
        const difficulty = this.getDrillDifficulty(drillId);
        const estimatedTime = this.getEstimatedTime(drillId);
        const prerequisites = this.getPrerequisites(drillId);
        const canAccess = this.canAccessDrill(drillId);
        const isCompleted = this.isDrillCompleted(drillId);
        const track = this.getLearningTrack(drillId);

        const levelColors = {
            'A1': 'bg-green-100 text-green-800',
            'A2': 'bg-blue-100 text-blue-800',
            'B1': 'bg-yellow-100 text-yellow-800',
            'B2': 'bg-orange-100 text-orange-800'
        };

        const difficultyStars = '⭐'.repeat(Math.min(difficulty, 5));
        const lockIcon = !canAccess ? '🔒' : '';
        const checkIcon = isCompleted ? '✅' : '';

        let prerequisitesHTML = '';
        if (prerequisites.length > 0 && !canAccess) {
            prerequisitesHTML = `
                <div class="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                    <strong>⚠️ Prerequisites:</strong>
                    <ul class="mt-1 ml-4 list-disc">
                        ${prerequisites.map(prereqId => {
                            const completed = this.isDrillCompleted(prereqId);
                            return `<li class="${completed ? 'text-green-600' : 'text-red-600'}">
                                ${this.getDrillName(prereqId)} ${completed ? '✓' : '✗'}
                            </li>`;
                        }).join('')}
                    </ul>
                </div>
            `;
        }

        return `
            <div class="flex flex-wrap gap-2 items-center">
                ${checkIcon ? `<span class="text-2xl" title="Completed">${checkIcon}</span>` : ''}
                ${lockIcon ? `<span class="text-xl" title="Locked - Complete prerequisites first">${lockIcon}</span>` : ''}
                <span class="inline-block ${levelColors[level] || levelColors['A1']} text-xs font-semibold px-2 py-1 rounded-full">
                    ${level}
                </span>
                <span class="text-xs text-slate-600" title="Difficulty: ${difficulty}/10">
                    ${difficultyStars}
                </span>
                <span class="text-xs text-slate-600" title="Estimated time">
                    ⏱️ ${estimatedTime}
                </span>
                ${track ? `<span class="text-xs px-2 py-1 rounded-full" style="background-color: ${track.color}20; color: ${track.color};">
                    ${track.name}
                </span>` : ''}
            </div>
            ${prerequisitesHTML}
        `;
    }

    getDrillName(drillId) {
        // Map of drill IDs to friendly names
        const names = {
            'regular-ar': 'Regular -ar Verbs',
            'regular-er': 'Regular -er Verbs',
            'regular-ir': 'Regular -ir Verbs',
            'irregular-verbs': 'Irregular Verbs',
            'ser-estar': 'Ser vs Estar',
            'reflexive-verbs': 'Reflexive Verbs',
            'preterite-tense': 'Preterite Tense',
            'imperfect-tense': 'Imperfect Tense',
            'future-tense': 'Future Tense',
            'conditional-tense': 'Conditional Tense',
            'present-subjunctive': 'Present Subjunctive',
            'imperfect-subjunctive': 'Imperfect Subjunctive',
            'future-subjunctive': 'Future Subjunctive',
            'imperative': 'Imperative',
            'present-continuous': 'Present Continuous',
            'immediate-future': 'Immediate Future',
            'noun-plurals': 'Noun Plurals',
            'adjective-agreement': 'Adjective Agreement',
            'demonstratives': 'Demonstratives',
            'advanced-demonstratives': 'Advanced Demonstratives',
            'possessives': 'Possessives',
            'object-pronouns': 'Object Pronouns',
            'common-prepositions': 'Common Prepositions',
            'por-vs-para': 'Por vs Para',
            'contractions-articles': 'Contractions (de/em)',
            'contractions-de': 'Contractions (dele/dela)',
            'contractions-em': 'Contractions (nele/nela)',
            'question-words': 'Question Words',
            'interrogatives': 'Interrogatives',
            'e-que-questions': 'É que Questions',
            'conversational-answers': 'Conversational Answers',
            'colloquial-speech': 'Colloquial Speech',
            'self-introduction': 'Self Introduction',
            'phonetics-br': 'Brazilian Phonetics',
            'syllable-stress': 'Syllable Stress',
            'crase': 'Crase',
            'time-expressions': 'Time Expressions',
            'numbers': 'Numbers',
            'colors': 'Colors',
            'days-of-week': 'Days of the Week',
            'ir-transportation': 'Ir + Transportation',
            'subject-identification': 'Subject Identification',
            'portuguese-for-spanish': 'Portuguese for Spanish Speakers',
            'a1-simplifier': 'A1 Text Simplifier'
        };
        return names[drillId] || drillId;
    }

    async renderLearningPathsModal() {
        if (!this.dependencies) {
            await this.loadDependencies();
        }

        const modal = document.createElement('div');
        modal.id = 'learning-paths-modal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };

        const content = document.createElement('div');
        content.className = 'bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto';
        content.onclick = (e) => e.stopPropagation();

        const paths = this.dependencies.learningPaths;
        const stats = this.getProgressStats();

        content.innerHTML = `
            <div class="sticky top-0 bg-white border-b border-slate-200 p-6 rounded-t-2xl">
                <div class="flex justify-between items-start">
                    <div>
                        <h2 class="text-3xl font-bold text-slate-900">Learning Paths</h2>
                        <p class="text-slate-600 mt-2">Choose your learning journey</p>
                    </div>
                    <button onclick="document.getElementById('learning-paths-modal').remove()" class="text-slate-400 hover:text-slate-600 text-2xl">×</button>
                </div>
                <div class="mt-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-semibold text-slate-700">Your Progress</span>
                        <span class="text-sm font-bold text-slate-900">${stats.completed}/${stats.total} drills completed</span>
                    </div>
                    <div class="mt-2 w-full bg-slate-200 rounded-full h-2">
                        <div class="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500" style="width: ${stats.percentage}%"></div>
                    </div>
                </div>
            </div>

            <div class="p-6 space-y-6">
                ${Object.entries(paths).map(([pathId, path]) => `
                    <div class="border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                        <div class="flex items-start justify-between">
                            <div class="flex-grow">
                                <h3 class="text-xl font-bold text-slate-900">${path.name}</h3>
                                <p class="text-slate-600 mt-1">${path.description}</p>
                                <div class="mt-3 flex items-center gap-4 text-sm">
                                    <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold">
                                        Target: ${path.targetLevel}
                                    </span>
                                    <span class="text-slate-600">
                                        ${path.recommendedOrder.length} drills
                                    </span>
                                </div>
                            </div>
                            <button onclick="showPathDetails('${pathId}')" class="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
                                View Path
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);
    }

    async renderPathDetails(pathId) {
        if (!this.dependencies) {
            await this.loadDependencies();
        }

        const path = this.dependencies.learningPaths[pathId];
        if (!path) return;

        const modal = document.getElementById('learning-paths-modal');
        if (modal) modal.remove();

        const detailModal = document.createElement('div');
        detailModal.id = 'path-details-modal';
        detailModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        detailModal.onclick = (e) => {
            if (e.target === detailModal) detailModal.remove();
        };

        const content = document.createElement('div');
        content.className = 'bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto';
        content.onclick = (e) => e.stopPropagation();

        const completedCount = path.recommendedOrder.filter(drillId => this.isDrillCompleted(drillId)).length;
        const progressPercent = Math.round((completedCount / path.recommendedOrder.length) * 100);

        content.innerHTML = `
            <div class="sticky top-0 bg-white border-b border-slate-200 p-6 rounded-t-2xl">
                <div class="flex justify-between items-start">
                    <div>
                        <h2 class="text-3xl font-bold text-slate-900">${path.name}</h2>
                        <p class="text-slate-600 mt-2">${path.description}</p>
                        <div class="mt-3 flex items-center gap-3">
                            <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold text-sm">
                                ${path.targetLevel}
                            </span>
                            <span class="text-sm text-slate-600">
                                ${completedCount}/${path.recommendedOrder.length} completed (${progressPercent}%)
                            </span>
                        </div>
                    </div>
                    <button onclick="document.getElementById('path-details-modal').remove()" class="text-slate-400 hover:text-slate-600 text-2xl">×</button>
                </div>
                <div class="mt-4 w-full bg-slate-200 rounded-full h-2">
                    <div class="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500" style="width: ${progressPercent}%"></div>
                </div>
            </div>

            <div class="p-6">
                <div class="space-y-3">
                    ${path.recommendedOrder.map((drillId, index) => {
                        const isCompleted = this.isDrillCompleted(drillId);
                        const canAccess = this.canAccessDrill(drillId);
                        const drillMeta = this.dependencies.drillMetadata[drillId];
                        const level = this.getDrillLevel(drillId);
                        const difficulty = this.getDrillDifficulty(drillId);
                        const estimatedTime = this.getEstimatedTime(drillId);

                        const levelColors = {
                            'A1': 'bg-green-100 text-green-800',
                            'A2': 'bg-blue-100 text-blue-800',
                            'B1': 'bg-yellow-100 text-yellow-800',
                            'B2': 'bg-orange-100 text-orange-800'
                        };

                        return `
                            <div class="flex items-center gap-4 p-4 border border-slate-200 rounded-lg ${!canAccess ? 'opacity-50' : ''} ${isCompleted ? 'bg-green-50' : 'bg-white'}">
                                <div class="flex-shrink-0 w-8 h-8 ${isCompleted ? 'bg-green-500' : canAccess ? 'bg-blue-500' : 'bg-slate-300'} text-white rounded-full flex items-center justify-center font-bold text-sm">
                                    ${isCompleted ? '✓' : index + 1}
                                </div>
                                <div class="flex-grow">
                                    <div class="font-semibold text-slate-900">${this.getDrillName(drillId)}</div>
                                    <div class="flex items-center gap-2 mt-1 text-xs">
                                        <span class="${levelColors[level]} px-2 py-0.5 rounded-full font-semibold">${level}</span>
                                        <span class="text-slate-600">Difficulty: ${'⭐'.repeat(Math.min(difficulty, 5))}</span>
                                        <span class="text-slate-600">⏱️ ${estimatedTime}</span>
                                    </div>
                                </div>
                                ${canAccess ? `
                                    <button onclick="startDrill('${drillId}')" class="px-4 py-2 ${isCompleted ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg font-semibold text-sm transition-colors">
                                        ${isCompleted ? 'Practice Again' : 'Start'}
                                    </button>
                                ` : `
                                    <span class="text-2xl">🔒</span>
                                `}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;

        detailModal.appendChild(content);
        document.body.appendChild(detailModal);
    }
}

// Global instance
const dependencyManager = new DependencyManager();

// Global functions for onclick handlers
window.showLearningPaths = async function() {
    await dependencyManager.renderLearningPathsModal();
};

window.showPathDetails = async function(pathId) {
    await dependencyManager.renderPathDetails(pathId);
};

window.startDrill = function(drillId) {
    const modal = document.getElementById('path-details-modal');
    if (modal) modal.remove();

    // This should integrate with your existing drill starting logic
    // For now, we'll just navigate to the drill
    const element = document.querySelector(`[data-drill-id="${drillId}"]`);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        element.click();
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    await dependencyManager.loadDependencies();
    console.log('Dependency system loaded');
});
