El sistema LETS (Local Exchange Trading System) es un **sistema de monedas complementarias** ideado para  **crear redes locales y revitalizar los barrios** , enfocado en el intercambio de objetos y servicios. Fue  **creado por Michael Linton** . Estos sistemas son  **herramientas completamente libres y abiertas** , cuya única limitación radica en la mentalidad del grupo que los utiliza.

A continuación, se presenta un manual para implementar el sistema LETS dentro del entorno de la SuperApp CoomÜnity, integrándolo con el marketplace y las Comunidades de Práctica (CoPs), basándose en la visión de CoomÜnity y las experiencias de implementación de sistemas de intercambio.

### **Manual para la Implementación del Sistema LETS en la SuperApp CoomÜnity**

#### **1. Alineación con los Principios Fundamentales de CoomÜnity**

La implementación de LETS en CoomÜnity se basa en los valores y objetivos centrales de la plataforma, que promueven un nuevo paradigma económico centrado en la  **confianza, la cooperación y la dignidad humana** .

* **Cooperar es mejor que Competir** : Este lema es central para el Matchplace de CoomÜnity, incentivando el intercambio de valor en lugar de la acumulación. La plataforma busca  **conectar a personas con intereses y valores similares a través de una economía colaborativa global y descentralizada** .
* **Tokenización de Confianza y Méritos** : En lugar de dinero convencional, CoomÜnity utiliza un  **sistema basado en tokens que incentivan el intercambio y el compromiso local** . Las **Mëritos** representan la confianza y se acumulan en función de los beneficios generados para la comunidad, otorgando progresivamente acceso a roles de moderación y gobernanza local. Este sistema busca  **visibilizar a los más meritorios** .
* **Reducción de la Dependencia al Dinero FIAT** : Uno de los objetivos económicos de CoomÜnity es  **mostrar y enseñar otras vías para reducir la dependencia al FIAT** , fomentando el aprovechamiento de recursos y el trabajo colaborativo.
* **Autopoiesis Homeostática y Resiliencia** : CoomÜnity busca ser un sistema que se **autorreplica y crece de manera segura** dentro de parámetros saludables para sus miembros y el entorno. Esto implica una  **capacidad de autoorganización y auto-equilibrio** .
* **Narrativa Eterna y Transformación** : La experiencia en CoomÜnity se concibe como un  **viaje continuo de transformación personal y colectiva (Metanöia)** . La narrativa es un diálogo con los jugadores, quienes pueden influir en la evolución del mundo.

#### **2. Implementación de LETS en el Matchplace (Marketplace)**

El Matchplace de CoomÜnity está diseñado para  **propiciar espacios de intercambios de servicios, experiencias y productos de origen local, utilizando un medio alternativo de pago** .

* **Unidad de Intercambio (Ünits)** :
* Las **Ünits son el token extrínseco principal** y la unidad de medida del valor de intercambio en el Matchplace.
* Se busca que el **valor del tiempo sea equitativo** ("una hora es igual a otra hora") para los servicios, aunque se reconoce que el software puede permitir flexibilidad en la valoración si se desea.
* Las billeteras de los participantes pueden **empezar en cero** y permitir saldos negativos temporalmente, basándose en la  **confianza de la comunidad** . Algunos sistemas LETS conceden un número inicial de crédito (ej. tres horas) para empezar.
* Para los  **Ünits de Prueba** , estos están confinados a un "Concurso de Mëritos" y caducan al finalizar dicho concurso.
* **Tipos de Intercambio** :
* Además de servicios, el sistema LETS en CoomÜnity puede **incluir el intercambio de objetos** (segunda mano o producidos por los miembros) y el alquiler de herramientas.
* Se contempla la  **posibilidad de implementar sistemas híbridos** , como la participación en actividades a cambio de alimentos, fomentando la inclusión de personas que no comparten plenamente la filosofía del sistema pero desean colaborar.
* **Manejo de Servicios Profesionales** :
* En LETS, se enfatiza que los intercambios **no son de carácter profesional** ni buscan competir con el mercado laboral tradicional. Se pueden ofrecer **consejos u orientaciones** en lugar de servicios profesionales completos.
* Si se incluyen profesionales, una solución es  **valorar sus servicios con una mayor generosidad en horas** (ej., media hora profesional = una hora normal) para que se sientan valorados.
* Se puede **cambiar el formato** para evitar la asimilación a una academia, por ejemplo, "cenas de idiomas" en lugar de clases estructuradas.
* Es posible crear "círculos" de un nivel más profesional para servicios como diseño gráfico, programación, psicología, siempre que haya disposición de la gente para hacerlo.
* **Tecnología y Operatividad** :
* CoomÜnity usará una **Wallet para las Ünits** montada sobre infraestructura blockchain (Lightning Network Bitcoin, con evaluación de Liquid Network para NFT como Mëritos).
* La aplicación se distribuirá como una  **PWA (Progressive Web Application)** , no a través de tiendas de aplicaciones convencionales.
* El sistema de **invitación directa** por parte de usuarios existentes (con puntos de credibilidad por recomendaciones) es el mecanismo principal de expansión de la comunidad, eliminando la necesidad de marketing externo.
* La plataforma permitirá a los usuarios  **contactar directamente desde su domicilio** , ver ofertas y demandas, y conocer la valoración de otros intercambios, lo que facilita la confianza.

#### **3. Implementación de LETS en Comunidades de Práctica (CoPs)**

Las Comunidades de Práctica (CoPs) en CoomÜnity son  **espacios donde confluyen personas con distintos niveles de conocimiento (enseñar, hacer, aprender) con el objetivo de capturar, documentar, transferir y acompañar el conocimiento** .

* **Establecimiento y Organización (6 Pasos del Proceso Estructurado)** : CoomÜnity ya cuenta con una base tecnológica sólida para implementar CoPs, y se propone seguir una metodología estructurada.

1. **Valoración del Entorno** : Evaluar la madurez organizacional y definir objetivos alineados con la filosofía CoomÜnity.
2. **Diseño y Conceptualización** : Definir la razón de ser, temática, objetivos, identificar patrocinadores, analizar viabilidad, métricas, plan de trabajo, riesgos y oportunidades, y la organización de la CoP.
3. **Activación (Arrancando)** : Consolidar el grupo central, desarrollar el diseño conceptual, configurar la plataforma tecnológica, formar al grupo y celebrar el  *kickoff* .
4. **Desarrollo de la Comunidad** : Realizar seguimiento, moderación y dinamización, ejecutar el plan de comunicación, mantener la plataforma y analizar métricas y resultados.
5. **Apoyo de la Organización** : La organización (en este caso CoomÜnity en su nivel macro) debe aprobar el proyecto, evaluar periódicamente y analizar el impacto de las CoPs.
6. **Evaluación de Resultados** : Formalizar el cierre, presentar productos y lecciones aprendidas.

* **Grupo Gestor / Central** : Es fundamental para tomar iniciativas, organizar actividades y gestionar el mantenimiento del grupo.
* **Infraestructura Tecnológica** :
* Se aprovecharán las **tablas existentes (cops, cop_roles, cop_members)** en el backend NestJS.
* El frontend GroupsPageEnhanced.tsx ya incluye **métricas Ayni** y se integrará con el sistema de roles jerárquicos (7 niveles: Aprendiz → Maestro).
* Las plataformas online facilitan el contacto y proporcionan  **valoraciones de intercambios** , fomentando la confianza.
* **Roles y Gobernanza** :
* El **e-moderador o líder de la comunidad** es clave para mantener viva la comunidad, velar por su "salud social" y atender las necesidades de los miembros.
* La **gobernanza se define como el consenso o compromiso** para cumplir normas y pautas de trabajo y relación, que puede ser explícita o implícita. Un **entorno seguro y de respeto** es crucial para fomentar la participación.
* Los moderadores de foros velan por el respeto de las directrices de comportamiento y limitan conductas indeseadas.
* **Dinamización y Participación** :
* Los **talleres y actividades presenciales** son fundamentales para que la gente se conozca, cree vínculos reales y se integre.
* La **comunicación fluida y la transparencia** son importantes. Las redes sociales (Facebook) son útiles para anunciar actividades.
* Se deben usar **dinámicas de grupo y facilitadores** para que todos participen y se saque la "sabiduría del grupo".
* Es crucial **fomentar la autoestima** de las personas, ayudándolas a descubrir y valorar sus habilidades.
* Para evitar la "competencia" con el mundo profesional, se enfatiza que los intercambios son para  **compartir conocimientos** , no para competir.
* **Incentivos y Motivación** :
* Se busca un equilibrio entre el **"gen egoísta"** (incentivos utilitarios) y el **"gen social"** (placer de colaborar, altruismo).
* Los **Tokens Intrínsecos** de CoomÜnity (relacionados con el aprendizaje, el crecimiento y el aporte a la comunidad) no son transaccionales, pero representan el valor del aporte personal y extendido, fomentando la  **motivación intrínseca** .
* El **reconocimiento profesional** y la visibilidad del trabajo son motivadores clave. Se deben validar y aplicar los productos resultantes de las CoPs para que el trabajo no sea inútil.
* Se puede **retribuir económicamente** a los líderes o moderadores de CoPs por su dedicación, legitimando su tiempo.

#### **4. Desafíos y Consideraciones Adicionales**

La implementación de LETS y CoPs en un entorno como CoomÜnity presenta desafíos que requieren una planificación cuidadosa:

* **Conciliación de Horarios** : Es un reto, especialmente en grandes ciudades, pero los sistemas LETS pueden ayudar en el cuidado de niños y mayores.
* **Gestión del Mantenimiento del Grupo** : Uno de los problemas más difíciles es dinamizar la participación y asegurar que la gente participe activamente.
* **Apoyo Institucional** : Aunque CoomÜnity es una iniciativa particular, el apoyo de ayuntamientos o instituciones puede aportar locales, difusión y, ocasionalmente, subvenciones, además de cubrir responsabilidades legales y seguros.
* **Crecimiento y Descentralización** : A medida que la comunidad crece, se puede considerar la **creación de grupos descentralizados por barrios** para facilitar la participación y conexión local.
* **Evitar la "Fosilización"** : Una gobernanza abierta es crucial para mantener el flujo constante de miembros e ideas, evitando que la comunidad se vuelva rígida y jerárquica.

Al seguir estos principios y directrices, CoomÜnity puede implementar un sistema LETS robusto y unas Comunidades de Práctica efectivas que  **fomenten la colaboración, la confianza y la transformación social a través de la gamificación y la sabiduría ancestral** .

El sistema LETS (Local Exchange Trading System) es un sistema de **monedas complementarias** creado por Michael Linton, diseñado para **generar redes locales y revitalizar barrios** mediante el intercambio de objetos y servicios [Manual para la Implementación del Sistema LETS en la SuperApp CoomÜnity]. Se caracterizan por ser herramientas completamente  **libres y abiertas** , cuya principal limitación es la mentalidad del grupo que las utiliza [Manual para la Implementación del Sistema LETS en la SuperApp CoomÜnity].

### **Funcionamiento General de los LETS y las Barras LETS**

1. **Definición y Objetivo** :

* Los LETS buscan superar las limitaciones del trueque y del sistema monetario tradicional, donde el dinero puede ser acumulado y especulado, perjudicando la economía real.
* Son monedas que **no tienen sentido acumular** y solo sirven para el  **intercambio** , funcionando como una herramienta. No pretenden sustituir al euro, sino ser **complementarias** y fomentar la ayuda mutua y el consumo responsable.
* Su objetivo principal es  **fomentar la ayuda mutua, la participación y evitar el aislamiento** , creando un lugar de encuentro y oportunidades donde las personas se sientan útiles en la sociedad.

1. **Unidad de Intercambio y Crédito** :

* La unidad de medida del valor en los LETS es el  **tiempo** , con el principio de que "una hora es igual a otra hora" [Manual para la Implementación del Sistema LETS en la SuperApp CoomÜnity, 56]. Esto valora el esfuerzo de manera equitativa entre las personas.
* Los participantes suelen empezar con **billeteras en cero** y pueden tener  **saldos negativos temporalmente** , basados en la confianza de la comunidad [Manual para la Implementación del Sistema LETS en la SuperApp CoomÜnity]. Algunos sistemas LETS otorgan un número inicial de crédito para empezar, por ejemplo, tres horas [Manual para la Implementación del Sistema LETS en la SuperApp CoomÜnity].
* Para poder solicitar un intercambio o un favor, se debe tener un  **crédito en horas** , lo que implica haber realizado intercambios previamente.
* El registro de los intercambios puede hacerse con un **talón o cartilla** donde se anota quién ofrece, quién recibe y cuántas horas. También existen plataformas digitales para facilitar esta contabilidad.

1. **Tipos de Intercambio** :

* Los intercambios pueden incluir  **bienes, servicios, experiencias y conocimientos** .
* Se enfatiza que los intercambios en LETS **no son de carácter profesional** ni buscan competir con el mercado laboral tradicional [Manual para la Implementación del Sistema LETS en la SuperApp CoomÜnity, 35, 52]. En lugar de servicios profesionales completos, se ofrecen  **consejos u orientaciones** [Manual para la Implementación del Sistema LETS en la SuperApp CoomÜnity, 57]. Por ejemplo, "cenas de idiomas" en lugar de clases estructuradas [Manual para la Implementación del Sistema LETS en la SuperApp CoomÜnity, 53].
* Se pueden intercambiar desde pequeñas reparaciones, masajes, clases de cocina o idiomas, hasta servicios de diseño gráfico, programación o psicología, siempre que haya disposición. La clave es que es gente que tiene conocimientos y los comparte, no compitiendo con profesionales.

1. **Las "Barras LETS" o Actividades Grupales** :

* Los **talleres y actividades presenciales** son fundamentales para que la gente se conozca, cree vínculos reales y se integre [Manual para la Implementación del Sistema LETS en la SuperApp CoomÜnity, 39].
* Ejemplos incluyen cenas de idiomas, bailes, actividades para niños, o incluso talleres donde se participa a cambio de alimentos, promoviendo la inclusión.
* Estos encuentros facilitan la **dinamización del grupo** y la participación, un reto común en los LETS.
* Algunos LETS permiten que **no socios participen en talleres** aportando alimentos al banco de alimentos del sistema, fomentando la colaboración sin necesidad de estar plenamente adherido a la filosofía de la moneda.

1. **Desafíos y Consideraciones** :

* **Conciliación de Horarios** : Un reto, especialmente en grandes ciudades, aunque los LETS pueden ayudar en el cuidado de niños y mayores [Manual para la Implementación del Sistema LETS en la SuperApp CoomÜnity, 36].
* **Mantenimiento del Grupo y Dinamización** : Es uno de los problemas más difíciles, asegurando que la gente participe activamente [Manual para la Implementación del Sistema LETS en la SuperApp CoomÜnity, 42, 47].
* **Competencia con Profesionales** : Aunque no buscan competir, puede haber preocupación por parte de profesionales externos. La solución es cambiar el formato de los servicios para que no se asimilen a academias o servicios profesionales [Manual para la Implementación del Sistema LETS en la SuperApp CoomÜnity, 53].
* **Gestión del Crecimiento** : A medida que una comunidad crece, puede ser útil descentralizar grupos por barrios para facilitar la participación local [Manual para la Implementación del Sistema LETS en la SuperApp CoomÜnity, 56].
* **Sistemas Híbridos** : Algunos LETS exploran la posibilidad de combinar el intercambio de tiempo con dinero FIAT o productos, generando debate dentro de la comunidad sobre la coherencia con los principios de intercambio no monetario.
* **Automatización vs. Flexibilidad** : El software puede facilitar el registro de intercambios y la valoración, pero a veces puede limitar la flexibilidad o las reglas internas acordadas por el colectivo.

### **Implementación en la SuperApp CoomÜnity**

La SuperApp CoomÜnity integra el sistema LETS con su **Matchplace** y sus  **Comunidades de Práctica (CoPs)** , alineándose con sus principios de confianza, cooperación y reducción de la dependencia del dinero FIAT [Manual para la Implementación del Sistema LETS en la SuperApp CoomÜnity].

1. **Unidad de Intercambio (Ünits)** :

* Las **Ünits son el token extrínseco principal** y la unidad de medida del valor en el Matchplace [Manual para la Implementación del Sistema LETS en la SuperApp CoomÜnity, 531].
* La filosofía es que "una hora es igual a otra hora" para los servicios, aunque el software puede permitir flexibilidad en la valoración [Manual para la Implementación del Sistema LETS en la SuperApp CoomÜnity, 56].
* Las billeteras pueden **empezar en cero** y permitir saldos negativos temporalmente, basándose en la **confianza de la comunidad** [Manual para la Implementación del Sistema LETS en la SuperApp CoomÜnity].
* Se usarán **Ünits de Prueba** en el "Concurso de Mëritos" para la etapa Solver, confinadas a dicho concurso y con caducidad al finalizar [Manual para la Implementación del Sistema LETS en la SuperApp CoomÜnity, 72].
* Se considera la posibilidad de implementar  **sistemas híbridos** , como participar en actividades a cambio de alimentos [Manual para la Implementación del Sistema LETS en la SuperApp CoomÜnity]. Las Ünits Circulantes no caducan si la suscripción mensual se renueva a tiempo.

1. **Matchplace Vocacional** :

* El Matchplace de CoomÜnity está diseñado para **propiciar intercambios de servicios, experiencias y productos de origen local** utilizando las Ünits como medio de pago alternativo [Manual para la Implementación del Sistema LETS en la SuperApp CoomÜnity].
* Se promoverá que los usuarios brinden productos, servicios o experiencias desde sus  **vocaciones** , guiándolos a encontrar maneras creativas de agregar valor.
* Los usuarios Buyer (pre-etapa) que no completen la experiencia completa tendrán  **costos más altos para comprar Ünits y menos beneficios** , y no podrán ver la GPL completa ni los contenidos de mayor valor social.

1. **Tecnología y Operatividad** :

* CoomÜnity utilizará una **Wallet para las Ünits** sobre infraestructura blockchain (Lightning Network Bitcoin, evaluando Liquid Network para NFTs como Mëritos) [Manual para la Implementación del Sistema LETS en la SuperApp CoomÜnity].
* La aplicación se distribuirá como una **PWA (Progressive Web Application)** [Manual para la Implementación del Sistema LETS en la SuperApp CoomÜnity].
* El sistema de **invitación directa** por usuarios existentes será el principal mecanismo de expansión de la comunidad, eliminando la necesidad de marketing externo [Manual para la Implementación del Sistema LETS en la SuperApp CoomÜnity].
* La plataforma permitirá a los usuarios  **contactar directamente desde su domicilio** , ver ofertas y demandas, y conocer la  **valoración de otros intercambios** , facilitando la confianza [Manual para la Implementación del Sistema LETS en la SuperApp CoomÜnity, 38].

1. **Integración con Comunidades de Práctica (CoPs)** :

* Las CoPs son espacios donde personas con distintos niveles de conocimiento (enseñar, hacer, aprender) confluyen para **capturar, documentar, transferir y acompañar el conocimiento** [Manual para la Implementación del Sistema LETS en la SuperApp CoomÜnity, 154].
* Se aprovechará la infraestructura tecnológica existente de CoomÜnity, incluyendo el backend NestJS con tablas cops, cop_roles, cop_members, y el frontend GroupsPageEnhanced.tsx con métricas Ayni y un sistema de roles jerárquicos (Aprendiz → Maestro) [Manual para la Implementación del Sistema LETS en la SuperApp CoomÜnity, 63, 64].
* La plataforma fomentará la **visibilidad y el reconocimiento del trabajo** de los miembros a través de métricas y la posibilidad de mostrar avances y éxitos colectivos.
* El **e-moderador** de la comunidad es clave para dinamizar la participación y promover el intercambio.
* Se busca un equilibrio entre la motivación intrínseca (placer de colaborar, altruismo) y extrínseca (incentivos utilitarios) [Manual para la Implementación del Sistema LETS en la SuperApp CoomÜnity, 504]. Los **Tokens Intrínsecos** de CoomÜnity (Mëritos, Vibras, Öndas) no son transaccionales, pero representan el valor del aporte personal y extendido, fomentando la  **motivación intrínseca** . Los **Mëritos**reconocen y celebran acciones recíprocas, desbloqueando nuevas posibilidades y acceso a interacciones más significativas o participación en iniciativas más amplias.

El sistema LETS (Local Exchange Trading System) y los bancos de tiempo son modelos de **monedas complementarias** diseñados para fomentar el **intercambio de bienes y servicios, la ayuda mutua y la construcción de comunidad a nivel local** [Manual para la Implementación del Sistema LETS en la SuperApp CoomÜnity; 48, 49, 54, 596, 648]. Surgieron como una respuesta a las limitaciones del trueque directo y del sistema monetario tradicional, que puede ser propenso a la acumulación y la especulación.

### **Ejemplo Descriptivo de Implementación de LETS en Bancos de Tiempo**

Imagina una comunidad, como un barrio en una ciudad o un campus universitario, donde se decide establecer un "Banco de Tiempo" para revitalizar el sentido de pertenencia y fomentar la colaboración.

1. **Registro y Creación de la Cuenta** :

* Las personas interesadas en unirse al Banco de Tiempo se registran como miembros, generalmente sin costo de cuota.
* Cada participante comienza con una **"billetera en cero"** o con un pequeño "crédito inicial" (por ejemplo, 3 horas o "Pumas" en el caso de la moneda social de Sevilla) para facilitar los primeros intercambios. Este crédito se basa en la  **confianza de la comunidad** .
* La unidad de medida del valor es el  **tiempo** , bajo el principio fundamental de que  **"una hora de esfuerzo es igual a otra hora de esfuerzo"** , valorando el trabajo de manera equitativa [Manual para la Implementación del Sistema LETS en la SuperApp CoomÜnity, 56].

1. **Oferta y Demanda de Servicios** :

* Los miembros publican lo que pueden **ofrecer** (servicios, habilidades, conocimientos, o incluso productos locales/reciclados) y lo que  **necesitan** . Por ejemplo, alguien podría ofrecer "clases de cocina casera" o "ayuda con pequeñas reparaciones", mientras que otro necesita "cuidado de niños" o "asesoramiento informático".
* Se enfatiza que estos intercambios **no son de carácter profesional** ni buscan competir con el mercado laboral tradicional, sino más bien ofrecer "consejos u orientaciones" o "cenas de idiomas" en lugar de clases estructuradas.
* La plataforma (inicialmente cartillas o talones, ahora más comúnmente plataformas digitales) permite a los miembros contactar directamente para acordar un intercambio.

1. **Realización y Registro del Intercambio** :

* Una vez que se realiza un servicio, el receptor paga al proveedor en "horas" o la unidad de tiempo definida por el sistema (ej., "Ünits", "Pumas", "Ecos").
* Este pago se registra en la cartilla o en la plataforma digital, actualizando los saldos de ambos participantes. Si un participante tiene un saldo negativo, esto se permite temporalmente, lo que refleja la confianza en que eventualmente ofrecerá servicios para compensarlo.

1. **Las "Barras LETS" y Actividades Comunitarias** :

* Más allá de los intercambios individuales, los bancos de tiempo organizan  **actividades presenciales o "talleres"** , a menudo denominadas "Barras LETS" [Manual para la Implementación del Sistema LETS en la SuperApp CoomÜnity, 39, 55].
* Estas actividades (como cenas de idiomas, bailes, talleres de reparación o agricultura urbana) son cruciales para que los miembros se conozcan, establezcan **vínculos de confianza reales** y se sientan útiles y parte de la comunidad.
* Algunos bancos de tiempo permiten que **no socios participen en talleres a cambio de donar alimentos** al banco de alimentos del sistema, fomentando la inclusión y la colaboración sin una adhesión plena inicial.

1. **Desafíos y Soluciones Observadas** :

* **Dinamización de la Participación** : Uno de los mayores retos es mantener a la gente activamente involucrada. Las plataformas online facilitan el contacto desde el domicilio y permiten ver valoraciones de otros intercambios, lo que genera confianza y fomenta la participación. La **gamificación** también puede ser una herramienta clave para incentivar el compromiso.
* **Conciliación de Horarios** : En ciudades grandes, la diversidad de horarios puede dificultar los intercambios, aunque los bancos de tiempo pueden ofrecer flexibilidad, por ejemplo, en el cuidado de niños o personas mayores.
* **Sistemas Híbridos** : Algunas comunidades han debatido la integración de intercambios de tiempo con dinero FIAT o productos, con experiencias variadas. Esto puede generar tensiones con la filosofía de intercambio no monetario, pero también puede dinamizar la participación.
* **Estrategias de Financiamiento** : Muchos bancos de tiempo operan sin cuotas, buscando apoyo institucional (ayuntamientos), pequeñas subvenciones, o intercambiando horas con asociaciones amigas para cubrir gastos básicos como el mantenimiento web.

### **Implementación de LETS en CoomÜnity**

CoomÜnity es un ejemplo de cómo los principios de LETS se integran en una plataforma digital moderna, buscando **"tokenizar la confianza"** y fomentar el **"ganar-ganar"** a través de una  **economía humanizada** .

1. **Unidades de Intercambio (Ünits)** :

* Las **Ünits son el "token extrínseco principal"** y la unidad de medida de valor en el **Matchplace vocacional** de CoomÜnity. Mantienen la filosofía de que "una hora es igual a otra hora" para los servicios, aunque el software permite cierta flexibilidad en la valoración.
* Las billeteras de los usuarios pueden comenzar en cero y permitir saldos negativos temporales, basados en la confianza de la comunidad.

1. **Tecnología y Gamificación** :

* CoomÜnity utiliza una **Wallet sobre infraestructura blockchain** (Lightning Network Bitcoin para Ünits y Liquid Network para NFTs como los Mëritos) para garantizar transacciones seguras y descentralizadas.
* La plataforma integra **"Experiencias Gamificadas Metanöicas"** para generar transformación de la mentalidad de los usuarios. La gamificación se basa en marcos como Octalysis, utilizando elementos como tablas de posiciones, barras de progreso y módulos de misiones.
* Además de las Ünits (tokens extrínsecos), existen **"Tokens Intrínsecos"** como los  **Mëritos, Vibras y Öndas** , que no son transaccionales y no tienen fecha de caducidad. Estos tokens representan el valor del aporte personal y extendido a la comunidad, fomentando la  **motivación intrínseca** , la reciprocidad y el reconocimiento social. Por ejemplo, los Mëritos reconocen acciones recíprocas y pueden desbloquear nuevos roles de moderación o gobernanza local.

1. **Matchplace Vocacional y Comunidades de Práctica (CoPs)** :

* El Matchplace de CoomÜnity está diseñado para propiciar intercambios de servicios, experiencias y productos locales, donde los usuarios ofrecen desde sus  **"vocaciones"** .
* Las **Comunidades de Práctica (CoPs)** son espacios clave dentro de CoomÜnity donde personas con distintos niveles de conocimiento (enseñar, hacer, aprender) colaboran para capturar, documentar y transferir conocimiento. La plataforma facilita la **visibilidad y el reconocimiento del trabajo** de los miembros de las CoPs, fomentando la participación y el compromiso.
* La integración con las CoPs busca un equilibrio entre la motivación intrínseca (placer de colaborar) y extrínseca (incentivos utilitarios), donde los Tokens Intrínsecos juegan un papel fundamental en el reconocimiento del valor no monetario.

En esencia, CoomÜnity se propone como un "laboratorio" digital que aprovecha los principios de los LETS y bancos de tiempo, pero con una **infraestructura tecnológica robusta y un diseño gamificado** que busca escalar la confianza y la cooperación, transformando la mentalidad de sus usuarios hacia una economía de  **"bien común"** .

Aquí tienes una descripción de la moneda social basada en la fuente "La moneda social explicada en 2 minutos":

La moneda social, como la de Traslasierra, se explica como un  **sistema de crédito mutuo** . Su objetivo principal es permitir el  **intercambio de lo que se produce localmente** , manteniendo la claridad en las cuentas.

La implementación y el funcionamiento se describen de la siguiente manera:

* **Inicio de la Billetera** : En un primer momento,  **cada participante de la moneda social recibe una billetera, pero todas las billeteras están en cero** .
* **Posibilidad de Transacción** : A pesar de que las billeteras comienzan en cero, **se puede comprar** porque la comunidad confía en cada uno de sus participantes. Esta confianza permite que los participantes tengan la billetera en cero, o incluso en negativo, durante un corto tiempo.
* **Transacciones y Saldo Negativo** :
* Si un participante, por ejemplo, Mariela, le pide a Carlos que le venda una manzana, **Mariela quedará en negativo** en su billetera, mientras que Carlos recibirá el pago, teniendo así un saldo positivo.
* Aquellos que tienen sus billeteras en negativo  **pueden realizar ventas y así ir saldando la deuda con la comunidad** . Por ejemplo, si Isabel le pide a Mariela que le corte el pelo, y Mariela realiza el corte, al recibir el pago,  **la billetera de Mariela vuelve a cero** .
* **Circulación del Crédito** : Quienes tienen un saldo positivo en su billetera pueden hacerlo circular. Por ejemplo, Carlos, al tener dinero, puede comprarle un dulce de leche a Abuela y transferirle el crédito.
* **Desaparición del Dinero** : La fuente destaca que es  **"saludable cuando el dinero desaparece"** . Esto ocurre cuando los intercambios se equilibran. Por ejemplo, si Isabel le arregla la computadora a Nahuel y él le paga,  **la comunidad vuelve a estar en equilibrio** .
* **Propósito de la Moneda Social** : En síntesis, al adoptar una moneda social, la comunidad logra  **autoorganizarse para promocionar la producción y el consumo local** . La  **confianza que circula entre los participantes mueve el trabajo** . El dinero que es creado y puesto en movimiento impulsa el consumo local, creando un  **sano ciclo de surgir y desaparecer que limita la función del dinero al puro intercambio** .

Basándonos en la explicación de la moneda social de Traslasierra y en la descripción de CoomÜnity, podemos contextualizar cómo los principios de una moneda social se aplican en esta plataforma digital:

CoomÜnity integra la esencia de una moneda social como un  **sistema de crédito mutuo** , diseñado para fomentar el intercambio local y mantener una contabilidad clara dentro de una **economía humanizada** [conversación anterior].

Así es como se manifestarían sus principios en CoomÜnity:

* **Billeteras en Cero y la Confianza Comunitaria** : Al igual que en la moneda social de Traslasierra, en CoomÜnity, **cada participante puede comenzar con una "billetera en cero" o con un pequeño "crédito inicial"** [conversación anterior, 1]. La plataforma permite que los usuarios realicen transacciones incluso con un saldo cero o **negativo temporalmente** [conversación anterior], porque el sistema se basa en la **confianza de la comunidad** en cada uno de sus participantes. Esta confianza es la que **"tokeniza la confianza"** en el contexto de CoomÜnity [conversación anterior].
* **Las Ünits como Unidades de Intercambio** : Las **Ünits son el "token extrínseco principal"** en el Matchplace vocacional de CoomÜnity [conversación anterior]. Funcionan como la moneda social descrita, donde si un usuario, por ejemplo, Mariela, "compra" un servicio o producto de Carlos, **Mariela quedaría en negativo en sus Ünits** mientras Carlos recibiría el pago, teniendo un saldo positivo. La filosofía de que **"una hora de esfuerzo es igual a otra hora de esfuerzo"** subyace a la valoración de los servicios en Ünits [conversación anterior].
* **Circulación y Compensación de Deudas** : Aquellos usuarios que tienen sus Ünits en negativo **pueden ofrecer sus propias "vocaciones" y servicios** en el Matchplace [conversación anterior] para realizar ventas y así ir saldando la deuda con la comunidad. Por ejemplo, si Isabel pide a Mariela que le "corte el pelo" (ofrezca un servicio), y Mariela lo realiza, al recibir el pago en Ünits, **su billetera de Ünits puede volver a cero** o reducir su saldo negativo. Quienes tienen Ünits con saldo positivo pueden hacerlas circular adquiriendo otros servicios o productos locales.
* **El "Ciclo Sano de Surgir y Desaparecer"** : La visión de la moneda social es que es  **"saludable cuando el dinero desaparece"** , lo que ocurre cuando los intercambios se equilibran y la comunidad regresa a un estado de equilibrio en sus transacciones. En CoomÜnity, esto se traduce en un flujo constante de intercambios de Ünits que  **limita la función del dinero al puro intercambio** , impulsando el consumo y la producción local de manera eficiente. La  **"confianza que circula entre los participantes mueve el trabajo"** .
* **Propósito de Promoción Local y Generación de Confianza** : Al igual que la moneda social busca que la comunidad se  **autoorganice para promocionar la producción y el consumo local** , CoomÜnity persigue este objetivo a través de su Matchplace Vocacional y las Comunidades de Práctica (CoPs), donde los usuarios intercambian desde sus habilidades y conocimientos [conversación anterior].
* **Innovaciones de CoomÜnity que Refuerzan el Modelo** : CoomÜnity va más allá al utilizar una **infraestructura blockchain** para la gestión de Ünits, garantizando transacciones seguras y descentralizadas [conversación anterior]. Además, integra **"Experiencias Gamificadas Metanöicas"** y **"Tokens Intrínsecos" (como los Mëritos, Vibras y Öndas)** [conversación anterior]. Estos tokens intrínsecos, que no son transaccionales, refuerzan la **motivación intrínseca, la reciprocidad y el reconocimiento social** [conversación anterior], elementos fundamentales para la **construcción de comunidad y confianza** que sustentan cualquier sistema de moneda social.

La diferencia en la aplicación del sistema LETS (Local Exchange Trading System) entre el **Matchplace Vocacional** y las **Comunidades de Práctica (CoPs)** dentro de CoomÜnity radica principalmente en el  **foco y la naturaleza de los intercambios** , así como en los **tipos de "tokens" que predominan** en cada uno:

* **Matchplace Vocacional (Intercambios Transaccionales con Ünits)** :
* El Matchplace es el espacio principal donde las **Ünits actúan como el "token extrínseco principal"** para el intercambio directo de servicios y productos [conversación anterior]. Aquí se aplica directamente el modelo de la moneda social explicada: cada participante puede iniciar con su  **"billetera en cero"** , y la **confianza de la comunidad** permite que se realicen transacciones, incluso si esto significa que un usuario queda con un **saldo negativo temporalmente** [1, conversación anterior].
* El propósito es el **intercambio de "vocaciones"** —es decir, las habilidades y ofertas de cada persona [conversación anterior]— de manera  **transaccional** . Cuando un usuario "compra" un servicio, sus Ünits disminuyen (o quedan en negativo), y el proveedor las recibe en positivo, con el objetivo de que aquellos con saldo negativo  **"puedan realizar ventas y así ir saldando la deuda con la comunidad"** . La filosofía de que **"una hora de esfuerzo es igual a otra hora de esfuerzo"** subyace a la valoración en Ünits [conversación anterior].
* En este contexto, las Ünits impulsan el **"consumo local"** y el **"trabajo"** a través de un **"sano ciclo de surgir y desaparecer"** del crédito, limitando la función del "dinero" al puro intercambio.
* **Comunidades de Práctica (CoPs) (Intercambios de Conocimiento y Valor No Transaccional)** :
* Mientras que en las CoPs los usuarios  **"intercambian desde sus habilidades y conocimientos"** [conversación anterior], el énfasis se desplaza de la transacción directa con Ünits hacia la **colaboración, el aprendizaje y la construcción de valor comunitario** que no siempre es monetizable de forma explícita.
* En las CoPs, la dinámica de intercambio se ve fuertemente influenciada por los  **"Tokens Intrínsecos"** , como los **Mëritos, Vibras y Öndas** [conversación anterior]. Es crucial destacar que estos tokens **no son transaccionales** [conversación anterior]. Su función es **"tokenizar la confianza"** [conversación anterior] y fomentar la **motivación intrínseca, la reciprocidad y el reconocimiento social** [conversación anterior].
* Esto sugiere que, si bien podría haber servicios específicos dentro de una CoP que se intercambien con Ünits (manteniendo la lógica del LETS), el propósito principal de las CoPs es más holístico: facilitar el flujo de conocimiento y apoyo mutuo, donde la recompensa no es solo monetaria (Ünits) sino también social y de reconocimiento (Tokens Intrínsecos). La  **"confianza que circula entre los participantes mueve el trabajo"** , y en las CoPs, esta confianza se construye y se hace evidente a través de estos tokens no transaccionales que refuerzan el compromiso y la participación.

En resumen, el **Matchplace** es el motor **transaccional LETS** de CoomÜnity, centrado en las Ünits para la compraventa directa de servicios. Las  **Comunidades de Práctica** , por otro lado, se centran en el  **intercambio colaborativo de conocimiento y habilidades** , apoyándose en la  **reciprocidad y el reconocimiento (a través de tokens intrínsecos no transaccionales)** , lo que contribuye a la confianza subyacente que permite que el sistema LETS general funcione.
