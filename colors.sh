#!/usr/bin/env bash

# Define cores usando tput
red=$(tput setaf 1)
green=$(tput setaf 2)
reset=$(tput sgr0)

# Exibe mensagens coloridas
echo "${green}Build iniciado com sucesso!${reset}"