<!DOCTYPE html>
<html lang="es"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>ÜSocial - CoomUnity</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&amp;family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
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
    }
    .modal {
        display: none;
    }
    .modal.is-open {
        display: flex;
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
<a class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100" href="#">
<span class="material-icons">play_circle_outline</span>
<span class="ml-4">UPlay</span>
</a>
<a class="flex items-center px-6 py-3 bg-purple-100 text-purple-700 font-semibold" href="#">
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
<main class="flex-1 p-8 overflow-y-auto">
<div class="grid grid-cols-12 gap-8">
<div class="col-span-12 lg:col-span-8 space-y-8">
<div class="bg-white rounded-lg shadow-md p-6">
<div class="flex items-start space-x-4">
<img alt="User Avatar" class="h-12 w-12 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaXgAQwiLqsyiPfrvon6jYib-suep9tHSVyFYGaYElULMVtdqVyvnLh3BCQmJmz1mrhKEg7pvD1LPjnD9QYfVVADC9deStkmm1M7nvZXlHvVDl1cAcLcC0sYo-XqVJWJ84VAUb8GAMcfiY31leSLQqkbsZxiaOfFXGyUCZ4Zu99qZQdW-6yk1bAKUQ3gV7My5X2zbARhngTbcL4aPT2X11VpnoTyNoAHsxmDF2iKceg7aGhGuiKwQHLy5tvfm_nzHYrB0lFgHGNxg"/>
<div class="flex-1">
<textarea class="w-full border-none focus:ring-0 resize-none text-gray-600 bg-gray-100 rounded-lg p-3 placeholder-gray-400" placeholder="¿Qué energía quieres compartir con la CoomÜnity, Guardián?" rows="3"></textarea>
<div class="flex items-center justify-between mt-2">
<div class="flex items-center space-x-4">
<button class="text-gray-500 hover:text-purple-600">
<span class="material-icons">image</span>
</button>
<button class="text-gray-500 hover:text-purple-600">
<span class="material-icons">alternate_email</span>
</button>
<button class="text-gray-500 hover:text-purple-600">
<span class="material-icons">mood</span>
</button>
</div>
<button class="bg-purple-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-purple-700">Publicar</button>
</div>
</div>
</div>
</div>
<div class="space-y-6">
<div class="bg-white rounded-lg shadow-md border-l-4 border-[var(--duo-magenta)]">
<div class="p-6">
<div class="flex items-center justify-between mb-4">
<div class="flex items-center space-x-4">
<img alt="Avatar de CoomUnity" class="w-12 h-12 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9F2Gk-3-P4D6jB-R7q-U-S-W-C-L-G-F-E-D-B-A_9_8_7_6_5_4_3_2_1_0_"/>
<div>
<p class="font-semibold text-gray-800">CoomUnity</p>
<p class="text-sm text-gray-500">Evento Comunitario</p>
</div>
</div>
<span class="material-icons text-gray-500">more_horiz</span>
</div>
<h2 class="text-xl font-bold text-gray-800 mb-2">Minga de Siembra en el Río Pance</h2>
<div class="space-y-3 text-gray-700">
<div class="flex items-center">
<span class="material-icons text-gray-500 mr-3">event</span>
<span>Sábado, 25 de Mayo, 9:00 AM</span>
</div>
<div class="flex items-center">
<span class="material-icons text-gray-500 mr-3">location_on</span>
<span>Entrada principal del Ecoparque Río Pance</span>
</div>
</div>
</div>
<div class="px-6 py-4 bg-gray-50 flex items-center justify-end space-x-4 rounded-b-lg">
<button class="bg-transparent text-[var(--duo-magenta)] font-semibold px-4 py-2 rounded-lg border border-[var(--duo-magenta)] hover:bg-pink-50">
                  Ver Detalles del Evento
                </button>
<button class="bg-[var(--duo-magenta)] text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90">
                  Confirmar Asistencia
                </button>
</div>
</div>
<div class="bg-white rounded-lg shadow-md">
<div class="p-6 flex items-center space-x-4">
<img alt="Avatar de Elara" class="w-12 h-12 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDui5SXA1l4p97Jaf_0rp4UvhTo_z7RqamsKzt1lY-D1aBcPiP_QJRhuBCfBdXMD7_4ndU_KNFdjkrJS6yjIAhlVUMb_VsvlkBo2LofB2Mnlr6qjjF3U4dg7KpOubFLCoVCTGiGKGB4LZ2NmALpSUo7RliEbnj9I9lyNr3xyZmct71O6eTqQkMh67z-KIyAlBl2H52meerNmWn254XpLnu79IqEwh6yzCUMjJ4sxZGmneVHI9K8UYjnOCjsgHudxL3Kr1UU_JggIaA"/>
<div>
<p class="font-semibold text-gray-800">Elara</p>
<p class="text-sm text-gray-500">hace 2 horas</p>
</div>
</div>
<div class="px-6 pb-4">
<p class="text-gray-700">¡Hola a todos! ✨ He estado explorando el poder de la gratitud y cómo transforma nuestra percepción diaria. ¿Qué es algo por lo que se sienten agradecidos hoy? Compartamos esa energía positiva.</p>
</div>
<img alt="Imagen de paisaje soleado" class="w-full h-auto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgX-hkNoWY9kUxGJU752AeMV0kO1fVWk69b4auhuc0SqrAkm5RUf6_cT1UAhQ6-UdU3ZYoP_HKO4dBG7jZ8ZUvDd_h8VGNaAZK6SXnb3WfMaxmUiblN22LsO2vr1t-LxJHUf7fDvZWEnP3bOh5educZ4bFGFcenIJRcvC5MgOzeBOTjxWYYJdF8Ly_8aK3i3jC_4Ryx-rwh2ZDI_aSlMrJHYGWkYFKImw0Y4aLpfTJBbKm9nuuqCqN7yULbP4kO2Oo9y3EMcJWBKA"/>
<div class="p-4 flex justify-between items-center border-t border-gray-200">
<button class="flex items-center space-x-2 text-gray-600 hover:text-purple-600">
<span class="material-icons">favorite_border</span>
<span>Reaccionar</span>
</button>
<button class="flex items-center space-x-2 text-gray-600 hover:text-purple-600">
<span class="material-icons">chat_bubble_outline</span>
<span>Comentar</span>
</button>
<button class="flex items-center space-x-2 text-gray-600 hover:text-purple-600" onclick="openModal()">
<span class="material-icons">sync_alt</span>
<span>Compartir Reciprocidad</span>
</button>
</div>
</div>
<div class="bg-white rounded-lg shadow-md">
<div class="p-6 flex items-center space-x-4">
<img alt="Avatar de Kael" class="w-12 h-12 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBex4T6bcfErCwycpy2ltIYqLZ68TcPlc02Nwvq78ofgEFuBA5jWaqMZdgBu5eqjl2yQ89uCvX8ChrBvcOh2M_dLBl0THLjGpHFlYpPJ2Caz9PRY1A9QX9mBA4cCtihXyAC_a-Cen-v5S37WNjIILW4p2fT_DeTjjw--Hopv8iTdpYXvHW52ZwbcJOUikzVegyHFnLYqPmNOWwgVmFZdv-m-C1fkZ22WKCpK9mM5h0UbeSIjWzRpsTQ_oG9w4Ea5kNa5KN9JiNU5H8"/>
<div>
<p class="font-semibold text-gray-800">Kael</p>
<p class="text-sm text-gray-500">hace 5 horas</p>
</div>
</div>
<div class="px-6 pb-6">
<p class="text-gray-700">Descubrí un rincón de meditación increíble en el parque local. La tranquilidad que se siente allí es mágica. Si están cerca, ¡se los recomiendo!</p>
</div>
<div class="p-4 flex justify-between items-center border-t border-gray-200">
<button class="flex items-center space-x-2 text-gray-600 hover:text-purple-600">
<span class="material-icons text-purple-600">favorite</span>
<span class="text-purple-600">12 Reacciones</span>
</button>
<button class="flex items-center space-x-2 text-gray-600 hover:text-purple-600">
<span class="material-icons">chat_bubble_outline</span>
<span>Comentar</span>
</button>
<button class="flex items-center space-x-2 text-gray-600 hover:text-purple-600" onclick="openModal()">
<span class="material-icons">sync_alt</span>
<span>Compartir Reciprocidad</span>
</button>
</div>
</div>
</div>
</div>
<div class="col-span-12 lg:col-span-4 space-y-8">
<div class="bg-white rounded-lg shadow-md p-6">
<h3 class="text-lg font-bold text-gray-800 mb-4">Tejiendo tu Red</h3>
<div class="space-y-4">
<div class="flex items-center">
<img alt="Avatar de Lyra" class="h-10 w-10 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1h5eG3H-KstkLgMhDBT5qS4yD_5z7lOsF_s4w3j2f-E_E8G4Y6u8C9V2bJ4h8N7pQzW8xR6b-K7jT8f8G9x-V3gXoY-C-K7bT9g0g-I-J-L-A-S9s8O7p-R-V6w4z3"/>
<div class="ml-3 flex-1">
<p class="text-sm font-semibold text-gray-800">Lyra</p>
<p class="text-xs text-gray-500">Intereses en Permacultura</p>
</div>
<button class="ml-auto bg-purple-100 text-purple-700 text-sm font-semibold px-3 py-1 rounded-full hover:bg-purple-200">+ Conectar</button>
</div>
<div class="flex items-center">
<img alt="Avatar de Orión" class="h-10 w-10 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9g5eH-G_K-L8g-P-F_s7z-V-E_g4h-U-J-K6j-N-R-V-B-W-Z-Y-X-W-T-S-R-Q-P-O-N-M-L-K-J-I-H-G-F-E-D-C-B-A-9-8-7-6-5-4-3-2-1-0"/>
<div class="ml-3 flex-1">
<p class="text-sm font-semibold text-gray-800">Orión</p>
<p class="text-xs text-gray-500">Cerca de tu ubicación</p>
</div>
<button class="ml-auto bg-purple-100 text-purple-700 text-sm font-semibold px-3 py-1 rounded-full hover:bg-purple-200">+ Conectar</button>
</div>
<div class="flex items-center">
<img alt="Avatar de Selene" class="h-10 w-10 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-P-R-S-V-W-X-Y-Z-A-B-C-D-E-F-G-H-I-J-K-L-M-N-O-P-Q-R-S-T-U-V-W-X-Y-Z-a-b-c-d-e-f-g-h-i-j-k-l-m-n-o-p-q-r-s-t-u-v"/>
<div class="ml-3 flex-1">
<p class="text-sm font-semibold text-gray-800">Selene</p>
<p class="text-xs text-gray-500">Amigo en común: Kael</p>
</div>
<button class="ml-auto bg-purple-100 text-purple-700 text-sm font-semibold px-3 py-1 rounded-full hover:bg-purple-200">+ Conectar</button>
</div>
</div>
</div>
<div class="bg-white rounded-lg shadow-md p-6">
<h3 class="text-lg font-bold text-gray-800 mb-4">Círculos para Explorar</h3>
<div class="space-y-4">
<div>
<div class="flex items-center">
<div class="flex-1">
<p class="font-semibold text-gray-800">Permacultura Cali</p>
<p class="text-sm text-gray-600 mt-1">Conectando con la tierra y la comunidad local.</p>
<p class="text-xs text-gray-500 mt-1">42 miembros</p>
</div>
<button class="ml-4 bg-transparent border border-purple-600 text-purple-600 text-sm font-semibold px-3 py-1 rounded-full hover:bg-purple-100">Unirme al Círculo</button>
</div>
</div>
<div class="border-t border-gray-200 my-4"></div>
<div>
<div class="flex items-center">
<div class="flex-1">
<p class="font-semibold text-gray-800">Tejedoras de Sueños</p>
<p class="text-sm text-gray-600 mt-1">Espacio para mujeres emprendedoras y creativas.</p>
<p class="text-xs text-gray-500 mt-1">78 miembros</p>
</div>
<button class="ml-4 bg-transparent border border-purple-600 text-purple-600 text-sm font-semibold px-3 py-1 rounded-full hover:bg-purple-100">Unirme al Círculo</button>
</div>
</div>
<div class="border-t border-gray-200 my-4"></div>
<div>
<div class="flex items-center">
<div class="flex-1">
<p class="font-semibold text-gray-800">Música para el Alma</p>
<p class="text-sm text-gray-600 mt-1">Amantes de la música que sana y conecta.</p>
<p class="text-xs text-gray-500 mt-1">112 miembros</p>
</div>
<button class="ml-4 bg-transparent border border-purple-600 text-purple-600 text-sm font-semibold px-3 py-1 rounded-full hover:bg-purple-100">Unirme al Círculo</button>
</div>
</div>
</div>
</div>
</div>
</div>
</main>
</div>
<div class="modal fixed inset-0 bg-black bg-opacity-50 items-center justify-center p-4" id="shareModal">
<div class="bg-white rounded-lg shadow-xl w-full max-w-md">
<div class="p-6">
<div class="flex justify-between items-center">
<h2 class="text-xl font-bold text-gray-800">Amplifica esta Energía</h2>
<button class="text-gray-500 hover:text-gray-800" onclick="closeModal()">
<span class="material-icons">close</span>
</button>
</div>
<div class="mt-6 space-y-4">
<label class="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
<input checked="" class="form-radio text-purple-600 focus:ring-purple-500" name="share-option" type="radio"/>
<span class="ml-4 text-gray-700">Compartir en mi Perfil</span>
</label>
<label class="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
<input class="form-radio text-purple-600 focus:ring-purple-500" name="share-option" type="radio"/>
<div class="ml-4 w-full">
<span class="text-gray-700">Impulsar con Öndas</span>
<div class="flex items-center mt-2">
<input class="w-24 border-gray-300 rounded-md shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 text-sm" placeholder="Cantidad" type="number"/>
<span class="ml-2 text-gray-500 text-sm">Öndas</span>
</div>
</div>
</label>
</div>
<div class="mt-8 flex justify-end">
<button class="bg-purple-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-purple-700">Confirmar Acción</button>
</div>
</div>
</div>
</div>
<script>
    function openModal() {
      document.getElementById('shareModal').classList.add('is-open');
    }
    function closeModal() {
      document.getElementById('shareModal').classList.remove('is-open');
    }
  </script>

</body></html>