5) <h3 class="MuiTypography-root MuiTypography-h3 css-a91o90-MuiTypography-root">12h</h3>akagetByR

ole('heading',{name:'12h'})

Calllog:

-Expect"toContainText"withtimeout5000ms

-waitingforlocator('h1, h2, h3')

102|

103|//VerificarquelapáginaÜPlaysecarga

> 104|awaitexpect(page.locator('h1, h2, h3')).toContainText(/ÜPlay|Videos|Playlist/i);

|^

105|

106|//Verificarquehaycontenidodevideoscargadodesdeelbackend

107|constvideoElements=page.locator('[data-testid*="video"], .video-item, .video-card');

at/Users/kevinp/Movies/GAMIFIERcopy/Demo/apps/superapp-unified/e2e/videos-e2e-flow.spec.ts:104:46

attachment#1: screenshot (image/png) ──────────────────────────────────────────────────────────

test-results/artifacts/videos-e2e-flow-🎬-Videos--bc05d-ión-de-videos-desde-Backend-chromium/test-failed

-1.png

────────────────────────────────────────────────────────────────────────────────────────────────

attachment#2: video (video/webm) ──────────────────────────────────────────────────────────────

test-results/artifacts/videos-e2e-flow-🎬-Videos--bc05d-ión-de-videos-desde-Backend-chromium/video.webm

────────────────────────────────────────────────────────────────────────────────────────────────

ErrorContext:test-results/artifacts/videos-e2e-flow-🎬-Videos--bc05d-ión-de-videos-desde-Backend-chrom

ium/error-context.md

…🎬VideosGamificados-FlujoE2ECompleto›🎮Parte3A:Simularinteracciónconpreguntas (si disponible)

ℹ️Selectornava:has-text("Videos")noencontrado,probandosiguiente...

ℹ️Selectorbutton:has-text("ÜPlay")noencontrado,probandosiguiente...

ℹ️Selectorbutton:has-text("UPlay")noencontrado,probandosiguiente...

ℹ️Selector [data-testid*="uplay"] no encontrado, probando siguiente...

ℹ️Selector.navigationa:has-text("ÜPlay")noencontrado,probandosiguiente...

ℹ️Selector.sidebara:has-text("ÜPlay")noencontrado,probandosiguiente...

⚠️NoseencontróenlaceÜPlay,navegandodirectamente...

194) [chromium] › e2e/videos-e2e-flow.spec.ts:139:3 › 🎬 Videos Gamificados - Flujo E2E Completo › 🎮 Part

e3A:Simularinteracciónconpreguntas (si disponible)

Testtimeoutof30000msexceeded.

Error:page.goto:Targetpage,contextorbrowserhasbeenclosed

76|//Sinoencuentraningúnenlace,intentarnavegacióndirecta

77|console.log('⚠️  No se encontró enlace ÜPlay, navegando directamente...');

> 78|awaitpage.goto('/uplay');

|^

79|awaitpage.waitForLoadState('networkidle');

80|   }

81|

atnavigateToUPlay (/Users/kevinp/Movies/GAMIFIER copy/Demo/apps/superapp-unified/e2e/videos-e2e-flo

w.spec.ts:78:16)

at/Users/kevinp/Movies/GAMIFIERcopy/Demo/apps/superapp-unified/e2e/videos-e2e-flow.spec.ts:143:5

attachment#1: screenshot (image/png) ──────────────────────────────────────────────────────────

test-results/artifacts/videos-e2e-flow-🎬-Videos--21512-on-preguntas-si-disponible--chromium/test-failed

-1.png

────────────────────────────────────────────────────────────────────────────────────────────────

attachment#2: video (video/webm) ──────────────────────────────────────────────────────────────

test-results/artifacts/videos-e2e-flow-🎬-Videos--21512-on-preguntas-si-disponible--chromium/video.webm

────────────────────────────────────────────────────────────────────────────────────────────────

ErrorContext:test-results/artifacts/videos-e2e-flow-🎬-Videos--21512-on-preguntas-si-disponible--chrom

ium/error-context.md

…›🎬VideosGamificados-FlujoE2ECompleto›📊Parte3B:Verificarpersistenciadedatos (llamadas API)

ℹ️Selectornava:has-text("Videos")noencontrado,probandosiguiente...

ℹ️Selectorbutton:has-text("ÜPlay")noencontrado,probandosiguiente...

ℹ️Selectorbutton:has-text("UPlay")noencontrado,probandosiguiente...

ℹ️Selector [data-testid*="uplay"] no encontrado, probando siguiente...

ℹ️Selector.navigationa:has-text("ÜPlay")noencontrado,probandosiguiente...

ℹ️Selector.sidebara:has-text("ÜPlay")noencontrado,probandosiguiente...

⚠️NoseencontróenlaceÜPlay,navegandodirectamente...

…ation.spec.ts:86:3›WalletAPIFixVerification›shouldhavewalletAPIproperlyexportedfromapi-service

✅walletAPIproperlyexportedwithallexpectedmethods

📊Availablemethods:getMyWallet,getBalance,getTransactions,getMerits,getAllMerits,getMeritsLeaderboar

d,getMeritHistory,awardMerit,transfer

195) [chromium] › e2e/videos-e2e-flow.spec.ts:190:3 › 🎬 Videos Gamificados - Flujo E2E Completo › 📊 Part

e3B:Verificarpersistenciadedatos (llamadas API)

Testtimeoutof30000msexceeded.

Error:page.goto:Targetpage,contextorbrowserhasbeenclosed

76|//Sinoencuentraningúnenlace,intentarnavegacióndirecta

77|console.log('⚠️  No se encontró enlace ÜPlay, navegando directamente...');

> 78|awaitpage.goto('/uplay');

|^

79|awaitpage.waitForLoadState('networkidle');

80|   }

81|

atnavigateToUPlay (/Users/kevinp/Movies/GAMIFIER copy/Demo/apps/superapp-unified/e2e/videos-e2e-flo

w.spec.ts:78:16)

at/Users/kevinp/Movies/GAMIFIERcopy/Demo/apps/superapp-unified/e2e/videos-e2e-flow.spec.ts:224:5

attachment#1: screenshot (image/png) ──────────────────────────────────────────────────────────

test-results/artifacts/videos-e2e-flow-🎬-Videos--1b86b-ncia-de-datos-llamadas-API--chromium/test-failed

-1.png

────────────────────────────────────────────────────────────────────────────────────────────────

attachment#2: video (video/webm) ──────────────────────────────────────────────────────────────

test-results/artifacts/videos-e2e-flow-🎬-Videos--1b86b-ncia-de-datos-llamadas-API--chromium/video.webm

────────────────────────────────────────────────────────────────────────────────────────────────

ErrorContext:test-results/artifacts/videos-e2e-flow-🎬-Videos--1b86b-ncia-de-datos-llamadas-API--chrom

ium/error-context.md

…eos-e2e-flow.spec.ts:296:3›🎬VideosGamificados-FlujoE2ECompleto›🏁ResumendelFlujoE2ECompleto

ℹ️Selectornava:has-text("UPlay")noencontrado,probandosiguiente...

…ation.spec.ts:10:3›WalletBackendIntegration›shouldloadwalletpageanddisplayrealdataafterlogin

🔍Testingwalletpagewithrealbackenddata...

🚀Navegandoalapáginadelwallet...

🌐CurrentURL:http://localhost:3001/wallet

💰Verificandoelementosdelwallet...

💎Verificandobalancesymonedas...

⚠️Elementosespecíficosnoencontrados,verificandoestructurageneral...

🔍Verificandoausenciadeerroresdeconexión...

✅Walletpagecondatosreales-Testexitoso

…integration.spec.ts:89:3›WalletBackendIntegration›shouldverifybackendconnectivityanddataloading

🔍Testingbackendconnectivityanddataloading...

…tion.spec.ts:138:3›WalletAPIFixVerification›shouldnavigatethroughprotectedrouteswithoutcrashes

✅Route/loadedsuccessfully

…integration.spec.ts:89:3›WalletBackendIntegration›shouldverifybackendconnectivityanddataloading

🌐Verificandoconectividadconelbackend...

196) [chromium] › e2e/wallet-api-fix-verification.spec.ts:4:3 › Wallet API Fix Verification › should login

successfullywithoutwalletAPIimporterrors

Error:Timedout5000mswaitingforexpect(locator).toContainText(expected)

Locator:locator('h1, h2, h3')

Expectedpattern:/login|iniciar|sesión/i

Receivedstring:"CoomÜnity"

Calllog:

-Expect"toContainText"withtimeout5000ms

-waitingforlocator('h1, h2, h3')

7×locatorresolvedto<h1class="MuiTypography-root MuiTypography-h4 MuiTypography-alignCenter Mui

Typography-gutterBottom css-ifnfs7-MuiTypography-root">CoomÜnity`</h1>`

-unexpectedvalue"CoomÜnity"

33|

34|//3.Verificarquelapáginadeloginsecargacorrectamente

> 35|awaitexpect(page.locator('h1, h2, h3')).toContainText(/login|iniciar|sesión/i);

|^

36|

37|//4.Realizarloginconcredencialesválidas

38|awaitpage.fill('[data-testid="login-email-input"] input','user@gamifier.com');

at/Users/kevinp/Movies/GAMIFIERcopy/Demo/apps/superapp-unified/e2e/wallet-api-fix-verification.spe

c.ts:35:46

attachment#1: screenshot (image/png) ──────────────────────────────────────────────────────────

test-results/artifacts/wallet-api-fix-verificatio-b59d3-out-walletAPI-import-errors-chromium/test-failed

-1.png

────────────────────────────────────────────────────────────────────────────────────────────────

attachment#2: video (video/webm) ──────────────────────────────────────────────────────────────

test-results/artifacts/wallet-api-fix-verificatio-b59d3-out-walletAPI-import-errors-chromium/video.webm

────────────────────────────────────────────────────────────────────────────────────────────────

ErrorContext:test-results/artifacts/wallet-api-fix-verificatio-b59d3-out-walletAPI-import-errors-chrom

ium/error-context.md

…tion.spec.ts:138:3›WalletAPIFixVerification›shouldnavigatethroughprotectedrouteswithoutcrashes

✅Route/dashboardloadedsuccessfully

…eos-e2e-flow.spec.ts:296:3›🎬VideosGamificados-FlujoE2ECompleto›🏁ResumendelFlujoE2ECompleto

ℹ️Selectornava:has-text("Videos")noencontrado,probandosiguiente...

✅EnlaceÜPlayencontradoconselector:button:has-text("ÜPlay")

✅NavegaciónaÜPlaycompletada

✅ConectividadAPIverificada

✅Navegaciónfuncional

🏆RESUMENFINAL:FLUJOE2EVIDEOSGAMIFICADOS

═════════════════════════════════════════════════

🔌AutenticaciónReal:✅

📊ContenidodeVideo:❌

🔗ConectividadAPI:✅

🎮ElementosInteractivos:❌

═════════════════════════════════════════════════

📊ScoreGeneral:2/4 (50%)

🎉FLUJOE2EVIDEOSGAMIFICADOS:NECESITAATENCIÓN

…tion.spec.ts:121:3›WalletBackendIntegration›shoulddisplaywalletnavigationandinteractiveelements

🔍Testingwalletnavigationafterlogin...

🧭Buscandoelementosdenavegación...

🔘Verificandoelementosinteractivos...

📊Interactiveelementsfound-Buttons:5,Links:1

🖱️Clickableelementsfound:10

✅Navigationandinteractivitytestpassed

197) [chromium] › e2e/videos-e2e-flow.spec.ts:296:3 › 🎬 Videos Gamificados - Flujo E2E Completo › 🏁 Resu

mendelFlujoE2ECompleto

Error:expect(received).toBeGreaterThanOrEqual(expected)

Expected:>=3

Received:2

369|

370|//Verificarquealmenos3de4checkspasaron

> 371|expect(successCount).toBeGreaterThanOrEqual(3);

|^

372|console.log('✅ Prueba de integración E2E completada exitosamente');

373|   });

374| });

at/Users/kevinp/Movies/GAMIFIERcopy/Demo/apps/superapp-unified/e2e/videos-e2e-flow.spec.ts:371:26

attachment#1: screenshot (image/png) ──────────────────────────────────────────────────────────

test-results/artifacts/videos-e2e-flow-🎬-Videos--287b4-umen-del-Flujo-E2E-Completo-chromium/test-failed

-1.png

────────────────────────────────────────────────────────────────────────────────────────────────

attachment#2: video (video/webm) ──────────────────────────────────────────────────────────────

test-results/artifacts/videos-e2e-flow-🎬-Videos--287b4-umen-del-Flujo-E2E-Completo-chromium/video.webm

────────────────────────────────────────────────────────────────────────────────────────────────

ErrorContext:test-results/artifacts/videos-e2e-flow-🎬-Videos--287b4-umen-del-Flujo-E2E-Completo-chrom

ium/error-context.md

…tion.spec.ts:138:3›WalletAPIFixVerification›shouldnavigatethroughprotectedrouteswithoutcrashes

✅Route/walletloadedsuccessfully

…gration.spec.ts:235:3›WalletBackendIntegration›shouldhandleloadingstatesanddisplayfinalcontent

🔍Testingloadingstatesafterlogin...

⏳Verificandoestadosdecarga...

…integration.spec.ts:89:3›WalletBackendIntegration›shouldverifybackendconnectivityanddataloading

✅Backendconnectivityanddataloading-Testpassed

…nd-integration.spec.ts:167:3›WalletBackendIntegration›shoulddisplaywalletbalancewithbackenddata

🔍Testingwalletbalancewithrealbackenddata...

⏳Esperandocargadedatosdelbackend...

…tion.spec.ts:138:3›WalletAPIFixVerification›shouldnavigatethroughprotectedrouteswithoutcrashes

✅Route/profileloadedsuccessfully

…gration.spec.ts:290:3›WalletBackendIntegration›shouldberesponsiveanddisplaycorrectlyafterlogin

🔍Testingresponsivedesignafterlogin...

📱Testingviewport:1200x800

…gration.spec.ts:235:3›WalletBackendIntegration›shouldhandleloadingstatesanddisplayfinalcontent

⏳Loadingindicatorfound:.loading

…gration.spec.ts:290:3›WalletBackendIntegration›shouldberesponsiveanddisplaycorrectlyafterlogin

📱Viewport1200x800:Bodywidth1200px

🖱️Clickableelementsin1200px:11

📱Testingviewport:768x1024

…tion.spec.ts:138:3›WalletAPIFixVerification›shouldnavigatethroughprotectedrouteswithoutcrashes

✅Route/marketplaceloadedsuccessfully

…nd-integration.spec.ts:167:3›WalletBackendIntegration›shoulddisplaywalletbalancewithbackenddata

💰Verificandoelementosdebalance...

💰Foundbalance-relatedelementswithselector:text=Balance

✅Balanceelementisvisible:text=Balance

🔢Verificandodatosnuméricosdelbackend...

🔢Pagecontainsnumbers (backend balances): true

✅Balanceelementsfoundandverified

✅Balancesectionwithbackenddata-Testpassed

…gration.spec.ts:290:3›WalletBackendIntegration›shouldberesponsiveanddisplaycorrectlyafterlogin

📱Viewport768x1024:Bodywidth768px

🖱️Clickableelementsin768px:17

📱Testingviewport:375x667

…:12:3›WalletPageDebug-BackendIntegration›DEBUG:Completeauthenticationandwalletnavigationflow

🔍Startingcomprehensivewalletdebuginspection...

📍Step1:Initialloginpagestate

🌐InitialURL:http://localhost:3001/login

📍Step2:Performinglogin

✅Loginbuttonclicked

📍Step3:Waitingforauthenticationredirect

✅Successfullyredirectedto:http://localhost:3001/login

📍Step4:Directnavigationtowallet

…gration.spec.ts:290:3›WalletBackendIntegration›shouldberesponsiveanddisplaycorrectlyafterlogin

📱Viewport375x667:Bodywidth375px

🖱️Clickableelementsin375px:18

✅Responsivedesignafterlogin-Testpassed

…tion.spec.ts:138:3›WalletAPIFixVerification›shouldnavigatethroughprotectedrouteswithoutcrashes

✅Route/challengesloadedsuccessfully

…ec.ts:124:3›WalletPageDebug-BackendIntegration›DEBUG:Checkauthenticationstateandwalletaccess

🔍Testingauthenticationstateandwalletaccess...

…:12:3›WalletPageDebug-BackendIntegration›DEBUG:Completeauthenticationandwalletnavigationflow

🌐WalletURLafterdirectnavigation:http://localhost:3001/login

❌Notonwalletpage,redirectedto:http://localhost:3001/login

❌Consoleerrorsduringflow: [

'[Auth] Error en login: Error: Error de conexión con el servidor. Por favor, verifica tu conexión.\n'+

'    at ApiService.requestWithoutAuth (http://localhost:3001/src/lib/api-service.ts:417:27)\n'+

'    at async backendSignIn (http://localhost:3001/src/contexts/AuthContext.tsx:70:22)\n'+

'    at async signIn (http://localhost:3001/src/contexts/AuthContext.tsx:211:24)\n'+

'    at async handleSubmit (http://localhost:3001/src/pages/Login.tsx:58:7)',

'Original Error: Error: Error de conexión con el servidor. Por favor, verifica tu conexión.\n'+

'    at backendSignIn (http://localhost:3001/src/contexts/AuthContext.tsx:92:11)\n'+

'    at async signIn (http://localhost:3001/src/contexts/AuthContext.tsx:211:24)\n'+

'    at async handleSubmit (http://localhost:3001/src/pages/Login.tsx:58:7)',

'Message: Error de conexión con el servidor. Por favor, verifica tu conexión.',

'Category: unknown',

'Stack: Error: Error de conexión con el servidor. Por favor, verifica tu conexión.\n'+

'    at backendSignIn (http://localhost:3001/src/contexts/AuthContext.tsx:92:11)\n'+

'    at async signIn (http://localhost:3001/src/contexts/AuthContext.tsx:211:24)\n'+

'    at async handleSubmit (http://localhost:3001/src/pages/Login.tsx:58:7)',

'Troubleshooting: undefined',

'Timestamp: 2025-06-15T07:09:07.216Z'

]

⚠️Consolewarningsduringflow: [

'⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransit

ion `in v7. You can use the`v7_startTransition` future flag to opt-in early. For more information, see http

s://reactrouter.com/v6/upgrading/future#v7_starttransition.',

'⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You

can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactroute

r.com/v6/upgrading/future#v7_relativesplatpath.'

]

📸Finalscreenshotsavedaswallet-debug-final.png

✅Debugtestcompletedsuccessfully

…tion.spec.ts:138:3›WalletAPIFixVerification›shouldnavigatethroughprotectedrouteswithoutcrashes

✅Route/socialloadedsuccessfully

✅Navigationthroughprotectedroutescompletedwithoutcriticalerrors

….ts:17:3›🎬VerificacióndeVideosdeYouTube›🎥VerificarquelosvideosdeYouTubesecarganenÜPlay

🎯IniciandoverificacióndevideosdeYouTube...

…ec.ts:124:3›WalletPageDebug-BackendIntegration›DEBUG:Checkauthenticationstateandwalletaccess

🔑AuthenticationtokenfoundinlocalStorage:false

👤UserdatainlocalStorage:null

…n.spec.ts:72:3›🎬VerificacióndeVideosdeYouTube›🎮Verificarfuncionalidaddelreproductordevideo

🎯Verificandofuncionalidaddelreproductor...

…ec.ts:124:3›WalletPageDebug-BackendIntegration›DEBUG:Checkauthenticationstateandwalletaccess

🌐FinalURLafterwalletaccessattempt:http://localhost:3001/wallet

🔐Userappearstobeauthenticated:true

💰Wallet-relatedelementsfound: [

'CoomÜnity3RInicioMi PerfilMódulosMarketplaceÜPlaySocial2GruposDesafíosWalletÜStatsPilgrimPWA DemoConfigur

aciónConfiguraciónAyudaSistema funcionando correctamenteAdmin PanelMi Wallet CoomÜnity🌐 Datos en tiempo rea

lSINCRONIZADOBalance PrincipalPesos Colombianos100 COP+3.6695973960069335% este mesÜCoins CoomÜnityMoneda in

terna colaborativa100 UCMëritos10Contribuciones al Bien ComúnÖndas50Energía vibracional positivaPendiente$0T

ransacciones en procesoComunidad#8823Ranking globalNivel AyniReciprocidad en CoomÜnityExplorador10/10016 pun

tos para Colaborador8.164042350134965Colaboración#8823Ranking💼 Balance Disponible para Operaciones$100 COP1

00 ÜCoins10 Mëritos50 ÖndasAcciones RápidasEnviarTransferir a otros usuariosRecibirSolicitar o generar QRAyn

iIntercambiarConvertir entre monedasHistorialVer todas las transacciones📊 Resumen📝 Transacciones💳 Métodos

 de Pago⚙️ Configuración📊 Resumen de Cuentas CoomÜnityGestiona tus diferentes cuentas y balances en el ecosi

stema CoomÜnity.Cuenta Principal CoomÜnity100 ÜCoinsCuenta corrientePrincipalTöins Wallet$ 50Moneda digital'

,

'CoomÜnity3R',

'',

'',

'',

'',

'',

'InicioMi PerfilMódulosMarketplaceÜPlaySocial2GruposDesafíosWalletÜStatsPilgrimPWA DemoConfiguraciónConfig

uraciónAyudaSistema funcionando correctamenteAdmin Panel',

'',

'',

'',

'',

'',

'',

'',

'',

'',

'',

'',

'',

'',

'',

'',

'',

'',

'',

'',

'',

'',

'',

'',

'',

'',

'',

'',

'',

'',

'',

'',

'',

'',

'',

'',

'',

'InicioMi PerfilMódulosMarketplaceÜPlaySocial2GruposDesafíosWalletÜStatsPilgrimPWA DemoConfiguraciónConfig

uraciónAyudaSistema funcionando correctamenteAdmin Panel',

'',

'InicioMi PerfilMódulosMarketplaceÜPlaySocial2GruposDesafíosWalletÜStatsPilgrimPWA DemoConfiguraciónConfig

uraciónAyudaSistema funcionando correctamenteAdmin Panel',

'',

'',

'',

'',

'',

'',

'',

'',

'',

'',

'',

'',

'',

'',

''

]

….ts:17:3›🎬VerificacióndeVideosdeYouTube›🎥VerificarquelosvideosdeYouTubesecarganenÜPlay

📊VideosdeYouTubedetectados:0

📊Videoslocalesdetectados:0

198) [chromium] › e2e/youtube-videos-verification.spec.ts:17:3 › 🎬 Verificación de Videos de YouTube › 🎥

VerificarquelosvideosdeYouTubesecarganenÜPlay

Error:expect(received).toBeGreaterThan(expected)

Expected:>0

Received:0

34|

35|//Verificarquehayalmenosalgúntipodevideo

> 36|expect(youtubeElements+localVideos).toBeGreaterThan(0);

|^

37|

38|//SihayvideosdeYouTube,verificarquesecargancorrectamente

39|if(youtubeElements>0){

at/Users/kevinp/Movies/GAMIFIERcopy/Demo/apps/superapp-unified/e2e/youtube-videos-verification.spe

c.ts:36:43

attachment#1: screenshot (image/png) ──────────────────────────────────────────────────────────

test-results/artifacts/youtube-videos-verificatio-6b401--YouTube-se-cargan-en-ÜPlay-chromium/test-failed

-1.png

────────────────────────────────────────────────────────────────────────────────────────────────

attachment#2: video (video/webm) ──────────────────────────────────────────────────────────────

test-results/artifacts/youtube-videos-verificatio-6b401--YouTube-se-cargan-en-ÜPlay-chromium/video.webm

────────────────────────────────────────────────────────────────────────────────────────────────

ErrorContext:test-results/artifacts/youtube-videos-verificatio-6b401--YouTube-se-cargan-en-ÜPlay-chrom

ium/error-context.md

…n.spec.ts:103:3›🎬VerificacióndeVideosdeYouTube›🔧VerificarconfiguracióndeentornoparaYouTube

🔧Verificandoconfiguracióndeentorno...

199) [chromium] › e2e/youtube-videos-verification.spec.ts:103:3 › 🎬 Verificación de Videos de YouTube ›

🔧VerificarconfiguracióndeentornoparaYouTube

Error:page.evaluate:Passedfunctionisnotwell-serializable!

108|

109|//Verificarlasvariablesdeentornoenelnavegador

> 110|constenvConfig=awaitpage.evaluate(()=> {

|^

111|return{

112|VITE_FORCE_YOUTUBE_VIDEOS:import.meta.env.VITE_FORCE_YOUTUBE_VIDEOS,

113|VITE_API_BASE_URL:import.meta.env.VITE_API_BASE_URL,

at/Users/kevinp/Movies/GAMIFIERcopy/Demo/apps/superapp-unified/e2e/youtube-videos-verification.spe

c.ts:110:34

attachment#1: screenshot (image/png) ──────────────────────────────────────────────────────────

test-results/artifacts/youtube-videos-verificatio-04b38-ión-de-entorno-para-YouTube-chromium/test-failed

-1.png

────────────────────────────────────────────────────────────────────────────────────────────────

attachment#2: video (video/webm) ──────────────────────────────────────────────────────────────

test-results/artifacts/youtube-videos-verificatio-04b38-ión-de-entorno-para-YouTube-chromium/video.webm

────────────────────────────────────────────────────────────────────────────────────────────────

ErrorContext:test-results/artifacts/youtube-videos-verificatio-04b38-ión-de-entorno-para-YouTube-chrom

ium/error-context.md

…n.spec.ts:72:3›🎬VerificacióndeVideosdeYouTube›🎮Verificarfuncionalidaddelreproductordevideo

🎮Botonesdereproducciónencontrados:0

⚠️Noseencontraronbotonesdereproduccióndisponibles

…gration.spec.ts:235:3›WalletBackendIntegration›shouldhandleloadingstatesanddisplayfinalcontent

⚠️Loadingindicatorstillpresent:.loading

📄Verificandocontenidofinal...

✅Loadingstatesandfinalcontent-Testpassed

199failed

[chromium]›e2e/admin-superapp-complete-verification.spec.ts:153:3›🚀SuperAppCoomÜnity-Verificaci

ónCompletaconAdmin›🎮2.VerificarDashboardGamificadoyMétricas

[chromium]›e2e/admin-superapp-complete-verification.spec.ts:316:3›🚀SuperAppCoomÜnity-Verificaci

ónCompletaconAdmin›🧭7.VerificarNavegaciónyRutasEstables

[chromium]›e2e/admin-superapp-complete-verification.spec.ts:338:3›🚀SuperAppCoomÜnity-Verificaci

ónCompletaconAdmin›🎯8.VerificaciónFinalyReportedeEstado

[chromium]›e2e/api-connectivity-debug.spec.ts:4:3›APIConnectivityDebug›DEBUG:TestdirectAPIco

nnectivityfrombrowser

[chromium]›e2e/auth-flow-verification.spec.ts:241:3›AuthFlowVerification›shouldloginsuccessful

lyandloaduserprofilewithout403errors

[chromium]›e2e/backend-data-verification.spec.ts:23:3›🔗DatosdelBackendenSuperApp›🌐Verifica

rllamadasalbackendyrespuestas

[chromium]›e2e/backend-data-verification.spec.ts:72:3›🔗DatosdelBackendenSuperApp›🎥Verifica

rendpointdevideosfunciona

[chromium]›e2e/backend-data-verification.spec.ts:107:3›🔗DatosdelBackendenSuperApp›🌍Verific

arendpointdemundosfunciona

[chromium]›e2e/backend-data-verification.spec.ts:142:3›🔗DatosdelBackendenSuperApp›🔍Verific

arnavegaciónycontenidoenlaSuperApp

[chromium]›e2e/backend-data-verification.spec.ts:161:3›🔗DatosdelBackendenSuperApp›📊Verific

arintegracióncompletaBackend↔SuperApp

[chromium]›e2e/backend-integration-verification.spec.ts:26:3›🔗IntegraciónBackendNestJS↔SuperAp

p›🌍VerificarquelosMundosdelBackendsemuestrenenlaSuperApp

[chromium]›e2e/backend-integration-verification.spec.ts:86:3›🔗IntegraciónBackendNestJS↔SuperAp

p›🎥VerificarquelosVideosdelBackendsemuestrenenlaSuperApp

[chromium]›e2e/backend-integration-verification.spec.ts:144:3›🔗IntegraciónBackendNestJS↔SuperA

pp›🔗VerificarconectividadconBackendNestJS

[chromium]›e2e/backend-integration-verification.spec.ts:172:3›🔗IntegraciónBackendNestJS↔SuperA

pp›📊VerificarrespuestadelBackendHealthCheck

[chromium]›e2e/backend-integration-verification.spec.ts:196:3›🔗IntegraciónBackendNestJS↔SuperA

pp›🔄Verificarcachéyactualizacióndedatos

[chromium]›e2e/backend-integration-verification.spec.ts:224:3›🔗IntegraciónBackendNestJS↔SuperA

pp›🎯VerificarestructuradedatosdelBackendenlaUI

[chromium]›e2e/builder-io-validation.spec.ts:26:3›Builder.ioRulesValidation›shouldloadhorizont

alplayerdemowithouthookerrors

[chromium]›e2e/builder-io-validation.spec.ts:54:3›Builder.ioRulesValidation›shouldhandlevideo

interactionswithouterrors

[chromium]›e2e/builder-io-validation.spec.ts:76:3›Builder.ioRulesValidation›shoulddisplayvideo

informationcorrectly

[chromium]›e2e/builder-io-validation.spec.ts:90:3›Builder.ioRulesValidation›shouldhandlequesti

onoverlayswithouthookerrors

[chromium]›e2e/builder-io-validation.spec.ts:117:3›Builder.ioRulesValidation›shouldcleanupprop

erlyonunmount

[chromium]›e2e/builder-io-validation.spec.ts:139:3›Builder.ioRulesValidation›shouldvalidateBui

lder.iocompatibility

[chromium]›e2e/challenges-backend-integration.spec.ts:64:3›ChallengesBackendIntegrationE2E›shou

ldattemptrealbackendconnectionforchallengesandfallbackgracefully

[chromium]›e2e/challenges-backend-integration.spec.ts:193:3›ChallengesBackendIntegrationE2E›sho

uldverifyspecificbackenderrorhandlingpatterns

[chromium]›e2e/challenges-content-verification.spec.ts:50:3›FaseA.8-VerificacióndeContenidodel

MódulodeChallenges›A.8.6-Verificardatosmockespecíficosdechallenges

[chromium]›e2e/challenges-content-verification.spec.ts:120:3›FaseA.8-VerificacióndeContenidode

lMódulodeChallenges›A.8.8-Verificarpestañas/navegacióninterna (si existe)

[chromium]›e2e/challenges-content-verification.spec.ts:179:3›FaseA.8-VerificacióndeContenidode

lMódulodeChallenges›A.8.10-Verificarintegraciónconautenticaciónmock

[chromium]›e2e/challenges-data-verification.spec.ts:26:3›ChallengesDataVerification›debemostrar

los3desafíosrealesdelBackendNestJS

[chromium]›e2e/challenges-data-verification.spec.ts:116:3›ChallengesDataVerification›debeverifi

carqueNOsemuestrandatosmockantiguos

[chromium]›e2e/challenges-integration.spec.ts:67:3›ChallengesIntegrationE2E›debemostrarlosdes

afíosrealesobtenidosdelbackendNestJS

[chromium]›e2e/challenges-integration.spec.ts:187:3›ChallengesIntegrationE2E›debemanejarcorrec

tamentelanavegaciónyestructuradelapáginacondatosreales

[chromium]›e2e/console-errors-analysis.spec.ts:5:3›🔍AnálisisdeErroresdeConsola-SuperApp›de

becapturaryanalizarerroresdeconsoladuranteloginynavegación

[chromium]›e2e/create-post-verification.spec.ts:25:3›🎯VerificaciónEspecífica:CreacióndePosts›

🎯 [INTEGRATION] Verificar que el feed social se carga y muestra el post de prueba manual

[chromium]›e2e/create-post-verification.spec.ts💯3›🎯VerificaciónEspecífica:CreacióndePosts

›🎯 [DATA] Verificar que los datos del backend se mapean correctamente

[chromium]›e2e/debug-videos-backend.spec.ts:4:3›🔥DEBUG:VideosdelBackendenÜPlay›🔍Verificar

logsydatosdelbackend

[chromium]›e2e/debug-youtube-admin.spec.ts:36:3›🔐DEBUGconCredencialesdeADMIN›🎬Verificarvi

deosdeYouTubeconpermisosdeADMIN

[chromium]›e2e/groups-basic-verification.spec.ts:12:3›MódulodeGrupos-VerificaciónBásica›1.Ac

cesodirectoalapáginadeGrupos

[chromium]›e2e/groups-functionality.spec.ts:29:3›MódulodeGrupos-VerificaciónFuncionalCompleta

›1.AccesoyCargadelaPáginadeGrupos

[chromium]›e2e/groups-functionality.spec.ts:47:3›MódulodeGrupos-VerificaciónFuncionalCompleta

›2.VisualizacióndelListadodeGruposMock

[chromium]›e2e/groups-functionality.spec.ts:74:3›MódulodeGrupos-VerificaciónFuncionalCompleta

›3.NavegaciónporPestañasdelMódulo

[chromium]›e2e/groups-functionality.spec.ts:105:3›MódulodeGrupos-VerificaciónFuncionalCompleta

›4.FuncionalidaddeBúsquedayFiltros

[chromium]›e2e/groups-functionality.spec.ts:143:3›MódulodeGrupos-VerificaciónFuncionalCompleta

›5.FuncionalidaddeUnirse/SalirdeGrupos

[chromium]›e2e/groups-functionality.spec.ts:199:3›MódulodeGrupos-VerificaciónFuncionalCompleta

›6.Modal/FlujodeCreacióndeGrupos

[chromium]›e2e/groups-functionality.spec.ts:247:3›MódulodeGrupos-VerificaciónFuncionalCompleta

›7.NavegaciónaDetallesdeGrupo

[chromium]›e2e/groups-functionality.spec.ts:298:3›MódulodeGrupos-VerificaciónFuncionalCompleta

›8.EstadosdeCargayError

[chromium]›e2e/groups-functionality.spec.ts:328:3›MódulodeGrupos-VerificaciónFuncionalCompleta

›9.ResponsividadyUIGeneral

[chromium]›e2e/groups-functionality.spec.ts:353:3›MódulodeGrupos-VerificaciónFuncionalCompleta

›10.IntegraciónconSistemadeAutenticaciónMock

[chromium]›e2e/groups-module-verification.spec.ts:12:3›FaseA.7-VerificaciónMódulodeGrupos (CoP

s) › A.7.1 - Verificar que la página de Grupos carga correctamente

[chromium]›e2e/groups-module-verification.spec.ts:29:3›FaseA.7-VerificaciónMódulodeGrupos (CoP

s) › A.7.2 - Verificar funcionalidad de búsqueda y filtros

[chromium]›e2e/groups-module-verification.spec.ts:45:3›FaseA.7-VerificaciónMódulodeGrupos (CoP

s) › A.7.3 - Verificar listado de grupos con datos mock

[chromium]›e2e/groups-module-verification.spec.ts:71:3›FaseA.7-VerificaciónMódulodeGrupos (CoP

s) › A.7.4 - Verificar botón de crear grupo

[chromium]›e2e/groups-module-verification.spec.ts:103:3›FaseA.7-VerificaciónMódulodeGrupos (Co

Ps) › A.7.5 - Verificar navegación entre tabs

[chromium]›e2e/groups-module-verification.spec.ts:128:3›FaseA.7-VerificaciónMódulodeGrupos (Co

Ps) › A.7.6 - Verificar acciones en tarjetas de grupo

[chromium]›e2e/groups-module-verification.spec.ts:165:3›FaseA.7-VerificaciónMódulodeGrupos (Co

Ps) › A.7.7 - Verificar integración con hooks de backend

[chromium]›e2e/groups-module-verification.spec.ts:199:3›FaseA.7-VerificaciónMódulodeGrupos (Co

Ps) › A.7.8 - Verificar responsividad del módulo de grupos

[chromium]›e2e/groups-simple-verification.spec.ts:5:3›FaseA.7-VerificaciónSimplificadadelMódul

odeGrupos›A.7.S1-Verificarquelaaplicacióncargaylaruta/groupsresponde

[chromium]›e2e/groups-simple-verification.spec.ts:126:3›FaseA.7-VerificaciónSimplificadadelMód

ulodeGrupos›A.7.S5-Verificarquelanavegacióna/groupsdesderootfunciona

[chromium]›e2e/horizontal-demo-reciprocidad.spec.ts:19:3›ReproductorHorizontalÜPlay-VideodeRec

iprocidad›Debecargarelvideodereciprocidadconinformacióncorrecta

[chromium]›e2e/horizontal-demo-reciprocidad.spec.ts:37:3›ReproductorHorizontalÜPlay-VideodeRec

iprocidad›Debemostrarlaspreguntassobrereciprocidad

[chromium]›e2e/horizontal-demo-reciprocidad.spec.ts:58:3›ReproductorHorizontalÜPlay-VideodeRec

iprocidad›DebemostrareliframedeYouTube

[chromium]›e2e/horizontal-demo-reciprocidad.spec.ts:71:3›ReproductorHorizontalÜPlay-VideodeRec

iprocidad›Debemostrarlasmétricasdegamificación

[chromium]›e2e/horizontal-demo-reciprocidad.spec.ts:83:3›ReproductorHorizontalÜPlay-VideodeRec

iprocidad›Debemostrarlascaracterísticasdelreproductor

[chromium]›e2e/horizontal-demo-reciprocidad.spec.ts:95:3›ReproductorHorizontalÜPlay-VideodeRec

iprocidad›Debeserresponsiveenmóvil

[chromium]›e2e/invitation-flow.spec.ts:11:3›🎫InvitationFlow-BetaRegistration›shouldnavigate

tobetaregistrationpage

[chromium]›e2e/invitation-flow.spec.ts:26:3›🎫InvitationFlow-BetaRegistration›shouldshowerr

orforemptyinvitationcode

[chromium]›e2e/invitation-flow.spec.ts:38:3›🎫InvitationFlow-BetaRegistration›shouldshowerr

orforinvalidinvitationcodeformat

[chromium]›e2e/invitation-flow.spec.ts:54:3›🎫InvitationFlow-BetaRegistration›shouldacceptv

alidinvitationcodeandproceedtonextstep

[chromium]›e2e/invitation-flow.spec.ts:73:3›🎫InvitationFlow-BetaRegistration›shouldvalidate

personaldataform

[chromium]›e2e/invitation-flow.spec.ts:92:3›🎫InvitationFlow-BetaRegistration›shouldcomplete

personaldataandproceedtophilosophyquiz

[chromium]›e2e/invitation-flow.spec.ts:120:3›🎫InvitationFlow-BetaRegistration›shouldvalidat

ephilosophyquizcompletion

[chromium]›e2e/invitation-flow.spec.ts:144:3›🎫InvitationFlow-BetaRegistration›shouldcomplet

efullregistrationflow

[chromium]›e2e/invitation-flow.spec.ts:180:3›🎫InvitationFlow-BetaRegistration›shouldhandle

invitationcodefromURLparameter

[chromium]›e2e/invitation-flow.spec.ts:190:3›🎫InvitationFlow-BetaRegistration›shouldtracka

nalyticseventsduringregistration

[chromium]›e2e/invitation-flow.spec.ts:212:3›🎫InvitationFlow-BetaRegistration›shouldshowpr

opererrorhandlingfornetworkissues

[chromium]›e2e/like-functionality.spec.ts:28:3›Like/UnlikeFunctionalitywithOptimisticUpdates›s

houldtogglelikewithoptimisticupdates

[chromium]›e2e/like-functionality.spec.ts:80:3›Like/UnlikeFunctionalitywithOptimisticUpdates›s

houldpersistlikestateafterpagerefresh

[chromium]›e2e/like-functionality.spec.ts:109:3›Like/UnlikeFunctionalitywithOptimisticUpdates›

shouldhandlemultiplerapidclicksgracefully

[chromium]›e2e/login-functionality.spec.ts:15:3›LoginFunctionality›shouldloginsuccessfullywith

usercredentials

[chromium]›e2e/login-functionality.spec.ts:34:3›LoginFunctionality›shouldloginsuccessfullywith

admincredentials

[chromium]›e2e/login-verification.spec.ts:15:3›LoginVerification-BackendIntegration›shouldsuc

cessfullyloginwithvalidcredentials

[chromium]›e2e/login-verification.spec.ts:38:3›LoginVerification-BackendIntegration›shouldhan

dleinvalidcredentialsgracefully

[chromium]›e2e/login-verification.spec.ts:57:3›LoginVerification-BackendIntegration›shouldval

idateemailformat

[chromium]›e2e/logout-functionality.spec.ts:64:3›LogoutFunctionality›shouldclearauthentication

tokensfromlocalStorage

[chromium]›e2e/logout-functionality.spec.ts:148:3›LogoutFunctionality›shoulddisplaylogoutbutto

nwithcorrectstylingandaccessibility

[chromium]›e2e/logout-functionality.spec.ts:179:3›LogoutFunctionality›shouldhandlelogoutgracef

ullyevenifbackendcallfails

[chromium]›e2e/logout-functionality.spec.ts:205:3›LogoutFunctionality›shouldshowusermenuwith

logout option

[chromium]›e2e/marketplace-crud.spec.ts:205:3›MarketplaceCRUDOperations›shouldallowanadminto

performthefullCRUDcycleontheirownitem

[chromium]›e2e/marketplace-edit-delete.spec.ts:211:3›MarketplaceEdit/DeleteFunctionality›should

allowanadmintocreateanewitemandseeedit/deletecontrolsonit

[chromium]›e2e/marketplace-edit-delete.spec.ts:352:3›MarketplaceEdit/DeleteFunctionality›should

allowanadmintoeditanexistingitem

[chromium]›e2e/marketplace-edit-delete.spec.ts:447:3›MarketplaceEdit/DeleteFunctionality›should

allowanadmintodeleteanitemwithconfirmation

[chromium]›e2e/marketplace-integration.spec.ts:125:3›MarketplaceE2ETests›shouldverifyuserauth

enticationpersistsinmarketplace

[chromium]›e2e/marketplace-mobile-design-verification.spec.ts:4:3›MarketplaceMobileDesignVerifica

tion›shouldmatchBuilder.iomobiledesignspecification

[chromium]›e2e/marketplace-mobile-design-verification.spec.ts:53:3›MarketplaceMobileDesignVerific

ation›shouldshowconsumertabasselectedbydefault

[chromium]›e2e/marketplace-mobile-design-verification.spec.ts:71:3›MarketplaceMobileDesignVerific

ation›shouldtogglebetweenconsumerandproviderroles

[chromium]›e2e/marketplace-mobile-design-verification.spec.ts:93:3›MarketplaceMobileDesignVerific

ation›shouldhaveinteractivesearchfunctionality

[chromium]›e2e/marketplace-mobile-design-verification.spec.ts:115:3›MarketplaceMobileDesignVerifi

cation›shoulddisplaycategoryiconsandlabels

[chromium]›e2e/marketplace-mobile-design-verification.spec.ts:128:3›MarketplaceMobileDesignVerifi

cation›shouldhavepropermobileresponsivedesign

[chromium]›e2e/marketplace-mobile-design-verification.spec.ts:156:3›MarketplaceMobileDesignVerifi

cation›shouldmatchcolorschemefromBuilder.iodesign

[chromium]›e2e/mobile-search-suggestions.spec.ts:15:3›MobileMarketplaceSearchSuggestions›should

showsearchsuggestionswhensearchinputisfocused

[chromium]›e2e/mobile-search-suggestions.spec.ts:42:3›MobileMarketplaceSearchSuggestions›should

allowclickingonsuggestedcategories

[chromium]›e2e/mobile-search-suggestions.spec.ts:59:3›MobileMarketplaceSearchSuggestions›should

allowclickingonsuggestedproducts/services

[chromium]›e2e/mobile-search-suggestions.spec.ts:81:3›MobileMarketplaceSearchSuggestions›should

show"Crear solicitud"buttonandallowinteraction

[chromium]›e2e/mobile-search-suggestions.spec.ts:104:3›MobileMarketplaceSearchSuggestions›shoul

dhidesuggestionswheninputlosesfocus

[chromium]›e2e/mobile-search-suggestions.spec.ts:124:3›MobileMarketplaceSearchSuggestions›shoul

dshowadvancedfiltersystem

[chromium]›e2e/monitoring-verification-fixed.spec.ts:31:3›🔍MonitoringImplementationVerification

-Fixed›🚀MonitoringInitialization-Fixed

[chromium]›e2e/monitoring-verification-fixed.spec.ts:55:3›🔍MonitoringImplementationVerification

-Fixed›📊PageViewTracking-Fixed

[chromium]›e2e/monitoring-verification-fixed.spec.ts:81:3›🔍MonitoringImplementationVerification

-Fixed›🚨ErrorBoundaryFunctionality-Fixed

[chromium]›e2e/monitoring-verification-fixed.spec.ts:107:3›🔍MonitoringImplementationVerification

-Fixed›⚡PerformanceMonitoring-Fixed

[chromium]›e2e/monitoring-verification-fixed.spec.ts:147:3›🔍MonitoringImplementationVerification

-Fixed›🧪MonitoringTestComponentFunctionality-Fixed

[chromium]›e2e/monitoring-verification-fixed.spec.ts:206:3›🔍MonitoringImplementationVerification

-Fixed›🔧HooksIntegrationVerification-Fixed

[chromium]›e2e/monitoring-verification-fixed.spec.ts:243:3›🔍MonitoringImplementationVerification

-Fixed›🌐NetworkRequestsMonitoring-Fixed

[chromium]›e2e/monitoring-verification-fixed.spec.ts:274:3›🔍MonitoringImplementationVerification

-Fixed›📱ResponsiveMonitoring-Fixed

[chromium]›e2e/monitoring-verification-fixed.spec.ts:296:3›🔍MonitoringImplementationVerification

-Fixed›🎯ErrorRecoveryTesting-Fixed

[chromium]›e2e/monitoring-verification-fixed.spec.ts:321:3›🔍MonitoringImplementationVerification

-Fixed›🔍ConsoleMonitoring-Fixed

[chromium]›e2e/monitoring-verification-fixed.spec.ts:374:3›🔧IntegrationTests-Fixed›CompleteM

onitoringStackIntegration-Fixed

[chromium]›e2e/recovered-pages-verification.spec.ts:26:3›PáginasRecuperadas-Verificación›Página

HorizontalDemodebecargarcorrectamente

[chromium]›e2e/recovered-pages-verification.spec.ts:71:3›PáginasRecuperadas-Verificación›Página

ÜPlayGamifieddebecargarcorrectamente

[chromium]›e2e/recovered-pages-verification.spec.ts:130:3›PáginasRecuperadas-Verificación›Naveg

aciónentrepáginasrecuperadasfuncionacorrectamente

[chromium]›e2e/recovered-pages-verification.spec.ts:148:3›PáginasRecuperadas-Verificación›Págin

assonresponsivasendiferentestamañosdepantalla

[chromium]›e2e/recovered-pages-verification.spec.ts:176:3›PáginasRecuperadas-Verificación›Funci

onalidadinteractivadelreproductorhorizontal

[chromium]›e2e/route-guards-protection.spec.ts:67:3›RouteGuardsProtection›shouldallowauthentic

atedusertoaccessprotectedroutes

[chromium]›e2e/route-guards-protection.spec.ts:109:3›RouteGuardsProtection›shouldredirecttolo

ginafterlogoutfromprotectedroute

[chromium]›e2e/route-guards-protection.spec.ts:140:3›RouteGuardsProtection›shouldshowloadings

tateduringauthenticationcheck

[chromium]›e2e/services-health-check.spec.ts:49:3›ServicesHealthCheck›BackendNestJSdebeestar

ejecutándoseenpuerto3002

[chromium]›e2e/services-health-check.spec.ts:141:3›ServicesHealthCheck›Configuracióndepuertos

correcta

[chromium]›e2e/sidebar-navigation-test.spec.ts:20:3›SidebarNavigation-NewÜPlayLinks›🎮Navega

ciónaÜPlayHorizontalDemodesdeelmenúlateral

[chromium]›e2e/sidebar-navigation-test.spec.ts:48:3›SidebarNavigation-NewÜPlayLinks›🎯Navega

ciónaÜPlayGamifieddesdeelmenúlateral

[chromium]›e2e/sidebar-navigation-test.spec.ts:77:3›SidebarNavigation-NewÜPlayLinks›🔄Navega

ciónentrelaspáginasÜPlay

[chromium]›e2e/sidebar-navigation-test.spec.ts:110:3›SidebarNavigation-NewÜPlayLinks›📱Verif

icarquelosenlacesfuncionanenmóvil

[chromium]›e2e/simple-horizontal-test.spec.ts:4:3›TestSimple-HorizontalDemo›Verificarquelap

áginacargacorrectamente

[chromium]›e2e/social-feed-debugging.spec.ts:51:3›SocialFeedDebugging›Debecargarymostrarpost

srealesdelbackend

[chromium]›e2e/social-feed-integration-simple.spec.ts:33:3›🤝FeedSocial-IntegraciónSimple›🔍

[BACKEND→SUPERAPP] Verificar que el feed social muestre datos reales

[chromium]›e2e/social-feed-real-data-verification.spec.ts:14:3›🤝FeedSocial-VerificacióndeDato

sReales›🔍 [BACKEND→SUPERAPP] Verificar que el feed social muestre datos reales del backend

[chromium]›e2e/social-flow.spec.ts:180:3›SocialModuleE2EFlow›shouldverifyauthenticationpersi

stsinsocialmodule

[chromium]›e2e/social-integration-simple.spec.ts:12:3›🤝MóduloSocial-IntegraciónSimplificada›

🔍Verificarintegracióncompletadelfeedsocialcondatosreales

[chromium]›e2e/social-module-integration-simple.spec.ts:12:3›🤝MóduloSocial-VerificaciónDirecta

›🔍 [DIRECT] Verificar página social directa

[chromium]›e2e/social-module-integration.spec.ts:33:3›🤝MóduloSocial-IntegraciónEnd-to-End›🔍

[BACKEND→SUPERAPP]VerificarcargadelFeedSocialcondatosrealesdelbackend

[chromium]›e2e/social-module-integration.spec.ts:235:3›🤝MóduloSocial-IntegraciónEnd-to-End›

🔄 [BACKEND] Verificar llamada API real al endpoint /social/publications

[chromium]›e2e/social-module-integration.spec.ts:277:3›🤝MóduloSocial-IntegraciónEnd-to-End›✍️

[CREATE POST]Verificarcreacióndepublicacionesconbackendreal

[chromium]›e2e/social-module-integration.spec.ts:376:3›🤝MóduloSocial-IntegraciónEnd-to-End›

👍 [TOGGLE LIKE]Verificarfuncionalidaddelike/unlikeconoptimisticupdates

[chromium]›e2e/social-module-integration.spec.ts:511:3›🤝MóduloSocial-IntegraciónEnd-to-End›

💬 [COMENTARIOS] Verificar funcionalidad completa de comentarios con autorización

[chromium]›e2e/social-module-integration.spec.ts:743:3›🤝MóduloSocial-IntegraciónEnd-to-End›

🔄 [COMENTARIOS OPTIMISTIC]Verificaroptimisticupdatesencomentarios

[chromium]›e2e/social-module-integration.spec.ts:793:3›🤝MóduloSocial-IntegraciónEnd-to-End›✍️

[INTEGRATION]Crearnuevapublicaciónyverificarapariciónenfeed

[chromium]›e2e/social-module-integration.spec.ts:830:3›🤝MóduloSocial-IntegraciónEnd-to-End›❤️

[INTEGRATION]Daryquitarlikeconoptimisticupdates

[chromium]›e2e/social-module-integration.spec.ts:876:3›🤝MóduloSocial-IntegraciónEnd-to-End›

💬 [INTEGRATION] Crear comentario y verificar aparición

[chromium]›e2e/social-module-integration.spec.ts:926:3›🤝MóduloSocial-IntegraciónEnd-to-End›🗑️

[INTEGRATION]Eliminarcomentariopropioconautorización

[chromium]›e2e/uplay-backend-integration.spec.ts:29:3›ÜPlayBackendIntegration›shouldloadÜPlay

pageanddisplayvideosfrombackend

[chromium]›e2e/uplay-backend-integration.spec.ts:104:3›ÜPlayBackendIntegration›shouldmakeAPIc

alltobackendvideo-itemsendpoint

[chromium]›e2e/uplay-interactive-questions.spec.ts:82:3›ÜPlay-FuncionalidaddeInteracciónAvanzad

a (Auth Real) › DIAGNÓSTICO: verificar configuración de entorno y autenticación

[chromium]›e2e/uplay-interactive-questions.spec.ts:119:3›ÜPlay-FuncionalidaddeInteracciónAvanza

da (Auth Real) › debe autenticarse correctamente con el backend real

[chromium]›e2e/uplay-interactive-questions.spec.ts:149:3›ÜPlay-FuncionalidaddeInteracciónAvanza

da (Auth Real) › debe cargar videos con preguntas desde el backend usando auth real

[chromium]›e2e/uplay-interactive-questions.spec.ts:179:3›ÜPlay-FuncionalidaddeInteracciónAvanza

da (Auth Real) › DEBUG: verificar carga de datos del backend

[chromium]›e2e/uplay-interactive-questions.spec.ts:246:3›ÜPlay-FuncionalidaddeInteracciónAvanza

da (Auth Real) › debe mostrar el InteractiveVideoPlayer con datos reales del backend

[chromium]›e2e/uplay-interactive-questions.spec.ts:315:3›ÜPlay-FuncionalidaddeInteracciónAvanza

da (Auth Real) › debe pausar el video y mostrar diálogo de pregunta real del backend

[chromium]›e2e/uplay-interactive-questions.spec.ts:358:3›ÜPlay-FuncionalidaddeInteracciónAvanza

da (Auth Real) › debe enviar respuestas reales al backend y recibir feedback

[chromium]›e2e/uplay-interactive-questions.spec.ts:454:3›ÜPlay-FuncionalidaddeInteracciónAvanza

da (Auth Real) › debe manejar autenticación expirada o inválida

[chromium]›e2e/uplay-interactive-questions.spec.ts:498:3›ÜPlay-FuncionalidaddeInteracciónAvanza

da (Auth Real) › debe verificar permisos de usuario con backend real

[chromium]›e2e/uplay-interactive-questions.spec.ts:531:3›ÜPlay-FuncionalidaddeInteracciónAvanza

da (Auth Real) › debe mostrar datos de usuario real en la interfaz

[chromium]›e2e/uplay-interactive-questions.spec.ts:545:3›ÜPlay-FuncionalidaddeInteracciónAvanza

da (Auth Real) › debe sincronizar estado entre frontend y backend real

[chromium]›e2e/uplay-interactive-questions.spec.ts:609:3›ÜPlay-FuncionalidaddeInteracciónAvanza

da (Auth Real) › DIAGNÓSTICO SIMPLE: verificar aplicación paso a paso

[chromium]›e2e/uplay-unified-system.spec.ts:44:3›ÜPlayUnifiedSystem-CompleteVerification›🏠S

houlddisplayunifiedÜPlaydashboard

[chromium]›e2e/uplay-unified-system.spec.ts:85:3›ÜPlayUnifiedSystem-CompleteVerification›🎬S

houlddisplayunifiedvideoplayerwithinteractivefeatures

[chromium]›e2e/uplay-unified-system.spec.ts:119:3›ÜPlayUnifiedSystem-CompleteVerification›🌱

ShouldreflectCoomÜnityphilosophy

[chromium]›e2e/uplay-unified-system.spec.ts:234:3›ÜPlayUnifiedSystem-CompleteVerification›🎥

Shouldnavigatetovideoplayerandloadvideocorrectly

[chromium]›e2e/uplay-unified-system.spec.ts:281:3›ÜPlayUnifiedSystem-CompleteVerification›🔄

Shouldredirectlegacyroutestounifiedsystem

[chromium]›e2e/uplay-video-overlay-behavior.spec.ts:27:3›ÜPlayVideoOverlayBehavior›🎯Shouldhi

devideoinfooverlayduringplaybackandshowonpause/hover

[chromium]›e2e/uplay-video-overlay-behavior.spec.ts:84:3›ÜPlayVideoOverlayBehavior›🎬Shouldha

ndlevideoinfooverlaytransitionssmoothly

[chromium]›e2e/uplay-video-overlay-behavior.spec.ts:117:3›ÜPlayVideoOverlayBehavior›📱Shouldn

otinterferewithvideocontrols

[chromium]›e2e/uplay-video-reproduction.spec.ts:13:3›ÜPlayVideoReproduction›shouldloadanddisp

layvideoplayercorrectly

[chromium]›e2e/uplay-video-reproduction.spec.ts:28:3›ÜPlayVideoReproduction›shouldplayYouTube

videoscorrectly

[chromium]›e2e/uplay-video-reproduction.spec.ts:43:3›ÜPlayVideoReproduction›shouldshowvideoco

ntrolsandinformation

[chromium]›e2e/uplay-video-reproduction.spec.ts:61:3›ÜPlayVideoReproduction›shouldhandlequesti

onmarkerscorrectly

[chromium]›e2e/uplay-video-reproduction.spec.ts:84:3›ÜPlayVideoReproduction›shouldshowvideome

tadatacorrectly

[chromium]›e2e/uplay-video-reproduction.spec.ts:99:3›ÜPlayVideoReproduction›shouldhandlevideo

playercontrols

[chromium]›e2e/uplay-video-reproduction.spec.ts:120:3›ÜPlayVideoReproduction›shoulddisplayCoom

Ünitygamificationelements

[chromium]›e2e/uplay-video-reproduction.spec.ts:134:3›ÜPlayVideoReproduction›shouldhandlevideo

selectionfromlist

[chromium]›e2e/uplay-video-safari-fix.spec.ts:13:3›ÜPlayVideoPlayer-SafariCompatibility›shoul

dloadvideoplayerwithoutNotSupportedError

[chromium]›e2e/uplay-video-safari-fix.spec.ts:95:3›ÜPlayVideoPlayer-SafariCompatibility›shoul

dhandlevideoerrorsgracefully

[chromium]›e2e/uplay-video-safari-fix.spec.ts:124:3›ÜPlayVideoPlayer-SafariCompatibility›shou

ldshowretrybuttonwhenvideofails

[chromium]›e2e/uplay-video-safari-fix.spec.ts:161:3›ÜPlayVideoPlayer-SafariCompatibility›shou

lddetectSafaribrowsercorrectly

[chromium]›e2e/verify-backend-credentials.spec.ts:6:3›🔐VerificacióndeCredencialesBackendNestJS

›debeusarcredencialescorrectasdelbackendNestJS

[chromium]›e2e/verify-backend-credentials.spec.ts:40:3›🔐VerificacióndeCredencialesBackendNestJ

S›debeconectarexitosamenteconelbackendNestJS

[chromium]›e2e/verify-login-credentials.spec.ts:5:3›🔐VerificacióndeCredencialesenLogin›debe

mostrarlascredencialescorrectasdelaSuperApp

[chromium]›e2e/verify-login-credentials.spec.ts:39:3›🔐VerificacióndeCredencialesenLogin›debe

mostrarelestadocorrectosinmockauth

[chromium]›e2e/video-loading-verification.spec.ts:28:3›VideoLoadingVerification›🎬ShouldloadÜ

Playdashboardanddisplayvideos

[chromium]›e2e/video-loading-verification.spec.ts:50:3›VideoLoadingVerification›🎥Shouldloadv

ideoplayerwithfunctionalvideo

[chromium]›e2e/video-loading-verification.spec.ts:88:3›VideoLoadingVerification›🔄Shouldhandle

videonavigationcorrectly

[chromium]›e2e/video-loading-verification.spec.ts:120:3›VideoLoadingVerification›📱Shouldwork

onmobileviewport

[chromium]›e2e/video-loading-verification.spec.ts:144:3›VideoLoadingVerification›🌐Shouldverif

yallvideoURLsarefunctional

[chromium]›e2e/videos-data-display.spec.ts:15:3›VideosDataDisplay-BackendIntegration›shouldd

isplayvideoitemsfrombackendinUPlaysection

[chromium]›e2e/videos-data-display.spec.ts:75:3›VideosDataDisplay-BackendIntegration›shouldv

erifybackendAPIcallforvideo-items

[chromium]›e2e/videos-e2e-flow-simple.spec.ts:26:3›🎬VideosGamificados-FlujoE2ESimplificado›

🔍PARTE1:VerificarconexiónBackend→Frontend

[chromium]›e2e/videos-e2e-flow.spec.ts:97:3›🎬VideosGamificados-FlujoE2ECompleto›🔍Parte2:

VerificarvisualizacióndevideosdesdeBackend

[chromium]›e2e/videos-e2e-flow.spec.ts:139:3›🎬VideosGamificados-FlujoE2ECompleto›🎮Parte3

A:Simularinteracciónconpreguntas (si disponible)

[chromium]›e2e/videos-e2e-flow.spec.ts:190:3›🎬VideosGamificados-FlujoE2ECompleto›📊Parte3

B:Verificarpersistenciadedatos (llamadas API)

[chromium]›e2e/videos-e2e-flow.spec.ts:296:3›🎬VideosGamificados-FlujoE2ECompleto›🏁Resumen

delFlujoE2ECompleto

[chromium]›e2e/wallet-api-fix-verification.spec.ts:4:3›WalletAPIFixVerification›shouldloginsu

ccessfullywithoutwalletAPIimporterrors

[chromium]›e2e/youtube-videos-verification.spec.ts:17:3›🎬VerificacióndeVideosdeYouTube›🎥Ve

rificarquelosvideosdeYouTubesecarganenÜPlay

[chromium]›e2e/youtube-videos-verification.spec.ts:103:3›🎬VerificacióndeVideosdeYouTube›🔧V

erificarconfiguracióndeentornoparaYouTube

159passed (15.6m)

ServingHTMLreportathttp://localhost:9323.PressCtrl+Ctoquit.
