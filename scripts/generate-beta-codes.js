#!/usr/bin/env node
/**
 * Script para generar códigos únicos de invitación para el programa beta
 * CoomÜnity Beta Program - Código generador v1.0
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configuración
const CONFIG = {
  totalCodes: 100,
  codeLength: 8,
  prefix: 'BETA',
  outputFile: 'beta-invitation-codes.csv',
  backupFile: 'beta-codes-backup.json'
};

/**
 * Genera un código único aleatorio
 */
function generateUniqueCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < CONFIG.codeLength; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${CONFIG.prefix}-${result}`;
}

/**
 * Valida que el código sea único
 */
function isCodeUnique(code, existingCodes) {
  return !existingCodes.has(code);
}

/**
 * Genera una lista de códigos únicos
 */
function generateBetaCodes(count) {
  const codes = new Set();
  const codeDetails = [];
  
  console.log(`🚀 Generando ${count} códigos únicos para el programa beta...`);
  
  while (codes.size < count) {
    const newCode = generateUniqueCode();
    
    if (isCodeUnique(newCode, codes)) {
      codes.add(newCode);
      
      codeDetails.push({
        code: newCode,
        status: 'available',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días
        usedAt: null,
        usedBy: null,
        invitationSentAt: null,
        invitationSentTo: null,
        cohort: 'beta_initial',
        source: 'automated_generation'
      });
    }
  }
  
  return codeDetails;
}

/**
 * Genera archivo CSV para gestión fácil
 */
function generateCSV(codes) {
  const headers = [
    'code',
    'status', 
    'createdAt',
    'expiresAt',
    'usedAt',
    'usedBy',
    'invitationSentAt',
    'invitationSentTo',
    'cohort',
    'source'
  ];
  
  let csv = headers.join(',') + '\n';
  
  codes.forEach(codeData => {
    const row = headers.map(header => {
      const value = codeData[header] || '';
      return `"${value}"`;
    }).join(',');
    csv += row + '\n';
  });
  
  return csv;
}

/**
 * Guarda los códigos en archivos
 */
function saveCodes(codes) {
  try {
    // Archivo CSV para gestión manual
    const csvContent = generateCSV(codes);
    fs.writeFileSync(CONFIG.outputFile, csvContent, 'utf8');
    console.log(`✅ Archivo CSV creado: ${CONFIG.outputFile}`);
    
    // Archivo JSON para backup y programático
    const jsonContent = JSON.stringify({
      metadata: {
        generatedAt: new Date().toISOString(),
        totalCodes: codes.length,
        version: '1.0',
        program: 'CoomÜnity Beta',
        expirationPolicy: '30 days'
      },
      codes: codes
    }, null, 2);
    
    fs.writeFileSync(CONFIG.backupFile, jsonContent, 'utf8');
    console.log(`✅ Archivo de backup creado: ${CONFIG.backupFile}`);
    
  } catch (error) {
    console.error('❌ Error guardando archivos:', error);
    throw error;
  }
}

/**
 * Genera estadísticas de los códigos
 */
function generateStats(codes) {
  const stats = {
    total: codes.length,
    available: codes.filter(c => c.status === 'available').length,
    used: codes.filter(c => c.status === 'used').length,
    expired: codes.filter(c => new Date(c.expiresAt) < new Date()).length,
    cohorts: {}
  };
  
  // Estadísticas por cohort
  codes.forEach(code => {
    stats.cohorts[code.cohort] = (stats.cohorts[code.cohort] || 0) + 1;
  });
  
  return stats;
}

/**
 * Función principal
 */
function main() {
  console.log('🌱 GENERADOR DE CÓDIGOS BETA COOMÜNITY');
  console.log('=====================================');
  console.log(`Configuración:`);
  console.log(`- Total códigos: ${CONFIG.totalCodes}`);
  console.log(`- Longitud: ${CONFIG.codeLength} caracteres`);
  console.log(`- Prefijo: ${CONFIG.prefix}`);
  console.log('');
  
  try {
    // Generar códigos
    const codes = generateBetaCodes(CONFIG.totalCodes);
    
    // Guardar archivos
    saveCodes(codes);
    
    // Generar estadísticas
    const stats = generateStats(codes);
    
    console.log('');
    console.log('📊 ESTADÍSTICAS FINALES:');
    console.log(`✅ Total códigos generados: ${stats.total}`);
    console.log(`✅ Códigos disponibles: ${stats.available}`);
    console.log(`✅ Archivos creados: 2`);
    console.log('');
    
    console.log('📋 PRÓXIMOS PASOS:');
    console.log('1. Revisar ' + CONFIG.outputFile + ' para gestión manual');
    console.log('2. Usar códigos para invitaciones del programa beta');
    console.log('3. Trackear uso de códigos en analytics');
    console.log('4. Configurar validación en backend');
    console.log('');
    
    console.log('🎯 EJEMPLOS DE CÓDIGOS GENERADOS:');
    codes.slice(0, 5).forEach((code, index) => {
      console.log(`${index + 1}. ${code.code}`);
    });
    console.log(`... y ${codes.length - 5} códigos más.`);
    
    console.log('');
    console.log('🚀 ¡Códigos beta listos para el lanzamiento!');
    
  } catch (error) {
    console.error('❌ Error durante la generación:', error);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = {
  generateBetaCodes,
  generateCSV,
  generateStats
}; 