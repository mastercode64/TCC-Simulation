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
	this.geracao = 0;
	this.chanceCruzamentoRua = 3;
	this.chanceCasa = 15;
	this.chanceAgua = 18;
	
	//Organiza os pisos 'agua', 'mato' pelo mapa usando automato celular
	
	this.gerarProxIteracao = function () {
		this.pisosNext = [];
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
var mapa = new Mapa(8, 100, 70, true);
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

function Mosquito(x, y, infectado, movimentoRestante){
	this.x = x;
	this.y = y;
	this.infectado = infectado;
	this.movimentoRestante = movimentoRestante;
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

//60% chance de aparecer mosquito no piso agua
/*
if(randomIntFromInterval(0, 9) <= 5){
	var mosquito = new Mosquito(x, y, false, 5);
	mapa.mosquitos.push(mosquito);
}
*/

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
}

function automatico(){
	mapa.gerarProxIteracao();
	mapa.pisos.forEach(desenharPisos);
}

var refreshIntervalId;

function iniciarAutomatico(){
	refreshIntervalId = setInterval(function(){ automatico(); }, 40);
	
}

function pararAutomatico(){
	clearInterval(refreshIntervalId);
}

//FUNÇÕES MATEMATICAS
function randomIntFromInterval(min,max){
	return Math.floor(Math.random()*(max-min+1)+min);
}
// JQUERY
$(document).ready(function(){
	iniciar();
	$("#automaticoStatus").val("Modo Automatico: OFF");

	$("#btnRandom").click(function(){
		gerarMapa();
		mapa.pisos.forEach(desenharPisos);
    });
	$("#btnIniciar").click(function(){
		$("#automaticoStatus").val("Modo Automatico: ON");
		iniciarAutomatico();
		
    });	
	$("#btnParar").click(function(){
		pararAutomatico();
		$("#automaticoStatus").val("Modo Automatico: OFF");
    });
	$("#btnProxGen").click(function(){
		mapa.gerarProxIteracao();
		mapa.pisos.forEach(desenharPisos);
    });

});