# Bronca_App
Bronca_App - Fez algum barulho, você leva uma bronca.
Essa aplicação WEB detecta som de volume alto, e, em seguida, dispara um áudio. Foi desenvolvida em JavaScript, e para rodá-la, bastá levantar um servidor web e executar o "index.html".
Uma dica importante é calibrar o volume a ser capturado que está no arquivo "main.js" na propriedade "meter.volume" a sua necessidade.

Exemplo de Servidor Web em Python
No terminal de comandos, se for windows o famoso "cmd", navegue até a pasta onde está o arquivo "index.html" desse projeto e execute o comando abaixo:
python3 -m http.server 8080

Agora para usar essa aplicação basta digitar no navegador Firefox:
http://localhost:8080

Para funcionar corretamente essa aplicação é preciso dar permissão para usar o microfone, som e javascript.
