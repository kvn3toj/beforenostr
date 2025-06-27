#!/bin/bash

# Estrategia de Mejoras Proactiva ANA

echo "=== Estrategia de Mejoras Proactiva ANA ==="
echo

# 1. Auditoría de componentes sin documentación
echo "1. Auditoría de componentes sin documentación:"
bash scripts/utilities/auditar-componentes-sin-doc.sh
echo

# 2. Resumen de referencias a ANA en la SuperApp
echo "2. Resumen de referencias a ANA en la SuperApp:"
bash scripts/utilities/resumir-uso-ana-superapp.sh
echo

# 3. Reporte de alineación filosófica
echo "3. Reporte de alineación filosófica:"
bash scripts/utilities/reporte-filosofia-superapp.sh
echo

# 4. Chequeo de accesibilidad en componentes
echo "4. Chequeo de accesibilidad en componentes:"
bash scripts/utilities/chequeo-accesibilidad-componentes.sh
echo

# 5. Consulta de recomendaciones y protocolo estratégico de ANA
echo "5. Consulta de recomendaciones y protocolo estratégico de ANA:"
bash scripts/utilities/consultar-recomendaciones-ana.sh
echo

echo "=== Fin del reporte estratégico ANA ==="
