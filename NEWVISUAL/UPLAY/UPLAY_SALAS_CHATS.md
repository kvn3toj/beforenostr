<!DOCTYPE html>
<html lang="es"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>ÜPlay - CoomUnity</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&amp;family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<style type="text/tailwindcss">
    body {
      font-family: 'Inter', sans-serif;
      background-color: #F8F9FA;
    }
    .font-montserrat {
      font-family: 'Montserrat', sans-serif;
    }
     :root {
      --duo-magenta: #D6075C;
      --one-purple: #5C2483;
      --triketa-green: #3E8638;
      --gold-border: #FBBA00;
    }
  </style>
</head>
<body class="bg-gray-50">
<div class="flex h-screen">
<aside class="w-64 bg-white shadow-md flex flex-col justify-between">
<div>
<div class="p-6">
<h1 class="text-2xl font-bold text-gray-800">CoomUnity</h1>
</div>
<nav class="mt-6">
<a class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100" href="#">
<span class="material-icons">home</span>
<span class="ml-4">Inicio</span>
</a>
<a class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100" href="#">
<span class="material-icons">store</span>
<span class="ml-4">Marketplace</span>
</a>
<a class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100" href="#">
<span class="material-icons">sync_alt</span>
<span class="ml-4">LETS</span>
</a>
<a class="flex items-center px-6 py-3 bg-purple-100 text-[var(--one-purple)] font-semibold" href="#">
<span class="material-icons">play_circle_outline</span>
<span class="ml-4">ÜPlay</span>
</a>
<a class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100" href="#">
<span class="material-icons">group</span>
<span class="ml-4">ÜSocial</span>
</a>
<a class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100" href="#">
<span class="material-icons">emoji_events</span>
<span class="ml-4">Retos</span>
</a>
<a class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100" href="#">
<span class="material-icons">account_balance_wallet</span>
<span class="ml-4">Billetera</span>
</a>
<a class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100" href="#">
<span class="material-icons">bar_chart</span>
<span class="ml-4">Estadísticas</span>
</a>
</nav>
</div>
<div class="p-6">
<div class="flex items-center mb-4">
<img alt="Avatar de administrador" class="h-10 w-10 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaXgAQwiLqsyiPfrvon6jYib-suep9tHSVyFYGaYElULMVtdqVyvnLh3BCQmJmz1mrhKEg7pvD1LPjnD9QYfVVADC9deStkmm1M7nvZXlHvVDl1cAcLcC0sYo-XqVJWJ84VAUb8GAMcfiY31leSLQqkbsZxiaOfFXGyUCZ4Zu99qZQdW-6yk1bAKUQ3gV7My5X2zbARhngTbcL4aPT2X11VpnoTyNoAHsxmDF2iKceg7aGhGuiKwQHLy5tvfm_nzHYrB0lFgHGNxg"/>
<div class="ml-4">
<p class="font-semibold text-gray-800">Admin</p>
<p class="text-sm text-gray-500">admin@gomiller.com</p>
</div>
<span class="material-icons ml-auto text-gray-500">chevron_right</span>
</div>
<a class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100" href="#">
<span class="material-icons">settings</span>
<span class="ml-4">Configuración</span>
</a>
<a class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100" href="#">
<span class="material-icons">help_outline</span>
<span class="ml-4">Ayuda</span>
</a>
<p class="text-xs text-gray-400 mt-6">v18.0 - Claridad Organica</p>
</div>
</aside>
<main class="flex-1 flex overflow-hidden">
<div class="flex-1 flex flex-col p-6 lg:p-8 overflow-y-auto">
<div class="flex-1 flex flex-col">
<div class="flex justify-between items-center mb-4">
<h1 class="text-2xl lg:text-3xl font-bold text-gray-800 font-montserrat">Debate sobre Finanzas Regenerativas</h1>
<button class="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800">
<span class="material-icons">logout</span> Salir de la Sala
            </button>
</div>
<div class="flex-1 bg-white rounded-lg shadow-inner p-4 space-y-6 overflow-y-auto">
<div class="space-y-4">
<div class="flex items-start gap-3">
<img alt="Avatar" class="h-8 w-8 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBc8dctvWwXLeEWgsUpmOleJyxbmFdNu4I-6Kz-UtFjsrTjW6sCPNHcGvxn6sB-QkZ19O0oGgfeSqIl2wAFn_SdP5wpMmI_OuaRfJ-t83PgTpcxDD7lKIvQ9Nijh7LUYe5Fo_Wp1_tWEsc0zVTTaGdIxi9jYJVv9pto5DtyaaIyXrSkxcSn5AfNllWCuuLC0zvq7j8me9-kBJqODeh9xcPniObTSKmK-9S7ErzFCCOJOEl_xp4zl7nmc5k5r5DjTz0emdMkhv-DzY"/>
<div class="bg-gray-100 p-3 rounded-lg max-w-lg">
<p class="text-sm font-semibold text-gray-800">Maria</p>
<p class="text-sm text-gray-700">Hola a todos, ¡qué bueno que se unieron! ¿Qué les pareció la idea de los "capitales múltiples" que menciona el video?</p>
</div>
</div>
<div class="flex items-start gap-3 justify-end">
<div class="bg-purple-100 p-3 rounded-lg max-w-lg">
<p class="text-sm font-semibold text-[var(--one-purple)]">Tú</p>
<p class="text-sm text-gray-700">¡Hola María! A mí me pareció fascinante. Especialmente la idea de que el capital social y natural son tan importantes como el financiero.</p>
</div>
<img alt="Avatar" class="h-8 w-8 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaXgAQwiLqsyiPfrvon6jYib-suep9tHSVyFYGaYElULMVtdqVyvnLh3BCQmJmz1mrhKEg7pvD1LPjnD9QYfVVADC9deStkmm1M7nvZXlHvVDl1cAcLcC0sYo-XqVJWJ84VAUb8GAMcfiY31leSLQqkbsZxiaOfFXGyUCZ4Zu99qZQdW-6yk1bAKUQ3gV7My5X2zbARhngTbcL4aPT2X11VpnoTyNoAHsxmDF2iKceg7aGhGuiKwQHLy5tvfm_nzHYrB0lFgHGNxg"/>
</div>
<div class="flex items-start gap-3">
<img alt="Avatar" class="h-8 w-8 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXbBu4vtyaBe-FJuNG2jxYmRo3wVVggEcg96PEVbngk6giswDvy2ExE332SkwqkBdNEMz0AfUo8cHKhPV8RCLBWUAMEQS0TcOVong8ubwKk1SlUFDoPzbTbI4IRh27Ip9uIuMBZBXEoorS_ewR-FSsO1ijjFjTSpjtmO2OGyid79ZmmCb7PyK7wBNjT_sof-NvtWBfU-XX729cE5VtihS3JR9_0bpsq_a7k1wnP07agL3F0LGZsd9n0pjckQYhlVKWa_478S6ycBE"/>
<div class="bg-gray-100 p-3 rounded-lg max-w-lg">
<p class="text-sm font-semibold text-gray-800">Carlos</p>
<p class="text-sm text-gray-700">Totalmente de acuerdo. ¿Alguien tiene algún ejemplo de empresa que ya esté aplicando estos principios?</p>
</div>
</div>
</div>
</div>
<div class="mt-4">
<div class="flex items-center gap-2">
<input class="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-[var(--one-purple)] focus:border-[var(--one-purple)]" placeholder="Escribe tu mensaje aquí..." type="text"/>
<button class="bg-[var(--one-purple)] text-white p-3 rounded-lg hover:bg-purple-700 transition-colors">
<span class="material-icons">send</span>
</button>
</div>
</div>
</div>
</div>
<aside class="w-full max-w-sm bg-white shadow-lg p-6 flex flex-col gap-6 overflow-y-auto">
<div class="bg-gray-50 rounded-xl shadow-md p-5 border border-gray-200">
<h3 class="text-lg font-bold text-gray-800 font-montserrat mb-4">Participantes Activos</h3>
<div class="space-y-4">
<div class="flex items-center gap-3">
<img alt="Avatar" class="h-10 w-10 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaXgAQwiLqsyiPfrvon6jYib-suep9tHSVyFYGaYElULMVtdqVyvnLh3BCQmJmz1mrhKEg7pvD1LPjnD9QYfVVADC9deStkmm1M7nvZXlHvVDl1cAcLcC0sYo-XqVJWJ84VAUb8GAMcfiY31leSLQqkbsZxiaOfFXGyUCZ4Zu99qZQdW-6yk1bAKUQ3gV7My5X2zbARhngTbcL4aPT2X11VpnoTyNoAHsxmDF2iKceg7aGhGuiKwQHLy5tvfm_nzHYrB0lFgHGNxg"/>
<div>
<p class="font-semibold text-gray-800">Admin (Tú)</p>
<p class="text-sm text-gray-500">Guardian</p>
</div>
</div>
<div class="flex items-center gap-3">
<img alt="Avatar" class="h-10 w-10 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBc8dctvWwXLeEWgsUpmOleJyxbmFdNu4I-6Kz-UtFjsrTjW6sCPNHcGvxn6sB-QkZ19O0oGgfeSqIl2wAFn_SdP5wpMmI_OuaRfJ-t83PgTpcxDD7lKIvQ9Nijh7LUYe5Fo_Wp1_tWEsc0zVTTaGdIxi9jYJVv9pto5DtyaaIyXrSkxcSn5AfNllWCuuLC0zvq7j8me9-kBJqODeh9xcPniObTSKmK-9S7ErzFCCOJOEl_xp4zl7nmc5k5r5DjTz0emdMkhv-DzY"/>
<div>
<p class="font-semibold text-gray-800">Maria</p>
<p class="text-sm text-gray-500">Guardian</p>
</div>
</div>
<div class="flex items-center gap-3">
<img alt="Avatar" class="h-10 w-10 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOpqgjl7OI_CewrA5SK7nYdRADNPLaLYfch0p3AooJcsLn0wU2Mj2xLBh5EXWPybIp6GGjS7IZl9nUTxLnDnKUP_XKCEZ13ieYPFlNkxvWKzbgrqimeHSEx5awV12pNSieN8SIesZc5ty8SXkYADzMCSLsNRvTAhzKjt_OG1IK_3xNm9s1tNEBfHhhGUAh5-hATkt0EU4oRgN5PuwSc1r0eEqRVju3D3Jy30ytwSSKL5cY-N004amLfY9DJA5Fkv0lKp8ZvPRtpKM"/>
<div>
<p class="font-semibold text-gray-800">Juan</p>
<p class="text-sm text-gray-500">Guardian</p>
</div>
</div>
<div class="flex items-center gap-3">
<img alt="Avatar" class="h-10 w-10 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXbBu4vtyaBe-FJuNG2jxYmRo3wVVggEcg96PEVbngk6giswDvy2ExE332SkwqkBdNEMz0AfUo8cHKhPV8RCLBWUAMEQS0TcOVong8ubwKk1SlUFDoPzbTbI4IRh27Ip9uIuMBZBXEoorS_ewR-FSsO1ijjFjTSpjtmO2OGyid79ZmmCb7PyK7wBNjT_sof-NvtWBfU-XX729cE5VtihS3JR9_0bpsq_a7k1wnP07agL3F0LGZsd9n0pjckQYhlVKWa_478S6ycBE"/>
<div>
<p class="font-semibold text-gray-800">Carlos</p>
<p class="text-sm text-gray-500">Guardian</p>
</div>
</div>
</div>
</div>
<div class="bg-gray-50 rounded-xl shadow-md p-5 border border-gray-200">
<h3 class="text-lg font-bold text-gray-800 font-montserrat mb-4">Recurso Principal</h3>
<div class="space-y-3">
<img alt="Thumbnail del video" class="w-full h-32 object-cover rounded-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2WKyajHUnSEi51uCYewix8MnNxYoEFuEhBm6lYtWY5CkxgtNW0OjBKBzzVa-LAWAl0xctrSTx5cUzW9nFHFD89gbpZlb2MqNDS8m9Mmpn9gfhM9LCMgVDAjiEIqQpcFqX-bccTJmK-pI5fsm_hm61mb5xpJ6iTEzMoQn9Ld3VufZd2AFyNtbGFyQ3hJSAbENvH-mWQLxKN0FJkE0KpfSBQbzssjYHY65Etzh_V7G-r9CpRYwVRPL4kjyPXm2CmiP7QuGXVj9wwow"/>
<h4 class="font-semibold text-gray-800">Introducción a las Finanzas Regenerativas</h4>
<p class="text-sm text-gray-500">Un video esencial de la Biblioteca Interactiva para comprender los fundamentos.</p>
<button class="w-full text-sm font-semibold text-[var(--one-purple)] py-2 px-4 rounded-lg border-2 border-[var(--one-purple)] hover:bg-purple-100 transition-colors">Ver Recurso</button>
</div>
</div>
<div class="bg-gray-50 rounded-xl shadow-md p-5 border border-gray-200 flex-1 flex flex-col">
<h3 class="text-lg font-bold text-gray-800 font-montserrat mb-4">Notas Colaborativas</h3>
<div class="flex-1">
<textarea class="w-full h-full p-2 border border-gray-300 rounded-lg text-sm bg-yellow-50 focus:ring-[var(--gold-border)] focus:border-[var(--gold-border)]" placeholder="Escribe ideas, preguntas o resúmenes aquí. Todos pueden ver y editar en tiempo real...">- Capitales múltiples (financiero, social, natural)
- Ejemplo: Patagonia
- ¿Cómo medir el retorno social?</textarea>
</div>
</div>
</aside>
</main>
</div>

</body></html>