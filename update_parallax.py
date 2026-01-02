import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace all the SVG divs with simple img tags
old_pattern = r'<div class="parallax-wrapper"[^>]*>\s*<!-- Sky with Moon Layer -->.*?<!-- Foreground Layer \(Dark Red/Pink\) -->.*?</div>\s+<!-- Hero Content'

new_pattern = '''<div class="parallax-wrapper" style="background: #2a1a4e;">
            <!-- Parallax Image Layers -->
            <img src="assets/images/moon-sky.png" class="parallax-layer" data-speed="0.02" alt="Moon and Sky">
            <img src="assets/images/trees.png" class="parallax-layer" data-speed="0.15" alt="Forest">
            <img src="assets/images/mountains.png" class="parallax-layer" data-speed="0.25" alt="Mountains">
            <img src="assets/images/foreground.png" class="parallax-layer" data-speed="0.35" alt="Foreground">
            
            <!-- Hero Content'''

content_new = re.sub(old_pattern, new_pattern, content, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content_new)

print("✓ Updated index.html to use image files for parallax layers")
