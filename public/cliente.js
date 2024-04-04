//conexão com a porta pelo websocket
let ws = new WebSocket('ws://localhost:9090');
//fim conexão

//variáveis para guardar os dados tanto do jogador, quanto da sala.
let clientId = null;
let gameId = null;
let njogador = null;
let game = null;
let pontos = 0;
let verifica = 0;
//fim variáveis

//Elementos HTML
const btnCreate = document.getElementById("btnCreate");
const btnJoin = document.getElementById("btnJoin");
const txtGameId = document.getElementById("txtGameId");
const readyPlay1 = document.getElementById("play1ready");
const readyPlay2 = document.getElementById("play2ready");
const jogadoreSala = document.getElementById("jogadoreSala");
const salaGame = document.getElementById("salaGame");
const btnComeca = document.getElementById("btnComeca");
var oTable = document.getElementById('myTable');
//fim elementos HTML

var rowLength = oTable.rows.length;
//Eventos que acabam fazendo requisições no servidor.
btnComeca.addEventListener("click", e => {


    if (verifica === 0) {
        alert("Você precisa entrar primeiro em uma partida!");
        return;
    }
    var payLoad = {
        "method": "tabuleiro",
        "pecas": []
    }
    for (var i = 0; i < rowLength; i++) {

        //gets cells of current row
        var oCells = oTable.rows.item(i).cells;

        //gets amount of cells of current row
        var cellLength = oCells.length;

        //loops through each cell in current row
        for (var j = 0; j < cellLength; j++) {
            // get your cell info here

            var cellVal = oCells.item(j);
            var cellChildren = cellVal.children;
            for (var k = 0; k < cellChildren.length; k++) {
                var child = cellChildren[k]; // Obtém o filho atual
                var childClassName = child.className;
                payLoad.pecas.push({
                    "ClassName": childClassName,
                    "j": j,
                    "i": i + 1,
                    "jogador": njogador,
                    "clientId": clientId,
                    "gameId": gameId
                })
                console.log("Teste Teste");
                pontos++;
                console.log(pontos);
            }
        }
    }
    // if (pontos > 0 && verifica != 0 ) {
    //     const payLoad = {
    //         "method":"Pronto",
    //         "game":game,
    //         "clientId":clientId,
    //         "jogador":njogador
    //     }
    //     console.log("Entrou na pontos > 0 e verifica !== 0")
    //     ws.send(JSON.stringify(payLoad));
    // }
    if (pontos === 0) {
        alert("Por favor preencha o seu tabuleiro com suas embarcações, para poder começar a jogar.");
        return;
    }
    console.log("CHEGOU AQUI");
    console.log(payLoad.pecas);
    ws.send(JSON.stringify(payLoad));

})

//Requisição "Create"
btnCreate.addEventListener("click", e => {
    const payLoad = {
        "method": "create",
        "clientId": clientId
    }

    ws.send(JSON.stringify(payLoad));
})
//fim requisição "create"

//Requisição "Join"
btnJoin.addEventListener("click", e => {
    verifica = 1;
    e.preventDefault();
    if (gameId === null) {
        gameId = txtGameId.value;
    }
    const payLoad = {
        "method": "join",
        "clientId": clientId,
        "gameId": gameId
    }
    ws.send(JSON.stringify(payLoad));

})

//Caixa de mensagens do cliente.
ws.onmessage = message => {

    //variável que guarda todas as informações passadas por ws.send.
    const response = JSON.parse(message.data);

    // if (response.method === "Pronto") {
    //     game = response.game;
    //     console.log(response.game);
    //     console.log(response.jogador);
    //     console.log(gameId)
    //     console.log("Chegou a receber a requisição do servidor no pronto");
    //     if (gameId === game) {
    //         if (response.jogador != njogador ) {
    //             pronto++;
    //             console.log("Entrou na função do method pronto");
    //         }
    //     }
    // }


    //método para pegar o Id do jogador que o servidor gerou.
    if (response.method === "connect") {
        clientId = response.clientId;
        console.log("cliente  id set successfully " + clientId)
    }


    //método create, usado para pegar o id do game.
    if (response.method === "create") {
        gameId = response.game.id;
        var parentElement = salaGame.parentElement;
        if (salaGame.children[1]) {
            salaGame.removeChild(salaGame.children[1])
        }
        const d = document.createElement("span");
        d.textContent = gameId;
        d.style.display = "inline";
        d.style.background = "red";
        salaGame.appendChild(d);
    }

    if (response.method === "joinErroTamanho") {
        alert("A sala já está cheia!");
    }

    if (response.method === "joinErroJaEsta") {
        alert("Você já está na sala.");
    }
    //método join, vai informar se os jogadores entraram ou não na partida.
    if (response.method === "join") {

        game = response.game;
        console.log(game);
        if (response.clientId == clientId) {
            njogador = response.jogador;
        }
        while (jogadoreSala.firstChild)
            jogadoreSala.removeChild(jogadoreSala.firstChild);
        game.clients.forEach(c => {
            const d = document.createElement("div");
            d.style.width = "200px";
            d.textContent = c.jogador;
            const caixa = document.createElement("div");
            caixa.style.width = "10px";
            caixa.style.height = "10px";
            caixa.style.display = "inline";
            caixa.style.background = "green";
            caixa.textContent = "conectado";
            d.appendChild(caixa);
            jogadoreSala.appendChild(d);

        });
    }



    if (response.method === "ataque") {
        const tamanho = response.tamanho;
        if (tamanho === 0) {
            alert("Você não está em nenhuma partida.");
            return;
        }
        const clientId = response.clientId;
        const i = response.i;
        const j = response.j;
        const jogador = response.jogador;
        const gameId = response.gameId;
        const game = response.game;
        const acertou = response.acertou;
        let classee = response.className;
        const jogadores = response.jogadores;
        console.log(jogador);
        console.log(jogadores);
        console.log(i);
        console.log(j);
        console.log(acertou);
        console.log(classee);
        if (jogadores < 2) {
            alert("Calma, você ainda nem tem um adversário.");
            return;
        }
        if (acertou === "não") {
            classee = "espacos bomba";
        } else {
            pontos--;
            console.log(pontos);
        }

        setCellClassName(i, j, classee, jogador, acertou);
    }
};
//fim da caixa de mensagens.
ws.onerror = function (event) {
    console.error('Erro de WebSocket detectado:', event);
};

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id)
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev) {
    ev.preventDefault()
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));

}



// Adicione um ouvinte de mensagem WebSocket para receber os dados do jogador 1
// Função para obter as coordenadas (i, j) da célula clicada
function getCellCoordinates(event) {
    // Obtém o elemento clicado
    var cell = event.target;

    // Verifica se o elemento clicado é uma célula da tabela
    if (cell.tagName === 'TD') {
        // Obtém o índice da linha (i)
        var i = cell.parentNode.rowIndex + 1;
        // Obtém o índice da coluna (j)
        var j = cell.cellIndex;

        // Retorna as coordenadas (i, j)
        return { i: i, j: j };
    }

    // Retorna null se o elemento clicado não for uma célula da tabela
    return null;
}

function setCellClassName(i, j, className, jogadorr, acertou) {
    // Obtém a referência para a célula da tabela com os índices fornecidos
    let tabela = (jogadorr === njogador) ? "tabelaInimiga" : "myTable";
    console.log("Valor de tabela:", tabela);
    if (acertou === "sim") {
        if (jogadorr === njogador) {
            alert("Você acertou uma embarcação.");
        } else {
            alert("Seu adversário acertou uma embarcação.");
        }
    } else {
        if (jogadorr === njogador) {
            alert("Você não acertou nada.");
        } else {
            alert("Seu adversário não acertou nada.");
        }
    }
    var cell = document.getElementById(tabela).rows[i - 1].cells[j];

    console.log("pegou a tabela");
    // Verifica se a célula existe
    if (true) {
        // Define a classe da célula
        cell.className = className;
    }
}


// Adiciona um evento de clique a todas as células da tabela
var cells = document.querySelectorAll('#tabelaInimiga td.espacos');
cells.forEach(function (cell) {
    cell.addEventListener('click', function (event) {
        var coordinates = getCellCoordinates(event);
        if (!gameId) {
            alert("Entre em uma partida.")
            return;
        }
        if (verifica === 0) {
            alert("Entre na partida.")
            return;
        }
        if (coordinates) {
            console.log('Célula clicada: (i=' + coordinates.i + ', j=' + coordinates.j + ')');
            // Faça o que desejar com as coordenadas (i, j) da célula clicada
            var payLoad = {
                "method": "ataque",
                "clientId": clientId,
                "gameId": gameId,
                "jogador": njogador,
                "i": coordinates.i,
                "j": coordinates.j,
                "game": game
            }
            ws.send(JSON.stringify(payLoad));

        }

    });
});
