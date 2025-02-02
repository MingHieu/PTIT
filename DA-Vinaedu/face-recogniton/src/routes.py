from flask import Blueprint, request, jsonify
from .inference import compare_faces, detect_face_from_file

routes = Blueprint('routes', __name__)


@routes.route('/compare-faces', methods=['POST'])
def compare_faces_route():
    try:
        files = request.files.getlist('files')

        if len(files) != 2:
            return jsonify({"error": "Vui lòng sử dụng 2 hình ảnh để so sánh"}), 400

        is_match = compare_faces(files[0], files[1])

        return jsonify({"match": is_match}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@routes.route('/detect-face', methods=['POST'])
def detect_face_route():
    try:
        file = request.files.get('file')

        if file is None:
            return jsonify({"error": "Hình ảnh không có dữ liệu"}), 400

        have_face = detect_face_from_file(file)

        return jsonify({"success": have_face}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
