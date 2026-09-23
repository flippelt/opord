#!/bin/bash
# ============================================================================
# OPORD — Linux (duplo clique no gerenciador de arquivos, ou rode no terminal)
# ============================================================================

cd "$(dirname "$0")" || exit 1
export PATH="$HOME/.local/bin:/usr/local/bin:$PATH"

echo "OPORD — briefing confidencial para clãs de milsim"
echo "------------------------------------------------------------"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js não encontrado."
  echo "Instale a versão 22 LTS: https://nodejs.org/  (ou o pacote nodejs da distro, se for 22+)."
  echo
  echo "— Pressione Enter para fechar —"
  read -r
  exit 1
fi

node scripts/abrir.mjs
status=$?
if [ "$status" -ne 0 ]; then
  echo
  echo "— Pressione Enter para fechar —"
  read -r
fi
exit "$status"
