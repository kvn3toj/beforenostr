#!/bin/bash

echo "=== Chequeo de Accesibilidad en Componentes ==="

COMP_DIR="Demo/apps/superapp-unified/src/components/"

echo "Componentes con atributos de accesibilidad (aria-):"
grep -ril "aria-" "$COMP_DIR"
echo

echo "Componentes que NO implementan atributos de accesibilidad (aria-):"
for file in "$COMP_DIR"*.tsx; do
  if ! grep -qi "aria-" "$file"; then
    echo "$(basename "$file")"
  fi
done

echo "=== Fin del chequeo de accesibilidad ==="
