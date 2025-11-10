#!/usr/bin/env python3
"""Quick script to add speaker buttons to remaining patterns"""

import re

# Read the file
with open('lessons/unit-1.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Speaker button template
speaker_template = '''                        <!-- Speaker button for all 3 steps -->
                        <div class="flex items-center gap-2 mb-2">
                            <button class="three-step-speaker speaker-btn" data-text="{text}" aria-label="Speak this sentence" title="Click to hear pronunciation">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.984 3.984 0 00-1.172-2.828 1 1 0 010-1.415z" clip-rule="evenodd"></path></svg>
                            </button>
                            <span class="text-xs text-gray-500">All steps sound the same</span>
                        </div>

'''

# Find and replace pattern: add speaker button before "<!-- Step 1: Original -->"
# Only if it doesn't already have a speaker button above it

def add_speaker_before_step1(match):
    full_match = match.group(0)

    # Check if speaker button already exists before this
    if 'three-step-speaker' in match.string[max(0, match.start()-500):match.start()]:
        return full_match

    # Extract the Portuguese text from Step 1
    step1_match = re.search(r'<div class="font-medium text-gray-900">([^<]+)</div>', full_match)
    if step1_match:
        portuguese_text = step1_match.group(1).strip()
        speaker_button = speaker_template.format(text=portuguese_text)
        # Insert speaker button before "<!-- Step 1: Original -->"
        return full_match.replace('<!-- Step 1: Original -->', speaker_button + '<!-- Step 1: Original -->')

    return full_match

# Pattern to match a complete three-step example WITHOUT a speaker button
pattern = r'<div class="example-sentence p-4 rounded bg-white border-l-2 border-transparent space-y-2">\s*<!-- Step 1: Original -->.*?</div>\s*</div>'

content = re.sub(pattern, add_speaker_before_step1, content, flags=re.DOTALL)

# Write back
with open('lessons/unit-1.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Speaker buttons added to all three-step examples!")
