# flask --app home run --debug
from flask import Flask, render_template, request, jsonify
from PIL import Image
from sklearn.cluster import KMeans
import numpy as np

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('home.html')


@app.route('/upload-image', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({
            'error': 'no such file '
        }), 400
    image_path = request.files['image']
    if image_path.filename == '':
        return jsonify({
            'error': 'nothing selected '
        }), 400
    img = Image.open(image_path)
    img = img.convert('RGB')
    img = img.resize((150, 150))
    pixels = np.array(img)
    pixels = pixels.reshape(-1, 3)
    kmeans = KMeans(n_clusters=4, n_init=10)
    kmeans.fit(pixels)
    main_colors = kmeans.cluster_centers_.astype(int).tolist()
    for i in range(len(main_colors)):
        main_colors[i] = f'#{main_colors[i][0]:02X}{main_colors[i][1]:02X}{main_colors[i][2]:02X}'

    return jsonify({
        'msg': 'success',
        'colors': main_colors
    })


if __name__ == '__main__':
    app.run()
