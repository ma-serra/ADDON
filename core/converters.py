import os
import platform
import subprocess
from pathlib import Path

class DocumentConverter:
    @staticmethod
    def get_converter():
        system = platform.system().lower()
        if system == "windows":
            return WindowsConverter()
        else:
            return LibreOfficeConverter()

class WindowsConverter:
    def convert_to_pdf(self, input_path, output_path):
        try:
            from docx2pdf import convert
        except ImportError:
            raise ImportError("O pacote 'docx2pdf' não está instalado. Instale-o usando 'pip install docx2pdf'.")
        
        if not os.path.isfile(input_path):
            raise FileNotFoundError(f"O arquivo de entrada '{input_path}' não foi encontrado.")
        if not os.path.isdir(os.path.dirname(output_path)):
            raise FileNotFoundError(f"O diretório de saída '{os.path.dirname(output_path)}' não existe.")
        
        convert(input_path, output_path)

class LibreOfficeConverter:
    def convert_to_pdf(self, input_path, output_path):
        output_dir = os.path.dirname(output_path)
        if not os.path.isfile(input_path):
            raise FileNotFoundError(f"O arquivo de entrada '{input_path}' não foi encontrado.")
        if not os.path.isdir(output_dir):
            raise FileNotFoundError(f"O diretório de saída '{output_dir}' não existe.")
        
        # Verifica se LibreOffice está disponível
        if subprocess.run(['which', 'libreoffice'], capture_output=True).returncode != 0:
            raise EnvironmentError("LibreOffice não está instalado ou não foi encontrado no PATH.")
        
        try:
            subprocess.run([
                'libreoffice',
                '--headless',
                '--convert-to', 'pdf',
                '--outdir', output_dir,
                input_path
            ], check=True, capture_output=True)
            
            temp_pdf = Path(input_path).with_suffix('.pdf')
            if temp_pdf.is_file():
                os.rename(temp_pdf, output_path)
        except subprocess.CalledProcessError as e:
            error_message = e.stderr.decode() if e.stderr else str(e)
            raise Exception(f"Erro na conversão com LibreOffice: {error_message}")