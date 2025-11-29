/**
 * Prompt Manager - Loads and manages drill prompts from generated configuration
 * Cloudflare Workers compatible version
 *
 * Prompts are loaded from promptData.generated.js which is auto-generated
 * by scripts/build-prompts.js from config/prompts/*.json files.
 */

import { promptConfigs } from './promptData.generated.js';

class PromptManager {
  constructor() {
    this.prompts = new Map(); // keyed by id
    this.initialized = false;
    this.loadPrompts();
  }

  /**
   * Load prompt configurations from generated data
   */
  loadPrompts() {
    try {
      Object.entries(promptConfigs).forEach(([filePath, cfg]) => {
        if (cfg && cfg.id) {
          this.prompts.set(cfg.id, cfg);
          console.log(`• Loaded prompt configuration: ${cfg.id} (${cfg.name})`);
        } else {
          console.warn(`Skipping ${filePath}: missing id`);
        }
      });

      if (this.prompts.size === 0) {
        throw new Error('No valid prompt configurations loaded');
      }

      this.initialized = true;
      console.log(`✓ Loaded ${this.prompts.size} prompt configurations`);
    } catch (error) {
      console.error('Error loading prompt configurations:', error);
      throw error;
    }
  }

  /**
   * Load a single prompt configuration by file path
   * Preserved for any callers that use file path lookup
   * @param {string} filePath - The relative path to the prompt config file
   * @returns {Object|null} The prompt configuration or null
   */
  loadPromptConfig(filePath) {
    return promptConfigs[filePath] || null;
  }

  /**
   * Get a specific drill configuration by ID
   * @param {string} drillId - The drill identifier
   * @returns {Object|null} The drill configuration or null
   */
  getPrompt(drillId) {
    return this.prompts.get(drillId) || null;
  }

  /**
   * Get the system prompt text for a specific drill
   * @param {string} drillId - The drill identifier
   * @returns {string} The system prompt text, or fallback for unknown drills
   */
  getSystemPrompt(drillId) {
    const promptConfig = this.getPrompt(drillId);
    if (promptConfig) {
      return promptConfig.systemPrompt;
    }

    // Fallback to regular-ar if drill not found
    const fallback = this.getPrompt('regular-ar');
    if (fallback) {
      console.warn(`Drill '${drillId}' not found, using 'regular-ar' as fallback`);
      return fallback.systemPrompt;
    }

    // Last resort fallback
    console.error(`No prompt configurations available for drill '${drillId}'`);
    return 'You are a helpful Portuguese language tutor. Please provide language learning exercises.';
  }

  /**
   * Get all available drill configurations
   * @returns {Array} Array of drill configurations
   */
  getAllDrills() {
    return Array.from(this.prompts.values());
  }

  /**
   * Get drill info for display purposes
   * @param {string} drillId - The drill identifier
   * @returns {Object} Object with id, name, and description
   */
  getDrillInfo(drillId) {
    const promptConfig = this.getPrompt(drillId);
    if (!promptConfig) {
      return {
        id: drillId,
        name: 'Unknown Drill',
        description: 'Drill configuration not found'
      };
    }

    return {
      id: promptConfig.id,
      name: promptConfig.name || promptConfig.id,
      description: promptConfig.description || 'No description available'
    };
  }
}

// Create a singleton instance
const promptManager = new PromptManager();

export default promptManager;
