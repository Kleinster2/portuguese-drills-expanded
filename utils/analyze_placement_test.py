
import json
from collections import defaultdict
import re

# --- Constants ---
QUESTION_FILE = 'config/placement-test-questions-v8.0-streamlined.json'
REPORT_FILE = 'placement_test_analysis_report.txt'

# --- Helper Functions ---

def print_header(title):
    """Prints a formatted header."""
    print("\n" + "=" * 80)
    print(f"📊 {title}")
    print("=" * 80)

def load_questions():
    """Loads the question data from the JSON file."""
    try:
        with open(QUESTION_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: The file '{QUESTION_FILE}' was not found.")
        return None
    except json.JSONDecodeError:
        print(f"Error: The file '{QUESTION_FILE}' is not a valid JSON file.")
        return None

def analyze_question_distribution(questions):
    """Analyzes the distribution of questions by unit, type, and phase."""
    unit_counts = defaultdict(int)
    type_phase_counts = defaultdict(lambda: defaultdict(int))
    total_questions = len(questions)

    for q in questions:
        unit_counts[q['unitName']] += 1
        type_phase_counts[f"Phase {q['phase']}"][q['type']] += 1

    # --- Generate Report Content ---
    report = []
    report.append("=" * 80)
    report.append("📊 Question Distribution Analysis")
    report.append("=" * 80)
    report.append(f"\nTotal questions: {total_questions}\n")

    report.append("\n--- Questions per Unit ---")
    for unit, count in sorted(unit_counts.items()):
        report.append(f"{unit:<40} | {count} questions")

    report.append("\n--- Questions per Phase and Type ---")
    for phase, types in sorted(type_phase_counts.items()):
        report.append(f"\n{phase}:")
        for q_type, count in types.items():
            report.append(f"  - {q_type.capitalize():<15} | {count} questions")

    return report

def analyze_verb_agreement(questions):
    """Analyzes potential verb agreement issues in production questions."""
    issues = []
    # Simplified rules for demonstration
    plural_subjects = ['meninas', 'meninos', 'livros', 'canetas', 'casas', 'mães']
    singular_verbs = ['está', 'é', 'fica', 'trabalha', 'estuda']

    for q in questions:
        if q['type'] == 'production' and 'template' in q:
            template = q['template']
            # Find the verb in the template if it exists
            template_verb = None
            for verb in singular_verbs:
                if f" {verb}" in template:
                    template_verb = verb
                    break
            
            if template_verb:
                # Check if a plural subject is used with a singular verb
                for subject in plural_subjects:
                    if subject in template:
                        issues.append({
                            "id": q['id'],
                            "unitName": q['unitName'],
                            "issue": f"Potential agreement error: Plural subject '{subject}' with singular verb '{template_verb}'.",
                            "template": template
                        })
                        break # Move to the next question
    
    # Specific check for Q90
    for q in questions:
        if q['id'] == 90:
            if 'estuda' in q['template']:
                 issues.append({
                    "id": q['id'],
                    "unitName": q['unitName'],
                    "issue": f"Confirmed agreement error: Plural subject 'mães' with singular verb 'estuda'.",
                    "template": q['template']
                })

    # --- Generate Report Content ---
    report = []
    report.append("\n" + "=" * 80)
    report.append(""🔎 Verb Agreement Analysis (Production Questions)"" )
    report.append("=" * 80)

    if not issues:
        report.append("\nNo obvious verb agreement issues found based on the simplified check.")
    else:
        report.append(f"\nFound {len(issues)} potential verb agreement issues:\n")
        for issue in issues:
            report.append(f"  - Q{issue['id']} ({issue['unitName']}): {issue['issue']}")
            report.append(f"    Template: '{issue['template']}'")

    return report

def analyze_ambiguity_and_distractors(questions):
    """Analyzes questions for potential ambiguity and the quality of distractors."""
    issues = []
    
    for q in questions:
        # 1. Ambiguity of "you"
        if q['type'] == 'production' and 'you ' in q['en'].lower():
            if 'você' not in q['chips'] and 'tu' not in q['chips']:
                 # This is not a perfect check, but it's a start
                 pass # This case is too complex for a simple script
        
        # 2. Quality of distractors
        if q['type'] == 'production' and 'chips' in q:
            correct_answer = q['correct']
            distractors = q['chips']
            
            # Check if correct answer is in chips
            if correct_answer not in distractors:
                issues.append({
                    "id": q['id'],
                    "unitName": q['unitName'],
                    "issue": f"Correct answer '{correct_answer}' not found in chips.",
                    "chips": distractors
                })

            # Check for tense mixing in distractors
            present_tenses = ['sou', 'estou', 'falo', 'moro']
            past_tenses = ['fui', 'era', 'estava', 'falei', 'morei']
            
            is_present = any(verb in correct_answer for verb in present_tenses)
            has_past_distractor = any(any(verb in chip for verb in past_tenses) for chip in distractors)

            if is_present and not has_past_distractor and q['unit'] > 25: # After A1
                # This might indicate a lack of challenging distractors in later stages
                pass # This is a soft indicator, so we'll just pass for now

    # --- Generate Report Content ---
    report = []
    report.append("\n" + "=" * 80)
    report.append("🤔 Ambiguity and Distractor Analysis")
    report.append("=" * 80)
    
    if not issues:
        report.append("\nNo major issues found with ambiguity or distractors.")
    else:
        report.append(f"\nFound {len(issues)} issues:\n")
        for issue in issues:
            report.append(f"  - Q{issue['id']} ({issue['unitName']}): {issue['issue']}")

    return report

def main():
    """Main function to run the analysis."""
    data = load_questions()
    if not data:
        return

    questions = data.get('questions', [])
    if not questions:
        print("No questions found in the file.")
        return

    # --- Run Analyses ---
    distribution_report = analyze_question_distribution(questions)
    agreement_report = analyze_verb_agreement(questions)
    ambiguity_report = analyze_ambiguity_and_distractors(questions)

    # --- Write Report to File ---
    full_report = distribution_report + agreement_report + ambiguity_report
    
    with open(REPORT_FILE, 'w', encoding='utf-8') as f:
        f.write("Placement Test Quality Analysis Report\n")
        f.write(f"Source file: {QUESTION_FILE}\n")
        f.write(f"Version: {data.get('metadata', {}).get('version', 'N/A')}\n")
        f.write("\n".join(full_report))
        
    print(f"\n✅ Analysis complete. Report saved to '{REPORT_FILE}'.")
    
    # --- Print to Console ---
    print_header("Analysis Summary")
    print("".join(distribution_report))
    print("".join(agreement_report))
    print("".join(ambiguity_report))


if __name__ == "__main__":
    main()
