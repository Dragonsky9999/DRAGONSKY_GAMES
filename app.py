from flask import Flask, jsonify, render_template, request

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("2048.html")

if __name__ == "__main__":
    app.run(debug=True)