/*
Use esse script a vontade, é gratis, faça o que quiser, seja feliz ...
*/

/*
audioNode = createAudioMeter(audioContext,clipLevel,averaging,clipLag);
audioContext: o AudioContext que você está usando.
clipLevel: o nível (0 a 1) que você consideraria "recortar".
    O padrão é 0,98.
averaging: quão "suavizado" você gostaria que o medidor ficasse ao longo do tempo.
    Deve estar entre 0 e menor que 1. O padrão é 0,95.
clipLag: quanto tempo você gostaria que o indicador de "recorte" mostrasse
    após o recorte ter ocorrido, em milissegundos. O padrão é 750ms.
Acesse o recorte através de node.checkClipping(); use node.shutdown para se livrar dele.
*/

function createAudioMeter(audioContext,clipLevel,averaging,clipLag) {
	var processor = audioContext.createScriptProcessor(512);
	processor.onaudioprocess = volumeAudioProcess;
	processor.clipping = false;
	processor.lastClip = 0;
	processor.volume = 0;
	processor.clipLevel = clipLevel || 0.98;
	processor.averaging = averaging || 0.95;
	processor.clipLag = clipLag || 750;

	// isso não terá efeito, pois não copiamos a entrada para a saída,
	// mas contorna um bug atual do Chrome.
	processor.connect(audioContext.destination);

	processor.checkClipping =
		function(){
			if (!this.clipping)
				return false;
			if ((this.lastClip + this.clipLag) < window.performance.now())
				this.clipping = false;
			return this.clipping;
		};

	processor.shutdown =
		function(){
			this.disconnect();
			this.onaudioprocess = null;
		};

	return processor;
}

function volumeAudioProcess( event ) {
	var buf = event.inputBuffer.getChannelData(0);
    var bufLength = buf.length;
	var sum = 0;
    var x;

	// Faça uma raiz quadrada média nas amostras: some os quadrados...
    for (var i=0; i<bufLength; i++) {
    	x = buf[i];
    	if (Math.abs(x)>=this.clipLevel) {
    		this.clipping = true;
    		this.lastClip = window.performance.now();
    	}
    	sum += x * x;
    }

    // ... então tire a raiz quadrada da soma.
    var rms =  Math.sqrt(sum / bufLength);

     // Agora suavize isso com o fator de média aplicado
     // para a amostra anterior - tire o máximo aqui porque nós
     // queremos um "ataque rápido, liberação lenta."
    this.volume = Math.max(rms, this.volume*this.averaging);
}