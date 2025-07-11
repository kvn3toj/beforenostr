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
    .modal {
      display: none;
    }
    .modal.is-open {
      display: flex;
    }
    #challenge-tabs .tab.active {
      background-color: var(--one-purple);
      color: white;
      border-radius: 6px 6px 0 0;
    }
    #challenge-tabs .tab:not(.active) {
      border-bottom: 2px solid transparent;
    }
    .tooltip {
      position: relative;
      display: inline-block;
    }
    .tooltip .tooltiptext {
      visibility: hidden;
      width: 220px;
      background-color: #1F2937;
      color: #fff;
      text-align: left;
      border-radius: 6px;
      padding: 12px;
      position: absolute;
      z-index: 50;
      bottom: 110%;
      left: 50%;
      margin-left: -110px;
      opacity: 0;
      transition: opacity 0.3s;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .tooltip .tooltiptext::after {
      content: "";
      position: absolute;
      top: 100%;
      left: 50%;
      margin-left: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: #1F2937 transparent transparent transparent;
    }
    .tooltip:hover .tooltiptext {
      visibility: visible;
      opacity: 1;
    }
    .badge-item {
      transition: transform 0.2s ease-in-out;
    }
    .badge-item:hover {
      transform: translateY(-5px);
    }
    #uplay-tabs .tab.active {
      background-color: var(--one-purple);
      color: white;
      border-radius: 6px;
    }
    #uplay-tabs .tab:not(.active) {
      color: #6B7280;
    }
    .cosmic-card .play-icon {
      visibility: hidden;
      opacity: 0;
      transition: opacity 0.3s, visibility 0.3s;
    }
    .cosmic-card:hover .play-icon {
      visibility: visible;
      opacity: 1;
    }
    .badge-unlocked {
      background-color: #C4B5FD;
    }
    .badge-locked {
      background-color: #D1D5DB;
      filter: grayscale(100%);
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
<main class="flex-1 p-8 overflow-y-auto">
<h1 class="text-3xl font-bold text-gray-800 font-montserrat mb-6">ÜPlay - Tu Senda del Saber</h1>
<div class="border-b border-gray-200" id="uplay-tabs">
<nav aria-label="Tabs" class="flex space-x-8">
<button class="tab py-2 px-4 font-medium text-sm">Dashboard Gamificado</button>
<button class="tab py-2 px-4 font-medium text-sm">Biblioteca Interactiva</button>
<button class="tab py-2 px-4 font-medium text-sm">Sistema de Logros</button>
<button class="tab active py-2 px-4 font-medium text-sm">Salas de Estudio</button>
</nav>
</div>
<div class="mt-8">
<div class="flex justify-between items-center mb-6">
<h2 class="text-2xl font-bold font-montserrat text-gray-800">Salas de Estudio Colaborativas</h2>
<button class="bg-[var(--one-purple)] text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors" onclick="openModal('create-room-modal')">
<span class="material-icons">add</span>
            Crear Nueva Sala
          </button>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
<div class="bg-white rounded-lg shadow-md p-6 flex flex-col space-y-4">
<h3 class="text-lg font-bold text-gray-800 font-montserrat">Debate sobre Finanzas Regenerativas</h3>
<p class="text-sm text-gray-500">Video: Introducción a las Finanzas Regenerativas</p>
<div class="flex items-center">
<div class="flex -space-x-2">
<img alt="Participant 1" class="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBc8dctvWwXLeEWgsUpmOleJyxbmFdNu4I-6Kz-UtFjsrTjW6sCPNHcGvxn6sB-QkZ19O0oGgfeSqIl2wAFn_SdP5wpMmI_OuaRfJ-t83PgTpcxDD7lKIvQ9Nijh7LUYe5Fo_Wp1_tWEsc0zVTTaGdIxi9jYJVv9pto5DtyaaIyXrSkxcSn5AfNllWCuuLC0zvq7j8me9-kBJqODeh9xcPniObTSKmK-9S7ErzFCCOJOEl_xp4zl7nmc5k5r5DjTz0emdMkhv-DzY"/>
<img alt="Participant 2" class="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOpqgjl7OI_CewrA5SK7nYdRADNPLaLYfch0p3AooJcsLn0wU2Mj2xLBh5EXWPybIp6GGjS7IZl9nUTxLnDnKUP_XKCEZ13ieYPFlNkxvWKzbgrqimeHSEx5awV12pNSieN8SIesZc5ty8SXkYADzMCSLsNRvTAhzKjt_OG1IK_3xNm9s1tNEBfHhhGUAh5-hATkt0EU4oRgN5PuwSc1r0eEqRVju3D3Jy30ytwSSKL5cY-N004amLfY9DJA5Fkv0lKp8ZvPRtpKM"/>
<img alt="Participant 3" class="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXbBu4vtyaBe-FJuNG2jxYmRo3wVVggEcg96PEVbngk6giswDvy2ExE332SkwqkBdNEMz0AfUo8cHKhPV8RCLBWUAMEQS0TcOVong8ubwKk1SlUFDoPzbTbI4IRh27Ip9uIuMBZBXEoorS_ewR-FSsO1ijjFjTSpjtmO2OGyid79ZmmCb7PyK7wBNjT_sof-NvtWBfU-XX729cE5VtihS3JR9_0bpsq_a7k1wnP07agL3F0LGZsd9n0pjckQYhlVKWa_478S6ycBE"/>
</div>
<span class="text-sm text-gray-500 ml-2">+5 más</span>
</div>
<div class="flex items-center">
<span class="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
<span class="text-sm font-medium text-green-600">Activa Ahora</span>
</div>
<button class="w-full bg-[var(--triketa-green)] text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
              Unirme a la Sala
            </button>
</div>
<div class="bg-white rounded-lg shadow-md p-6 flex flex-col space-y-4">
<h3 class="text-lg font-bold text-gray-800 font-montserrat">Taller de Creatividad Consciente</h3>
<p class="text-sm text-gray-500">Curso: El Arte de la Innovación</p>
<div class="flex items-center">
<div class="flex -space-x-2">
<img alt="Participant 4" class="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdDpqgKHxrO9frInxUJtBm2wmupqlCyN4AKpK2y3iTcgys4uLP-DOHQNBiTRj2k9oavX7LZ4fEpIf0GWocZQ7RjbXjkTjEyg7JxWEdQP8ULrU0Ctw0e0tGyDZ4eai50rs9IQQ0N-WgVhbAuQxuoHJ0wlBOgtneRpUQFHeH0-_rtznFyJQBfGpoUe00wxjh9Z3J77ULutYLBVyvJKYRl2iwNfQjmuuc3g2WII9RtWyQKMZFYNLYS16aiVDM7E1lXaDSBY__eojBboI"/>
<img alt="Participant 5" class="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzVDA3Px-LHElcNlNaPXVPKZg4F5lmckJBRIiNPBVZXSboahn7mobsgFQF2qoNxenMK_gVGf71ejFjo58E_rB9FD8YxppGhAG5eDHvu2uzoi8bTXqEnbMip8WbNbo2ZaDb2utthSMz1rsvRzSnUYpkjZuKhF8rbcbcsF55iXhaUmgoOj9EmTjmcZAoJB457aJFPRjKnHe9fCn9buILry_JhnTcIJ7Crthje8jhvvl22qVfu19epsMEm2njTfWWjLiOexbt_645roQ"/>
</div>
</div>
<div class="flex items-center">
<span class="h-2 w-2 bg-gray-400 rounded-full mr-2"></span>
<span class="text-sm font-medium text-gray-600">Programada para Mañana</span>
</div>
<button class="w-full bg-[var(--triketa-green)] text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
              Unirme a la Sala
            </button>
</div>
<div class="bg-white rounded-lg shadow-md p-6 flex flex-col space-y-4">
<h3 class="text-lg font-bold text-gray-800 font-montserrat">Círculo de Lectura: Economía del Bien Común</h3>
<p class="text-sm text-gray-500">Curso: Principios de Reciprocidad</p>
<div class="flex items-center">
<div class="flex -space-x-2">
<img alt="Participant 6" class="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBV0FVhcFl-7-_oaOXqfXtf8-9ZWOj2ygnpNE3HIe8_jKLuSvbyQg_5190_yRc8QJbhtmgQ5inwhzz3yh3yx39PDdwY6YzPWI11CvDWQQ-OUhwnZBINtUG2pWNQrHHaOBNHpjGCRgSSnUIMHuyIe5oyHCJ3299dSwE4RkB99mZeT5h81kmkAzlk2Yi5xaBW7zVh0X_F7PIFI8IvQRdx9LAdpoyMvPeTbUZZAv1_ulbmRLKabOW0nkPr80GYPlDjGtlL4UOXKkPu4tw"/>
<img alt="Participant 7" class="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7oNIdFcAN3-QwlAjmse4SjUEIqmJAU-hJcIEzCqdzARmvps9G0xjyxs2GhwcrWFUyrk4wGfFoAvcWeSrrbLXWKfzQziZ2LZU2cjJB1nWqP8dW9aIsvSUc3k2dElBO4P_I0eE_YhaLlpLJmLbQRhshH4pJlamoZS4gqfK9fI2rdgOgfEMYTTJzOk00m27Ap0QbzBQeDSR8HZfGsDIQmnWsSY2q0ulm7A2O_3LgDsPuhSjllShuDbL0YxSYoAIWpxrJROi2MjcOlwU"/>
<img alt="Participant 8" class="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHf3xD4t322xzKVKdZavXiKOXBorVKBLKIWWqWQLGamkLFCmnnKe9wsQBgqP9erToMBzGrFH_x6NE2YkeDmIkCteQ16EmEoXNg6LaHjCF2QLICtH1SKDqfKwFW-DFbO7O1-RxcDnyuAz_3PLJvIt7NcsLUIyut1EObFt4R8dnXry43ShYB0FxK6CSiUKHc-bngmfThSrfOtrg4NX-iH62_PaHE5GwKyGVVERi9teHjXmwa7154xyndf6lHwvezAXyoD8lv657WDps"/>
<img alt="Participant 9" class="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxVkFLQKlJXfK6cfh0FNPrgoTLzbcwQZR4u0ccpMrGPlDcrvYDIsRbcoghv0U2Odpg-87U5Nw_EQ445SqN-uI95IzMkGLdMtTXyx6h1PdSJKyGJDCCVTg7TP5DEQHGaNtRfWaGsGzSz3aHPhqziCuMIFZLLlCcy5YngSXdhGbx7D7YlsZtZSvA8mhj2LzTLVOqkqEdVdxuXiGUFduEIrnmWei4jN71lAvzfsOX8U1B0yZmI22s5jShSLwJWAir-iTC6j9TNpnCi6M"/>
</div>
</div>
<div class="flex items-center">
<span class="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
<span class="text-sm font-medium text-green-600">Activa Ahora</span>
</div>
<button class="w-full bg-[var(--triketa-green)] text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
              Unirme a la Sala
            </button>
</div>
</div>
</div>
</main>
</div>
<div class="modal fixed inset-0 bg-black bg-opacity-50 items-center justify-center p-4" id="create-room-modal">
<div class="bg-white rounded-lg shadow-xl w-full max-w-2xl">
<div class="p-6 border-b border-gray-200">
<div class="flex justify-between items-center">
<h2 class="text-2xl font-bold font-montserrat text-gray-800">Convocar un Círculo de Estudio</h2>
<button class="text-gray-400 hover:text-gray-600" onclick="closeModal('create-room-modal')">
<span class="material-icons">close</span>
</button>
</div>
</div>
<div class="p-6">
<form class="space-y-6">
<div>
<label class="block text-sm font-medium text-gray-700" for="topic">Tema Principal</label>
<select class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md" id="topic" name="topic">
<option>Selecciona un video o curso de la Biblioteca Interactiva</option>
<option>Introducción a las Finanzas Regenerativas</option>
<option>El Arte de la Innovación</option>
<option>Principios de Reciprocidad</option>
<option>Sostenibilidad en la Práctica</option>
</select>
</div>
<div>
<label class="block text-sm font-medium text-gray-700" for="room-name">Nombre de la Sala</label>
<input class="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" id="room-name" name="room-name" placeholder="Ej: Debate sobre..." type="text"/>
</div>
<div>
<label class="block text-sm font-medium text-gray-700" for="description">Descripción Breve</label>
<textarea class="mt-1 shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md" id="description" name="description" placeholder="Propósito de la sala, temas a tratar..." rows="3"></textarea>
</div>
<div>
<label class="block text-sm font-medium text-gray-700" for="date-time">Fecha y Hora</label>
<input class="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" id="date-time" name="date-time" type="datetime-local"/>
</div>
<div class="pt-4 flex justify-end">
<button class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500" onclick="closeModal('create-room-modal')" type="button">
              Cancelar
            </button>
<button class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[var(--one-purple)] hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500" type="submit">
              Crear y Convocar
            </button>
</div>
</form>
</div>
</div>
</div>
<script>
    function openModal(modalId) {
      document.querySelectorAll('.modal.is-open').forEach(modal => modal.classList.remove('is-open'));
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('is-open');
      }
    }
    function closeModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.remove('is-open');
      }
    }
    document.addEventListener('keydown', function(event) {
      if (event.key === "Escape") {
        document.querySelectorAll('.modal.is-open').forEach(modal => modal.classList.remove('is-open'));
      }
    });
    document.addEventListener('click', function(event) {
      const openModals = document.querySelectorAll('.modal.is-open');
      openModals.forEach(modal => {
        // We check if the click is on the modal's backdrop
        if (event.target === modal) {
          modal.classList.remove('is-open');
        }
      });
    });
  </script>

</body></html>