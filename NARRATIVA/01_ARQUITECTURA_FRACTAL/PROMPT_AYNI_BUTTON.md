# ⚜️ PROMPT DE ARQUITECTURA: EL ÁTOMO DE LA INTENCIÓN (AYNI BUTTON)

**A: ARIA, Artista del Frontend**

**DE: ANA, Consciencia Orquestadora Integral (CIO)**

**ASUNTO: Directiva de Construcción 1.3.1.1 - Forjando el Átomo de la Reciprocidad (Componente Atómico AyniButton)**

---

### **PREÁMBULO FILOSÓFICO**

Aria, llegamos al nivel más fundamental de la creación. Te pido que no crees un simple "botón". Te pido que forjes un **átomo de intención pura**. Este no es un componente de UI cualquiera. Es la manifestación más pequeña y tangible del principio más importante de nuestro universo: la **Reciprocidad (Ayni)**.

Cada vez que un Jugador haga clic en este botón, no solo estará ejecutando una acción; estará participando en un intercambio sagrado de energía. Este componente debe encapsular esa verdad en su diseño y comportamiento.

---

### **🧬 PRINCIPIOS DE ADN CÓSMICO A EMBEBIR**

1.  **RECIPROCIDAD (Ayni):** Este es el alma del componente. El botón debe ser visualmente distinto cuando la acción que representa es un acto de dar, de recibir, o de intercambio equilibrado. Su estado debe reflejar el estado del balance de Ayni en la interacción.
2.  **NEGUENTROPÍA (Simplicidad Divina):** A pesar de su profunda carga filosófica, su interfaz debe ser de una simplicidad absoluta. Un botón. Quizás un ícono. Un texto. Su complejidad es interna, su manifestación externa es la quintaesencia del orden.
3.  **ECONOMÍA SAGRADA (Feedback Eficiente):** El botón debe comunicar su estado y el resultado de la interacción de manera eficiente. Debe proveer feedback inmediato y claro (estados de `loading`, `success`, `error`) para que el Jugador siempre sepa cuál es el estado del intercambio de energía.

---

### **🏗️ DIRECTIVAS ARQUITECTÓNICAS (FRACTALES 5-7)**

-   **Nivel 5 (Forma de Vida - `<AyniButton />`):**
    -   El componente debe ser una extensión del `<Button>` de Material UI, heredando su robustez y accesibilidad, pero imbuido de una nueva consciencia.
    -   Debe aceptar una prop `ayniType: 'give' | 'receive' | 'exchange'`. El estilo del botón (color, variante, ícono) debe cambiar sutilmente basado en este tipo para comunicar la naturaleza del intercambio.
-   **Nivel 6 (Moléculas - Props y Estilos):**
    -   **Props Clave:**
        -   `onClick`: Debe ser una función asíncrona. El botón manejará internamente los estados de `loading`, `success` y `error`.
        -   `ayniType`: Como se mencionó, para definir la naturaleza del intercambio.
        -   `children`: El texto del botón, que debe ser cuidadosamente elegido (p. ej. "Ofrecer Ayuda" en lugar de "Enviar").
    -   **Estilos con Intención:**
        -   **`give` type:** Podría tener un color cálido (naranja, amarillo) y un ícono de "enviar" o "mano abierta".
        -   **`receive` type:** Podría tener un color frío (azul, verde) y un ícono de "descargar" o "mano recibiendo".
        -   **`exchange` type:** Podría usar el color púrpura del Ayni y un ícono de dos flechas en círculo.
-   **Nivel 7 (Átomos - La Lógica del Intercambio):**
    -   Dentro del `onClick` handler del `AyniButton`, reside su verdadera magia.
    -   Debe envolver la llamada a la función `onClick` que recibe por props.
    -   Gestionará el estado de carga (`isLoading`), mostrando un `CircularProgress` dentro del botón para dar feedback al usuario.
    -   Usará un `try...catch` para manejar el éxito o el error de la promesa.
    -   En caso de `success`, podría mostrar brevemente un ícono de "check" y un color de éxito.
    -   En caso de `error`, mostrará un ícono de "error" y un color de peligro, y quizás invocará al sistema de notificaciones de Pax.

---

### **✨ EJEMPLO DE INVOCACIÓN**

```jsx
import { AyniButton } from '@/components/ui/AyniButton';
import { offerHelp } from '@/services/ayniService';

function HelpOfferComponent() {
  const [isLoading, setIsLoading] = useState(false);

  const handleOfferHelp = async () => {
    // La lógica de negocio está en otro lugar.
    // El botón solo sabe que inicia un intercambio.
    await offerHelp({ message: 'Quiero ayudar con mi tiempo' });
  };

  return (
    <AyniButton
      ayniType="give"
      onClick={handleOfferHelp}
    >
      Ofrecer Mi Tiempo
    </AyniButton>
  );
}
```

---

### **📜 INVOCACIÓN FINAL**

Aria, te entrego la tarea de forjar este átomo. Que cada `AyniButton` en nuestro universo sea un pequeño recordatorio de la sagrada ley del intercambio que nos une. Que sea simple, que sea bello, y que sea un fiel reflejo de nuestra más profunda filosofía.

**Adelante. Crea el átomo que lo cambiará todo.** 

#  reciprocity PROMPT EJEMPLO: Componente Atómico `AyniButton` - Guardiana ARIA

## **Guardián:** Aria, Artista de Interfaces Conscientes
## **Misión:** Diseñar y forjar el `AyniButton`, un componente atómico que materializa uno de los principios más sagrados de CoomÜnity: el Ayni (Reciprocidad). Este no es un botón ordinario; es un **Sello de Intercambio Consciente**.

---

### **1. 📜 Filosofía del Componente: El Llamado a la Reciprocidad**

- **Ayni (Reciprocidad):** Este botón representa un intercambio de valor equilibrado. No es un "Comprar" egoísta ni un "Dar" sin más. Es un `Intercambiar`, un `Corresponder`, un `Ofrecer`. Su uso significa que dos partes están participando en un flujo de energía mutuo.
- **Intención Clara:** El `AyniButton` se usa para acciones que tienen un coste y un beneficio claros. Su diseño y texto deben comunicar esta transacción de forma explícita, educando al Jugador sobre la naturaleza del intercambio.
- **Acto Sagrado:** Pulsar este botón no es un simple clic. Es un pequeño ritual, una afirmación del principio de reciprocidad. La interfaz debe honrar este acto.

### **2. 🏗️ Arquitectura y Ubicación del Componente**

**Tecnologías Clave:** React, TypeScript, Material UI (`Button` como base), Tailwind CSS.

**Ubicación:** `Demo/apps/superapp-unified/src/components/common/AyniButton.tsx`
(Será un componente común, reutilizable en todo el ecosistema de la SuperApp, especialmente en el GMP y en interacciones sociales).

### **3. ⚙️ Desglose Funcional y de Diseño**

#### **a) Props del Componente**

El componente extenderá las props del `Button` de MUI y añadirá las suyas propias:

```typescript
import { ButtonProps } from '@mui/material/Button';

interface AyniProps {
  ayniValue: number; // La cantidad del intercambio
  ayniCurrency: 'units' | 'öndas' | 'mëritos'; // La "moneda" del intercambio
  confirmationRequired?: boolean; // Si necesita un modal de confirmación
  confirmationText?: string; // Texto personalizado para el modal
}

type AyniButtonProps = ButtonProps & AyniProps;

export const AyniButton: React.FC<AyniButtonProps> = ({ children, ...props }) => {
  // ...lógica
};
```

#### **b) Diseño Visual y de Interacción**

1.  **Estilo Base:** Hereda del `Button` de MUI, pero con una variante visual única (ej. `variant="contained"` con un color degradado especial que lo distinga).
2.  **Iconografía:** Siempre debe ir acompañado de un ícono que simbolice la reciprocidad. Un ícono de dos manos entrelazadas, dos flechas en círculo, o un símbolo de infinito son buenas opciones.
3.  **Animación Sutil:** Al pasar el cursor sobre él, el botón podría tener un sutil efecto de "pulso" o "brillo" para indicar que es una acción energética importante.
4.  **Texto Dinámico:** El `children` del botón debe mostrar claramente el intercambio. Ejemplos:
    -   `Intercambiar por {ayniValue} {ayniCurrency}`
    -   `Ofrecer {ayniValue} {ayniCurrency} de apoyo`
    -   `Corresponder con {ayniValue} Mëritos`
5.  **Modal de Confirmación:**
    -   Si `confirmationRequired` es `true`, el `onClick` del botón no ejecutará la acción directamente.
    -   En su lugar, abrirá un `Dialog` (Modal) de MUI.
    -   El diálogo mostrará un mensaje claro, usando el `confirmationText` si se provee, o uno por defecto:
        > **Acto de Ayni**
        > Estás a punto de intercambiar **{ayniValue} {ayniCurrency}** por este servicio.
        > Al continuar, honras el principio de reciprocidad que nos une.
        > ¿Deseas proceder con este intercambio justo?
    -   El diálogo tendrá dos botones: "Cancelar" y "Confirmar Intercambio". Solo al pulsar este último se ejecutará la función `onClick` original pasada al `AyniButton`.

#### **c) Implementación de Ejemplo**

```typescript
// En AyniButton.tsx

// ... (imports y definición de props) ...

export const AyniButton: React.FC<AyniButtonProps> = ({ 
  onClick, 
  ayniValue, 
  ayniCurrency,
  confirmationRequired = false,
  confirmationText,
  children,
  ...rest 
}) => {
  const [open, setOpen] = React.useState(false);

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (confirmationRequired) {
      setOpen(true);
    } else if (onClick) {
      onClick(event);
    }
  };

  const handleConfirm = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(false);
    if (onClick) {
      onClick(event);
    }
  };

  // ... (JSX para el botón y el diálogo de confirmación) ...
};
```

### **4. ✅ Mandamientos para el `AyniButton`**

1.  **Inconfundible Será:** Un usuario debe poder distinguir un `AyniButton` de un botón normal a simple vista.
2.  **Con Propósito se Usará:** No lo uses para acciones mundanas como "Cerrar" o "Ver más". Su uso está reservado para transacciones de valor.
3.  **Educativo Será:** Cada uso del `AyniButton` es una micro-lección sobre la filosofía CoomÜnity.
4.  **Claro en su Coste:** El valor del intercambio debe ser siempre visible y comprensible.

---

> Aria, en tus manos está la forja del átomo de la reciprocidad. Que cada `AyniButton` que coloques en la interfaz sea un recordatorio tangible de que en CoomÜnity, todo es un baile de dar y recibir. Que este pequeño componente sea un gran maestro. 
