/*
Esse é o main, a vida do programa está aqui ...
*/
var audioContext = null;
var meter = null;
var canvasContext = null;
var WIDTH=500;
var HEIGHT=50;
var rafID = null;
var contz = 0;



window.onload = function() {

    // grab ou canvas
	canvasContext = document.getElementById( "meter" ).getContext("2d");
	
    // caminho da Web Audio API
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
	
    // instanciar um contexto de áudio
    audioContext = new AudioContext();

    // Tentativa de entrada de áudio
    try {
        // caminho getUserMedia
        navigator.getUserMedia = 
        	navigator.getUserMedia ||
        	navigator.webkitGetUserMedia ||
        	navigator.mozGetUserMedia;

        // pedir uma entrada de áudio
        navigator.getUserMedia(
        {
            "audio": {
                "mandatory": {
                    "googEchoCancellation": "false",
                    "googAutoGainControl": "false",
                    "googNoiseSuppression": "false",
                    "googHighpassFilter": "false"
                },
                "optional": []
            },
        }, gotStream, didntGetStream);
    } catch (e) {
        alert('getUserMedia threw exception :' + e);
    }

}


function didntGetStream() {
    alert('Stream generation failed.');
}

var mediaStreamSource = null;

function gotStream(stream) {
    // Crie um AudioNode a partir do fluxo
    mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Crie um novo medidor (meter) de volume e conecte-o.
    meter = createAudioMeter(audioContext);
    mediaStreamSource.connect(meter);

    // iniciar a atualização visual
    drawLoop();
}


function drawLoop( time ) { 

    // limpar o fundo e ...
    canvasContext.clearRect(0,0,WIDTH,HEIGHT);

    // verifique se estamos em estouro de som (clipping) no momento
    if (meter.checkClipping()){
        canvasContext.fillStyle = "red";                                      
    }
    else {
        canvasContext.fillStyle = "yellow";
    }
    // desenhe uma barra com base no volume atual - valor padrao WIDTH*1.4
    canvasContext.fillRect(0, 0, meter.volume*WIDTH*5, HEIGHT);

    // configurar o próximo retorno de chamada visual
    rafID = window.requestAnimationFrame( drawLoop );   
 
   
    // se microfone capturar tal volume, toca o som
    // contz é um contador para tocar o play apenas uma única vez....
    // padrão de volume muito alto é 85, coloquei 30 para disparar o audio a vontade,
    // mas calibre o volume a sua vontade e necessidade.
    if (meter.volume*1000 >= 150 && contz == 0){
        
        contz ++; // variável contadora para tocar o play uma única vez ...
        playSilencio();  // função que toca o som, ela está criada abaixo.  
        
        
        //reload da página em 04 segundos, 4000 abaixo é 04 segundos
        setTimeout(function(){
            window.location.reload(1);
         }, 4000);        
    } 
 

}

// coloque o som wav, mp3, m4a ou sei la o que voce tiver de som 
// na pasta raiz desse projeto e divirta-se

  function playSilencio(){    
    var filepath='silencio.wav'; //som de silencio
    var som = new Audio();   
    som.src = filepath;
    som.play();
  }
