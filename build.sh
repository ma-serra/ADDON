#!/usr/bin/env bash
# exit on error
set -o errexit
set -x  # Ativa o modo de depuração

# Atualiza os repositórios
echo "Updating package lists..."
sudo apt-get update

# Instala ncurses-bin que contém o tput
echo "Instalando ncurses..."
sudo apt-get install -y ncurses-bin

# Instala o LibreOffice
echo "Installing LibreOffice..."
sudo apt-get install -y libreoffice

# Verifica a instalação do LibreOffice
echo "Checking LibreOffice installation..."
libreoffice --version

# Instala as dependências Python
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Coleta arquivos estáticos
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Aplica as migrações do banco de dados
echo "Applying database migrations..."
python manage.py migrate

# Chama o colors.sh 
. ./colors.sh

echo "Build script completed successfully!"