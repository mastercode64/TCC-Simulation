//VARIAVEIS E OBJETOS

var
canvas,
ctx,
message = "";

var mapa ={
	tamanhoPisoPixel: 8,
	
	largura: 1,
	altura: 1,
	proporcao: 2,
	exibirLinhas: false,
	pisos: []
};

var simulacao = {
	qtdMosquito: 1
};

var mosquitos = [];

//SPRITESHEET DOS PISOS

var sprite = new Image();
sprite.src = "piso.png";

//TIPOS PISOS

var mato = {
	nome: "mato",
	locationX: null,
	locationY: null,
	spriteX: 0,
	spriteY: 0,
	tamanhoX: mapa.tamanhoPisoPixel,
	tamanhoY: mapa.tamanhoPisoPixel
};
var agua = {
	nome: "agua",
	locationX: null,
	locationY: null,
	spriteX: 8,
	spriteY: 0,
	tamanhoX: mapa.tamanhoPisoPixel,
	tamanhoY: mapa.tamanhoPisoPixel
};
var rua = {
	nome: "rua",
	locationX: null,
	locationY: null,
	spriteX: 16,
	spriteY: 0,
	tamanhoX: mapa.tamanhoPisoPixel,
	tamanhoY: mapa.tamanhoPisoPixel
};
var casa = {
	nome: "casa",
	locationX: null,
	locationY: null,
	spriteX: 24,
	spriteY: 0,
	tamanhoX: mapa.tamanhoPisoPixel,
	tamanhoY: mapa.tamanhoPisoPixel
};

var tipoPiso = [];
tipoPiso.push(mato, agua, rua, casa);

//FUNÇÕES

function newPiso(nome, x, y){
	var piso = {
		nome: nome,
		x: x,
		y: y
	};
	return piso;
}

function teste(item){
	console.log(item);
}


function iniciar(){
	canvas = document.getElementById("mycanvas");
	
	canvas.width =  mapa.largura * mapa.tamanhoPisoPixel;
	canvas.height = mapa.altura * mapa.tamanhoPisoPixel;
	
	ctx = canvas.getContext("2d");


	ctx.fillStyle = "black";
	//ctx.fillRect(0,0,150,75);
	inicializarMapa();
}

function inicializarMapa(){

	var i = 1;
	for(y = 1; y <= mapa.altura; y+= mapa.tamanhoPisoPixel){
		for(x = 1; x <= mapa.largura; x+= mapa.tamanhoPisoPixel){
			
			var piso = tipoPiso[randomNumber(0,3)];
			piso.locationX = x;
			piso.locationY = y;

			mapa.pisos[i] = piso;
			//console.log(mapa.pisos[i]);
			i++;
		}
	}
	
	/*for(i = 1; i <= mapa.altura * mapa.largura; i++){
		console.log(mapa.pisos[i]);
	}*/
	mapa.pisos.forEach(teste);
	
}

function desenharMapa(){
	var qtdPiso = mapa.largura * mapa.altura;
	
	for(i = 1; i <= qtdPiso; i++){
		ctx.drawImage(
		sprite,
		mapa.pisos[i].spriteX,
		mapa.pisos[i].spriteY,
		mapa.pisos[i].tamanhoX,
		mapa.pisos[i].tamanhoY,
		mapa.pisos[i].locationX,
		mapa.pisos[i].locationY,
		mapa.tamanhoPisoPixel,
		mapa.tamanhoPisoPixel
		);
	}
	
	//mapa.pisos.forEach(desenharPiso);
}

function inicializarMosquito(){

	for(y = 1; y <= mapa.altura; y++){
		mapa.pisos.push(newPiso( null, "azul", x, y));
	}
	mapa.pisos.forEach(teste);
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
		desenharMapa();
    });


});