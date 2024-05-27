from flask import Flask, render_template, request
import openai


app = Flask(__name__)

# ESTE ES EL ID DE LA API QUE SE ESTA UTILIZANDO , ES DECIR LA LLAVE QUE ABRE UNA PETICION A OPENAI.COM
openai.api_key = 'KEY-API'

#RUTAS QUE SE UTILIZAN DENTRO DEL INDEX
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
    #Esta es la forma en que se hace una peticion a la IA DE OPENAI a traves de una aplicacion , 
    #llamandno el message como el contenido que se le esta pasando
    completion = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "user",
         "content": 
             ""+ message}
    ]
    )
    if completion.choices[0].message!=None:
        return completion.choices[0].message

    else :
        return 'Fallo al Responder!'
    
#AUI SE LLAMA LA PARTE PRINCIPAL DE LA APLICACION 
if __name__=='__main__':
    app.run()

