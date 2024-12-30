// Validação de números
function validarNumero(campo) {
    campo.value = campo.value.replace(/[^0-9]/g, '');
}

// Formatação de RG
function formatarRG(campo) {
    const rg = campo.value.replace(/\D/g, '');
    campo.value = rg.substring(0, 9);
}

// Formatação de CPF
function formatarCPF(campo) {
    const cpf = campo.value.replace(/\D/g, '');
    campo.value = cpf
        .substring(0, 14)
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

// Formatação de Boletim de Ocorrência
function formatarBO(campo) {
    // Separa os dois primeiros caracteres do resto
    let valor = campo.value;
    
    // Para os dois primeiros caracteres, mantém apenas letras
    let letras = valor.substring(0, 2).replace(/[^A-Za-z]/g, '');
    
    // Para o resto, mantém apenas números
    let numeros = valor.substring(2).replace(/\D/g, '');
    
    // Combina letras e números (limitando a 4 números)
    campo.value = letras.toUpperCase() + numeros.substring(0, 4);
}

// Formatação de número do processo
function formatarProcesso(campo) {
    let valor = campo.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    let resultado = '';
    
    // Formata conforme vai digitando
    if (valor.length > 7) {
        resultado = valor.substring(0, 7) + '-' + valor.substring(7);
    } else {
        resultado = valor;
    }
    
    if (valor.length > 9) {
        resultado = resultado.substring(0, 10) + '.' + valor.substring(9);
    }
    
    if (valor.length > 13) {
        resultado = resultado.substring(0, 15) + '.' + valor.substring(13, 14);
    }
    
    if (valor.length > 14) {
        resultado = resultado.substring(0, 17) + '.' + valor.substring(14, 16);
    }
    
    if (valor.length > 16) {
        resultado = resultado.substring(0, 20) + '.' + valor.substring(16);
    }
    
    campo.value = resultado;
}

// Handler para cópia de CPF
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('cpf').addEventListener('copy', function(event) {
        const campo = event.target;
        const cpfSemFormatacao = campo.value.replace(/\D/g, '');
        event.clipboardData.setData('text/plain', cpfSemFormatacao);
        event.preventDefault();
    });
});