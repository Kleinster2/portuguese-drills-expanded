#!/usr/bin/env python3
"""
Generate placeholder PWA icons
Creates simple colored squares with "PT" text and Brazilian flag emoji
"""

from PIL import Image, ImageDraw, ImageFont
import os

# Icon sizes needed for PWA
SIZES = [72, 96, 128, 144, 152, 192, 384, 512]

# Colors (sky blue gradient)
BG_COLOR_TOP = (14, 165, 233)  # #0ea5e9
BG_COLOR_BOTTOM = (2, 132, 199)  # #0284c7

def create_icon(size):
    """Create a single icon of the specified size"""

    # Create image with gradient background
    img = Image.new('RGB', (size, size), BG_COLOR_TOP)
    draw = ImageDraw.Draw(img)

    # Draw gradient background
    for y in range(size):
        ratio = y / size
        r = int(BG_COLOR_TOP[0] + (BG_COLOR_BOTTOM[0] - BG_COLOR_TOP[0]) * ratio)
        g = int(BG_COLOR_TOP[1] + (BG_COLOR_BOTTOM[1] - BG_COLOR_TOP[1]) * ratio)
        b = int(BG_COLOR_TOP[2] + (BG_COLOR_BOTTOM[2] - BG_COLOR_TOP[2]) * ratio)
        draw.line([(0, y), (size, y)], fill=(r, g, b))

    # Draw white rounded rectangle border (subtle)
    border_width = max(2, size // 64)
    draw.rectangle(
        [border_width, border_width, size - border_width, size - border_width],
        outline=(255, 255, 255, 50),
        width=border_width
    )

    # Draw "PT" text
    try:
        # Try to use a system font
        font_size = int(size * 0.35)
        font = ImageFont.truetype("arial.ttf", font_size)
    except:
        # Fallback to default font
        font = ImageFont.load_default()

    text = "PT"

    # Get text bounding box for centering
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    # Draw text centered at top third
    text_x = (size - text_width) // 2
    text_y = int(size * 0.25) - text_height // 2

    # Draw text with slight shadow for depth
    shadow_offset = max(1, size // 128)
    draw.text((text_x + shadow_offset, text_y + shadow_offset), text,
              fill=(0, 0, 0, 30), font=font)
    draw.text((text_x, text_y), text, fill=(255, 255, 255), font=font)

    # Draw "🇧🇷" emoji as text (will render as text, not emoji in PIL)
    # Instead, draw "BR" in smaller text
    try:
        flag_font_size = int(size * 0.15)
        flag_font = ImageFont.truetype("arial.ttf", flag_font_size)
    except:
        flag_font = ImageFont.load_default()

    flag_text = "BR"
    flag_bbox = draw.textbbox((0, 0), flag_text, font=flag_font)
    flag_width = flag_bbox[2] - flag_bbox[0]
    flag_height = flag_bbox[3] - flag_bbox[1]

    flag_x = (size - flag_width) // 2
    flag_y = int(size * 0.65) - flag_height // 2

    # Draw flag text
    draw.text((flag_x + shadow_offset, flag_y + shadow_offset), flag_text,
              fill=(0, 0, 0, 30), font=flag_font)
    draw.text((flag_x, flag_y), flag_text, fill=(255, 255, 255), font=flag_font)

    return img

def main():
    """Generate all icon sizes"""

    # Get script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    icons_dir = os.path.join(script_dir, 'icons')

    # Create icons directory if it doesn't exist
    os.makedirs(icons_dir, exist_ok=True)

    print("Generating PWA icons...")

    for size in SIZES:
        filename = f"icon-{size}.png"
        filepath = os.path.join(icons_dir, filename)

        print(f"  Creating {filename} ({size}x{size}px)...")

        img = create_icon(size)
        img.save(filepath, 'PNG', optimize=True)

        print(f"  [OK] Saved to {filepath}")

    print(f"\n[SUCCESS] Successfully generated {len(SIZES)} icons!")
    print(f"[FOLDER] Location: {icons_dir}")
    print("\nIcons created:")
    for size in SIZES:
        print(f"  - icon-{size}.png")

if __name__ == '__main__':
    main()
