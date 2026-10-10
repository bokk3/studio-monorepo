import os
import numpy as np
from PIL import Image, ImageDraw

def render_fighter_png(path):
    w, h = 800, 600
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Exhaust plumes
    draw.polygon([(340, 430), (355, 540), (370, 430)], fill=(0, 212, 255, 220))
    draw.polygon([(430, 430), (445, 540), (460, 430)], fill=(0, 212, 255, 220))

    # Wings
    wing_l = [(400, 160), (210, 360), (80, 410), (130, 430), (310, 390), (350, 420)]
    wing_r = [(400, 160), (590, 360), (720, 410), (670, 430), (490, 390), (450, 420)]
    draw.polygon(wing_l, fill=(30, 41, 59, 240), outline=(71, 85, 105, 255))
    draw.polygon(wing_r, fill=(30, 41, 59, 240), outline=(71, 85, 105, 255))

    # Wing leading edge blue trim
    draw.line([(400, 160), (210, 360), (80, 410)], fill=(0, 85, 255, 255), width=3)
    draw.line([(400, 160), (590, 360), (720, 410)], fill=(0, 85, 255, 255), width=3)

    # Fuselage
    fuse = [(400, 60), (445, 210), (435, 420), (400, 435), (365, 420), (355, 210)]
    draw.polygon(fuse, fill=(15, 23, 42, 255), outline=(100, 116, 139, 255))

    # Canopy (Solar Gold)
    canopy = [(400, 160), (416, 215), (412, 280), (400, 295), (388, 280), (384, 215)]
    draw.polygon(canopy, fill=(255, 184, 0, 255), outline=(255, 255, 255, 255))

    # Stabilizers
    draw.polygon([(340, 320), (325, 410), (338, 425), (352, 400)], fill=(30, 41, 59, 240), outline=(0, 85, 255, 255))
    draw.polygon([(460, 320), (475, 410), (462, 425), (448, 400)], fill=(30, 41, 59, 240), outline=(0, 85, 255, 255))

    img.save(path, "PNG")
    print(f"Generated transparent PNG: {path}")

def render_drone_png(path):
    w, h = 600, 600
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Exhaust
    draw.polygon([(275, 370), (300, 520), (325, 370)], fill=(255, 0, 255, 220))

    # Forward Swept Blades
    draw.polygon([(300, 210), (140, 150), (90, 260), (160, 280), (270, 300)], fill=(45, 10, 53, 240), outline=(255, 0, 255, 255))
    draw.polygon([(300, 210), (460, 150), (510, 260), (440, 280), (330, 300)], fill=(45, 10, 53, 240), outline=(255, 0, 255, 255))

    # Fuselage
    fuse = [(300, 80), (345, 190), (340, 360), (300, 385), (260, 360), (255, 190)]
    draw.polygon(fuse, fill=(21, 5, 27, 255), outline=(226, 232, 240, 255))

    # Gyro Sensor
    draw.ellipse([300 - 32, 260 - 32, 300 + 32, 260 + 32], fill=(9, 1, 12, 255), outline=(255, 0, 255, 255), width=2)
    draw.ellipse([300 - 22, 260 - 22, 300 + 22, 260 + 22], fill=(255, 51, 102, 255))
    draw.ellipse([300 - 8, 260 - 8, 300 + 8, 260 + 8], fill=(255, 255, 255, 255))

    img.save(path, "PNG")
    print(f"Generated transparent PNG: {path}")

def render_ball_png(path):
    w, h = 500, 500
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 3D Sphere
    draw.ellipse([250 - 160, 250 - 160, 250 + 160, 250 + 160], fill=(15, 23, 42, 255), outline=(51, 65, 85, 255), width=3)

    # Magnus Equator Ring
    draw.ellipse([250 - 150, 250 - 80, 250 + 150, 250 + 80], outline=(0, 243, 255, 220), width=3)
    draw.ellipse([250 - 80, 250 - 150, 250 + 80, 250 + 150], outline=(0, 255, 178, 200), width=2)

    # Core Hub
    draw.ellipse([250 - 28, 250 - 28, 250 + 28, 250 + 28], fill=(2, 6, 23, 255), outline=(0, 243, 255, 255), width=2)
    draw.polygon([(250, 228), (266, 242), (266, 258), (250, 272), (234, 258), (234, 242)], fill=(0, 255, 178, 255))
    draw.ellipse([250 - 6, 250 - 6, 250 + 6, 250 + 6], fill=(255, 255, 255, 255))

    img.save(path, "PNG")
    print(f"Generated transparent PNG: {path}")

def render_logo_highres_png(path):
    """Render a crystal-clear 1024x1024 Tachyon emblem with 100% transparent background."""
    w, h = 1024, 1024
    scale = 2
    img = Image.new("RGBA", (w * scale, h * scale), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    cx, cy = (w * scale) // 2, (h * scale) // 2

    # Concentric orbital rings
    draw.ellipse([cx - 400*scale, cy - 400*scale, cx + 400*scale, cy + 400*scale], outline=(0, 243, 255, 120), width=4*scale)
    draw.ellipse([cx - 320*scale, cy - 320*scale, cx + 320*scale, cy + 320*scale], outline=(255, 0, 255, 100), width=3*scale)
    draw.ellipse([cx - 240*scale, cy - 240*scale, cx + 240*scale, cy + 240*scale], outline=(0, 85, 255, 80), width=2*scale)

    # Left Wing (Aero Cyan)
    lw = [
        (cx - 320*scale, cy - 120*scale),
        (cx - 40*scale, cy - 120*scale),
        (cx - 80*scale, cy - 40*scale),
        (cx - 240*scale, cy - 40*scale),
        (cx - 300*scale, cy + 40*scale),
        (cx - 380*scale, cy + 40*scale)
    ]
    draw.polygon(lw, fill=(0, 243, 255, 240), outline=(255, 255, 255, 255))

    # Right Wing (Pulse Magenta)
    rw = [
        (cx + 320*scale, cy - 120*scale),
        (cx + 40*scale, cy - 120*scale),
        (cx + 80*scale, cy - 40*scale),
        (cx + 240*scale, cy - 40*scale),
        (cx + 300*scale, cy + 40*scale),
        (cx + 380*scale, cy + 40*scale)
    ]
    draw.polygon(rw, fill=(255, 0, 255, 240), outline=(255, 255, 255, 255))

    # Center Crest
    crest = [
        (cx, cy - 200*scale),
        (cx + 100*scale, cy - 120*scale),
        (cx, cy - 70*scale),
        (cx - 100*scale, cy - 120*scale)
    ]
    draw.polygon(crest, fill=(255, 255, 255, 255), outline=(0, 243, 255, 255))

    # Center Diamond
    diamond = [
        (cx, cy - 50*scale),
        (cx + 50*scale, cy + 30*scale),
        (cx, cy + 110*scale),
        (cx - 50*scale, cy + 30*scale)
    ]
    draw.polygon(diamond, fill=(255, 255, 255, 255), outline=(0, 85, 255, 255))

    # Stems
    draw.polygon([
        (cx - 45*scale, cy - 60*scale),
        (cx - 12*scale, cy - 60*scale),
        (cx - 12*scale, cy + 220*scale),
        (cx - 52*scale, cy + 300*scale),
        (cx - 80*scale, cy + 300*scale),
        (cx - 45*scale, cy + 190*scale)
    ], fill=(0, 243, 255, 245), outline=(0, 243, 255, 255))

    draw.polygon([
        (cx + 45*scale, cy - 60*scale),
        (cx + 12*scale, cy - 60*scale),
        (cx + 12*scale, cy + 220*scale),
        (cx + 52*scale, cy + 300*scale),
        (cx + 80*scale, cy + 300*scale),
        (cx + 45*scale, cy + 190*scale)
    ], fill=(255, 0, 255, 245), outline=(255, 0, 255, 255))

    # Supersampled antialiasing downscale
    res = img.resize((w, h), Image.Resampling.LANCZOS)
    res.save(path, "PNG")
    print(f"Generated transparent PNG: {path}")

def render_website_branding_png(path):
    """Render a horizontal 1376x400 transparent hero lockup with ZERO background grid."""
    w, h = 1376, 400
    scale = 2
    img = Image.new("RGBA", (w * scale, h * scale), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    cx, cy = 200 * scale, 200 * scale

    # Emblem in lockup
    draw.ellipse([cx - 160*scale, cy - 160*scale, cx + 160*scale, cy + 160*scale], outline=(0, 243, 255, 120), width=3*scale)
    draw.ellipse([cx - 125*scale, cy - 125*scale, cx + 125*scale, cy + 125*scale], outline=(255, 0, 255, 90), width=2*scale)

    lw = [(cx - 130*scale, cy - 50*scale), (cx - 15*scale, cy - 50*scale), (cx - 35*scale, cy - 15*scale), (cx - 100*scale, cy - 15*scale), (cx - 120*scale, cy + 15*scale), (cx - 155*scale, cy + 15*scale)]
    draw.polygon(lw, fill=(0, 243, 255, 240), outline=(255, 255, 255, 255))

    rw = [(cx + 130*scale, cy - 50*scale), (cx + 15*scale, cy - 50*scale), (cx + 35*scale, cy - 15*scale), (cx + 100*scale, cy - 15*scale), (cx + 120*scale, cy + 15*scale), (cx + 155*scale, cy + 15*scale)]
    draw.polygon(rw, fill=(255, 0, 255, 240), outline=(255, 255, 255, 255))

    crest = [(cx, cy - 80*scale), (cx + 40*scale, cy - 50*scale), (cx, cy - 30*scale), (cx - 40*scale, cy - 50*scale)]
    draw.polygon(crest, fill=(255, 255, 255, 255), outline=(0, 243, 255, 255))

    diamond = [(cx, cy - 20*scale), (cx + 20*scale, cy + 10*scale), (cx, cy + 40*scale), (cx - 20*scale, cy + 10*scale)]
    draw.polygon(diamond, fill=(255, 255, 255, 255), outline=(0, 85, 255, 255))

    draw.polygon([(cx - 18*scale, cy - 25*scale), (cx - 5*scale, cy - 25*scale), (cx - 5*scale, cy + 90*scale), (cx - 22*scale, cy + 120*scale), (cx - 32*scale, cy + 120*scale), (cx - 18*scale, cy + 80*scale)], fill=(0, 243, 255, 240))
    draw.polygon([(cx + 18*scale, cy - 25*scale), (cx + 5*scale, cy - 25*scale), (cx + 5*scale, cy + 90*scale), (cx + 22*scale, cy + 120*scale), (cx + 32*scale, cy + 120*scale), (cx + 18*scale, cy + 80*scale)], fill=(255, 0, 255, 240))

    # Sleek Horizontal Horizon Lines
    tx = 420 * scale
    draw.line([(tx, 90*scale), (w*scale - 60*scale, 90*scale)], fill=(0, 243, 255, 140), width=2*scale)
    draw.line([(tx, 310*scale), (w*scale - 60*scale, 310*scale)], fill=(255, 0, 255, 140), width=2*scale)

    # Geometric Lettering for TACHYON
    letters = [
        # T
        {"type": "lines", "paths": [((440*scale, 130*scale), (520*scale, 130*scale)), ((480*scale, 130*scale), (480*scale, 260*scale))], "w": 18*scale},
        # A
        {"type": "lines", "paths": [((540*scale, 260*scale), (580*scale, 130*scale)), ((580*scale, 130*scale), (620*scale, 260*scale)), ((555*scale, 215*scale), (605*scale, 215*scale))], "w": 18*scale},
        # C
        {"type": "lines", "paths": [((710*scale, 145*scale), (660*scale, 130*scale)), ((660*scale, 130*scale), (640*scale, 195*scale)), ((640*scale, 195*scale), (660*scale, 260*scale)), ((660*scale, 260*scale), (710*scale, 245*scale))], "w": 18*scale},
        # H
        {"type": "lines", "paths": [((730*scale, 130*scale), (730*scale, 260*scale)), ((810*scale, 130*scale), (810*scale, 260*scale)), ((730*scale, 195*scale), (810*scale, 195*scale))], "w": 18*scale},
        # Y
        {"type": "lines", "paths": [((830*scale, 130*scale), (875*scale, 195*scale)), ((920*scale, 130*scale), (875*scale, 195*scale)), ((875*scale, 195*scale), (875*scale, 260*scale))], "w": 18*scale},
        # O
        {"type": "rect", "box": [940*scale, 130*scale, 1020*scale, 260*scale], "w": 18*scale},
        # N
        {"type": "lines", "paths": [((1040*scale, 260*scale), (1040*scale, 130*scale)), ((1040*scale, 130*scale), (1120*scale, 260*scale)), ((1120*scale, 260*scale), (1120*scale, 130*scale))], "w": 18*scale},
    ]

    for item in letters:
        if item["type"] == "lines":
            for p1, p2 in item["paths"]:
                draw.line([p1, p2], fill=(255, 255, 255, 255), width=item["w"])
        elif item["type"] == "rect":
            draw.rectangle(item["box"], outline=(255, 255, 255, 255), width=item["w"])

    # Subtitle telemetry dashes
    draw.line([(440*scale, 285*scale), (820*scale, 285*scale)], fill=(0, 243, 255, 220), width=3*scale)
    draw.line([(840*scale, 285*scale), (1120*scale, 285*scale)], fill=(255, 0, 255, 220), width=3*scale)

    res = img.resize((w, h), Image.Resampling.LANCZOS)
    res.save(path, "PNG")
    print(f"Generated transparent PNG: {path}")

if __name__ == "__main__":
    os.makedirs("docs/assets", exist_ok=True)
    os.makedirs("apps/web-gateway/public", exist_ok=True)

    render_fighter_png("docs/assets/tachyon_fighter_concept.png")
    render_fighter_png("apps/web-gateway/public/tachyon_fighter_concept.png")

    render_drone_png("docs/assets/tachyon_drone_concept.png")
    render_drone_png("apps/web-gateway/public/tachyon_drone_concept.png")

    render_ball_png("docs/assets/tachyon_ball_concept.png")
    render_ball_png("apps/web-gateway/public/tachyon_ball_concept.png")

    render_logo_highres_png("docs/assets/tachyon_logo_highres.png")
    render_logo_highres_png("apps/web-gateway/public/tachyon_logo_highres.png")

    render_website_branding_png("docs/assets/tachyon_website_branding.png")
    render_website_branding_png("apps/web-gateway/public/tachyon_website_branding.png")
