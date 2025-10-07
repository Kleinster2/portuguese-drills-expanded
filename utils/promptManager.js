/**
 * Prompt Manager - Loads and manages drill prompts from JSON configuration files
 */

import fs from 'fs';
import path from 'path';

class PromptManager {
  constructor() {
    this.prompts = new Map();
    this.promptsDir = path.join(process.cwd(), 'config', 'prompts');
    this.loadPrompts();
  }

  /**
   * Load all prompt configuration files from the config/prompts directory
   */
  loadPrompts() {
    try {
      // Check if prompts directory exists
      if (!fs.existsSync(this.promptsDir)) {
        console.warn(`Prompts directory not found: ${this.promptsDir}`);
        return;
      }

      // Read all JSON files in the prompts directory
      const files = fs.readdirSync(this.promptsDir).filter(file => file.endsWith('.json'));
      
      for (const file of files) {
        const filePath = path.join(this.promptsDir, file);
        try {
          const content = fs.readFileSync(filePath, 'utf-8');
          const promptConfig = JSON.parse(content);
          
          // Validate prompt structure
          if (!promptConfig.id || !promptConfig.systemPrompt) {
            console.error(`Invalid prompt configuration in ${file}: missing id or systemPrompt`);
            continue;
          }

          this.prompts.set(promptConfig.id, promptConfig);
          console.log(`✓ Loaded prompt configuration: ${promptConfig.id} (${promptConfig.name})`);
        } catch (error) {
          console.error(`Error loading prompt file ${file}:`, error.message);
        }
      }

      if (this.prompts.size === 0) {
        console.warn('No valid prompt configurations loaded');
      }
    } catch (error) {
      console.error('Error loading prompt configurations:', error);
    }
  }

  /**
   * Get prompt configuration for a specific drill
   * @param {string} drillId - The drill identifier
   * @returns {Object|null} The prompt configuration or null if not found
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
  getAllPrompts() {
    return Array.from(this.prompts.values());
  }

  /**
   * Get list of available drill IDs
   * @returns {Array} Array of drill IDs
   */
  getAvailableDrills() {
    return Array.from(this.prompts.keys());
  }

  /**
   * Reload all prompt configurations (useful for development)
   */
  reload() {
    this.prompts.clear();
    this.loadPrompts();
  }

  /**
   * Get metadata for a specific drill
   * @param {string} drillId - The drill identifier
   * @returns {Object} Metadata object with id, name, description
   */
  getDrillMetadata(drillId) {
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