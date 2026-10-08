# Genera la fuente de iconos que sustituye a los emojis de la app.
#
# Cada emoji se dibuja con un simbolo Material (los mismos que el menu), en el
# color del texto. Sale src/iconos-emoji.css con la fuente en base64 y un
# unicode-range, para ponerla la primera en font-family: el navegador la usa
# solo para estos caracteres y el resto del texto sigue en Inter.
#
# Hace falta fonttools (pip install fonttools brotli) y los SVG de Material
# (npm install @material-design-icons/svg@0.14.13 en cualquier carpeta):
#
#   MATERIAL=<carpeta>/node_modules/@material-design-icons/svg/filled \n#     python scripts/iconos-emoji.py . [../otra-app]
#
# Para un emoji nuevo: añadelo a ICONOS (o a PROPIOS si Material no lo trae)
# y vuelve a ejecutarlo.
import base64, io, os, pathlib, sys
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.t2CharStringPen import T2CharStringPen
from fontTools.pens.transformPen import TransformPen
from fontTools.svgLib.path import SVGPath
from fontTools.ttLib import TTFont

MAT = pathlib.Path(os.environ.get('MATERIAL', 'node_modules/@material-design-icons/svg/filled'))

# Dibujos propios para lo que Material no trae (corona, gorra, gafas...).
PROPIOS = {
    'corona': 'M5 17 3 6.5l5 4L12 4l4 6.5 5-4L19 17H5zm0 2h14v2H5v-2z',
    'gorra': 'M12 6C7.6 6 4 9.1 4 13.2V15h12.5l5.5 1.2v-2.1l-2.3-.6C19.4 9.2 16.1 6 12 6zM3 16h12v2H3z',
    'gafas': 'M6.5 9a4 4 0 110 8 4 4 0 010-8zm0 1.8a2.2 2.2 0 100 4.4 2.2 2.2 0 000-4.4zM17.5 9a4 4 0 110 8 4 4 0 010-8zm0 1.8a2.2 2.2 0 100 4.4 2.2 2.2 0 000-4.4zM10 12h4v1.6h-4z',
    'bufanda': 'M5 5c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v3c0 1.1-.9 2-2 2h-2v10l-2.5-1.5L10 20V10H7c-1.1 0-2-.9-2-2V5z',
    'zapato': 'M2 17.5V14c0-1.1.9-2 2-2h2.5L9 8.5l3 1.8-1.4 2.2c1.2.9 2.7 1.5 4.4 1.5h4c1.7 0 3 1.3 3 3v.5H2zM2 19h21v2H2z',
    'zorro': 'M3 3l5 4.5h8L21 3v8.5C21 16.7 16.9 21 12 21s-9-4.3-9-9.5V3zm5.5 8.5a1.3 1.3 0 100 2.6 1.3 1.3 0 000-2.6zm7 0a1.3 1.3 0 100 2.6 1.3 1.3 0 000-2.6zM12 15.5l-1.8 1.3h3.6L12 15.5z',
    'moneda': 'M12 2a10 10 0 110 20 10 10 0 010-20zm0 2.2a7.8 7.8 0 100 15.6 7.8 7.8 0 000-15.6zm0 1.3a6.5 6.5 0 110 13 6.5 6.5 0 010-13zm-1 2.5v7h2V8h-2z',
    'circulo': 'M12 4a8 8 0 110 16 8 8 0 010-16z',
}

ICONOS = {
    '✅': 'check_box', '✨': 'auto_awesome', '👑': '#corona', '💬': 'chat', '💡': 'lightbulb',
    '📖': 'menu_book', '📝': 'edit_note', '🪙': '#moneda', '⚡': 'bolt', '🎲': 'casino',
    '🔄': 'autorenew', '⚠': 'warning', '🩹': 'healing', '🎯': 'adjust', '🗣': 'record_voice_over',
    '⭐': 'star', '🔀': 'shuffle', '🧩': 'extension', '🔁': 'repeat', '📋': 'content_paste',
    '✏': 'edit', '🧭': 'explore', '🏆': 'emoji_events', '🔠': 'grid_on', '🏁': 'sports_score',
    '🎉': 'celebration', '⚖': 'balance', '🔤': 'sort_by_alpha', '🪢': 'help', '🎨': 'palette',
    '📓': 'book', '📚': 'library_books', '❌': 'cancel', '🏃': 'directions_run', '📸': 'photo_camera',
    '⏱': 'timer', '🎧': 'headphones', '🔗': 'link', '🔥': 'local_fire_department', '✍': 'draw',
    '🖼': 'image', '📷': 'photo_camera', '📄': 'description', '📰': 'newspaper', '🌤': 'wb_cloudy',
    '👁': 'visibility', '📍': 'place', '📊': 'bar_chart', '❄': 'ac_unit', '🦊': '#zorro',
    '📘': 'book', '💪': 'fitness_center', '🏅': 'military_tech', '🎵': 'music_note', '🔬': 'science',
    '🎪': 'festival', '⚽': 'sports_soccer', '❓': 'help', '😃': 'sentiment_very_satisfied',
    '☀': 'light_mode', '🌙': 'dark_mode', '🎁': 'card_giftcard', '🔒': 'lock', '🔎': 'search',
    '🎮': 'sports_esports', '🏞': 'landscape', '🐾': 'pets', '🏷': 'label', '🔊': 'volume_up',
    '💾': 'save', '➕': 'add_circle', '📅': 'calendar_today', '🗑': 'delete', '👕': 'checkroom',
    '🧠': 'psychology', '🕰': 'history', '⏳': 'hourglass_bottom', '🟡': '#circulo', '🚴': 'directions_bike',
    '💫': 'flare', '🌟': 'stars', '💎': 'diamond', '🌌': 'nights_stay', '🌠': 'auto_awesome',
    '🍀': 'local_florist', '🙈': 'visibility_off', '⚙': 'settings', '😕': 'sentiment_dissatisfied',
    '🧹': 'cleaning_services', '🎭': 'theater_comedy', '💥': 'error', '📗': 'menu_book', '🎓': 'school',
    '📔': 'auto_stories', '👏': 'thumb_up', '🎚': 'tune', '👀': 'visibility', '🔍': 'zoom_in',
    '🧢': '#gorra', '👓': '#gafas', '🧣': '#bufanda', '👟': '#zapato', '🎒': 'backpack',
    '🎤': 'mic', '🤩': 'mood', '😐': 'sentiment_neutral', '😔': 'sentiment_dissatisfied',
    '🌗': 'brightness_6', '⛅': 'wb_cloudy', '☁': 'cloud', '🌧': 'umbrella', '⛈': 'thunderstorm',
    '🌨': 'ac_unit', '🌫': 'dehaze', '🚫': 'block', '🍽': 'restaurant', '🧳': 'luggage',
    '💼': 'work', '🩺': 'medical_services', '🛒': 'shopping_cart', '🏠': 'home', '🎬': 'movie',
    '🔢': 'pin', '👨': 'family_restroom', '🧍': 'accessibility_new', '🍎': 'fastfood',
    '🏙': 'location_city', '🌦': 'wb_cloudy', '💻': 'laptop', '🧺': 'shopping_basket', '🗂': 'folder',
    '🌱': 'spa', '🚦': 'traffic', '✂': 'content_cut', '👤': 'person', '❤': 'favorite',
    '🔔': 'notifications', '⌨': 'keyboard', '🃏': 'style', '🔐': 'lock', '📌': 'push_pin',
    '🚀': 'rocket_launch', '🏳': 'flag', '🎶': 'music_note', '💤': 'bedtime', '👍': 'thumb_up',
    '👋': 'waving_hand', '😊': 'sentiment_satisfied', '🙂': 'sentiment_satisfied', '😅': 'sentiment_satisfied',
    '🤔': 'psychology_alt', '📈': 'trending_up', '📉': 'trending_down', '🕐': 'schedule', '🗓': 'calendar_month',
    '📦': 'inventory_2', '🔧': 'build', '🛠': 'handyman', '🧪': 'science', '📱': 'smartphone',
    '✔': 'check', '☑': 'check_box', '⏰': 'alarm', '⌛': 'hourglass_bottom', '🌍': 'public',
    '🌎': 'public', '🌏': 'public', '🗺': 'map', '🏫': 'school', '📣': 'campaign', '📢': 'campaign',
    '🎙': 'mic', '📺': 'tv', '🎟': 'confirmation_number', '🍺': 'sports_bar', '☕': 'coffee',
    '🥨': 'bakery_dining', '🚆': 'train', '🚌': 'directions_bus', '✈': 'flight', '🚗': 'directions_car',
}
# Los que acompañan a otro y no deben verse: el selector de emoji (FE0F), el
# unidor (200D) y los miembros de la familia que no son el primero.
VACIOS = ['️', '‍', '\U0001F469', '\U0001F467']

ESCALA = 1000 / 24
ABAJO = -170       # el dibujo de 24 se pone de -170 a 830, centrado con el texto
LADO = 50
ANCHO = 1100


def dibujo(nombre):
    if nombre.startswith('#'):
        return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="{PROPIOS[nombre[1:]]}"/></svg>'
    return (MAT / f'{nombre}.svg').read_text(encoding='utf8')


def construir():
    orden = ['.notdef', 'space']
    cmap = {0x20: 'space'}
    trazos = {}
    anchos = {'.notdef': (ANCHO, 0), 'space': (300, 0)}

    vacio = T2CharStringPen(0, None)
    trazos['.notdef'] = T2CharStringPen(ANCHO, None).getCharString()
    trazos['space'] = T2CharStringPen(300, None).getCharString()

    for i, (e, nombre) in enumerate(ICONOS.items()):
        g = f'ico{i}'
        pen = T2CharStringPen(ANCHO, None)
        t = TransformPen(pen, (ESCALA, 0, 0, -ESCALA, LADO, 24 * ESCALA + ABAJO))
        SVGPath.fromstring(dibujo(nombre).encode('utf8')).draw(t)
        trazos[g] = pen.getCharString()
        anchos[g] = (ANCHO, LADO)
        orden.append(g)
        cmap[ord(e)] = g
    for j, c in enumerate(VACIOS):
        g = f'cero{j}'
        trazos[g] = T2CharStringPen(0, None).getCharString()
        anchos[g] = (0, 0)
        orden.append(g)
        cmap[ord(c)] = g

    fb = FontBuilder(1000, isTTF=False)
    fb.setupGlyphOrder(orden)
    fb.setupCharacterMap(cmap)
    fb.setupCFF('IconosFelix', {'FullName': 'Iconos Felix'}, trazos, {})
    fb.setupHorizontalMetrics(anchos)
    fb.setupHorizontalHeader(ascent=930, descent=-250)
    fb.setupNameTable({'familyName': 'Iconos Felix', 'styleName': 'Regular'})
    fb.setupOS2(sTypoAscender=930, sTypoDescender=-250, usWinAscent=930, usWinDescent=250)
    fb.setupPost()
    fb.font.flavor = 'woff2'
    buf = io.BytesIO()
    fb.font.save(buf)
    return buf.getvalue(), sorted(cmap)


def rango(cps):
    return ', '.join(f'U+{c:X}' for c in cps if c != 0x20)


if __name__ == '__main__':
    datos, cps = construir()
    b64 = base64.b64encode(datos).decode()
    css = (
        "/* Generado por fuente.py: los emojis de la app dibujados como iconos\n"
        "   Material, en el color del texto. Va la primera en font-family; con el\n"
        "   unicode-range solo se usa para estos caracteres. */\n"
        "@font-face {\n"
        "  font-family: 'Iconos Felix';\n"
        f"  src: url(data:font/woff2;base64,{b64}) format('woff2');\n"
        f"  unicode-range: {rango(cps)};\n"
        "  font-display: block;\n"
        "}\n"
    )
    for raiz in sys.argv[1:]:
        (pathlib.Path(raiz) / 'src' / 'iconos-emoji.css').write_text(css, encoding='utf8')
    print('iconos', len(ICONOS), 'bytes', len(datos))
