#!/bin/bash
echo "Resumen de referencias a ANA en la SuperApp:"
grep -inr "ana" Demo/apps/superapp-unified/src/ | cut -d: -f1,2 | sort | uniq
