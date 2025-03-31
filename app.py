from flask import Flask, jsonify, render_template, request

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")

@app.route("/gomokunarabe")
def gomokunarabe():
    return render_template("gomoku.html")


if __name__ == "__main__":
    app.run(debug=True)