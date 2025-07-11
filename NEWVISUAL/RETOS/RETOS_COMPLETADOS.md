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
      --one-purple: #5C2483;
      --triketa-green: #3E8638;
      --gold-border: #FBBA00;
    }
    .modal {
      display: none;
    }
    .modal.is-open {
      display: flex;
    }
    #challenge-tabs .tab.active {
        background-color: #5C2483;
        color: white;
        border-radius: 6px 6px 0 0;
    }
    #challenge-tabs .tab:not(.active) {
      border-bottom: 2px solid transparent;
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
<a class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100" href="#">
<span class="material-icons">group</span>
<span class="ml-4">ÜSocial</span>
</a>
<a class="flex items-center px-6 py-3 bg-purple-100 text-purple-700 font-semibold" href="#">
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
<h1 class="text-3xl font-bold text-gray-800 font-montserrat mb-6">La Senda de los Retos</h1>
<div id="challenge-tabs">
<nav aria-label="Tabs" class="flex space-x-4">
<button class="tab py-3 px-4 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-t-md whitespace-nowrap">Explorar</button>
<button class="tab py-3 px-4 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-t-md whitespace-nowrap">Mis Retos Activos</button>
<button class="tab active py-3 px-4 text-sm font-medium whitespace-nowrap">Completados</button>
<button class="tab py-3 px-4 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-t-md whitespace-nowrap">Estadísticas</button>
</nav>
</div>
<div class="mt-8">
<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
<div class="bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-center">
<h4 class="text-sm font-semibold text-gray-600 mb-2">Total de Retos Completados</h4>
<p class="text-4xl font-bold text-[var(--one-purple)]">12</p>
</div>
<div class="bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-center">
<h4 class="text-sm font-semibold text-gray-600 mb-2">Total de Méritos Ganados en Retos</h4>
<p class="text-4xl font-bold text-[var(--triketa-green)]">1,850</p>
</div>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
<div class="bg-gray-50 rounded-lg shadow-md p-6 border-2 border-[var(--gold-border)] flex flex-col">
<h3 class="text-xl font-bold font-montserrat text-gray-900 text-center">Maestría en Compostaje</h3>
<div class="my-4 flex justify-center">
<span class="material-icons text-7xl text-[var(--gold-border)]">emoji_events</span>
</div>
<p class="text-sm text-gray-500 text-center mb-4">Completado el: 15 de Mayo, 2024</p>
<div class="bg-white rounded-md p-4 mb-4">
<h4 class="text-md font-semibold text-gray-800 mb-2">Recompensas Obtenidas</h4>
<ul class="space-y-1 text-gray-700">
<li class="flex items-center"><span class="font-semibold text-green-600 mr-2">+200 Méritos</span> por tu dedicación al suelo.</li>
<li class="flex items-center"><span class="font-semibold text-blue-500 mr-2">+50 Öndas</span> para proyectos de agricultura sostenible.</li>
</ul>
</div>
<button class="mt-auto w-full bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">Compartir Logro en ÜSocial</button>
</div>
<div class="bg-gray-50 rounded-lg shadow-md p-6 border-2 border-[var(--gold-border)] flex flex-col">
<h3 class="text-xl font-bold font-montserrat text-gray-900 text-center">7 Días de Mindfulness</h3>
<div class="my-4 flex justify-center">
<span class="material-icons text-7xl text-[var(--gold-border)]">emoji_events</span>
</div>
<p class="text-sm text-gray-500 text-center mb-4">Completado el: 28 de Abril, 2024</p>
<div class="bg-white rounded-md p-4 mb-4">
<h4 class="text-md font-semibold text-gray-800 mb-2">Recompensas Obtenidas</h4>
<ul class="space-y-1 text-gray-700">
<li><span class="font-semibold text-green-600">+150 Méritos</span> por cultivar tu paz interior.</li>
<li><span class="font-semibold text-blue-500">+30 Öndas</span> para apoyar iniciativas de bienestar.</li>
</ul>
</div>
<button class="mt-auto w-full bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">Compartir Logro en ÜSocial</button>
</div>
</div>
</div>
</main>
</div>
<div class="modal fixed inset-0 bg-black bg-opacity-50 items-center justify-center p-4" id="challengeDetailModal">
<div class="bg-white rounded-lg shadow-xl w-full max-w-lg">
<div class="p-6">
<div class="flex justify-between items-start">
<h2 class="text-2xl font-bold text-gray-800 font-montserrat">7 Días de Mindfulness</h2>
<button class="text-gray-500 hover:text-gray-800" onclick="closeModal('challengeDetailModal')">
<span class="material-icons">close</span>
</button>
</div>
<p class="mt-4 text-gray-600">
          Este reto consiste en dedicar 15 minutos cada día, durante una semana, a la práctica de la meditación mindfulness. El objetivo es ayudarte a reducir el estrés, mejorar tu concentración y conectar con el momento presente. Te proporcionaremos guías diarias para facilitar tu práctica, enfocándote en la respiración, las sensaciones corporales y la observación de tus pensamientos sin juicio.
        </p>
<div class="mt-6">
<h3 class="text-lg font-semibold text-gray-800">Recompensas por Completar</h3>
<ul class="list-disc list-inside mt-2 space-y-2 text-gray-600">
<li><span class="font-semibold text-green-600">+150 Méritos</span> por cultivar tu paz interior.</li>
<li><span class="font-semibold text-blue-500">+30 Öndas</span> para apoyar iniciativas de bienestar.</li>
<li>Insignia digital: <span class="font-semibold text-yellow-600">'Mente Serena'</span>.</li>
</ul>
</div>
<div class="mt-8 flex justify-end">
<button class="bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">Aceptar el Reto</button>
</div>
</div>
</div>
</div>
<script>
    function openModal(modalId) {
      document.getElementById(modalId).classList.add('is-open');
    }
    function closeModal(modalId) {
      document.getElementById(modalId).classList.remove('is-open');
    }
  </script>

</body></html>