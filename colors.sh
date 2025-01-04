# Definição de cores usando códigos de escape ANSI
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
RESET='\033[0m'

# Exemplo de uso das cores
echo -e "${RED}Este é um texto vermelho${RESET}"
echo -e "${GREEN}Este é um texto verde${RESET}"
echo -e "${YELLOW}Este é um texto amarelo${RESET}"
echo -e "${BLUE}Este é um texto azul${RESET}"
echo -e "${MAGENTA}Este é um texto magenta${RESET}"
echo -e "${CYAN}Este é um texto ciano${RESET}"