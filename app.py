from flask import Flask, render_template, request
import openai


app = Flask(__name__)

# ESTE ES EL ID DE LA API QUE SE ESTA UTILIZANDO , ES DECIR LA LLAVE QUE ABRE UNA PETICION A OPENAI.COM
openai.api_key = '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'


@app.route("/")
def index():
    return render_template("index.html")

@app.route("/Imagenes")
def Imagenes():
    return render_template("Imagenes.html")

@app.route("/conversacion.js")
def main_js():
    return render_template("/js/conversacion.js")

@app.route("/api", methods=["POST"])
def api():
    message = request.json.get("message")
    
    completion = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "user", "content": message}
    ]
    )
    if completion.choices[0].message!=None:
        return completion.choices[0].message

    else :
        return 'Fallo al Responder!'
    

if __name__=='__main__':
    app.run()

