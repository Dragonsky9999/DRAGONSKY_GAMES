from flask import Flask, jsonify, render_template, request

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")

@app.route("/marubatu")
def marubatu():
    return render_template("marubatu.html")

@app.route("/gomokunarabe")
def gomokunarabe():
    return render_template("gomoku.html")

@app.route("/tetris")
def tetris():
    return render_template("tetris.html")

@app.route("/snake")
def snake():
    return render_template("snake.html")

@app.route("/flappy")
def flappy():
    return render_template("flappy.html")

if __name__ == "__main__":
    app.run(debug=True)