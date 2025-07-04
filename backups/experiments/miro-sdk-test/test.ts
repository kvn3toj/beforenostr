import { Miro } from '@mirohq/miro-api';

// ANA: Por favor, reemplaza estos valores con tus credenciales reales de Miro.
// 1. MIRO_ACCESS_TOKEN: Tu token de acceso de desarrollador de Miro.
//    Puedes obtenerlo desde tu perfil de desarrollador en Miro: https://miro.com/app/settings/user-profile/apps
// 2. MIRO_BOARD_ID: El ID de un tablero de Miro al que tengas acceso.
//    Puedes encontrarlo en la URL de tu tablero (ej: https://miro.com/app/board/uXjV..._=/).
const MIRO_ACCESS_TOKEN = 'REPLACE_WITH_YOUR_MIRO_ACCESS_TOKEN';
const MIRO_BOARD_ID = 'REPLACE_WITH_YOUR_MIRO_BOARD_ID';

async function validateMiroSDK() {
  console.log('🔮 [SAGE] Iniciando el oráculo de validación del SDK de Miro...');

  if (
    MIRO_ACCESS_TOKEN === 'REPLACE_WITH_YOUR_MIRO_ACCESS_TOKEN' ||
    MIRO_BOARD_ID === 'REPLACE_WITH_YOUR_MIRO_BOARD_ID'
  ) {
    console.error(
      '❌ [SAGE] Error: Las credenciales (MIRO_ACCESS_TOKEN, MIRO_BOARD_ID) no han sido reemplazadas en `miro-sdk-test/test.ts`.'
    );
    console.log(' ANA, por favor, edita el archivo e introduce las credenciales correctas.');
    return;
  }

  try {
    console.log('✨ [SAGE] Intentando instanciar el cliente de Miro...');
    const miro = new Miro({
      auth: {
        accessToken: MIRO_ACCESS_TOKEN,
      },
    });
    console.log('✅ [SAGE] ¡Cliente de Miro instanciado con éxito!');

    console.log(`🔎 [SAGE] Buscando información del tablero con ID: ${MIRO_BOARD_ID}`);
    const board = await miro.getBoard(MIRO_BOARD_ID);

    console.log('✅ [SAGE] ¡Información del tablero obtenida con éxito!');
    console.log('--- Resultado de la Validación ---');
    console.log(`  Board Name: ${board.name}`);
    console.log(`  Board ID: ${board.id}`);
    console.log(`  Description: ${board.description}`);
    console.log('---------------------------------');
    console.log('✅ [SAGE] El Oráculo ha hablado: El SDK de Miro parece funcionar correctamente en este entorno aislado.');
    console.log('   La "incompatibilidad fundamental" podría estar relacionada con la configuración del monorepo (tsconfig, etc.).');
  } catch (error) {
    console.error('❌ [SAGE] El Oráculo ha detectado una disonancia. Ha ocurrido un error durante la validación:');
    console.error(error);
    console.log('---');
    console.log('   El veredicto es: El SDK de Miro falló incluso en un entorno aislado.');
    console.log('   [COSMOS] Recomienda proceder con la API REST directa usando axios.');
  }
}

validateMiroSDK();
