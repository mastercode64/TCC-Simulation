//VARIAVEIS E OBJETOS

var
canvas,
ctx,
message = "";
//construtor do mapa
function Mapa(tamanhoPisoPixel, qtdPxLargura, qtdPxAltura, exibirLinhas){
	this.tamanhoPisoPixel = tamanhoPisoPixel;
	this.qtdPxLargura = qtdPxLargura;
	this.qtdPxAltura = qtdPxAltura;
	this.exibirLinhas = exibirLinhas;
	this.pisos = [];
	this.pisosNext = [];
	this.mosquitos = [];
	this.mosquitosNext = [];
	this.limiteMosquito = 60;
	this.geracao = 0;
	this.chanceCruzamentoRua = 3;
	this.chanceCasa = 30;
	this.chanceAgua = 18;
	this.quantidadeCasa = 0;
	
	this.listarMosquitos = function(){
		for(var i = 0; i < this.mosquitos.length; i++){
			console.log(this.mosquitos[i].x + " " + this.mosquitos[i].y);
		}
	}
	
	
	this.infectarCasa = function (){
		//Infecção desliga a geração automatica da cidade caso esteja ligada
		pararAutomatico();
		$("#automaticoStatus").val("Modo Automatico: OFF");
		
		//Contando a quantidade de casas existentes no mapa e tirando toda infecção
		var altura = mapa.qtdPxAltura;
		var largura = mapa.qtdPxLargura;
		var qtdCasas = 0;
		
		for(y = 0; y <= altura-1; y++){
			for(x = 0; x <= largura-1; x++){				
				var posicaoPiso = (y * this.qtdPxLargura) + x;
				if(this.pisos[posicaoPiso].nome === "casa"){
					qtdCasas++;
					this.pisos[posicaoPiso].pisoInfectado = false;
				}
					
			}
		}
		mapa.quantidadeCasa = qtdCasas;		
		if(qtdCasas <=0)
			return;
		
		//Escolhendo aleatoriamente a primeira casa para infectar
		var casaInfectadaInicial = 0;
		if(qtdCasas > 0)
			casaInfectadaInicial = randomIntFromInterval(1, qtdCasas);

		
		
		//Procurando a casa escolhida e setando ela como infectada
		var casaAtual = 0;		
		for(y = 0; y <= altura-1; y++){
			for(x = 0; x <= largura-1; x++){				
				var posicaoPiso = (y * this.qtdPxLargura) + x;
				if(this.pisos[posicaoPiso].nome === "casa")
					casaAtual++;
				
				if(this.pisos[posicaoPiso].nome === "casa" && casaAtual == casaInfectadaInicial){
					this.pisos[posicaoPiso].pisoInfectado = true;					
					break;
				}
				
			}
			if(casaAtual >= casaInfectadaInicial)
				break;
		}
		/*
		var qtdCasasInfectadas = 0;
		for(y = 0; y <= altura-1; y++){
			for(x = 0; x <= largura-1; x++){				
				var posicaoPiso = (y * this.qtdPxLargura) + x;
				if(this.pisos[posicaoPiso].pisoInfectado == true){
					qtdCasasInfectadas++;
				}
			}		
		}
		console.log("Qtd casas infectadas: " + qtdCasasInfectadas);
		*/
	}
	
	this.propagarVirus = function(){

		mosquitosNext = [];
		//Passando para o array next somente mosquitos validos
		this.mosquitos.forEach(function(item) {
			if (item.x != null && item.y != null)
				mosquitosNext.push(item);
		});
		
		//Insere um novo mosquito no mapa de forma aleatória caso a qtd de mosquitos existentes seja
		//inferior ao limite de mosquitos
		if(this.qtdMosquitos() < this.limiteMosquito){
			var pisoAleatorio = this.pisoAguaAleatorio();			
			var x = this.pisos[pisoAleatorio].dx;
			var y = this.pisos[pisoAleatorio].dy;
			
			this.mosquitosNext.push(criarMosquito(x, y, false))
		}
		
		//Movimenta os mosquitos pelo mapa
		this.mosquitosNext.forEach(function(item) {
			if (item.x != null && item.y != null) {				
				var direcao = randomIntFromInterval(1,4);
				//cima
				if(direcao == 1 && mapa.pisoNorteExiste(item.x, item.y) == true){
					item.y -= 1;
					if (item.infectado == true && mapa.pisos[(mapa.qtdPxLargura * item.y) + item.x].nome === "casa")
						mapa.pisos[(mapa.qtdPxLargura * item.y) + item.x].pisoInfectado = true;
					if(mapa.pisos[(mapa.qtdPxLargura * item.y) + item.x].pisoInfectado == true)
						item.infectado = true;

				}
					
				
				//baixo
				else if(direcao == 2 && mapa.pisoSulExiste(item.x, item.y) == true){
					item.y += 1;
					if (item.infectado == true && mapa.pisos[(mapa.qtdPxLargura * item.y) + item.x].nome === "casa")
						mapa.pisos[(mapa.qtdPxLargura * item.y) + item.x].pisoInfectado = true;
					if(mapa.pisos[(mapa.qtdPxLargura * item.y) + item.x].pisoInfectado == true)
						item.infectado = true;

				}
				
					
				
				//esquerda
				else if(direcao == 3 && mapa.pisoOesteExiste(item.x, item.y) == true){
					item.x -= 1;
					if (item.infectado == true && mapa.pisos[(mapa.qtdPxLargura * item.y) + item.x].nome === "casa")
						mapa.pisos[(mapa.qtdPxLargura * item.y) + item.x].pisoInfectado = true;
					if(mapa.pisos[(mapa.qtdPxLargura * item.y) + item.x].pisoInfectado == true)
						item.infectado = true;

				}
					
				
				//direita
				else if(direcao == 4 && mapa.pisoLesteExiste(item.x, item.y) == true){
					item.x += 1;
					if (item.infectado == true && mapa.pisos[(mapa.qtdPxLargura * item.y) + item.x].nome === "casa")
						mapa.pisos[(mapa.qtdPxLargura * item.y) + item.x].pisoInfectado = true;
					if(mapa.pisos[(mapa.qtdPxLargura * item.y) + item.x].pisoInfectado == true)
						item.infectado = true;
				}

			}	
		});
		this.mosquitos = this.mosquitosNext;
	}
	
	this.qtdMosquitos = function(){
		var qtd = 0;
		this.mosquitosNext.forEach(function(item) {
			if (item.x != null && item.y != null) {
				qtd++;
			}
			
		});
		return qtd;
	}	
	this.pisoAguaAleatorio = function(){
		var altura = mapa.qtdPxAltura;
		var largura = mapa.qtdPxLargura;
		var qtdAgua = 0;
		
		for(y = 0; y <= altura-1; y++){
			for(x = 0; x <= largura-1; x++){				
				var posicaoPiso = (y * this.qtdPxLargura) + x;
				if(this.pisos[posicaoPiso].nome === "agua")
					qtdAgua++;
			}
		}
		
		var aguaAtual = 0;
		var pisoAguaAleatorio = randomIntFromInterval(1, qtdAgua);
		
		for(y = 0; y <= altura-1; y++){
			for(x = 0; x <= largura-1; x++){
				var posicaoPiso = (y * this.qtdPxLargura) + x;	
				
				if(this.pisos[posicaoPiso].nome === "agua")
					aguaAtual++;
				if(aguaAtual === pisoAguaAleatorio)
					return posicaoPiso;	
			}
		}
	}	
	this.gerarProxIteracao = function () {
		this.pisosNext = [];
		this.mosquitos = [];
		this.mosquitosNext = [];
		var altura = mapa.qtdPxAltura;
		var largura = mapa.qtdPxLargura;
		var tamanhoPiso = mapa.tamanhoPisoPixel;
		
        for(y = 0; y <= altura-1; y++){
			for(x = 0; x <= largura-1; x++){
				
				var posicaoPiso = (y * this.qtdPxLargura) + x;				
				//AGUA				
				if(this.pisos[posicaoPiso].nome === "agua"){					
					if(this.visinhosPiso("agua", x, y) <= 2)						
						this.pisosNext.push(criarMato(x, y));
					else if(this.visinhosPiso("agua", x, y) >= 3)
						this.pisosNext[posicaoPiso] = this.pisos[posicaoPiso];				
				}
				//MATO
				else if(this.pisos[posicaoPiso].nome === "mato"){					
					
					if(this.visinhosPiso("agua", x, y) >= 4)
						this.pisosNext.push(criarAgua(x,y));
					
					else if(this.piso2Norte("rua", x, y)){
						if(!this.piso1Nordeste("rua",x, y) && this.piso1Noroeste("rua", x, y))
							this.pisosNext[posicaoPiso] = this.pisos[posicaoPiso];						
						else if(this.piso1Nordeste("rua",x, y) && !this.piso1Noroeste("rua", x, y))
							this.pisosNext[posicaoPiso] = this.pisos[posicaoPiso];						
						else if(this.piso1Nordeste("rua",x, y) && this.piso1Noroeste("rua", x, y))
							this.pisosNext[posicaoPiso] = this.pisos[posicaoPiso];
						else
							this.pisosNext.push(criarRua(x,y));	
					}

					else if(this.piso2Sul("rua", x, y)){
						if(!this.piso1Sudeste("rua",x, y) && this.piso1Sudoeste("rua", x, y))
							this.pisosNext[posicaoPiso] = this.pisos[posicaoPiso];
						else if(this.piso1Sudeste("rua",x, y) && !this.piso1Sudoeste("rua", x, y))
							this.pisosNext[posicaoPiso] = this.pisos[posicaoPiso];
						else if(this.piso1Sudeste("rua",x, y) && this.piso1Sudoeste("rua", x, y))
							this.pisosNext[posicaoPiso] = this.pisos[posicaoPiso];
						else
							this.pisosNext.push(criarRua(x,y));
					}						
					
					else if(this.piso2Leste("rua", x, y)){
						if(this.piso1Sudeste("rua",x, y) && !this.piso1Nordeste("rua", x, y))
							this.pisosNext[posicaoPiso] = this.pisos[posicaoPiso];
						else if(!this.piso1Sudeste("rua",x, y) && this.piso1Nordeste("rua", x, y))
							this.pisosNext[posicaoPiso] = this.pisos[posicaoPiso];
						else if(this.piso1Sudeste("rua",x, y) && this.piso1Nordeste("rua", x, y))
							this.pisosNext[posicaoPiso] = this.pisos[posicaoPiso];
						else
							this.pisosNext.push(criarRua(x,y));
					}						
					
					else if(this.piso2Oeste("rua", x, y)){
						if(!this.piso1Noroeste("rua",x, y) && this.piso1Sudoeste("rua", x, y))
							this.pisosNext[posicaoPiso] = this.pisos[posicaoPiso];
						else if(this.piso1Noroeste("rua",x, y) && !this.piso1Sudoeste("rua", x, y))
							this.pisosNext[posicaoPiso] = this.pisos[posicaoPiso];
						else if(this.piso1Noroeste("rua",x, y) && this.piso1Sudoeste("rua", x, y))
							this.pisosNext[posicaoPiso] = this.pisos[posicaoPiso];
						else
							this.pisosNext.push(criarRua(x,y));
					}						
					
					else if(this.visinhosPiso("rua", x, y) == 2 && this.piso1Oeste("rua" , x, y) && this.piso1Noroeste("rua" , x, y)){
						if(randomIntFromInterval(0,100) <= this.chanceCruzamentoRua)
							this.pisosNext.push(criarRua(x,y));
						else
							this.pisosNext.push(criarMato(x, y));
					}
					
					else if(this.visinhosPiso("rua", x, y) == 2 && this.piso1Norte("rua" , x, y) && this.piso1Noroeste("rua" , x, y)){
						if(randomIntFromInterval(0,100) <= this.chanceCruzamentoRua)
							this.pisosNext.push(criarRua(x,y));
						else
							this.pisosNext.push(criarMato(x, y));
					}
					
					else if(this.visinhosPiso("rua", x, y) == 2 && this.piso1Norte("rua" , x, y) && this.piso1Nordeste("rua" , x, y)){
						if(randomIntFromInterval(0,100) <= this.chanceCruzamentoRua)
							this.pisosNext.push(criarRua(x,y));
						else
							this.pisosNext.push(criarMato(x, y));
					}
					
					else if(this.visinhosPiso("rua", x, y) == 2 && this.piso1Leste("rua" , x, y) && this.piso1Nordeste("rua" , x, y)){
						if(randomIntFromInterval(0,100) <= this.chanceCruzamentoRua)
							this.pisosNext.push(criarRua(x,y));
						else
							this.pisosNext.push(criarMato(x, y));
					}
					
					else if(this.visinhosPiso("rua", x, y) == 2 && this.piso1Leste("rua" , x, y) && this.piso1Sudeste("rua" , x, y)){
						if(randomIntFromInterval(0,100) <= this.chanceCruzamentoRua)
							this.pisosNext.push(criarRua(x,y));
						else
							this.pisosNext.push(criarMato(x, y));
					}
					
					else if(this.visinhosPiso("rua", x, y) == 2 && this.piso1Sul("rua" , x, y) && this.piso1Sudeste("rua" , x, y)){
						if(randomIntFromInterval(0,100) <= this.chanceCruzamentoRua)
							this.pisosNext.push(criarRua(x,y));
						else
							this.pisosNext.push(criarMato(x, y));
					}
					
					else if(this.visinhosPiso("rua", x, y) == 2 && this.piso1Sul("rua" , x, y) && this.piso1Sudoeste("rua" , x, y)){
						if(randomIntFromInterval(0,100) <= this.chanceCruzamentoRua)
							this.pisosNext.push(criarRua(x,y));
						else
							this.pisosNext.push(criarMato(x, y));
					}
					
					else if(this.visinhosPiso("rua", x, y) == 2 && this.piso1Oeste("rua" , x, y) && this.piso1Sudoeste("rua" , x, y)){
						if(randomIntFromInterval(0,100) <= this.chanceCruzamentoRua)
							this.pisosNext.push(criarRua(x,y));
						else
							this.pisosNext.push(criarMato(x, y));
					}
					
					else if(this.visinhosPiso("agua", x, y) == 0 && this.visinhosPiso("rua", x, y) == 1){
						if(randomIntFromInterval(1,100) <= this.chanceCasa)
							this.pisosNext.push(criarCasa(x,y));
						else
							this.pisosNext[posicaoPiso] = this.pisos[posicaoPiso];
					}
					
					else
						this.pisosNext.push(criarMato(x, y));
					
				}
				//RUA
				else if(this.pisos[posicaoPiso].nome === "rua"){
					if(this.visinhosPiso("rua", x, y) == 8){
						this.pisosNext.push(criarMato(x,y));
					}
					else
						this.pisosNext[posicaoPiso] = this.pisos[posicaoPiso];
				}
				else
					this.pisosNext[posicaoPiso] = this.pisos[posicaoPiso];				
			}
		}		
		this.pisos = this.pisosNext;
		this.geracao++;
    }	
	this.visinhosPiso = function(nomePiso, x, y){
		var n = this.pisoNorteExiste(x, y);
		var s = this.pisoSulExiste(x, y);
		var l = this.pisoLesteExiste(x, y);
		var o = this.pisoOesteExiste(x, y);		
		var ne = this.pisoNordesteExiste(x, y);
		var se = this.pisoSudesteExiste(x, y);
		var so = this.pisoSudoesteExiste(x, y);
		var no = this.pisoNoroesteExiste(x, y);		
		var posicaoPiso = (y * this.qtdPxLargura) + x;
		var numVisinhos = 0;		
		if(n && this.pisos[posicaoPiso - this.qtdPxLargura].nome === nomePiso)
			numVisinhos++;
		if(s && this.pisos[posicaoPiso + this.qtdPxLargura].nome === nomePiso)
			numVisinhos++;
		if(l && this.pisos[posicaoPiso + 1].nome === nomePiso)
			numVisinhos++;
		if(o && this.pisos[posicaoPiso - 1].nome == nomePiso)
			numVisinhos++;
		if(ne && this.pisos[posicaoPiso - (this.qtdPxLargura - 1)].nome == nomePiso)
			numVisinhos++;
		if(se && this.pisos[posicaoPiso + (this.qtdPxLargura + 1)].nome == nomePiso)
			numVisinhos++;
		if(so && this.pisos[posicaoPiso + (this.qtdPxLargura - 1)].nome == nomePiso)
			numVisinhos++;
		if(no && this.pisos[posicaoPiso - (this.qtdPxLargura + 1)].nome == nomePiso)
			numVisinhos++;		
		return numVisinhos;
	}	
	this.piso2Norte = function(nomePiso, x, y){
		var posicaoPiso = (y * this.qtdPxLargura) + x;
		if(y <= 1)
			return false;
		else{
			if(this.pisos[posicaoPiso - this.qtdPxLargura].nome === nomePiso &&
			this.pisos[posicaoPiso - (this.qtdPxLargura * 2)].nome === nomePiso)
				return true;
			else
				return false;
		}
	}	
	this.piso1Norte = function(nomePiso, x, y){
		var posicaoPiso = (y * this.qtdPxLargura) + x;
		if(y <= 0)
			return false;
		else{
			if(this.pisos[posicaoPiso - this.qtdPxLargura].nome === nomePiso)
				return true;
			else
				return false;
		}
	}	
	this.piso2Sul = function(nomePiso, x, y){
		var posicaoPiso = (y * this.qtdPxLargura) + x;
		if(y >= this.qtdPxAltura - 2)
			return false;
		else{
			if(this.pisos[posicaoPiso + this.qtdPxLargura].nome === nomePiso &&
			this.pisos[posicaoPiso + (this.qtdPxLargura * 2)].nome === nomePiso)
				return true;
			else
				return false;
		}
	}	
	this.piso1Sul = function(nomePiso, x, y){
		var posicaoPiso = (y * this.qtdPxLargura) + x;
		if(y >= this.qtdPxAltura - 1)
			return false;
		else{
			if(this.pisos[posicaoPiso + this.qtdPxLargura].nome === nomePiso)
				return true;
			else
				return false;
		}
	}	
	this.piso2Leste = function(nomePiso, x, y){
		var posicaoPiso = (y * this.qtdPxLargura) + x;
		if(x >= this.qtdPxLargura - 2)
			return false;
		else{
			if(this.pisos[posicaoPiso + 1].nome === nomePiso &&
			this.pisos[posicaoPiso + 2].nome === nomePiso)
				return true;
			else
				return false;
		}
	}
	this.piso1Leste = function(nomePiso, x, y){
		var posicaoPiso = (y * this.qtdPxLargura) + x;
		if(x >= this.qtdPxLargura - 1)
			return false;
		else{
			if(this.pisos[posicaoPiso + 1].nome === nomePiso)
				return true;
			else
				return false;
		}
	}	
	this.piso2Oeste = function(nomePiso, x, y){
		var posicaoPiso = (y * this.qtdPxLargura) + x;
		if(x <= 1)
			return false;
		else{
			if(this.pisos[posicaoPiso - 1].nome === nomePiso &&
			this.pisos[posicaoPiso - 2].nome === nomePiso)
				return true;
			else
				return false;
		}
	}	
	this.piso1Oeste = function(nomePiso, x, y){
		var posicaoPiso = (y * this.qtdPxLargura) + x;
		if(x <= 0)
			return false;
		else{
			if(this.pisos[posicaoPiso - 1].nome === nomePiso)
				return true;
			else
				return false;
		}
	}	
	this.piso1Nordeste = function(nomePiso, x, y){
		var posicaoPiso = (y * this.qtdPxLargura) + x;
		if(y <= 0 || x >= this.qtdPxLargura - 1)
			return false;
		else{
			if(this.pisos[(posicaoPiso - this.qtdPxLargura) + 1].nome === nomePiso)
				return true;
			else
				return false;
		}
	}	
	this.piso1Sudeste = function(nomePiso, x, y){
		var posicaoPiso = (y * this.qtdPxLargura) + x;
		if(x >= this.qtdPxLargura - 1 || y >= this.qtdPxAltura - 1)
			return false;
		else{
			if(this.pisos[(posicaoPiso + this.qtdPxLargura) + 1].nome === nomePiso)
				return true;
			else
				return false;
		}
	}	
	this.piso1Sudoeste = function(nomePiso, x, y){
		var posicaoPiso = (y * this.qtdPxLargura) + x;
		if(x <= 0 || y >= this.qtdPxAltura - 1)
			return false;
		else{
			if(this.pisos[(posicaoPiso + this.qtdPxLargura) - 1].nome === nomePiso)
				return true;
			else
				return false;
		}
	}	
	this.piso1Noroeste = function(nomePiso, x, y){
		var posicaoPiso = (y * this.qtdPxLargura) + x;
		if(y <= 0 || x <= 0)
			return false;
		else{
			if(this.pisos[(posicaoPiso - this.qtdPxLargura) - 1].nome === nomePiso)
				return true;
			else
				return false;
		}
	}	
	this.pisoNorteExiste = function(x, y){
		if(y <= 0 || x < 0 || x > this.qtdPxLargura - 1)
			return false;
		else
			return true;
	}	
	this.pisoSulExiste = function(x, y){
		if(y >= this.qtdPxAltura - 1 || x < 0 || x > this.qtdPxLargura - 1)
			return false;
		else
			return true;
	}
	this.pisoLesteExiste = function(x, y){
		if(x >= this.qtdPxLargura - 1 || y < 0 || y > this.qtdPxAltura - 1)
			return false;
		else
			return true;
	}
	this.pisoOesteExiste = function(x, y){
		if(x <= 0 || y < 0 || y > this.qtdPxAltura - 1)
			return false;
		else
			return true;
	}
	this.pisoNordesteExiste = function(x, y){
		if(x >= this.qtdPxLargura - 1 || y <= 0)
			return false;
		else
			return true;
	}
	this.pisoSudesteExiste = function(x, y){
		if(x >= this.qtdPxLargura - 1 || y >= this.qtdPxAltura - 1)
			return false;
		else
			return true;
	}
	this.pisoSudoesteExiste = function(x, y){
		if(x <= 0 || y >= this.qtdPxAltura - 1)
			return false;
		else
			return true;
	}
	this.pisoNoroesteExiste = function(x, y){
		if(x <= 0 || y <= 0)
			return false;
		else
			return true;
	}
}
//var mapa = new Mapa(8, 130, 60, true);
var mapa = new Mapa(10, 80, 50, true);
//SPRITESHEET DOS PISOS
var pisoSprite = new Image();
pisoSprite.src = "piso.png";
var pisoMosquito = new Image();
pisoMosquito.src = "mosquito.png"

//TIPOS PISOS
//construtor do piso
function Piso(nome, sx, sy, dx, dy, dWidth, dHeight) {
	//valores fixos
	this.pisoInfectado = false;
    this.nome = nome;	
	this.sWidth = 8;
	this.sHeight = 8;	
	//valores variaveis
	this.sx = sx;
	this.sy = sy;
	this.dx = dx;
	this.dy = dy;
	this.dWidth = dWidth;
	this.dHeight = dHeight;	
}
function criarMato(x, y){
	return new Piso("mato", 0, 0, x, y, mapa.tamanhoPisoPixel, mapa.tamanhoPisoPixel);	
}
function criarAgua(x, y){
	return new Piso("agua", 8, 0, x, y, mapa.tamanhoPisoPixel, mapa.tamanhoPisoPixel);
}
function criarRua(x, y){
	return new Piso("rua", 16, 0, x, y, mapa.tamanhoPisoPixel, mapa.tamanhoPisoPixel);
}
function criarCasa(x, y){
	return new Piso("casa", 24, 0, x, y, mapa.tamanhoPisoPixel, mapa.tamanhoPisoPixel);
}

function Mosquito(x, y, infectado){
	this.x = x;
	this.y = y;
	this.infectado = infectado;
}

function criarMosquito(x, y, infectado){
	return new Mosquito(x, y, infectado);
}

//FUNÇÕES
function teste(item){
	console.log(item.dx + " " + item.dy + " " + item.nome);
}

function iniciar(){
	canvas = document.getElementById("mycanvas");	
	canvas.width =  mapa.qtdPxLargura * mapa.tamanhoPisoPixel;
	canvas.height = mapa.qtdPxAltura * mapa.tamanhoPisoPixel;	
	ctx = canvas.getContext("2d");
	ctx.fillStyle = "black";
	ctx.imageSmoothingEnabled = false;	
	gerarMapa();
	mapa.pisos.forEach(desenharPisos);
}

function gerarMapa(){
	
	var altura = mapa.qtdPxAltura;
	var largura = mapa.qtdPxLargura;
	
	var ruaX = randomIntFromInterval(0, largura - 1);
	var ruaY = randomIntFromInterval(0, altura - 1);
	
	mapa.geracao = 0;
	mapa.pisos = [];
	mapa.mosquitos = [];
	mapa.mosquitosNext = [];
	
	for(y = 0; y <= altura-1; y++){
		for(x = 0; x <= largura-1; x++){
			
			if(x == ruaX && y == ruaY - 1){
				mapa.pisos.push(criarRua(x,y));
				continue;
			}
			if(x == ruaX && y == ruaY + 1){
				mapa.pisos.push(criarRua(x,y));
				continue;
			}
			if(x == ruaX + 1 && y == ruaY){
				mapa.pisos.push(criarRua(x,y));
				continue;
			}
			if(x == ruaX - 1 && y == ruaY){
				mapa.pisos.push(criarRua(x,y));
				continue;
			}
			if(x == ruaX && y == ruaY){
				mapa.pisos.push(criarRua(x,y));
				continue;
			}
			
			if(randomIntFromInterval(0, 100) <= mapa.chanceAgua)
				mapa.pisos.push(criarAgua(x,y));					
			else
				mapa.pisos.push(criarMato(x, y));
		}
	}
}

function desenharPisos(item){
	var tamanhoPisoPixel = mapa.tamanhoPisoPixel;	
	ctx.drawImage(
		pisoSprite,
		item.sx,
		item.sy,
		item.sWidth,
		item.sHeight,
		item.dx * tamanhoPisoPixel,
		item.dy * tamanhoPisoPixel,
		item.dWidth,
		item.dHeight
	);
	
	if(item.pisoInfectado == true){
		ctx.drawImage(
			pisoMosquito,
			0,
			0,
			item.sWidth,
			item.sHeight,
			item.dx * tamanhoPisoPixel,
			item.dy * tamanhoPisoPixel,
			item.dWidth,
			item.dHeight
		);
	}
	
	for(var i = 0; i < mapa.mosquitos.length; i++){
		if(mapa.mosquitos[i].x == item.dx && mapa.mosquitos[i].y == item.dy && mapa.mosquitos[i].infectado == false){
			ctx.drawImage(
				pisoMosquito,
				8,
				0,
				item.sWidth,
				item.sHeight,
				item.dx * tamanhoPisoPixel,
				item.dy * tamanhoPisoPixel,
				item.dWidth,
				item.dHeight
			);
		}
		
		if(mapa.mosquitos[i].x == item.dx && mapa.mosquitos[i].y == item.dy && mapa.mosquitos[i].infectado == true){
			ctx.drawImage(
				pisoMosquito,
				16,
				0,
				item.sWidth,
				item.sHeight,
				item.dx * tamanhoPisoPixel,
				item.dy * tamanhoPisoPixel,
				item.dWidth,
				item.dHeight
			);
		}
		
	}
}

function automatico(){
	mapa.gerarProxIteracao();
	mapa.pisos.forEach(desenharPisos);
}

var refreshIntervalIdGeracao;

function iniciarAutomatico(){
	pararAutomatico();
	refreshIntervalIdGeracao = setInterval(function(){ automatico(); }, 40);
	
}

function pararAutomatico(){
	clearInterval(refreshIntervalIdGeracao);
}

function propagacaoAutomatica(){
	mapa.propagarVirus();
	mapa.pisos.forEach(desenharPisos);
}

var refreshIntervalIdPropagacao;

function iniciarPropagacaoAutomatica(){
	
	pararPropagacaoAutomatica();
	refreshIntervalIdPropagacao = setInterval(function(){ propagacaoAutomatica(); }, 50);
}

function pararPropagacaoAutomatica(){
	clearInterval(refreshIntervalIdPropagacao);
}

//FUNÇÕES MATEMATICAS
function randomIntFromInterval(min,max){
	return Math.floor(Math.random()*(max-min+1)+min);
}
// JQUERY
$(document).ready(function(){
	iniciar();
	$("#automaticoStatus").val("Modo Automatico: OFF");
	
	//GERAR MAPA ALEATORIO
	$("#btnRandom").click(function(){
		gerarMapa();
		mapa.pisos.forEach(desenharPisos);
    });
	
	//GERAR PROXIMA ITERAÇÃO DA CONSTRUÇÃO DA CIDADE
	$("#btnProxGen").click(function(){
		mapa.gerarProxIteracao();
		mapa.pisos.forEach(desenharPisos);
    });
	
	//GERAR CIDADE AUTOMATICAMENTE
	$("#btnIniciar").click(function(){
		$("#automaticoStatus").val("Modo Automatico: ON");
		iniciarAutomatico();
		
    });	
	
	//DESLIGA MODO AUTOMATICO DE GERAÇÃO DE CIDADE
	$("#btnParar").click(function(){
		pararAutomatico();
		$("#automaticoStatus").val("Modo Automatico: OFF");
    });
	
	//INFECTAR UMA CASA ALEATORIA
	$("#btnInfectarCasa").click(function(){
		pararPropagacaoAutomatica();
		mapa.infectarCasa();
		mapa.pisos.forEach(desenharPisos);
    });
	
	//INICIAR PROPAGAÇÃO DO VIRUS AUTOMATICA
	$("#btnSimularPropagacao").click(function(){
		iniciarPropagacaoAutomatica();		
    });
	
	//PARAR AUTOMATICO
	$("#btnPararPropagacao").click(function(){
		pararPropagacaoAutomatica();
    });

});