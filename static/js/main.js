// Função para salvar os dados no localStorage com debounce
const salvarDados = _.debounce(function() {
    const dados = {};
    const form = document.getElementById('documentForm');
    const inputs = form.getElementsByTagName('input');
    
    for (let input of inputs) {
        if (input.type !== 'checkbox' && input.type !== 'file') {
            dados[input.id] = input.value;
        }
    }
    
    localStorage.setItem('dadosFormulario', JSON.stringify(dados));
}, 1000);

// Função para carregar os dados do localStorage
function carregarDados() {
    const dadosSalvos = localStorage.getItem('dadosFormulario');
    if (dadosSalvos) {
        const dados = JSON.parse(dadosSalvos);
        for (let id in dados) {
            const input = document.getElementById(id);
            if (input) {
                input.value = dados[id];
            }
        }
    }
}

let documentFormat = 'docx';

function setDocumentFormat(format) {
    documentFormat = format;
}

function showLoading() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
        overlay.classList.add('active');
    }
}

function hideLoading() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}

// Função para processar documentos
async function processarDocumentos(arquivos, dados) {
    const log = document.getElementById('log');
    showLoading();
    
    try {
        for (const arquivo of arquivos) {
            try {
                // Verifica se é um arquivo Word
                if (!arquivo.name.match(/\.(docx|doc)$/i)) {
                    if (log) log.innerHTML += `<p style="color: orange;">Arquivo ${arquivo.name} ignorado - não é um arquivo Word</p>`;
                    continue;
                }

                // Lê o arquivo
                const content = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = e => resolve(e.target.result);
                    reader.onerror = reject;
                    reader.readAsArrayBuffer(arquivo);
                });

                const zip = new JSZip(content);
                const doc = new window.docxtemplater();
                doc.loadZip(zip);
                
                doc.setOptions({
                    linebreaks: true,
                    paragraphLoop: true,
                    parser: function(tag) {
                        return {
                            get: function(scope) {
                                return tag === '.' ? scope : (scope[tag] || '');
                            }
                        };
                    }
                });

                doc.setData(dados);
                doc.render();
                
                const out = doc.getZip().generate({
                    type: "blob",
                    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                });

                if (documentFormat === 'pdf') {
                    // Converter e abrir PDF em nova aba
                    const formData = new FormData();
                    formData.append('file', out, 'document.docx');
                    
                    const response = await fetch('/api/convert-to-pdf', {
                        method: 'POST',
                        body: formData
                    });

                    if (!response.ok) {
                        throw new Error('Falha na conversão para PDF');
                    }

                    const pdfBlob = await response.blob();
                    const blobUrl = URL.createObjectURL(pdfBlob);
                    window.open(blobUrl, '_blank');
                    
                    setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
                } else {
                    // Download do DOCX
                    const nomeProcessado = `${arquivo.name.split('.')[0]}_${dados.nome.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.docx`;
                    saveAs(out, nomeProcessado);
                }
                
                if (log) log.innerHTML += `<p style="color: green;">Documento ${arquivo.name} processado com sucesso!</p>`;
                
            } catch (error) {
                console.error(`Erro ao processar ${arquivo.name}:`, error);
                if (log) log.innerHTML += `<p style="color: red;">Erro ao processar ${arquivo.name}: ${error.message}</p>`;
            }
        }
    } finally {
        hideLoading();
    }
}

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    carregarDados();

    // Evento para salvar dados quando campos são alterados
    document.getElementById('documentForm').addEventListener('input', function(e) {
        if (e.target.type !== 'checkbox' && e.target.type !== 'file') {
            salvarDados();
        }
    });

    // Evento para limpar localStorage apenas quando o botão reset for clicado
    document.querySelector('button[type="reset"]').addEventListener('click', function() {
        localStorage.removeItem('dadosFormulario');
    });

    // Processamento do formulário
    document.getElementById('documentForm').addEventListener('submit', async function(e) {
        e.preventDefault(); // Previne o comportamento padrão do formulário
        
        const modelo = document.getElementById('modelo');
        const selectedDocs = document.querySelectorAll('input[name="documentos"]:checked');
        
        // Verifica se tem algum arquivo selecionado (manual ou checkbox)
        if (!modelo.files.length && selectedDocs.length === 0) {
            alert('Por favor, selecione pelo menos um documento para gerar ou escolha um modelo manualmente!');
            return;
        }

        // Função para obter URL do GitHub
        function getGithubUrl(filename) {
            // Converte a URL normal do GitHub para raw
            return `https://raw.githubusercontent.com/MiguelCrux/ADDON/main/modelos/${filename}`;
        }

        const dados = {
            bo: (document.getElementById('bo')?.value || '').trim(),
            versao_bo: (document.getElementById('versao_bo')?.value || '1').trim(),
            ano_bo: (document.getElementById('ano_bo')?.value || '2025').trim(),
            nome: document.getElementById('nome')?.value || '',
            rg: document.getElementById('rg')?.value || '',
            cpf: document.getElementById('cpf')?.value || '',
            nascimento: document.getElementById('nascimento')?.value ? 
                       new Date(document.getElementById('nascimento').value).toLocaleDateString('pt-BR') : '',
            mae: document.getElementById('mae')?.value || '',
            pai: document.getElementById('pai')?.value || '',
            naturalidade: document.getElementById('naturalidade')?.value || '',
            endereco: document.getElementById('endereco')?.value || '',
            instrucao: document.getElementById('instrucao')?.value || '',
            estado_civil: document.getElementById('estado_civil')?.value || '',
            profissao: document.getElementById('profissao')?.value || '',
            altura: document.getElementById('altura')?.value || '',
            cutis: document.getElementById('cutis')?.value || '',
            olhos: document.getElementById('olhos')?.value || '',
            cabelos: document.getElementById('cabelos')?.value || '',
            compleicao: document.getElementById('compleicao')?.value || '',
            barba: document.getElementById('barba')?.value || '',
            tatuagem: document.getElementById('tatuagem')?.value || '',
            processo: document.getElementById('processo')?.value || '',
            of1: document.getElementById('of1')?.value || '',
            of2: document.getElementById('of2')?.value || '',
            msg: document.getElementById('msg')?.value || '',
            vara: document.getElementById('vara')?.value || '',
            cv_cr: document.getElementById('cv_cr')?.value || '',
            comarca: document.getElementById('comarca')?.value || '',
            tipo: document.getElementById('tipo')?.value || '',
            delegacia: document.getElementById('delegacia')?.value || '',
            data_atual: new Date().toLocaleDateString('pt-BR')
        };

        const delegaciaSelect = document.getElementById('delegacia');

        delegaciaSelect.addEventListener('change', () => {
          const delegaciaSelecionada = delegaciaSelect.value;
          console.log('Delegacia selecionada:', delegaciaSelecionada);
          // Aqui você pode fazer algo com o valor selecionado, como enviar para o servidor
        });

        try {
            // Processa arquivos selecionados manualmente
            if (modelo.files.length) {
                await processarDocumentos(modelo.files, dados);
            }

            // Processa arquivos selecionados via checkbox
            if (selectedDocs.length) {
                const log = document.getElementById('log');
                for (const docCheckbox of selectedDocs) {
                    try {
                        const githubUrl = getGithubUrl(docCheckbox.value);
                        if (log) log.innerHTML += `<p>Tentando baixar arquivo de: ${githubUrl}</p>`;
                        
                        const response = await fetch(githubUrl);
                        
                        if (!response.ok) {
                            throw new Error(`Erro ao carregar ${docCheckbox.value} (Status: ${response.status})`);
                        }
                        
                        const blob = await response.blob();
                        const file = new File([blob], docCheckbox.value, { 
                            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
                        });
                        
                        await processarDocumentos([file], dados);
                    } catch (error) {
                        console.error("Erro ao processar documento:", error);
                        if (log) log.innerHTML += `<p style="color: red;">Erro ao processar documento ${docCheckbox.value}: ${error.message}</p>`;
                    }
                }
            }

            alert('Processamento concluído!');
        } catch (error) {
            console.error('Erro durante o processamento:', error);
            alert('Ocorreu um erro durante o processamento. Verifique o console para mais detalhes.');
        }
    });
});