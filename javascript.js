var
canvas,
ctx,
message = "";

//VARIAVEIS E OBJETOS

var simulacao = {
	qtdMosquito: 1
};
var mapa ={
	largura: 5,
	altura: 5,
	proporcao: 2,
	exibirLinhas: false,
	pisos: []
};
var piso = {
	nome: null,
	cor: null,
	x: null,
	y: null
};

var mosquitos = [];

//FUNÇÕES

function newPiso(nome, cor, x, y){
	var piso = {
		nome: nome,
		cor: cor,
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
	ctx = canvas.getContext("2d");

	ctx.fillStyle = "black";
	//ctx.fillRect(0,0,150,75);
	inicializarMapa();
}

function inicializarMapa(){
	
	for(y = 1; y <= mapa.altura; y++){
		for(x = 1; x <= mapa.largura; x++){
			mapa.pisos.push(newPiso( null, "azul", x, y));
		}
	}
	mapa.pisos.forEach(teste);	
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
		
	$("#btnInicializar").click(function(){
		//inicializarArray();
    });
	
	
});