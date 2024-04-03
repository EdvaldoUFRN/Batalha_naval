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
