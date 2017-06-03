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
	this.mosquitos = [];
}
var mapa = new Mapa(10, 50, 50, true);

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

function Mosquito(x, y, infectado, movimentoRestante){
	this.x = x;
	this.y = y;
	this.infectado = infectado;
	this.movimentoRestante = movimentoRestante;
}
/*
var mato = new Piso(pisoSprite, "mato", 0, 0, null, null, mapa.qtdPxLargura, Mapa.qtdPxAltura);
var agua = new Piso(pisoSprite, "agua", 8, 0, null, null, mapa.qtdPxLargura, Mapa.qtdPxAltura);
var rua = new Piso(pisoSprite, "rua", 16, 0, null, null, mapa.qtdPxLargura, Mapa.qtdPxAltura);
var casa = new Piso(pisoSprite, "casa", 24, 0, null, null, mapa.qtdPxLargura, Mapa.qtdPxAltura);
*/

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
	//ctx.fillRect(0,0,150,75);
	
	gerarMapa();
	mapa.pisos.forEach(desenharPisos);
}



function gerarMapa(){
	var altura = mapa.qtdPxAltura;
	var largura = mapa.qtdPxLargura;
	var tamanhoPiso = mapa.tamanhoPisoPixel;
	
	for(y = 0; y <= altura-1; y++){
		for(x = 0; x <= largura-1; x++){
			//20% chance do piso ser agua e 80% de ser mato
			if(randomIntFromInterval(0, 9) <= 1){
				var agua = new Piso("agua", 8, 0, null, null, tamanhoPiso, tamanhoPiso);
				agua.dx = x;
				agua.dy = y;
				mapa.pisos.push(agua);				
			}			
			else{
				var mato = new Piso("mato", 0, 0, null, null, tamanhoPiso, tamanhoPiso);
				mato.dx = x;
				mato.dy = y;
				mapa.pisos.push(mato);
			}
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
	//ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
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

//FUNÇÕES MATEMATICAS

function randomIntFromInterval(min,max){
	return Math.floor(Math.random()*(max-min+1)+min);
}

function isNumber(myNumber){
	if(typeof myNumber == typeof 1)
		return 'true';
	else
		return 'false';
}

function randomNumber(min,max){
	return (Math.round((max-min) * Math.random() + min));
}

function createRandomArray(num_elements,min,max){
	var nums = new Array;

	for (var element=0; element<num_elements; element++) {
		nums[element] = randomNumber(min,max);
	}

	return (nums);
}


// JQUERY

$(document).ready(function(){

	iniciar();

	$("#btnDesenhar").click(function(){
		gerarMapa();
		mapa.pisos.forEach(desenharPisos);
    });


});