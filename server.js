const http = require("http");
const express = require("express");
const app = express();

// Servir arquivos estáticos na pasta 'public'
app.use(express.static("public"));

// Rota para a página inicial
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// Iniciar o servidor na porta 9091
app.listen(9091, () => {
    console.log("listening on http port");
});
const { connect } = require("http2");
const { client } = require("websocket");
const websocketServer = require("websocket").server
const httpServer = http.createServer();
httpServer.listen(9090, () => console.log("Listening.. on 9090"))
//hashmap
//armazena os ids dos clientes no servidor.
const clients = {};
//armazena os ids das partidas que contém os jogadores que estão jogando nela.
const games = {};
//armazena os tabuleiros, os ids das partidas e dos jogadores.
const tabuleiro = {
    "pecas": []
};

const wsServer = new websocketServer({
    "httpServer": httpServer
})

wsServer.on("request", request => {
    //connect
    const connection = request.accept(null, request.origin);
    connection.on("open", () => console.log("opened!"))
    connection.on("close", () => console.log("closed!"))
    //Caixa de mensagens do servidor.
    connection.on("message", message => {
        //a variável que armazena as mensagens dos clientes.
        const result = JSON.parse(message.utf8Data)
        //método create, faz o servidor criar a partida, criando o id da partida.
        if (result.method === "create") {
            const clientId = result.clientId;
            const gameId = guid();

            games[gameId] = {
                "id": gameId,
                "clients": []
            }

            const payLoad = {
                "method": "create",
                "game": games[gameId]
            }
            //isso daqui é usado, pois ele não sabe qual é a conexão dele, então ele pega por meio do clients.
            const con = clients[clientId].connection;
            con.send(JSON.stringify(payLoad));
        }

        //a client want to join
        if (result.method === "join") {
            const clientId = result.clientId;
            const gameId = result.gameId;
            const game = games[gameId];
            if (game.clients.length >= 2 || game.clients.some(c => c.clientId === clientId)) {
                //sorry max players reach
                if (game.clients.length >= 2)
                    console.log("Sala lotada!")
                if (game.clients.some(c => c.clientId === clientId)) {
                    console.log("Você já está na sala.")
                }
                return;
            }

            const play = { "0": "Player1", "1": "Player2" }[game.clients.length]
            game.clients.push({
                "clientId": clientId,
                "jogador": play
            })

            const payLoad = {
                "method": "join",
                "game": game,
                "clientId": clientId,
                "jogador": play
            }

            //loop through all clients and tell them that people playing
            game.clients.forEach(c => {
                clients[c.clientId].connection.send(JSON.stringify(payLoad));
            });


        }

        if (result.method === "tabuleiro") {
            result.pecas.forEach(element => {
                tabuleiro.pecas.push(element);
            });
        }

        if (result.method === "ataque") {
            const clientId = result.clientId;
            const i = result.i;
            const j = result.j;
            const jogador = result.jogador;
            const gameId = result.gameId;
            let className = null;
            let acerto = "não";
            tabuleiro.pecas.forEach(element => {
                if ((i === element.i && j === element.j) && (gameId === element.gameId && jogador != element.jogador)) {
                    acerto = "sim";
                    className = element.className;
                }
            });
            const payLoad = {
                "method": "ataque",
                "acertou": acerto,
                "className": className,
                "i": i,
                "j": j,
                "jogador": jogador
            }
            const con = clients[clientId].connection;
            con.send(JSON.stringify(payLoad));
            console.log(`O jogador ${jogador} acertou uma embarcação.`);
        }


    })

    //vai criar a ponte da conexão desse jogador.
    const clientId = guid();
    clients[clientId] = {
        "connection": connection
    }

    const payLoad = {
        "method": "connect",
        "clientId": clientId
    }
    //envia para o jogador o seu id, para que ele possa fazer as requisições no servidor.
    connection.send(JSON.stringify(payLoad))
})

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

// then to call it, plus stitch in '4' in the third group
const guid = () => (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();