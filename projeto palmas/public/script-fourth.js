const inputMunicip = document.getElementById('localEscola')
const inputPalmas = document.getElementById('quadra-div-escola');
const inputPalmasValue = document.getElementById('quadraEscola');

inputMunicip.addEventListener('change', function(){
    if(inputMunicip.value !== '1'){
        inputPalmasValue.value = 'null';
        inputPalmas.style.display = 'none';
    } else {
        inputPalmas.style.display = 'block';
    }
});
