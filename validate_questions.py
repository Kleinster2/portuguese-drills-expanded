import json

def validate_question_bank():
    input_path = 'config/placement-test-questions-v10.9-no-hints.json'
    
    try:
        with open(input_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading JSON: {e}")
        return

    questions = data.get('questions', [])
    print(f"Validating {len(questions)} questions...")

    issues = []
    seen_ids = set()

    for q in questions:
        # 1. Check ID Uniqueness
        if q['id'] in seen_ids:
            issues.append(f"Duplicate ID found: {q['id']}")
        seen_ids.add(q['id'])

        # 2. Check Template Format
        if 'template' in q and '__' not in q['template']:
             issues.append(f"Q{q['id']}: Template missing '__' placeholder: '{q['template']}'")

        # 3. Check Correct Answer in Chips (for Production)
        if q.get('type') in ['production', 'contextualizedProduction', 'quickCheck']:
            if 'correct' in q and 'chips' in q:
                if q['correct'] not in q['chips']:
                     issues.append(f"Q{q['id']}: Correct answer '{q['correct']}' not found in chips: {q['chips']}")

        # 4. Check for missing fields
        required_fields = ['id', 'unit', 'phase', 'type', 'en', 'question']
        for field in required_fields:
            if field not in q:
                issues.append(f"Q{q['id']}: Missing required field '{field}'")

    if not issues:
        print("✅ Validation passed! No logical errors found.")
    else:
        print(f"❌ Found {len(issues)} issues:")
        for issue in issues:
            print(f" - {issue}")

if __name__ == "__main__":
    validate_question_bank()
