#!/bin/bash
echo "=== Recomendaciones y Reportes Clave de ANA ==="
awk '/^## Anexo: Resumen Manual de Recomendaciones y Reportes Clave de ANA/{flag=1} flag' NARRATIVA/06_SINFONIAS_FUTURAS/GUARDIANES_HABILIDADES_EVOLUCIONADAS.md
