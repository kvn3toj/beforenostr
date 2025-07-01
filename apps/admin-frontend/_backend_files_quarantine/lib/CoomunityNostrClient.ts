import {
  Event,
  EventTemplate,
  generateSecretKey,
  getPublicKey,
  finalizeEvent,
} from 'nostr-tools';
import { minePow } from 'nostr-tools/nip13';
import Dexie, { Table } from 'dexie';
// TODO: Import pow from the correct submodule if available, e.g. 'nostr-tools/pow' or 'nostr-tools/nip13'.
// import { pow } from 'nostr-tools/pow';

// Interfaz para eventos Nostr almacenados en IndexedDB
interface NostrEvent {
  id: string;
  pubkey: string;
  kind: number;
  created_at: number;
  content: string;
  tags: string[][];
  sig: string;
}

type SubscriptionCallback = (event: Event) => void;

export interface Filter {
  ids?: string[];
  kinds?: number[];
  authors?: string[];
  since?: number;
  until?: number;
  limit?: number;
  [key: string]: string[] | number[] | number | undefined;
}

interface Subscription {
  filters: Filter[];
  callback: SubscriptionCallback;
  processedEventIds: Set<string>; // Set para IDs de eventos ya procesados
}

// Definición de la base de datos con Dexie
class NostrDatabase extends Dexie {
  events!: Table<NostrEvent, string>;

  constructor() {
    super('coomunityNostrDatabase');

    this.version(1).stores({
      events: 'id, pubkey, kind, created_at', // 'id' es clave primaria, otros son índices
    });

    // Añadir manejadores de eventos para la base de datos
    this.on('ready', () => {
      console.log('Base de datos IndexedDB lista');
    });

    // Manejar errores de la base de datos
    this.on('blocked', () => {
      console.error('Base de datos bloqueada');
    });
  }
}

// Instancia de la base de datos
const db = new NostrDatabase();

// Manejar eventos de la base de datos
db.on('ready', () => {
  console.log('Base de datos IndexedDB lista');
});

db.on('blocked', () => {
  console.error('Base de datos bloqueada');
});

// Extiende EventTemplate para permitir nonce opcional
type EventTemplateWithNonce = EventTemplate & { nonce?: number };

export class CoomunityNostrClient {
  private privateKey: Uint8Array | null = null; // Clave privada en bytes
  private publicKey: string | null = null; // Clave pública en hex
  private activeRelays: Map<string, WebSocket> = new Map();
  private relayStates: Map<string, {
    status: 'connecting' | 'connected' | 'disconnected' | 'reconnecting';
    lastAttempt: number;
    retryCount: number;
    nextRetryDelay: number;
  }> = new Map();
  private subscriptions: Map<string, Subscription> = new Map();
  private subscriptionCounter: number = 0; // Para generar IDs de suscripción únicos
  private readonly MAX_RETRY_DELAY = 30000; // 30 segundos máximo
  private readonly INITIAL_RETRY_DELAY = 1000; // 1 segundo inicial
  private readonly MAX_RETRIES = 10; // Máximo número de reintentos

  constructor() {
    // Inicialización si es necesaria
  }

  /**
   * Genera un nuevo par de claves privada y pública Nostr.
   * @returns Un objeto con las claves generadas.
   */
  generateKeys(): { pubkey: string; privkey: Uint8Array } {
    const privkey = generateSecretKey();
    const pubkey = getPublicKey(privkey);
    return { privkey, pubkey };
  }

  /**
   * Establece la clave privada que se utilizará para firmar los eventos publicados.
   * Deriva y almacena la clave pública correspondiente.
   * @param privkeyBytes La clave privada en formato Uint8Array.
   */
  setPrivateKey(privkeyBytes: Uint8Array): void {
    this.privateKey = privkeyBytes;
    try {
      this.publicKey = getPublicKey(privkeyBytes);
    } catch (e) {
      console.error("Error getting public key:", e);
      this.publicKey = null;
    }
  }

  /**
   * Retorna la clave pública derivada de la clave privada establecida,
   * o null si no se ha establecido ninguna clave privada.
   * @returns La clave pública en formato hexadecimal o null.
   */
  getPublicKey(): string | null {
    return this.publicKey;
  }

  private getNextRetryDelay(currentDelay: number): number {
    // Backoff exponencial con jitter
    const jitter = Math.random() * 0.3 + 0.85; // Entre 0.85 y 1.15
    return Math.min(currentDelay * 1.5 * jitter, this.MAX_RETRY_DELAY);
  }

  private updateRelayState(url: string, status: 'connecting' | 'connected' | 'disconnected' | 'reconnecting') {
    const currentState = this.relayStates.get(url) || {
      status: 'disconnected',
      lastAttempt: 0,
      retryCount: 0,
      nextRetryDelay: this.INITIAL_RETRY_DELAY
    };

    this.relayStates.set(url, {
      ...currentState,
      status,
      lastAttempt: Date.now()
    });

    console.log(`Estado del relay ${url}: ${status}`, {
      timestamp: new Date().toISOString(),
      retryCount: currentState.retryCount,
      nextRetryDelay: currentState.nextRetryDelay
    });
  }

  private async attemptConnection(url: string): Promise<void> {
    // Asegurarse de que url es un string
    const relayUrl = typeof url === 'string' ? url : String(url);
    const state = this.relayStates.get(relayUrl);
    if (!state) {
      this.relayStates.set(relayUrl, {
        status: 'connecting',
        lastAttempt: Date.now(),
        retryCount: 0,
        nextRetryDelay: this.INITIAL_RETRY_DELAY
      });
    }
    this.updateRelayState(relayUrl, 'connecting');
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        const error = new Error(`Timeout al conectar a ${relayUrl} después de 10 segundos`);
        console.error('Error de timeout:', {
          url: relayUrl,
          timestamp: new Date().toISOString(),
          error: error.message,
          retryCount: state?.retryCount,
          possibleCauses: [
            'El relay está sobrecargado',
            'Problemas de red local',
            'Firewall bloqueando la conexión'
          ]
        });
        this.updateRelayState(relayUrl, 'disconnected');
        reject(error);
      }, 10000);
      try {
        console.log(`Intentando conectar a ${relayUrl}...`, {
          url: relayUrl,
          timestamp: new Date().toISOString(),
          retryCount: state?.retryCount,
          nextRetryDelay: state?.nextRetryDelay,
          browserInfo: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language
          }
        });
        const ws = new WebSocket(relayUrl);

        ws.onopen = () => {
          clearTimeout(timeout);
          console.log(`Conexión exitosa a ${relayUrl}`, {
            url: relayUrl,
            timestamp: new Date().toISOString(),
            readyState: ws.readyState,
            protocol: ws.protocol,
            extensions: ws.extensions,
            connectionTime: Date.now() - (state?.lastAttempt || Date.now())
          });

          this.activeRelays.set(relayUrl, ws);
          this.updateRelayState(relayUrl, 'connected');
          
          // Reset retry count on successful connection
          const currentState = this.relayStates.get(relayUrl);
          if (currentState) {
            this.relayStates.set(relayUrl, {
              ...currentState,
              retryCount: 0,
              nextRetryDelay: this.INITIAL_RETRY_DELAY
            });
          }

          // Re-suscribir a eventos si hay suscripciones activas
          this.subscriptions.forEach((sub, subId) => {
            const reqMessage = JSON.stringify(['REQ', subId, ...sub.filters]);
            ws.send(reqMessage);
          });
          resolve();
        };

        ws.onmessage = (event) => {
          this.handleMessage(relayUrl, event.data as string);
        };

        ws.onerror = (errorEvent) => {
          clearTimeout(timeout);
          // Intentar obtener detalles del error si está disponible en el evento
          const actualError = (errorEvent as ErrorEvent).error || new Error('Error desconocido en WebSocket');
          const errorDetails = {
            url: relayUrl,
            timestamp: new Date().toISOString(),
            type: errorEvent.type,
            readyState: ws.readyState,
            error: actualError instanceof Error ? actualError.message : 'Error desconocido',
            event: errorEvent, // Mantener el evento original para inspección
            // Retirado this.getPossibleCauses(error) ya que no es un Nostr Event
            possibleCauses: [
              'El relay rechazó la conexión',
              'Problemas de red',
              'Firewall bloqueando la conexión',
              'Relay caído o sobrecargado'
            ],
            browserInfo: {
              userAgent: navigator.userAgent,
              platform: navigator.platform,
              language: navigator.language
            }
          };
          console.error('Error en WebSocket:', errorDetails);
          this.updateRelayState(relayUrl, 'disconnected');
          reject(new Error(`Error en la conexión a ${relayUrl}: ${errorDetails.error}`));
        };

        ws.onclose = (event) => {
          clearTimeout(timeout);
          const closeDetails = {
            url: relayUrl,
            timestamp: new Date().toISOString(),
            code: event.code,
            reason: event.reason || 'Sin razón especificada',
            wasClean: event.wasClean,
            readyState: ws.readyState,
            possibleCauses: this.getPossibleCausesForCloseCode(event.code)
          };
          console.log('Conexión WebSocket cerrada:', closeDetails);
          this.activeRelays.delete(relayUrl);
          this.updateRelayState(relayUrl, 'disconnected');
          
          // Intentar reconexión si no fue un cierre intencional
          if (event.code !== 1000) {
            const currentState = this.relayStates.get(relayUrl);
            if (currentState && currentState.retryCount < this.MAX_RETRIES) {
              const nextDelay = this.getNextRetryDelay(currentState.nextRetryDelay);
              this.relayStates.set(relayUrl, {
                ...currentState,
                retryCount: currentState.retryCount + 1,
                nextRetryDelay: nextDelay
              });

              console.log(`Programando reconexión a ${relayUrl}`, {
                url: relayUrl,
                timestamp: new Date().toISOString(),
                previousCloseCode: event.code,
                retryCount: currentState.retryCount + 1,
                nextDelay,
                possibleCauses: closeDetails.possibleCauses
              });

              setTimeout(() => {
                this.attemptConnection(relayUrl).catch(error => {
                  console.error(`Error en reconexión a ${relayUrl}:`, {
                    url: relayUrl,
                    timestamp: new Date().toISOString(),
                    error: error instanceof Error ? error.message : 'Error desconocido',
                    retryCount: currentState.retryCount + 1,
                    browserInfo: {
                      userAgent: navigator.userAgent,
                      platform: navigator.platform,
                      language: navigator.language
                    }
                  });
                });
              }, nextDelay);
            } else {
              console.log(`Máximo número de reintentos alcanzado para ${relayUrl}`, {
                url: relayUrl,
                timestamp: new Date().toISOString(),
                maxRetries: this.MAX_RETRIES,
                lastCloseCode: event.code,
                possibleCauses: closeDetails.possibleCauses
              });
            }
          }
        };

      } catch (error) {
        clearTimeout(timeout);
        const errorDetails = {
          url: relayUrl,
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? error.message : 'Error desconocido',
          stack: error instanceof Error ? error.stack : undefined,
          possibleCauses: [
            'Error al crear WebSocket',
            'Problemas de red local',
            'Firewall bloqueando la conexión'
          ]
        };
        console.error('Error al crear WebSocket:', errorDetails);
        this.updateRelayState(relayUrl, 'disconnected');
        reject(new Error(`Error al intentar conectar a ${relayUrl}: ${errorDetails.error}`));
      }
    });
  }

  private getPossibleCauses(error: Event): string[] {
    const causes: string[] = [];
    
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      if (message.includes('network connection was lost')) {
        causes.push('Problemas de red local');
        causes.push('Firewall bloqueando la conexión');
        causes.push('El relay está caído');
      } else if (message.includes('bad response')) {
        causes.push('El relay está sobrecargado');
        causes.push('Problemas de configuración del relay');
        causes.push('Firewall bloqueando la conexión');
      } else if (message.includes('certificate')) {
        causes.push('Problemas con el certificado SSL');
        causes.push('El relay tiene un certificado inválido');
      }
    }
    
    return causes.length > 0 ? causes : ['Causa desconocida'];
  }

  private getPossibleCausesForCloseCode(code: number): string[] {
    const causes: { [key: number]: string[] } = {
      1000: ['Cierre normal'],
      1001: ['El relay se está moviendo a otra ubicación'],
      1002: ['Error de protocolo'],
      1003: ['Datos no aceptables'],
      1005: ['Sin código de estado'],
      1006: ['Conexión cerrada anormalmente'],
      1007: ['Datos inconsistentes'],
      1008: ['Violación de política'],
      1009: ['Mensaje demasiado grande'],
      1010: ['Extensión requerida'],
      1011: ['Error inesperado'],
      1012: ['Reinicio del servicio'],
      1013: ['Intente más tarde'],
      1014: ['Actuando como gateway'],
      1015: ['Error de TLS']
    };

    return causes[code] || ['Código de cierre desconocido'];
  }

  /**
   * Intenta establecer conexiones WebSocket con la lista de URLs de relays proporcionada.
   * Maneja la lógica de conexión y reconexión básica.
   * @param relayUrls Un array de strings con las URLs de los relays.
   * @returns Una promesa que se resuelve cuando se intenta conectar a todos los relays.
   */
  async connect(relayUrls: string[]): Promise<void> {
    console.log('Iniciando conexión a relays:', relayUrls);
    
    // Reset relay states for new connection attempt
    relayUrls.forEach(url => {
      this.relayStates.set(url, {
        status: 'connecting',
        lastAttempt: Date.now(),
        retryCount: 0,
        nextRetryDelay: this.INITIAL_RETRY_DELAY
      });
    });

    const connectionPromises = relayUrls.map(url => this.attemptConnection(url));

    try {
      // Esperar a que al menos una conexión se establezca
      await Promise.race(connectionPromises);
      console.log('Conexión exitosa establecida con al menos un relay', {
        timestamp: new Date().toISOString(),
        activeRelays: Array.from(this.activeRelays.keys()),
        relayStates: Object.fromEntries(this.relayStates)
      });
    } catch (error) {
      const errorDetails = {
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Error desconocido',
        stack: error instanceof Error ? error.stack : undefined,
        attemptedRelays: relayUrls,
        relayStates: Object.fromEntries(this.relayStates)
      };
      console.error('Error general de conexión:', errorDetails);
      throw new Error(`No se pudo establecer conexión con ningún relay: ${errorDetails.error}`);
    }
  }

  /**
   * Cierra todas las conexiones WebSocket activas con los relays.
   */
  disconnect(): void {
    this.activeRelays.forEach((ws, url) => {
      console.log(`Cerrando conexión a ${url}`);
      ws.close();
    });
    this.activeRelays.clear();
    this.subscriptions.clear(); // Limpiar suscripciones al desconectar
  }

  /**
   * Firma el evento proporcionado utilizando la clave privada establecida (si existe).
   * Si no hay clave privada, lanza un error. Envía el evento firmado a todos los relays conectados
   * y espera la confirmación de al menos uno.
   * Aplica Proof-of-Work (PoW) según NIP-13: 32 bits para kinds 31002, 31003, 31004; 28 bits para los demás.
   * @param eventTemplate El objeto evento a publicar.
   * @returns Una promesa que se resuelve con el evento firmado cuando se recibe confirmación.
   */
  async publish(eventTemplate: EventTemplateWithNonce): Promise<Event> {
    if (!this.privateKey) throw new Error('No hay clave privada configurada');
    const pubkey = this.getPublicKey();
    if (!pubkey) throw new Error('No hay clave pública configurada');
    // Construir UnsignedEvent con pubkey
    const unsignedEvent = {
      pubkey,
      kind: eventTemplate.kind,
      created_at: eventTemplate.created_at,
      tags: eventTemplate.tags,
      content: eventTemplate.content,
      ...(typeof eventTemplate.nonce !== 'undefined' ? { nonce: eventTemplate.nonce } : {})
    };
    // Mine PoW before signing
    const eventWithPow = await minePow(unsignedEvent, 28); // Adjust bits according to relay/project requirements

    // Sign the event using finalizeEvent
    const signedEvent = finalizeEvent(eventWithPow, this.privateKey);

    console.log('Publishing event:', signedEvent);

    // Crear un mapa para rastrear las confirmaciones de cada relay
    const confirmations = new Map<string, { success: boolean; message?: string; url: string }>();
    const confirmationPromises: Promise<void>[] = []; // Cambiado a Promise<void> ya que rastreamos resultados en el mapa

    // Función para crear una promesa que espera la confirmación de un relay específico
    const createConfirmationPromise = (url: string, ws: WebSocket): Promise<void> => {
      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          console.warn(`Timeout (${10000}ms) esperando confirmación de ${url} para evento ${signedEvent.id}`);
          confirmations.set(url, { success: false, message: 'Timeout waiting for OK', url });
          // Remove the message handler to avoid processing delayed OKs
          ws.removeEventListener('message', messageHandler);
          resolve(); // Resolve the promise even on timeout
        }, 10000); // 10 segundos de timeout

        const messageHandler = (event: MessageEvent) => {
          try {
            const msg = JSON.parse(event.data);
            if (msg[0] === 'OK' && msg[1] === signedEvent.id) {
              clearTimeout(timeout);
              const success = msg[2]; // boolean
              const message = msg[3] || 'No message provided'; // string
              console.log(`Confirmación recibida de ${url} para evento ${signedEvent.id}:`, {
                success, message, url, timestamp: new Date().toISOString()
              });
              confirmations.set(url, { success, message, url });
              // Remove the message handler once OK is received
              ws.removeEventListener('message', messageHandler);
              resolve(); // Resolve the promise once confirmation is received
            }
            // Optional: handle other messages like NOTICE for this event ID, though less common
            // if (msg[0] === 'NOTICE' && msg[1] === signedEvent.id) {
            //    console.warn(`NOTICE received for event ${signedEvent.id} from ${url}: ${msg[2]}`);
            // }

          } catch (error) {
            console.error(`Error processing message from ${url} for event ${signedEvent.id}:`, error, 'Message:', event.data);
            // If message processing fails, still resolve the promise to not block Promise.all
            // The lack of 'OK' in confirmations will indicate failure for this relay
            resolve();
          }
        };

        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.addEventListener('message', messageHandler);
          ws.send(JSON.stringify(['EVENT', signedEvent]));
          console.log(`Evento ${signedEvent.id} enviado a ${url}. Esperando OK...`, signedEvent);
        } else {
          console.warn(`No se pudo enviar el evento ${signedEvent.id} a ${url}: conexión no abierta.`);
          confirmations.set(url, { success: false, message: 'WebSocket connection not open', url });
          resolve(); // Resolve immediately if connection is not open
        }
      });
    };

    // Crear promesas de confirmación para cada relay activo
    this.activeRelays.forEach((ws, url) => {
      confirmationPromises.push(createConfirmationPromise(url, ws));
    });

    if (confirmationPromises.length === 0) {
      console.warn('No hay relays conectados para publicar el evento.');
      throw new Error('No hay relays conectados para publicar el evento.');
    }

    try {
      // Esperar a que todas las promesas de confirmación se resuelvan (incluyendo timeouts y errores de mensaje)
      await Promise.all(confirmationPromises);

      const successfulConfirmations = Array.from(confirmations.values()).filter(conf => conf.success);

      if (successfulConfirmations.length > 0) {
        console.log(`Evento ${signedEvent.id} publicado exitosamente. Confirmado por ${successfulConfirmations.length} relay(s).`, {
          id: signedEvent.id,
          kind: signedEvent.kind,
          confirmations: Object.fromEntries(confirmations), // Mostrar todos los resultados (éxito/fallo/timeout)
          timestamp: new Date().toISOString()
        });
        return signedEvent as Event; // Resuelve con el evento firmado si al menos uno fue exitoso
      } else {
        const failureDetails = Array.from(confirmations.values()).map(conf => `${conf.url}: ${conf.message || 'No OK received'}`).join('; ');
        console.error(`Fallo al publicar evento ${signedEvent.id}. Ningún relay confirmó la publicación.`, {
          id: signedEvent.id,
          kind: signedEvent.kind,
          confirmations: Object.fromEntries(confirmations),
          details: failureDetails,
          timestamp: new Date().toISOString()
        });
        // Rechazar la promesa con un error que incluye detalles de los fallos
        throw new Error(`Fallo al publicar evento ${signedEvent.id}. Ningún relay confirmó la publicación. Detalles: ${failureDetails}`);
      }
    } catch (error) {
      console.error(`Error inesperado durante la publicación del evento ${signedEvent.id}:`, error);
      throw error; // Re-lanzar cualquier otro error que ocurra
    }
  }

  /**
   * Verifica si un evento coincide con los filtros proporcionados.
   * @param event El evento a verificar
   * @param filters Los filtros a aplicar
   * @returns true si el evento coincide con los filtros
   */
  private eventMatchesFilters(event: Event, filters: Filter[]): boolean {
    return filters.some(filter => {
      // Verificar IDs
      if (filter.ids && !filter.ids.includes(event.id)) {
        return false;
      }

      // Verificar kinds
      if (filter.kinds && !filter.kinds.includes(event.kind)) {
        return false;
      }

      // Verificar authors
      if (filter.authors && !filter.authors.includes(event.pubkey)) {
        return false;
      }

      // Verificar since
      if (filter.since && event.created_at < filter.since) {
        return false;
      }

      // Verificar until
      if (filter.until && event.created_at > filter.until) {
        return false;
      }

      return true;
    });
  }

  /**
   * Envía una solicitud de suscripción (REQ) a todos los relays conectados con los filtros especificados.
   * Primero carga eventos históricos relevantes de la base de datos local.
   * @param filters Un array de objetos filtro que definen qué eventos se desean recibir.
   * @param callback Una función que se ejecutará cada vez que se reciba un evento que coincida con los filtros.
   * @returns Un ID de suscripción único generado internamente.
   */
  async subscribe(filters: Filter[], callback: SubscriptionCallback): Promise<string> {
    const subId = this.generateSubId();
    // Inicializar la suscripción con un Set vacío para processedEventIds
    this.subscriptions.set(subId, { 
      filters, 
      callback,
      processedEventIds: new Set<string>()
    });

    try {
      // Construir la consulta base
      let query = db.events.orderBy('created_at').reverse();

      // Aplicar filtros básicos si están presentes
      const firstFilter = filters[0]; // Usamos el primer filtro para la consulta inicial
      if (firstFilter) {
        if (firstFilter.kinds) {
          query = query.filter(event => firstFilter.kinds!.includes(event.kind));
        }
        if (firstFilter.authors) {
          query = query.filter(event => firstFilter.authors!.includes(event.pubkey));
        }
      }

      // Obtener eventos históricos (limitado a 1000 para no sobrecargar)
      const historicalEvents = await query.limit(1000).toArray();

      // Filtrar eventos en memoria para aplicar todos los criterios
      const matchingEvents = historicalEvents.filter(event => 
        this.eventMatchesFilters(event, filters)
      );

      // Encontrar el timestamp más reciente entre los eventos que coinciden
      const mostRecentTimestamp = matchingEvents.length > 0
        ? Math.max(...matchingEvents.map(event => event.created_at))
        : null;

      // Procesar eventos históricos
      const subscription = this.subscriptions.get(subId);
      if (subscription) {
        for (const event of matchingEvents) {
          // Marcar el evento como procesado antes de llamar al callback
          subscription.processedEventIds.add(event.id);
          callback(event);
        }
      }

      // Preparar filtros para los relays
      const relayFilters = filters.map(filter => ({
        ...filter,
        // Añadir since si encontramos eventos históricos
        ...(mostRecentTimestamp && !filter.since ? { since: mostRecentTimestamp } : {})
      }));

      // Enviar REQ a los relays
      const reqMessage = JSON.stringify(['REQ', subId, ...relayFilters]);

      this.activeRelays.forEach((ws, url) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(reqMessage);
          console.log(`Suscripción REQ enviada a ${url} con ID ${subId}:`, relayFilters);
        } else {
          console.warn(`No se pudo enviar REQ a ${url}: conexión no abierta.`);
        }
      });

      return subId;
    } catch (error) {
      console.error('Error al cargar eventos históricos:', error);
      // Si hay error, continuar con la suscripción normal sin eventos históricos
      const reqMessage = JSON.stringify(['REQ', subId, ...filters]);
      
      this.activeRelays.forEach((ws, url) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(reqMessage);
          console.log(`Suscripción REQ enviada a ${url} con ID ${subId}:`, filters);
        } else {
          console.warn(`No se pudo enviar REQ a ${url}: conexión no abierta.`);
        }
      });

      return subId;
    }
  }

  /**
   * Cancela una suscripción activa enviando un mensaje CLOSE a los relays conectados
   * y eliminando la entrada del mapa de suscripciones.
   * @param subId El ID de la suscripción a cancelar.
   */
  unsubscribe(subId: string): void {
    if (this.subscriptions.has(subId)) {
      const closeMessage = JSON.stringify(['CLOSE', subId]);

      this.activeRelays.forEach((ws, url) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(closeMessage);
          console.log(`Suscripción CLOSE enviada a ${url} con ID ${subId}:`, closeMessage);
        } else {
          console.warn(`No se pudo enviar CLOSE a ${url}: conexión no abierta.`);
        }
      });

      this.subscriptions.delete(subId);
    }
  }

  /**
   * Maneja los mensajes recibidos de un relay.
   * @param relayUrl La URL del relay que envió el mensaje.
   * @param message El mensaje recibido como string JSON.
   */
  private async handleMessage(relayUrl: string, message: string): Promise<void> {
    try {
      const msg = JSON.parse(message);
      const type = msg[0];

      switch (type) {
        case 'EVENT': {
          const subId = msg[1];
          const event: Event = msg[2];
          console.log(`EVENTO recibido de ${relayUrl} para sub ${subId}:`, event);

          const subscription = this.subscriptions.get(subId);
          if (subscription) {
            try {
              // Verificar si el evento ya fue procesado
              if (subscription.processedEventIds.has(event.id)) {
                console.log(`Evento ${event.id} ya procesado, ignorando...`);
                return;
              }

              // Marcar el evento como procesado
              subscription.processedEventIds.add(event.id);

              // Guardar el evento en IndexedDB
              try {
                const eventToStore: NostrEvent = {
                  id: event.id,
                  pubkey: event.pubkey,
                  kind: event.kind,
                  created_at: event.created_at,
                  content: event.content,
                  tags: event.tags,
                  sig: event.sig
                };
                
                console.log('Intentando guardar evento:', eventToStore);
                await db.events.put(eventToStore);
                console.log(`Evento guardado en IndexedDB:`, event.id);
              } catch (error) {
                console.error('Error al guardar evento en IndexedDB:', error);
                // Continuar con el procesamiento aunque falle el guardado
              }

              // Llamar al callback con el evento
              try {
                subscription.callback(event);
              } catch (callbackError) {
                console.error('Error en el callback de suscripción:', callbackError);
              }
            } catch (processingError) {
              console.error('Error al procesar evento:', processingError);
            }
          } else {
            console.warn(`Evento recibido para suscripción desconocida ${subId} de ${relayUrl}`);
          }
          break;
        }
        case 'EOSE': {
          const eoseSubId = msg[1];
          console.log(`EOSE recibido de ${relayUrl} para sub ${eoseSubId}`);
          // Opcional: notificar al callback que se ha recibido el fin de eventos iniciales
          break;
        }
        case 'OK': {
          const okEventId = msg[1];
          const okStatus = msg[2];
          const okMessage = msg[3];
          console.log(`OK recibido de ${relayUrl} para evento ${okEventId}: ${okStatus} - ${okMessage}`);
          // Opcional: manejar confirmación de publicación de evento
          break;
        }
        case 'NOTICE': {
          const noticeMessage = msg[1];
          console.warn(`NOTICE recibido de ${relayUrl}: ${noticeMessage}`);
          // Opcional: mostrar notificación al usuario
          break;
        }
        default: {
          console.log(`Mensaje desconocido recibido de ${relayUrl}:`, msg);
          break; // Añadir break al default case
        }
      }
    } catch (error) {
      console.error(`Error al parsear o manejar mensaje de ${relayUrl}:`, message, error);
    }
  }

  /**
   * Genera un ID de suscripción único simple.
   * @returns Un string único para el ID de suscripción.
   */
  private generateSubId(): string {
    this.subscriptionCounter += 1;
    return `sub_${this.subscriptionCounter}`;
  }
}