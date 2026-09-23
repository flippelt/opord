#!/bin/bash
# ============================================================================
# OPORD — duplo clique no Finder (macOS)
#
# Na 1ª vez, se o macOS bloquear: clique direito → Abrir.
# ============================================================================

cd "$(dirname "$0")" || exit 1
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

clear 2>/dev/null
echo "OPORD — briefing confidencial para clãs de milsim"
echo "------------------------------------------------------------"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js não encontrado."
  echo "Instale a versão 22 LTS em https://nodejs.org/ e tente de novo."
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
