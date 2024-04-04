clone o projeto >> abra a pasta do projeto >> \
botão direito do mouse, abrir com "o prompt de comando" >> \
rode esses comandos:\
npm i express\
npm i websocket\
npm i ws\
feito isso, basta você digitar no prompt: node server\
ele vai rodar o servidor, quando estiver rodando você abre no navegador as páginas >>\
http://localhost:9091/\
cada página nova recebe um id distinto e cada partida criada só pode ter dois jogadores >>\
é possível também ter várias partidas acontecendo.\
Estando na página, crie uma partida... clique em entrar na partida>>\
copie o id da sala, que está em vermelho >> estando na página do outro jogador você cola o id da sala no campo texto para entrar na partida.\
pronto, agora basta os jogadores mover as suas peças para o tabuleiro que vai estar escrito player 1...\
ao terminar de montar sua estratégia, os jogadores deveram clicar em começar partida, assim o servidor enviará para os jogadores adversário >>\
pronto agora para o jogador atacar, ele terá que fazer uso do tabuleiro do player 2, clicando nas células que ele acha que tem alguma embarcação.\
vence quem derrotar todas primeiro.\
Resumo de como jogar:
abra a pagina http://localhost:9091/, cria uma partida, abra outra aba com o mesmo link e entre na partida com o id da partida que copiou ao criar a sala, feito isso, você vai ter que pegar os elementos e posicionar eles no seu mapa, que é o player 1.
após montar o seu tabuleiro, você terá que clicar em pronto, quando os dois estiverem prontos aí poderá atacar.
para atacar você vai marcar o tabuleiro do outro lado, o player2.
o código faltou implementar um time de vitória.
![foto](https://media.discordapp.net/attachments/1211412867472171092/1225186055460880394/image.png?ex=6620366e&is=660dc16e&hm=03a31a5231b04647fcd2a20d208ecf93f644e515448e2afeee1a4dd78595ea9f&=&format=webp&quality=lossless)
