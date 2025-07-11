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
    #challenge-tabs .tab.active {
      border-bottom-color: #9333ea;
      color: #9333ea;
      font-weight: 600;
    }
    #challenge-tabs .tab {
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
<div class="border-b border-gray-200" id="challenge-tabs">
<nav aria-label="Tabs" class="-mb-px flex space-x-8">
<button class="tab active py-4 px-1 text-sm font-medium text-purple-600 border-b-2 border-purple-600 whitespace-nowrap">Explorar</button>
<button class="tab py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent whitespace-nowrap">Mis Desafíos</button>
<button class="tab py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent whitespace-nowrap">Completados</button>
<button class="tab py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent whitespace-nowrap">Estadísticas</button>
</nav>
</div>
<div class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
<div class="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transform hover:-translate-y-1 transition-transform duration-300 ease-in-out">
<img alt="Meditación" class="h-48 w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7-2LwMLDj2e2h3PMa27K2Xp1JwT3M1A5JgQG3QYk4j2L2fV7e8c9gHj1aJk8lM9n0pXqZfWbCj9i0bU1tH2vBwQoG2tY3s4uR_eX_k5f6g7h8iJk9lM0n1oPqRsTtUvXzY-A"/>
<div class="p-6 flex-1 flex flex-col">
<h3 class="text-xl font-bold text-gray-800 mb-2">7 Días de Mindfulness</h3>
<p class="text-gray-600 text-sm mb-4 flex-1">Dedica 15 minutos diarios a la meditación.</p>
<div class="flex items-center justify-between mb-4 text-xs">
<span class="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-semibold">Recompensa: +150 Méritos</span>
<span class="inline-flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold">Dificultad: Fácil</span>
</div>
<button class="w-full bg-purple-600 text-white font-semibold py-2 rounded-lg hover:bg-purple-700 transition-colors" onclick="openModal('challengeDetailModal')">Ver Reto</button>
</div>
</div>
<div class="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transform hover:-translate-y-1 transition-transform duration-300 ease-in-out">
<img alt="Huerto urbano" class="h-48 w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbY-3Z_qA_j-0c_a_p-4B_s_t-8F_l_k_j_d_a_c_e_f_g_h_i_j_k_l_m_n_o_p_q_r_s_t_u_v_w_x_y_z_a_b_c_d_e_f_g_h_i_j_k_l_m_n_o_p_q_r_s_t_u_v_w_x_y_z"/>
<div class="p-6 flex-1 flex flex-col">
<h3 class="text-xl font-bold text-gray-800 mb-2">Inicia tu Huerto Urbano</h3>
<p class="text-gray-600 text-sm mb-4 flex-1">Crea un pequeño huerto en tu balcón o ventana.</p>
<div class="flex items-center justify-between mb-4 text-xs">
<span class="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-semibold">Recompensa: +250 Méritos</span>
<span class="inline-flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-semibold">Dificultad: Medio</span>
</div>
<button class="w-full bg-purple-600 text-white font-semibold py-2 rounded-lg hover:bg-purple-700 transition-colors" onclick="openModal('challengeDetailModal')">Ver Reto</button>
</div>
</div>
<div class="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transform hover:-translate-y-1 transition-transform duration-300 ease-in-out">
<img alt="Compostaje" class="h-48 w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjpyL9yO9vtmNu7PzbcDzW-HfRPq2LGFNSIiTYMGdQ3A-pAF_CbAle5DGzbLpaVpvK4i0BJko0VlXVuqfEM3ts2SyZ_ewSADxEwC9EslN8em2JWwpCUrEy5pDpfE_Xwj7uNjXKQ7JMjFtWzhdTCDX_cz97ug4CoG-PejVMGivtVsIOCi1-kqx_X4GTMiLaaw_XneXW_7SG6aS5tNgNii-sHlPo3mgxj85C76-6ifDTgCl2tNRIRegQuv-ClO61DNunVZQZ74HwgSo"/>
<div class="p-6 flex-1 flex flex-col">
<h3 class="text-xl font-bold text-gray-800 mb-2">Maestría en Compostaje</h3>
<p class="text-gray-600 text-sm mb-4 flex-1">Transforma tus residuos orgánicos en abono.</p>
<div class="flex items-center justify-between mb-4 text-xs">
<span class="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-semibold">Recompensa: +500 Méritos</span>
<span class="inline-flex items-center bg-red-100 text-red-800 px-2 py-1 rounded-full font-semibold">Dificultad: Desafío Cósmico</span>
</div>
<button class="w-full bg-purple-600 text-white font-semibold py-2 rounded-lg hover:bg-purple-700 transition-colors" onclick="openModal('challengeDetailModal')">Ver Reto</button>
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