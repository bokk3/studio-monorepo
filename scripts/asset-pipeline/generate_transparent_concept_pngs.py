import math
from PIL import Image, ImageDraw
import os

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

if __name__ == "__main__":
    os.makedirs("docs/assets", exist_ok=True)
    os.makedirs("apps/web-gateway/public", exist_ok=True)

    render_fighter_png("docs/assets/tachyon_fighter_concept.png")
    render_fighter_png("apps/web-gateway/public/tachyon_fighter_concept.png")

    render_drone_png("docs/assets/tachyon_drone_concept.png")
    render_drone_png("apps/web-gateway/public/tachyon_drone_concept.png")

    render_ball_png("docs/assets/tachyon_ball_concept.png")
    render_ball_png("apps/web-gateway/public/tachyon_ball_concept.png")
