const inputMunicip = document.getElementById('mora')
const inputPalmas = document.getElementById('quadra-div');
const inputPalmasValue = document.getElementById('quadra');

window.onload = function(){
    if(inputMunicip.value !== '1'){
        inputPalmasValue.value = 'null';
        inputPalmas.style.display = 'none';
    } else {
        inputPalmas.style.display = 'block';
    }
};

inputMunicip.addEventListener('change', function(){
    if(inputMunicip.value !== '1'){
        inputPalmasValue.value = 'null';
        inputPalmas.style.display = 'none';
    } else {
        inputPalmas.style.display = 'block';
        inputPalmasValue.value = '';
    }
});
