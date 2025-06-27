#!/bin/bash
echo "Componentes que mencionan Ayni, Bien Común o reciprocidad:"
grep -inrE "ayni|bien común|reciprocidad" Demo/apps/superapp-unified/src/ | cut -d: -f1,2 | sort | uniq
