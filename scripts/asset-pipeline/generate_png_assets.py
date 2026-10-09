import math
from PIL import Image, ImageDraw, ImageFont
import os

def create_transparent_mark(path):
    size = 512
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    cx, cy = size // 2, size // 2

    # Draw glow rings
    for r, width, color in [
        (210, 2, (0, 243, 255, 60)),
        (170, 2, (255, 0, 255, 50)),
        (120, 2, (0, 85, 255, 80))
    ]:
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=color, width=width)

    # Upper wings
    wing_left = [(72, 136), (240, 136), (216, 184), (120, 184), (88, 232), (40, 232)]
    wing_right = [(440, 136), (272, 136), (296, 184), (392, 184), (424, 232), (472, 232)]
    draw.polygon(wing_left, fill=(0, 243, 255, 220), outline=(0, 243, 255, 255))
    draw.polygon(wing_right, fill=(255, 0, 255, 220), outline=(255, 0, 255, 255))

    # Center crest cap
    crest = [(256, 92), (316, 140), (256, 168), (196, 140)]
    draw.polygon(crest, fill=(255, 255, 255, 240), outline=(0, 243, 255, 255))

    # Twin vertical accelerators
    stem_left = [(228, 176), (248, 176), (248, 376), (224, 432), (208, 432), (228, 356)]
    stem_right = [(284, 176), (264, 176), (264, 376), (288, 432), (304, 432), (284, 356)]
    draw.polygon(stem_left, fill=(0, 243, 255, 230), outline=(0, 243, 255, 255))
    draw.polygon(stem_right, fill=(255, 0, 255, 230), outline=(255, 0, 255, 255))

    # Core fusion diamond
    diamond = [(256, 204), (286, 256), (256, 308), (226, 256)]
    draw.polygon(diamond, fill=(255, 255, 255, 250), outline=(0, 243, 255, 255))
    inner_diamond = [(256, 220), (274, 256), (256, 292), (238, 256)]
    draw.polygon(inner_diamond, fill=(0, 85, 255, 240))

    # Accelerating particle beam
    draw.line([(256, 40), (256, 92)], fill=(255, 255, 255, 255), width=3)
    draw.line([(256, 316), (256, 460)], fill=(0, 243, 255, 200), width=3)

    img.save(path, "PNG")
    print(f"Generated transparent PNG: {path}")

def create_transparent_logo(path):
    w, h = 1200, 320
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Left Mark (scaled)
    cx, cy = 160, 160
    draw.ellipse([cx - 110, cy - 110, cx + 110, cy + 110], outline=(0, 243, 255, 70), width=2)
    draw.ellipse([cx - 85, cy - 85, cx + 85, cy + 85], outline=(255, 0, 255, 60), width=1)

    # Mini mark wings
    wl = [(cx - 90, cy - 40), (cx - 15, cy - 40), (cx - 26, cy - 15), (cx - 70, cy - 15), (cx - 85, cy + 5)]
    wr = [(cx + 90, cy - 40), (cx + 15, cy - 40), (cx + 26, cy - 15), (cx + 70, cy - 15), (cx + 85, cy + 5)]
    draw.polygon(wl, fill=(0, 243, 255, 230), outline=(0, 243, 255, 255))
    draw.polygon(wr, fill=(255, 0, 255, 230), outline=(255, 0, 255, 255))
    crest = [(cx, cy - 65), (cx + 30, cy - 40), (cx, cy - 25), (cx - 30, cy - 40)]
    draw.polygon(crest, fill=(255, 255, 255, 250))
    draw.polygon([(cx - 10, cy - 20), (cx - 3, cy - 20), (cx - 3, cy + 60), (cx - 15, cy + 80)], fill=(0, 243, 255, 240))
    draw.polygon([(cx + 10, cy - 20), (cx + 3, cy - 20), (cx + 3, cy + 60), (cx + 15, cy + 80)], fill=(255, 0, 255, 240))
    draw.polygon([(cx, cy - 5), (cx + 14, cy + 15), (cx, cy + 35), (cx - 14, cy + 15)], fill=(255, 255, 255, 255))

    # Tech divider line
    draw.line([(320, 72), (1140, 72)], fill=(0, 243, 255, 90), width=1)
    draw.ellipse([1140, 70, 1144, 74], fill=(255, 0, 255, 200))

    # TACHYON Lettering (Geometric vector blocks)
    # T
    draw.polygon([(340, 100), (410, 100), (410, 122), (386, 122), (386, 210), (364, 210), (364, 122), (340, 122)], fill=(255, 255, 255, 255))
    # A
    draw.polygon([(425, 210), (445, 100), (475, 100), (495, 210), (473, 210), (466, 180), (454, 180), (447, 210)], fill=(0, 243, 255, 255))
    draw.polygon([(457, 130), (463, 160), (451, 160)], fill=(0, 0, 0, 0)) # cutout
    # C
    draw.polygon([(545, 122), (545, 100), (505, 100), (505, 210), (545, 210), (545, 188), (527, 188), (527, 122)], fill=(255, 255, 255, 255))
    # H
    draw.polygon([(560, 100), (582, 100), (582, 142), (618, 142), (618, 100), (640, 100), (640, 210), (618, 210), (618, 166), (582, 166), (582, 210), (560, 210)], fill=(0, 243, 255, 255))
    # Y
    draw.polygon([(652, 100), (676, 100), (692, 148), (708, 100), (732, 100), (702, 165), (702, 210), (682, 210), (682, 165)], fill=(255, 255, 255, 255))
    # O
    draw.polygon([(744, 100), (794, 100), (794, 210), (744, 210)], fill=(0, 243, 255, 255))
    draw.polygon([(764, 124), (774, 124), (774, 186), (764, 186)], fill=(0, 0, 0, 0)) # cutout
    # N
    draw.polygon([(808, 100), (830, 100), (868, 175), (868, 100), (890, 100), (890, 210), (868, 210), (830, 135), (830, 210), (808, 210)], fill=(255, 255, 255, 255))

    # Subtitle underline & nodes
    draw.line([(340, 250), (1140, 250)], fill=(0, 243, 255, 180), width=2)
    draw.line([(340, 254), (520, 254)], fill=(255, 0, 255, 200), width=2)

    img.save(path, "PNG")
    print(f"Generated transparent PNG: {path}")

if __name__ == "__main__":
    os.makedirs("docs/assets", exist_ok=True)
    os.makedirs("apps/web-gateway/public", exist_ok=True)
    
    create_transparent_mark("docs/assets/tachyon_mark.png")
    create_transparent_logo("docs/assets/tachyon_logo_full.png")
    
    # Also copy to web-gateway
    create_transparent_mark("apps/web-gateway/public/tachyon_mark.png")
    create_transparent_logo("apps/web-gateway/public/tachyon_logo_full.png")
