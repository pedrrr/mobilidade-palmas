const inputMunicipTrab = document.getElementById('localTrabalho')
const inputPalmasTrab = document.getElementById('quadra-div-trabalho');
const inputPalmasValueTrab = document.getElementById('quadraTrabalho');

window.onload = function(){
    if(inputMunicipTrab.value !== '1'){
        inputPalmasValueTrab.value = 'null';
        inputPalmasTrab.style.display = 'none';
    } else {
        inputPalmasTrab.style.display = 'block';
    } 
};

inputMunicipTrab.addEventListener('change', function(){
    if(inputMunicipTrab.value !== '1'){
        inputPalmasValueTrab.value = 'null';
        inputPalmasTrab.style.display = 'none';
    } else {
        inputPalmasTrab.style.display = 'block';
        inputPalmasValueTrab.value = '';
    }
});