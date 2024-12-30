# core/views.py
from django.shortcuts import render
from django.http import HttpResponse
import tempfile
import os
from .converters import DocumentConverter  # Importe o conversor
import logging

logger = logging.getLogger(__name__)

def index(request):
    return render(request, 'formulario.html')

def convert_to_pdf(request):
    if request.method == 'POST' and request.FILES.get('file'):
        docx_file = request.FILES['file']
        
        # Verifica se o arquivo é um DOCX
        if not docx_file.name.endswith('.docx'):
            logger.warning("Arquivo enviado não é um DOCX.")
            return HttpResponse("Arquivo inválido. Envie um arquivo com extensão .docx.", status=400)
        
        # Gerencia arquivos temporários
        with tempfile.TemporaryDirectory() as temp_dir:
            docx_path = os.path.join(temp_dir, docx_file.name)
            pdf_path = docx_path.replace('.docx', '.pdf')
            
            try:
                # Salva o arquivo temporário
                with open(docx_path, 'wb') as docx_temp:
                    for chunk in docx_file.chunks():
                        docx_temp.write(chunk)
                
                # Usa o conversor apropriado para o sistema
                converter = DocumentConverter.get_converter()
                logger.info(f"Iniciando conversão de {docx_path} para PDF...")
                converter.convert_to_pdf(docx_path, pdf_path)
                
                # Lê o PDF gerado e retorna como resposta
                with open(pdf_path, 'rb') as pdf_file:
                    response = HttpResponse(pdf_file.read(), content_type='application/pdf')
                    response['Content-Disposition'] = f'inline; filename="{os.path.basename(pdf_path)}"'
                    logger.info(f"Documento convertido com sucesso: {pdf_path}")
                    return response
                    
            except Exception as e:
                logger.error(f"Erro durante a conversão: {str(e)}")
                return HttpResponse(f"Erro durante a conversão: {str(e)}", status=500)
    
    logger.warning("Requisição inválida ou arquivo ausente.")
    return HttpResponse("Requisição inválida ou arquivo ausente.", status=400)
