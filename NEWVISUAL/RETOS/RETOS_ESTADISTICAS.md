<!DOCTYPE html>
<html lang="es"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>ÜSocial - CoomUnity</title>
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
        background-color: #555;
        color: #fff;
        text-align: center;
        border-radius: 6px;
        padding: 5px 0;
        position: absolute;
        z-index: 50;
        bottom: 125%;
        left: 50%;
        margin-left: -110px;
        opacity: 0;
        transition: opacity 0.3s;
    }
    .tooltip .tooltiptext::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: #555 transparent transparent transparent;
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
<a class="flex items-center px-6 py-3 bg-purple-100 text-[var(--one-purple)] font-semibold" href="#">
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
<button class="tab py-3 px-4 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-t-md whitespace-nowrap">Completados</button>
<button class="tab active py-3 px-4 text-sm font-medium whitespace-nowrap">Estadísticas</button>
</nav>
</div>
<div class="mt-8">
<div class="bg-white rounded-lg shadow p-6 mb-6">
<h3 class="text-xl font-bold font-montserrat text-gray-900 mb-4">Mi Sala de Trofeos y Logros</h3>
<div class="flex items-center justify-center space-x-4">
<div class="text-center">
<div class="tooltip badge-item">
<span class="material-icons text-7xl text-yellow-400">workspace_premium</span>
<span class="tooltiptext">Maestría en Compostaje<br/>Ganado: 28 Mayo, 2024</span>
</div>
<p class="text-sm font-semibold mt-2">Más Reciente</p>
</div>
<div class="grid grid-cols-4 gap-4">
<div class="tooltip badge-item">
<span class="material-icons text-5xl text-blue-400">water_drop</span>
<span class="tooltiptext">Maestro del Agua<br/>Ganado: 15 Mayo, 2024</span>
</div>
<div class="tooltip badge-item">
<span class="material-icons text-5xl text-green-500">eco</span>
<span class="tooltiptext">Corazón Verde<br/>Ganado: 02 Mayo, 2024</span>
</div>
<div class="tooltip badge-item">
<span class="material-icons text-5xl text-purple-500">self_improvement</span>
<span class="tooltiptext">Zen Total<br/>Ganado: 20 Abril, 2024</span>
</div>
<div class="tooltip badge-item">
<span class="material-icons text-5xl text-orange-400">groups</span>
<span class="tooltiptext">Conector Comunitario<br/>Ganado: 05 Abril, 2024</span>
</div>
</div>
</div>
</div>
<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
<div class="lg:col-span-2 bg-white rounded-lg shadow p-6">
<div class="flex justify-between items-center mb-6">
<h3 class="text-xl font-bold font-montserrat text-gray-900">Mi Viaje en los Retos</h3>
<div class="relative">
<select class="block appearance-none w-full bg-gray-100 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
<option>Este Mes</option>
<option>Este Año</option>
<option selected="">Desde el Inicio</option>
</select>
<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
<svg class="fill-current h-4 w-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"></path></svg>
</div>
</div>
</div>
<div class="w-full h-80 flex items-center justify-center">
<canvas id="radarChart"></canvas>
</div>
</div>
<div class="bg-white rounded-lg shadow p-6">
<h3 class="text-xl font-bold font-montserrat text-gray-900 mb-4">Ranking de Guardianes</h3>
<ul class="space-y-2">
<li class="flex items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer" onclick="openModal('userProfileModal')">
<span class="text-lg font-bold text-gray-700 w-8">1.</span>
<div class="relative">
<img alt="Avatar de Elara" class="h-10 w-10 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3WZagvZbaxgJgxMYc6MECIKtdVUNKDRUQh0V5V2sRKQQMyxdR1LULkVoydCKMbWBOszJHkGjRVUvrLF3NBQJIBx6jv52lOBwMqQXjr-5kXoz_AsCXxmdhSnV-wOOcDLq7iTAoa-HKN8JmN1fHxSoQmTgqqnKP55slDGOmfmuXJzoseMiwdqzQL3GtaRm5QQQEPTbY4BmaxlZiHiOZZOVGyF5ZyxnkCxyu64w5B6jSW0po-vI4YSHvWsUXKjroGLr_VkWAjBBh9mY"/>
<span class="absolute -bottom-1 -right-1 material-icons text-yellow-500 text-lg" title="Insignia Prestigiosa: Explorador de Sabiduría">military_tech</span>
</div>
<div class="ml-3 flex-1">
<p class="text-sm font-semibold text-gray-800">Elara</p>
<p class="text-sm text-green-600">3,200 Méritos</p>
<div class="flex items-center text-xs text-gray-500 mt-1">
<span class="material-icons text-orange-500 text-sm mr-1">local_fire_department</span>
<span>Racha de 15 Retos</span>
</div>
</div>
</li>
<li class="flex items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer" onclick="openModal('userProfileModal')">
<span class="text-lg font-bold text-gray-700 w-8">2.</span>
<div class="relative">
<img alt="Avatar de Kael" class="h-10 w-10 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRMTOn01_GI_kXq7d2InbOqv59pGm9nKjic1a9DiVXjCLTaMEJTu0jj-WrQzchtV41T6dgkTECptHemNakOPIXdgWTB3TXaxvASlgOLtXJ6F4RWKjFrYdKV3IO4ZusiHBDNmHhbu6tRTPBTORFQ1G481qPfARm5wVTkoiIBAerpgSih1kxtfpxvVNG4c0MQywludXYmMggNRZ-Er6gCdXXnPXeF8boDEMCtn5uKjXJyQSDaE_e9uYp9kLHne59UpEs0sBvT4ZrLPI"/>
<span class="absolute -bottom-1 -right-1 material-icons text-green-500 text-lg" title="Categoría Favorita: Sostenibilidad">eco</span>
</div>
<div class="ml-3 flex-1">
<p class="text-sm font-semibold text-gray-800">Kael</p>
<p class="text-sm text-green-600">2,950 Méritos</p>
<div class="flex items-center text-xs text-gray-500 mt-1">
<span class="material-icons text-orange-500 text-sm mr-1">local_fire_department</span>
<span>Racha de 12 Retos</span>
</div>
</div>
</li>
<li class="flex items-center bg-purple-100 p-2 rounded-lg">
<span class="text-lg font-bold text-gray-700 w-8">12.</span>
<div class="relative">
<img alt="Avatar de Admin" class="h-10 w-10 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaXgAQwiLqsyiPfrvon6jYib-suep9tHSVyFYGaYElULMVtdqVyvnLh3BCQmJmz1mrhKEg7pvD1LPjnD9QYfVVADC9deStkmm1M7nvZXlHvVDl1cAcLcC0sYo-XqVJWJ84VAUb8GAMcfiY31leSLQqkbsZxiaOfFXGyUCZ4Zu99qZQdW-6yk1bAKUQ3gV7My5X2zbARhngTbcL4aPT2X11VpnoTyNoAHsxmDF2iKceg7aGhGuiKwQHLy5tvfm_nzHYrB0lFgHGNxg"/>
<span class="absolute -bottom-1 -right-1 material-icons text-yellow-400 text-lg" title="Insignia Prestigiosa: Maestría en Compostaje">workspace_premium</span>
</div>
<div class="ml-3 flex-1">
<p class="text-sm font-semibold text-gray-800">Admin (Tú)</p>
<p class="text-sm text-green-600">1,850 Méritos</p>
<div class="flex items-center text-xs text-gray-500 mt-1">
<span class="material-icons text-orange-500 text-sm mr-1">local_fire_department</span>
<span>Racha de 5 Retos</span>
</div>
</div>
</li>
<li class="flex items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer" onclick="openModal('userProfileModal')">
<span class="text-lg font-bold text-gray-700 w-8">13.</span>
<div class="relative">
<img alt="Avatar de Lyra" class="h-10 w-10 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLQBnxm6ERrmV2Sh1rkDk0hTW0Mep1XqH9q3DhS3jgOKV1XckKNtJhG-GVRNUf7JSvkbblBt7OSlml7VA5VtRe0LX6W5wEToMbmC6DleiEPcKZ7b5Zmh5BzRfrBpM95RYnxEBXjWXIhslsgjTVuo_sFrVSvpLsP9L2rABdghiONUIEL8DrPCu3n87Vr1pnBn0Ovrknbl8vmnCQwFg9Oq70dHnebA_ZUNh_Hwk66Q3A1ZDj5a3qt2rwUjnDFZEN2TJTALUY2AcVzbw"/>
<span class="absolute -bottom-1 -right-1 material-icons text-purple-500 text-lg" title="Categoría Favorita: Mindfulness">self_improvement</span>
</div>
<div class="ml-3 flex-1">
<p class="text-sm font-semibold text-gray-800">Lyra</p>
<p class="text-sm text-green-600">1,780 Méritos</p>
<div class="flex items-center text-xs text-gray-500 mt-1">
<span class="material-icons text-gray-400 text-sm mr-1">whatshot</span>
<span>Racha de 2 Retos</span>
</div>
</div>
</li>
</ul>
</div>
</div>
</div>
</main>
</div>
<div class="modal fixed inset-0 bg-black bg-opacity-50 items-center justify-center p-4" id="userProfileModal">
<div class="bg-white rounded-lg shadow-xl w-full max-w-md">
<div class="p-6">
<div class="flex justify-between items-start">
<div class="flex items-center">
<img alt="Avatar de Elara" class="h-16 w-16 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3WZagvZbaxgJgxMYc6MECIKtdVUNKDRUQh0V5V2sRKQQMyxdR1LULkVoydCKMbWBOszJHkGjRVUvrLF3NBQJIBx6jv52lOBwMqQXjr-5kXoz_AsCXxmdhSnV-wOOcDLq7iTAoa-HKN8JmN1fHxSoQmTgqqnKP55slDGOmfmuXJzoseMiwdqzQL3GtaRm5QQQEPTbY4BmaxlZiHiOZZOVGyF5ZyxnkCxyu64w5B6jSW0po-vI4YSHvWsUXKjroGLr_VkWAjBBh9mY"/>
<div class="ml-4">
<h2 class="text-2xl font-bold text-gray-800 font-montserrat">Elara</h2>
<p class="text-sm text-gray-500">Guardián de la Armonía</p>
</div>
</div>
<button class="text-gray-500 hover:text-gray-800" onclick="closeModal('userProfileModal')">
<span class="material-icons">close</span>
</button>
</div>
<div class="mt-6">
<div class="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
<span class="text-md font-semibold text-gray-700">Puntaje de Reciprocidad:</span>
<span class="text-lg font-bold text-green-600">92%</span>
</div>
</div>
<div class="mt-6">
<h3 class="text-lg font-semibold text-gray-800">Último Reto Completado</h3>
<div class="mt-2 p-3 border rounded-lg">
<p class="font-semibold text-gray-700">Explorador de Sabiduría Ancestral</p>
<p class="text-sm text-gray-500">Hace 3 días</p>
</div>
</div>
<div class="mt-8 flex justify-end space-x-4">
<button class="bg-[var(--one-purple)] text-white font-semibold px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center">
<span class="material-icons mr-2">add</span> Conectar
                    </button>
<button class="border border-[var(--one-purple)] text-[var(--one-purple)] font-semibold px-6 py-3 rounded-lg hover:bg-purple-50 transition-colors">Felicitar por su Progreso</button>
</div>
</div>
</div>
</div>
<div class="modal fixed inset-0 bg-black bg-opacity-50 items-center justify-center p-4" id="favoriteCategoryModal">
<div class="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
<div class="p-6 border-b">
<div class="flex justify-between items-start">
<h2 class="text-2xl font-bold text-gray-800 font-montserrat">Desglose de mi Categoría Favorita: Mindfulness</h2>
<button class="text-gray-500 hover:text-gray-800" onclick="closeModal('favoriteCategoryModal')">
<span class="material-icons">close</span>
</button>
</div>
</div>
<div class="p-6 overflow-y-auto">
<ul class="space-y-4">
<li class="flex justify-between items-center">
<div>
<p class="font-semibold text-gray-800">7 Días de Mindfulness</p>
<p class="text-sm text-gray-500">Completado: 15 de Mayo, 2024</p>
</div>
<span class="material-icons text-green-500">check_circle</span>
</li>
<li class="flex justify-between items-center">
<div>
<p class="font-semibold text-gray-800">Meditación de Escaneo Corporal</p>
<p class="text-sm text-gray-500">Completado: 02 de Mayo, 2024</p>
</div>
<span class="material-icons text-green-500">check_circle</span>
</li>
<li class="flex justify-between items-center">
<div>
<p class="font-semibold text-gray-800">Respiración Consciente para Principiantes</p>
<p class="text-sm text-gray-500">Completado: 20 de Abril, 2024</p>
</div>
<span class="material-icons text-green-500">check_circle</span>
</li>
<li class="flex justify-between items-center">
<div>
<p class="font-semibold text-gray-800">Mindfulness en la Comida</p>
<p class="text-sm text-gray-500">Completado: 05 de Abril, 2024</p>
</div>
<span class="material-icons text-green-500">check_circle</span>
</li>
<li class="flex justify-between items-center">
<div>
<p class="font-semibold text-gray-800">Pausa Consciente de 5 minutos</p>
<p class="text-sm text-gray-500">Completado: 18 de Marzo, 2024</p>
</div>
<span class="material-icons text-green-500">check_circle</span>
</li>
</ul>
</div>
<div class="p-6 border-t flex justify-end">
<button class="bg-gray-200 text-gray-800 font-semibold px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors" onclick="closeModal('favoriteCategoryModal')">Cerrar</button>
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
    document.addEventListener('keydown', function (event) {
        if (event.key === "Escape") {
            document.querySelectorAll('.modal.is-open').forEach(modal => modal.classList.remove('is-open'));
        }
    });
    document.addEventListener('click', function(event) {
        const openModals = document.querySelectorAll('.modal.is-open');
        openModals.forEach(modal => {
            if (event.target === modal) {
                 modal.classList.remove('is-open');
            }
        });
    });
    const ctx = document.getElementById('radarChart');
    if (ctx) {
      new Chart(ctx, {
        type: 'radar',
        data: {
          labels: ['Mindfulness', 'Sostenibilidad', 'Comunidad', 'Creatividad', 'Bienestar'],
          datasets: [{
            label: 'Retos Completados',
            data: [5, 7, 3, 4, 6],
            fill: true,
            backgroundColor: 'rgba(92, 36, 131, 0.2)',
            borderColor: 'rgb(92, 36, 131)',
            pointBackgroundColor: 'rgb(92, 36, 131)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(92, 36, 131)'
          }]
        },
        options: {
          maintainAspectRatio: false,
          elements: {
            line: {
              borderWidth: 3
            }
          },
          scales: {
            r: {
              angleLines: {
                color: 'rgba(0, 0, 0, 0.1)'
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              },
              pointLabels: {
                font: {
                  size: 14,
                  family: "'Inter', sans-serif"
                },
                color: '#333'
              },
              ticks: {
                backdropColor: 'transparent',
                stepSize: 2,
                color: '#666'
              }
            }
          },
          plugins: {
            legend: {
                display: false
            }
          }
        }
      });
    }
</script>

</body></html>