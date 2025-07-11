<!DOCTYPE html>
<html lang="es"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>CoomÜnity Home</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Kollektif:wght@400&amp;family=Montserrat:wght@400;500;600;700&amp;family=Roboto:wght@400;500;700&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.2/dist/chart.umd.min.js"></script>
<style type="text/tailwindcss">
    body {
      font-family: 'Roboto', sans-serif;
      background-color: #F8F9FA;
    }
    .main-content {
      padding: 2rem;
      flex-grow: 1;
    }
    .cosmic-card {
      background-color: #FFFFFF;
      border-radius: 1rem;
      padding: 1.5rem;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      transition: all 0.3s ease-in-out;
      position: relative;
    }
    .cosmic-card-interactive {
      cursor: pointer;
    }
    .cosmic-card-interactive:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    }
    .cosmic-card-interactive:hover .radial-chart-glow {
      filter: drop-shadow(0 0 8px rgba(62, 134, 56, 0.5));
    }
    .quick-action-pill {
      display: flex;
      align-items: center;
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      background-color: #FFFFFF;
      border: 1px solid #E5E7EB;
      cursor: pointer;
      transition: background-color 0.2s ease-in-out;
      text-decoration: none;
      color: #4B5563;
    }
    .quick-action-pill:hover {
      background-color: #F5F5F5;
    }
    .quick-action-pill .material-icons {
      margin-right: 0.5rem;
    }
    .progress-ring__circle {
      transition: stroke-dashoffset 0.35s;
      transform: rotate(-90deg);
      transform-origin: 50% 50%;
    }
    .module-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    }
    .module-card:hover .module-icon {
      transform: scale(1.1);
    }
    .module-card .module-icon {
      transition: transform 0.3s ease-in-out;
    }
    .sidebar-nav-item {
      display: flex;
      align-items: center;
      padding: 0.75rem;
      border-radius: 9999px;
      color: #4B5563;
      font-weight: 500;
      transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
    }
    .sidebar-nav-item:hover {
      background-color: #F3F4F6;
      color: #1F2937;
    }
    .sidebar-nav-item.active {
      background-color: #F3F4F6;
      color: #1F2937;
    }
    .sidebar-nav-item .material-icons-outlined {
      margin-right: 1rem;
      color: #6B7280;
      transition: color 0.2s ease-in-out;
    }
    .sidebar-nav-item:hover .material-icons-outlined,
    .sidebar-nav-item.active .material-icons-outlined {
      color: #1F2937;
    }
    .section-title {
      font-family: 'Montserrat', sans-serif;
      font-size: 18px;
      font-weight: 600;
      color: #3C3C3B;
    }
    .card-subtitle {
      font-family: 'Kollektif', sans-serif;
      font-size: 14px;
      color: #706F6F;
    }
    .data-metric {
      font-weight: 700;
      color: #1F2937;
    }
    .data-label {
      font-size: 0.875rem;
      color: #6B7280;
    }
    .profile-card {
      padding: 0.75rem;
      border-radius: 1rem;
      cursor: pointer;
      transition: background-color 0.2s ease-in-out;
    }
    .profile-card:hover {
      background-color: #F9FAFB;
    }
    .montserrat {
      font-family: 'Montserrat', sans-serif;
    }
    .kollektif {
      font-family: 'Kollektif', sans-serif;
    }
    .ghost-button {
      background-color: transparent;
      border: 1px solid #5C2483;
      color: #5C2483;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      font-weight: 600;
      transition: all 0.2s ease-in-out;
    }
    .ghost-button:hover {
      background-color: #5C2483;
      color: white;
    }
    .pin-icon {
      position: absolute;
      top: 1rem;
      right: 1rem;
      font-size: 1.25rem;
      color: #706F6F;
      cursor: pointer;
      transition: color 0.2s ease-in-out;
    }
    .pin-icon:hover {
      color: #FBBA00;
    }
    #data-modal,
    #journey-modal,
    #event-modal,
    #add-funds-modal,
    #send-modal,
    #create-challenge-modal,
    #reciprocity-proposal-modal {
      display: none;
      position: fixed;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 50;
    }
    #data-modal.active,
    #journey-modal.active,
    #event-modal.active,
    #add-funds-modal.active,
    #send-modal.active,
    #create-challenge-modal.active,
    #reciprocity-proposal-modal.active {
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.5s ease-in-out;
    }
    #data-modal .modal-content,
    #journey-modal .modal-content {
      background-color: #1a202c;
      color: white;
      width: 100%;
      height: 100%;
      animation: zoomIn 0.8s cubic-bezier(0.165, 0.84, 0.44, 1);
      transform-origin: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    #event-modal .modal-content,
    #add-funds-modal .modal-content,
    #send-modal .modal-content,
    #create-challenge-modal .modal-content,
    #reciprocity-proposal-modal .modal-content {
      background-color: #ffffff;
      color: #1f2937;
      border-radius: 1rem;
      padding: 2.5rem;
      width: 100%;
      max-width: 500px;
      animation: zoomIn 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
      position: relative;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    @keyframes zoomIn {
      from {
        transform: scale(0.2);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }
    .close-modal {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      cursor: pointer;
      font-size: 2rem;
      color: #6b7280;
    }
    .cosmic-background {
      background: #00000e;
      overflow: hidden;
      position: relative;
    }
    .stars {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      display: block;
      background: transparent url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="stars" patternUnits="userSpaceOnUse" width="50" height="50"><circle cx="10" cy="10" r="1" fill="white"/><circle cx="30" cy="40" r="0.5" fill="white"/><circle cx="45" cy="5" r="0.8" fill="white"/></pattern></defs><rect width="100%" height="100%" fill="url(%23stars)"/></svg>') 0 0 / 50px 50px;
      animation: move-stars 60s linear infinite;
    }
    @keyframes move-stars {
      from {
        transform: translateY(0px);
      }
      to {
        transform: translateY(-2000px);
      }
    }
    .nebula {
      position: absolute;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(108, 38, 178, 0.2) 0%, rgba(108, 38, 178, 0) 70%);
      border-radius: 50%;
      animation: nebula-drift 120s alternate infinite ease-in-out;
    }
    .nebula.one {
      top: 10%;
      left: 20%;
    }
    .nebula.two {
      bottom: 5%;
      right: 15%;
      width: 700px;
      height: 700px;
      background: radial-gradient(circle, rgba(38, 178, 163, 0.15) 0%, rgba(38, 178, 163, 0) 70%);
      animation-duration: 150s;
    }
    @keyframes nebula-drift {
      from {
        transform: translate(-50px, -50px) rotate(0deg);
      }
      to {
        transform: translate(50px, 50px) rotate(30deg);
      }
    }
    .planet {
      position: absolute;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .planet.completed {
      background-color: #fcd34d;
      box-shadow: 0 0 20px 5px #fcd34d, 0 0 40px 10px #fef08a inset;
      transform: scale(1);
    }
    .planet.active {
      background-color: #60a5fa;
      box-shadow: 0 0 25px 8px #60a5fa, 0 0 50px 15px #93c5fd inset;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0% {
        transform: scale(0.95);
        box-shadow: 0 0 25px 8px #60a5fa, 0 0 50px 15px #93c5fd inset;
      }
      70% {
        transform: scale(1.05);
        box-shadow: 0 0 35px 12px #60a5fa, 0 0 60px 20px #93c5fd inset;
      }
      100% {
        transform: scale(0.95);
        box-shadow: 0 0 25px 8px #60a5fa, 0 0 50px 15px #93c5fd inset;
      }
    }
    .planet.future {
      background-color: #4b5563;
      opacity: 0.5;
      filter: grayscale(80%);
    }
    .planet:hover {
      transform: scale(1.1);
      filter: none;
      opacity: 1;
    }
    .planet-label {
      position: absolute;
      bottom: -2rem;
      color: white;
      background-color: rgba(0, 0, 0, 0.5);
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      opacity: 0;
      transition: opacity 0.3s ease;
      white-space: nowrap;
    }
    .planet:hover .planet-label {
      opacity: 1;
    }
    .celestial-event {
      position: absolute;
      cursor: pointer;
      filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.8));
      animation: celestial-pulse 3s infinite ease-in-out;
    }
    @keyframes celestial-pulse {
      0% {
        transform: scale(1);
        filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.8));
      }
      50% {
        transform: scale(1.1);
        filter: drop-shadow(0 0 25px rgba(255, 255, 255, 1));
      }
      100% {
        transform: scale(1);
        filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.8));
      }
    }
    .event-label {
      position: absolute;
      bottom: -2rem;
      left: 50%;
      transform: translateX(-50%);
      color: #fde047;
      background-color: rgba(0, 0, 0, 0.7);
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 600;
      white-space: nowrap;
      text-shadow: 0 0 5px #fde047;
    }
    #chronicle-panel {
      transform: translateX(-100%);
      transition: transform 0.5s ease-in-out;
    }
    #chronicle-panel.active {
      transform: translateX(0);
    }
    .toast {
      position: fixed;
      top: 2rem;
      right: 2rem;
      background-color: #28a745;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      z-index: 100;
      opacity: 0;
      transform: translateY(-20px);
      transition: opacity 0.3s ease, transform 0.3s ease;
      display: none;
    }
    .toast.show {
      display: block;
      opacity: 1;
      transform: translateY(0);
    }
    .visual-cue {
      position: absolute;
      opacity: 0;
      font-weight: bold;
      animation: flash-and-fade 1.5s ease-out forwards;
    }
    @keyframes flash-and-fade {
      0% {
        transform: translateY(0) scale(1);
        opacity: 1;
      }
      50% {
        transform: translateY(-10px) scale(1.2);
        opacity: 1;
      }
      100% {
        transform: translateY(-20px) scale(1.2);
        opacity: 0;
      }
    }
    .suggestion-sparkle {
      position: absolute;
      top: -0.5rem;
      right: -0.5rem;
      color: #FBBE24;
      font-size: 1.75rem;
      animation: sparkle-animation 1.5s infinite;
      filter: drop-shadow(0 0 3px #FBBF24);
    }
    @keyframes sparkle-animation {
      0%,
      100% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.2) rotate(15deg);
        opacity: 0.8;
      }
    }
    .notification-expansion {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.5s ease-in-out, padding 0.5s ease-in-out;
    }
    .gold-glow {
      box-shadow: 0 0 15px 3px rgba(251, 191, 36, 0.4);
    }
  </style>
</head>
<body class="flex">
<aside class="w-64 min-h-screen bg-white p-4 flex flex-col justify-between border-r border-gray-200">
<div>
<div class="text-2xl font-bold mb-8 ml-3">CoomÜnity</div>
<nav class="space-y-1">
<a class="sidebar-nav-item" href="#">
<span class="material-icons-outlined">home</span> Inicio
        </a>
<a class="sidebar-nav-item" href="#">
<span class="material-icons-outlined">storefront</span> Marketplace
        </a>
<a class="sidebar-nav-item" href="#">
<span class="material-icons-outlined">construction</span> LETS
        </a>
<a class="sidebar-nav-item" href="#">
<span class="material-icons-outlined">play_circle</span> ÜPlay
        </a>
<a class="sidebar-nav-item" href="#">
<span class="material-icons-outlined">group</span> ÜSocial
        </a>
<a class="sidebar-nav-item" href="#">
<span class="material-icons-outlined">emoji_events</span> Retos
        </a>
<a class="sidebar-nav-item" href="#">
<span class="material-icons-outlined">account_balance_wallet</span> Billetera
        </a>
<a class="sidebar-nav-item active" href="#">
<span class="material-icons-outlined">bar_chart</span> Estadísticas
        </a>
</nav>
</div>
<div class="space-y-2">
<a class="cosmic-card profile-card flex items-center no-underline" href="#">
<img alt="User avatar" class="w-10 h-10 rounded-full mr-3" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwInS-WqJP6SSa_yxWYMuoyXUGxc-KMj_wGlZcXGusom4aG0Shc1P8bm_wfD58vhYyfs97Tew4s-BlLE7PdF9MNJA0oQ1dNJ1OXYEkLl3h3GxuzgNqbtI3DlgAGF__a1byK91iMTkrgOv5mjNvnJXWdYEJQuCF2Dig7IzgB-tRQLHQ5qOrVYNW-6hz419VZI5pen2bhvAWWXYrO00Ko-bcr4MdgWfyXpbCI4u4RzhOxmf5DqlUWfv24A3vJZRURDYonTu8ZzLhpfrf"/>
<div class="flex-grow">
<p class="font-semibold text-gray-800">Admin</p>
<p class="text-sm text-gray-500">admin@gamiflier.com</p>
</div>
<span class="material-icons-outlined text-gray-400">chevron_right</span>
</a>
<a class="sidebar-nav-item" href="#">
<span class="material-icons-outlined">settings</span> Configuración
      </a>
<a class="sidebar-nav-item" href="#">
<span class="material-icons-outlined">help_outline</span> Ayuda
      </a>
<div class="text-xs text-gray-400 text-center mt-4">v18.0 - Claridad Organica</div>
</div>
</aside>
<main class="main-content bg-gray-50">
<header class="flex justify-between items-center mb-6">
<h1 class="text-3xl font-bold text-gray-800 montserrat">Estadísticas de la Comunidad</h1>
<div class="flex items-center space-x-4">
<span class="material-icons-outlined text-gray-500 cursor-pointer">search</span>
<div class="relative">
<span class="material-icons-outlined text-gray-500 cursor-pointer">notifications</span>
<span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">2</span>
</div>
<span class="material-icons-outlined text-gray-500 cursor-pointer">apps</span>
</div>
</header>
<div class="mb-8">
<div class="bg-gray-200 rounded-full p-1 flex space-x-1" id="stats-tabs">
<button class="flex-1 text-center py-2 px-4 rounded-full text-sm font-semibold transition-colors duration-300 bg-white" data-tab="global">Comunidad Global</button>
<button class="flex-1 text-center py-2 px-4 rounded-full text-sm font-semibold text-gray-600 hover:bg-gray-300 transition-colors duration-300" data-tab="network">Mi Red de Confianza</button>
<button class="flex-1 text-center py-2 px-4 rounded-full text-sm font-semibold text-gray-600 hover:bg-gray-300 transition-colors duration-300" data-tab="circles">Mis Círculos</button>
</div>
</div>
<div id="stats-content">
<div id="global-content">
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
<div class="cosmic-card">
<h3 class="card-subtitle mb-2">Miembros Activos Hoy</h3>
<p class="text-4xl font-bold data-metric">1,284</p>
</div>
<div class="cosmic-card">
<h3 class="card-subtitle mb-2">Intercambios en las últimas 24h</h3>
<p class="text-4xl font-bold data-metric">472</p>
</div>
<div class="cosmic-card">
<h3 class="card-subtitle mb-2">Promedio de Reciprocidad</h3>
<p class="text-4xl font-bold data-metric">98.5%</p>
</div>
<div class="cosmic-card">
<h3 class="card-subtitle mb-2">Nuevos Retos Creados</h3>
<p class="text-4xl font-bold data-metric">32</p>
</div>
</div>
<div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
<div class="cosmic-card lg:col-span-2">
<h2 class="section-title mb-4">Evolución de la Reciprocidad</h2>
<div class="h-80">
<canvas id="reciprocityChart"></canvas>
</div>
</div>
<div class="cosmic-card">
<h2 class="section-title mb-4">Guardianes Destacados de la Semana</h2>
<ol class="space-y-4">
<li class="flex items-center p-3 rounded-lg bg-yellow-50 gold-glow">
<span class="text-2xl font-bold text-yellow-600 mr-4">1</span>
<img alt="Avatar de Carlos" class="w-10 h-10 rounded-full mr-3" src="https://lh3.googleusercontent.com/a/ACg8ocJXpG3eJ_3qH3E8xWnB5f-oKj-qg3eJ_3qH3E8xWnB5f=s96-c"/>
<div class="flex-grow">
<p class="font-semibold text-gray-800">Carlos Mendoza</p>
<p class="text-sm text-gray-600">Mayor número de Aportes al Bien Común</p>
</div>
<span class="material-icons-outlined text-yellow-500 ml-2">emoji_events</span>
</li>
<li class="flex items-center">
<span class="text-2xl font-bold text-gray-500 mr-4">2</span>
<img alt="Avatar de Sofia" class="w-10 h-10 rounded-full mr-3" src="https://lh3.googleusercontent.com/a/ACg8ocK1eY5eJ_3qH3E8xWnB5f-oKj-qg3eJ_3qH3E8xWnB5f=s96-c"/>
<div>
<p class="font-semibold text-gray-800">Sofia Rodriguez</p>
<p class="text-sm text-gray-600">Mejor Balance de Reciprocidad</p>
</div>
</li>
<li class="flex items-center">
<span class="text-2xl font-bold text-gray-500 mr-4">3</span>
<img alt="Avatar de Elena" class="w-10 h-10 rounded-full mr-3" src="https://lh3.googleusercontent.com/a/ACg8ocJqg3eJ_3qH3E8xWnB5f-oKj-qg3eJ_3qH3E8xWnB5f=s96-c"/>
<div>
<p class="font-semibold text-gray-800">Elena Gomez</p>
<p class="text-sm text-gray-600">Más Retos Completados</p>
</div>
</li>
</ol>
</div>
</div>
<section class="cosmic-card h-full flex flex-col items-center justify-center text-center">
<h2 class="text-2xl font-bold text-gray-800 montserrat mb-4">Dashboard de Estadísticas Avanzadas</h2>
<p class="text-gray-600 kollektif max-w-md">Aquí se visualizará tu impacto y el de tu comunidad. En construcción por NIRA.</p>
</section>
</div>
<div class="hidden" id="network-content">
<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
<div class="cosmic-card">
<h2 class="section-title mb-4">Mi Comparativa</h2>
<div class="grid grid-cols-2 gap-6 items-center">
<div class="text-center">
<div class="relative w-32 h-32 mx-auto">
<svg class="w-full h-full" viewBox="0 0 36 36">
<path class="text-gray-200" d="M18 2.0845
                                              a 15.9155 15.9155 0 0 1 0 31.831
                                              a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3"></path>
<path class="text-green-500" d="M18 2.0845
                                              a 15.9155 15.9155 0 0 1 0 31.831
                                              a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-dasharray="92, 100" stroke-linecap="round" stroke-width="3"></path>
</svg>
<div class="absolute inset-0 flex flex-col items-center justify-center">
<span class="text-2xl font-bold data-metric">9.2</span>
<span class="text-xs text-gray-500">/10</span>
</div>
</div>
<p class="mt-3 font-semibold text-gray-700">Mi Puntaje de Reciprocidad</p>
</div>
<div class="text-center">
<div class="relative w-32 h-32 mx-auto">
<svg class="w-full h-full" viewBox="0 0 36 36">
<path class="text-gray-200" d="M18 2.0845
                                              a 15.9155 15.9155 0 0 1 0 31.831
                                              a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3"></path>
<path class="text-blue-500" d="M18 2.0845
                                              a 15.9155 15.9155 0 0 1 0 31.831
                                              a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-dasharray="85, 100" stroke-linecap="round" stroke-width="3"></path>
</svg>
<div class="absolute inset-0 flex flex-col items-center justify-center">
<span class="text-2xl font-bold data-metric">8.5</span>
<span class="text-xs text-gray-500">/10</span>
</div>
</div>
<p class="mt-3 font-semibold text-gray-700">Promedio de mi Red</p>
</div>
</div>
</div>
<div class="cosmic-card">
<h2 class="section-title mb-4">Mis Conexiones Más Activas</h2>
<ul class="space-y-4">
<li class="flex items-center">
<img alt="Avatar de Ana Lopez" class="w-12 h-12 rounded-full mr-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuACHLXa8Fcr6nM66bQJZNKms9tBR1lYNs5RqlAkUE8dugP1VH7EkHE9tg84gTaoo8MAFofjbp368CyJB84ZZMQ3NUh2C41oKhK1J54-4EPMRk0dT25KK7wT_VWj_3EWqOpp6q9deEinGsFmsh4YFlc3d5Jv8OZAHApO8x6cMr0F2TfvdceVcEiuSHocRzjN__ouo_rzOjDh1B-3Eyvl4eDvGoOwle-T6C_bJArr8TeMrMe76Uo-Y__DRJpOInekHpEilcr-81PN1x_4"/>
<div>
<p class="font-semibold text-gray-800">Ana Lopez</p>
<p class="text-sm text-gray-500">24 Interacciones</p>
</div>
</li>
<li class="flex items-center">
<img alt="Avatar de Juan Perez" class="w-12 h-12 rounded-full mr-4" src="https://lh3.googleusercontent.com/a/ACg8ocK1eY5eJ_3qH3E8xWnB5f-oKj-qg3eJ_3qH3E8xWnB5f=s96-c"/>
<div>
<p class="font-semibold text-gray-800">Juan Perez</p>
<p class="text-sm text-gray-500">18 Interacciones</p>
</div>
</li>
<li class="flex items-center">
<img alt="Avatar de Maria Garcia" class="w-12 h-12 rounded-full mr-4" src="https://lh3.googleusercontent.com/a/ACg8ocJqg3eJ_3qH3E8xWnB5f-oKj-qg3eJ_3qH3E8xWnB5f=s96-c"/>
<div>
<p class="font-semibold text-gray-800">Maria Garcia</p>
<p class="text-sm text-gray-500">15 Interacciones</p>
</div>
</li>
</ul>
</div>
</div>
<div class="cosmic-card">
<h2 class="section-title mb-4">Flujo de Reciprocidad en mi Red</h2>
<div class="h-96">
<canvas id="networkFlowChart"></canvas>
</div>
</div>
</div>
<div class="hidden" id="circles-content">
<div class="space-y-8">
<div>
<label class="block text-sm font-medium text-gray-700 mb-2 montserrat" for="circle-select">Seleccionar Círculo</label>
<div class="relative">
<select class="block w-full max-w-sm rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm" id="circle-select">
<option>Clan de los Innovadores</option>
<option>Círculo de Artesanos</option>
<option>Grupo de Lectura "Cosmos"</option>
</select>
<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
<span class="material-icons-outlined">expand_more</span>
</div>
</div>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
<div class="cosmic-card text-center">
<h3 class="card-subtitle mb-2">Miembros del Círculo</h3>
<p class="text-5xl font-bold data-metric">12</p>
</div>
<div class="cosmic-card text-center">
<h3 class="card-subtitle mb-2">Proyectos Completados Juntos</h3>
<p class="text-5xl font-bold data-metric">8</p>
</div>
<div class="cosmic-card text-center col-span-1 md:col-span-2 lg:col-span-1">
<h3 class="card-subtitle mb-2">Total de Ünits Intercambiados</h3>
<p class="text-5xl font-bold data-metric">1,250</p>
</div>
<div class="cosmic-card md:col-span-2 lg:col-span-1">
<h2 class="section-title mb-4">Miembros Más Colaborativos</h2>
<ul class="space-y-4">
<li class="flex items-center">
<img alt="Avatar" class="w-10 h-10 rounded-full mr-3" src="https://lh3.googleusercontent.com/a/ACg8ocJXpG3eJ_3qH3E8xWnB5f-oKj-qg3eJ_3qH3E8xWnB5f=s96-c"/>
<div>
<p class="font-semibold text-gray-800">Carlos Mendoza</p>
<p class="text-sm text-gray-600">3 Proyectos, 450 Ünits</p>
</div>
</li>
<li class="flex items-center">
<img alt="Avatar" class="w-10 h-10 rounded-full mr-3" src="https://lh3.googleusercontent.com/a/ACg8ocK1eY5eJ_3qH3E8xWnB5f-oKj-qg3eJ_3qH3E8xWnB5f=s96-c"/>
<div>
<p class="font-semibold text-gray-800">Sofia Rodriguez</p>
<p class="text-sm text-gray-600">2 Proyectos, 300 Ünits</p>
</div>
</li>
<li class="flex items-center">
<img alt="Avatar" class="w-10 h-10 rounded-full mr-3" src="https://lh3.googleusercontent.com/a/ACg8ocJqg3eJ_3qH3E8xWnB5f-oKj-qg3eJ_3qH3E8xWnB5f=s96-c"/>
<div>
<p class="font-semibold text-gray-800">Elena Gomez</p>
<p class="text-sm text-gray-600">2 Proyectos, 250 Ünits</p>
</div>
</li>
</ul>
</div>
</div>
</div>
</div>
</div>
</main>
<div class="toast" id="toast-message"></div>
<div id="data-modal">
<div class="modal-content">
<span class="material-icons close-modal" id="close-data-modal-btn">close</span>
<h1 class="text-4xl font-bold mb-4">Visualización 3D de Datos Transcendentales</h1>
<p class="text-lg text-gray-300 mb-8">Interactúa con la visualización de datos.</p>
<div class="w-3/4 h-3/4 bg-gray-800 border border-gray-600 rounded-lg flex items-center justify-center">
<span class="text-gray-500">[Espacio para visualización 3D interactiva]</span>
</div>
</div>
</div>
<div id="journey-modal">
<div class="modal-content cosmic-background">
<div class="stars"></div>
<div class="nebula one"></div>
<div class="nebula two"></div>
<span class="material-icons close-modal" id="close-journey-modal-btn">close</span>
<div class="relative w-full h-full flex items-center justify-center">
<div class="absolute text-center top-16">
<h1 class="text-4xl font-bold mb-2 text-white">Mapa de Viaje Cósmico</h1>
<p class="text-lg text-gray-300">Explora tu camino como Guardián.</p>
</div>
<div class="celestial-event" id="full-moon-challenge" style="top: 25%; right: 10%;">
<div class="w-20 h-20 rounded-full bg-white opacity-80" style="background: radial-gradient(circle, #fefce8 0%, #fefce8 50%, rgba(254, 252, 232, 0) 70%);"></div>
<span class="event-label">Reto de Luna Llena</span>
</div>
<div class="planet completed" style="width: 80px; height: 80px; top: 20%; left: 15%;">
<span class="planet-label">Fundamentos de CoomÜnity</span>
</div>
<div class="planet completed" style="width: 60px; height: 60px; top: 35%; left: 30%;">
<span class="planet-label">Primer Intercambio LETS</span>
</div>
<div class="planet active" style="width: 100px; height: 100px; top: 50%; left: 50%; transform: translate(-50%, -50%);">
<span class="planet-label">Iniciación en Marketplace</span>
</div>
<div class="planet future" style="width: 70px; height: 70px; top: 40%; right: 25%;">
<span class="planet-label">Creación de tu Primer Reto</span>
</div>
<div class="planet future" style="width: 90px; height: 90px; top: 65%; right: 15%;">
<span class="planet-label">Maestría en ÜPlay</span>
</div>
<div class="planet future" style="width: 50px; height: 50px; bottom: 15%; left: 40%;">
<span class="planet-label">Conexión ÜSocial Avanzada</span>
</div>
<button class="fixed bottom-8 left-8 flex items-center space-x-3 bg-yellow-400 bg-opacity-20 backdrop-blur-md p-3 rounded-full text-white hover:bg-opacity-30 transition-all duration-300 shadow-lg z-20" id="chronicle-button">
<span class="material-icons-outlined text-yellow-300 text-3xl">menu_book</span>
<span class="font-semibold text-yellow-200">Mi Crónica</span>
</button>
<div class="absolute top-0 left-0 h-full w-96 bg-gray-900 bg-opacity-90 backdrop-blur-sm p-8 text-white z-10" id="chronicle-panel">
<button class="absolute top-4 right-4 text-2xl" id="close-chronicle-btn">×</button>
<h2 class="text-2xl font-bold mb-6 border-b border-gray-700 pb-2 text-yellow-300">Crónica del Guardián</h2>
<div class="space-y-6 overflow-y-auto h-[calc(100%-6rem)] pr-2">
<div class="border-l-2 border-yellow-400 pl-4 relative">
<span class="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-yellow-400 ring-4 ring-gray-900"></span>
<h3 class="font-bold text-lg text-white">Maestro del Agua</h3>
<p class="text-sm text-gray-400 mb-2">Fecha: 23 de Julio, 2024</p>
<p class="text-gray-300">En esta fecha, te convertiste en un 'Maestro del Agua', demostrando tu fluidez en el mar del conocimiento. Tu luz ahora brilla más fuerte en la constelación.</p>
</div>
<div class="border-l-2 border-gray-600 pl-4 relative">
<span class="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-gray-600 ring-4 ring-gray-900"></span>
<h3 class="font-bold text-lg text-white">Primer Intercambio LETS</h3>
<p class="text-sm text-gray-400 mb-2">Fecha: 15 de Junio, 2024</p>
<p class="text-gray-300">La primera semilla del saber fue intercambiada. Compartiste tu sabiduría y, a cambio, el universo te devolvió conocimiento, fortaleciendo los lazos de nuestra Coomünidad.</p>
</div>
<div class="border-l-2 border-gray-600 pl-4 relative">
<span class="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-gray-600 ring-4 ring-gray-900"></span>
<h3 class="font-bold text-lg text-white">Fundamentos de CoomÜnity</h3>
<p class="text-sm text-gray-400 mb-2">Fecha: 1 de Mayo, 2024</p>
<p class="text-gray-300">Diste tus primeros pasos en este viaje cósmico. Al establecer tus raíces, demostraste tu compromiso con el crecimiento mutuo y el propósito colectivo.</p>
</div>
</div>
</div>
</div>
<div class="absolute top-0 right-0 h-full w-96 bg-gray-900 bg-opacity-80 backdrop-blur-sm p-8 text-white transform translate-x-full transition-transform duration-500 ease-in-out" id="planet-sidebar">
<button class="absolute top-4 right-4 text-2xl" id="close-sidebar-btn">×</button>
<h2 class="text-2xl font-bold mb-4" id="sidebar-title"></h2>
<div id="sidebar-content">
</div>
</div>
</div>
</div>
<div id="event-modal">
<div class="modal-content !w-auto">
<span class="material-icons close-modal" id="close-event-modal-btn">close</span>
<div class="text-center">
<span class="material-icons text-6xl text-yellow-300 mb-4" style="filter: drop-shadow(0 0 10px #fde047);">emoji_events</span>
<h2 class="text-3xl font-bold text-yellow-300 mb-2">Reto de Luna Llena</h2>
<p class="text-gray-300 mb-6">Un desafío especial bajo el brillo cósmico.</p>
</div>
<div class="space-y-4 text-left">
<div class="bg-gray-800 p-4 rounded-lg">
<h3 class="font-semibold text-lg mb-1 text-gray-200">Descripción del Reto</h3>
<p class="text-gray-400">Aprovecha la energía de la luna llena para completar una serie de 3 tareas de colaboración comunitaria en las próximas 48 horas.</p>
</div>
<div class="bg-gray-800 p-4 rounded-lg">
<h3 class="font-semibold text-lg mb-1 text-gray-200">Duración</h3>
<p class="text-gray-400">
<span class="material-icons-outlined text-sm align-bottom mr-1">timer</span> Termina en: <span class="font-bold text-white">47h 32m 10s</span>
</p>
</div>
<div class="bg-gray-800 p-4 rounded-lg">
<h3 class="font-semibold text-lg mb-1 text-gray-200">Recompensas Únicas</h3>
<ul class="list-disc list-inside space-y-2 text-gray-400">
<li><span class="font-bold text-purple-400">+500 Méritos</span> de bonificación</li>
<li>Insignia exclusiva: <span class="font-bold text-blue-400">"Guardián Lunar"</span></li>
<li>Acceso anticipado al próximo evento cósmico.</li>
</ul>
</div>
</div>
<button class="w-full mt-8 bg-yellow-400 text-gray-900 font-bold py-3 rounded-lg hover:bg-yellow-500 transition-colors duration-300 flex items-center justify-center">
<span class="material-icons-outlined mr-2">rocket_launch</span>
        Aceptar el Reto
      </button>
</div>
</div>
<div id="send-modal">
<div class="modal-content !bg-white !text-gray-800 !w-auto">
<span class="material-icons close-modal !text-gray-500" id="close-send-modal-btn">close</span>
<h2 class="text-2xl font-bold text-center mb-6">Enviar Valor a tu Red</h2>
<form class="space-y-6">
<div>
<label class="block text-sm font-medium text-gray-700 mb-1" for="destinatario">Destinatario</label>
<div class="relative">
<span class="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
<input class="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" id="destinatario" name="destinatario" placeholder="Busca por nombre o correo" type="text"/>
</div>
</div>
<div>
<label class="block text-sm font-medium text-gray-700 mb-1" for="importe">Importe</label>
<div class="flex">
<input class="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" id="importe" name="importe" placeholder="0.00" type="number"/>
<select class="rounded-r-md border-l-0 border-gray-300 bg-gray-50 text-gray-700 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" id="currency" name="currency">
<option>Ünits</option>
<option>Öndas</option>
<option>Méritos</option>
</select>
</div>
</div>
<div>
<label class="block text-sm font-medium text-gray-700 mb-1" for="memo">Memo</label>
<textarea class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" id="memo" name="memo" placeholder="Añade un mensaje (opcional)" rows="3"></textarea>
</div>
<button class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" type="submit">
          Enviar Ahora
        </button>
</form>
</div>
</div>
<div id="add-funds-modal">
<div class="modal-content !bg-gray-100 !text-gray-800 !w-auto">
<span class="material-icons close-modal !text-gray-500" id="close-add-funds-modal-btn">close</span>
<div class="text-center">
<h2 class="text-2xl font-bold mb-2">Añadir Fondos a tu Billetera</h2>
<p class="text-gray-600 mb-8">Elige un método para continuar.</p>
</div>
<div class="space-y-4">
<button class="w-full flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200">
<span class="material-icons-outlined text-2xl text-blue-600 mr-4">account_balance</span>
<div class="text-left">
<p class="font-semibold">Conectar con Banco Local</p>
<p class="text-sm text-gray-500">Transfiere fondos de forma segura desde tu cuenta bancaria.</p>
</div>
<span class="material-icons-outlined ml-auto text-gray-400">chevron_right</span>
</button>
<button class="w-full flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200">
<span class="material-icons-outlined text-2xl text-purple-600 mr-4">credit_card</span>
<div class="text-left">
<p class="font-semibold">Usar Tarjeta de Crédito</p>
<p class="text-sm text-gray-500">Añade fondos instantáneamente con tu tarjeta de crédito o débito.</p>
</div>
<span class="material-icons-outlined ml-auto text-gray-400">chevron_right</span>
</button>
</div>
<div class="mt-8 text-center text-sm text-gray-500">
<p>Función en desarrollo. Las opciones de conexión no están activas.</p>
</div>
</div>
</div>
<div id="create-challenge-modal">
<div class="modal-content">
<span class="material-icons close-modal" id="close-create-challenge-modal-btn">close</span>
<h2 class="text-2xl font-bold text-center mb-6 montserrat">Lanza un Nuevo Reto a la Coomünity</h2>
<form class="space-y-6">
<div>
<label class="block text-sm font-medium text-gray-700 mb-1" for="challenge-title">Nombre del Reto</label>
<input class="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm" id="challenge-title" name="challenge-title" type="text"/>
</div>
<div>
<label class="block text-sm font-medium text-gray-700 mb-1" for="challenge-description">Descripción detallada</label>
<textarea class="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm" id="challenge-description" name="challenge-description" rows="4"></textarea>
</div>
<div>
<label class="block text-sm font-medium text-gray-700 mb-1" for="challenge-reward">Recompensa (en Méritos y Öndas)</label>
<div class="grid grid-cols-2 gap-4">
<div class="relative">
<input class="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm pl-8" id="challenge-reward-meritos" name="challenge-reward-meritos" placeholder="Méritos" type="number"/>
<span class="material-icons absolute left-2 top-1/2 -translate-y-1/2 text-yellow-500 text-lg">military_tech</span>
</div>
<div class="relative">
<input class="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm pl-8" id="challenge-reward-ondas" name="challenge-reward-ondas" placeholder="Öndas" type="number"/>
<span class="material-icons absolute left-2 top-1/2 -translate-y-1/2 text-purple-500 text-lg">waves</span>
</div>
</div>
</div>
<div>
<label class="block text-sm font-medium text-gray-700 mb-1" for="challenge-deadline">Fecha de finalización</label>
<input class="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm" id="challenge-deadline" name="challenge-deadline" type="date"/>
</div>
<button class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500" type="submit">
          Lanzar Reto
        </button>
</form>
</div>
</div>
<div id="reciprocity-proposal-modal">
<div class="modal-content !w-auto">
<span class="material-icons close-modal" id="close-reciprocity-proposal-modal-btn">close</span>
<div class="flex-grow max-w-4xl mx-auto w-full">
<h2 class="text-3xl font-bold text-gray-800 mb-6 text-center montserrat">Propuesta de Ayni: Diseño de Logo</h2>
<div class="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
<h3 class="font-bold text-lg text-gray-700 mb-4">Solicitado por:</h3>
<div class="flex items-center">
<img alt="Avatar de Ana" class="w-12 h-12 rounded-full mr-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuACHLXa8Fcr6nM66bQJZNKms9tBR1lYNs5RqlAkUE8dugP1VH7EkHE9tg84gTaoo8MAFofjbp368CyJB84ZZMQ3NUh2C41oKhK1J54-4EPMRk0dT25KK7wT_VWj_3EWqOpp6q9deEinGsFmsh4YFlc3d5Jv8OZAHApO8x6cMr0F2TfvdceVcEiuSHocRzjN__ouo_rzOjDh1B-3Eyvl4eDvGoOwle-T6C_bJArr8TeMrMe76Uo-Y__DRJpOInekHpEilcr-81PN1x_4"/>
<div>
<p class="font-semibold text-xl text-gray-800">Ana Lopez</p>
<div class="flex items-center text-sm text-gray-500 mt-1">
<span class="material-icons-outlined text-yellow-500 mr-1 text-base">star</span>
<span>Puntaje de Reciprocidad: <strong>9.8</strong></span>
</div>
</div>
</div>
</div>
<div class="space-y-6">
<div>
<h3 class="font-bold text-lg text-gray-700 mb-2">Descripción de la Necesidad:</h3>
<p class="text-gray-600 leading-relaxed">¡Hola Coomünidad! Soy una emprendedora iniciando un proyecto de repostería artesanal y necesito un logo que capture la esencia de mi marca: calidez, sabor casero y un toque moderno. Busco a alguien con talento en diseño gráfico que pueda crear una identidad visual memorable para "Dulce Bocado". Me gustaría que el logo sea versátil para usar en empaques, redes sociales y mi futuro sitio web. ¡Estoy abierta a ideas creativas!</p>
</div>
<div>
<h3 class="font-bold text-lg text-gray-700 mb-2">Recompensa:</h3>
<div class="flex items-center space-x-2 text-purple-600 bg-purple-50 rounded-full py-2 px-4 w-fit">
<span class="material-icons">waves</span>
<span class="text-xl font-bold">500 Ünits</span>
</div>
</div>
</div>
</div>
<div class="mt-auto pt-6 border-t border-gray-200">
<button class="w-full max-w-md mx-auto flex justify-center py-4 px-4 border border-transparent rounded-full shadow-lg text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105" id="accept-exchange-btn">
          Aceptar Intercambio
        </button>
</div>
</div>
</div>
<script>
    const reciprocityCard = document.getElementById('reciprocity-card');
    const dataModal = document.getElementById('data-modal');
    const closeDataModalBtn = document.getElementById('close-data-modal-btn');
    const journeyCard = document.getElementById('journey-card');
    const journeyModal = document.getElementById('journey-modal');
    const closeJourneyModalBtn = document.getElementById('close-journey-modal-btn');
    const sendBtn = document.getElementById('send-btn');
    const sendModal = document.getElementById('send-modal');
    const closeSendModalBtn = document.getElementById('close-send-modal-btn');
    const addFundsBtn = document.getElementById('add-funds-btn');
    const addFundsModal = document.getElementById('add-funds-modal');
    const closeAddFundsModalBtn = document.getElementById('close-add-funds-modal-btn');
    const createChallengeBtn = document.getElementById('create-challenge-btn');
    const createChallengeModal = document.getElementById('create-challenge-modal');
    const closeCreateChallengeModalBtn = document.getElementById('close-create-challenge-modal-btn');
    const viewProposalBtn = document.getElementById('view-proposal-btn');
    const reciprocityProposalModal = document.getElementById('reciprocity-proposal-modal');
    const closeReciprocityProposalModalBtn = document.getElementById('close-reciprocity-proposal-modal-btn');
    const acceptExchangeBtn = document.getElementById('accept-exchange-btn');
    const toastMessage = document.getElementById('toast-message');
    if (reciprocityCard) {
      reciprocityCard.addEventListener('click', (e) => {
        e.preventDefault();
        dataModal.classList.add('active');
      });
    }
    if (closeDataModalBtn) {
      closeDataModalBtn.addEventListener('click', () => {
        dataModal.classList.remove('active');
      });
    }
    if (dataModal) {
      dataModal.addEventListener('click', (e) => {
        if (e.target === dataModal) {
          dataModal.classList.remove('active');
        }
      });
    }
    if (journeyCard) {
      journeyCard.addEventListener('click', (e) => {
        e.preventDefault();
        journeyModal.classList.add('active');
      });
    }
    if (closeJourneyModalBtn) {
      closeJourneyModalBtn.addEventListener('click', () => {
        journeyModal.classList.remove('active');
        closePlanetSidebar();
        closeChroniclePanel();
      });
    }
    if (journeyModal) {
      journeyModal.addEventListener('click', (e) => {
        if (e.target === journeyModal && !document.getElementById('planet-sidebar').contains(e.target) && !document.getElementById('chronicle-panel').contains(e.target)) {
          journeyModal.classList.remove('active');
          closePlanetSidebar();
          closeChroniclePanel();
        }
      });
    }
    if (sendBtn) {
      sendBtn.addEventListener('click', (e) => {
        e.preventDefault();
        sendModal.classList.add('active');
      });
    }
    if (closeSendModalBtn) {
      closeSendModalBtn.addEventListener('click', () => {
        sendModal.classList.remove('active');
      });
    }
    if (sendModal) {
      sendModal.addEventListener('click', (e) => {
        if (e.target === sendModal) {
          sendModal.classList.remove('active');
        }
      });
    }
    if (addFundsBtn) {
      addFundsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        addFundsModal.classList.add('active');
      });
    }
    if (closeAddFundsModalBtn) {
      closeAddFundsModalBtn.addEventListener('click', () => {
        addFundsModal.classList.remove('active');
      });
    }
    if (addFundsModal) {
      addFundsModal.addEventListener('click', (e) => {
        if (e.target === addFundsModal) {
          addFundsModal.classList.remove('active');
        }
      });
    }
    if (createChallengeBtn) {
      createChallengeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        createChallengeModal.classList.add('active');
      });
    }
    if (closeCreateChallengeModalBtn) {
      closeCreateChallengeModalBtn.addEventListener('click', () => {
        createChallengeModal.classList.remove('active');
      });
    }
    if (createChallengeModal) {
      createChallengeModal.addEventListener('click', (e) => {
        if (e.target === createChallengeModal) {
          createChallengeModal.classList.remove('active');
        }
      });
    }
    if (viewProposalBtn) {
      viewProposalBtn.addEventListener('click', (e) => {
        e.preventDefault();
        reciprocityProposalModal.classList.add('active');
      });
    }
    if (closeReciprocityProposalModalBtn) {
      closeReciprocityProposalModalBtn.addEventListener('click', () => {
        reciprocityProposalModal.classList.remove('active');
      });
    }
    if (reciprocityProposalModal) {
      reciprocityProposalModal.addEventListener('click', (e) => {
        if (e.target === reciprocityProposalModal) {
          reciprocityProposalModal.classList.remove('active');
        }
      });
    }
    function showVisualCue(element, content, colorClass) {
      if (!element) return;
      const existingCue = element.querySelector('.visual-cue');
      if (existingCue) {
        existingCue.remove();
      }
      const cue = document.createElement('span');
      cue.className = `visual-cue ${colorClass}`;
      cue.textContent = content;
      element.appendChild(cue);
      cue.addEventListener('animationend', () => {
        cue.remove();
      });
    }
    if (acceptExchangeBtn) {
      acceptExchangeBtn.addEventListener('click', () => {
        reciprocityProposalModal.classList.remove('active');
        toastMessage.textContent = '¡Intercambio aceptado! Los 500 Ünits están en resguardo hasta la finalización.';
        toastMessage.classList.add('show');
        setTimeout(() => {
          toastMessage.classList.remove('show');
        }, 5000);
        const journeyProgressBar = journeyCard.querySelector('.bg-green-500');
        if (journeyProgressBar) {
          journeyProgressBar.style.width = '100%';
        }
        const journeyProgressLabel = journeyProgressBar.parentElement.previousElementSibling.querySelector('span:last-child');
        if (journeyProgressLabel) {
          journeyProgressLabel.textContent = '1/1';
        }
        const overallProgress = journeyCard.querySelector('.bg-gradient-to-r');
        if (overallProgress) {
          overallProgress.style.width = "25%";
        }
        const notificationsList = document.getElementById('notifications-list');
        const newNotification = document.createElement('div');
        newNotification.className = 'flex items-start space-x-4 p-2 rounded-lg bg-yellow-50 border border-yellow-200';
        newNotification.innerHTML = `
                <div class="w-10 h-10 rounded-lg bg-yellow-400 flex items-center justify-center shrink-0">
                    <span class="material-icons text-white">emoji_events</span>
                </div>
                <div>
                    <p class="font-semibold text-gray-800">Nuevo Logro: Comerciante del Bien Común</p>
                    <p class="text-sm text-gray-600">Has completado tu primer intercambio. ¡Tu viaje avanza!</p>
                </div>
            `;
        notificationsList.prepend(newNotification);
        const unreadCountEl = document.querySelector('a.text-blue-600.font-medium');
        if (unreadCountEl) {
          let currentCount = parseInt(unreadCountEl.textContent.match(/\d+/)[0]);
          unreadCountEl.textContent = `${currentCount + 1} sin leer`;
        }
        const reciprocityLabel = document.getElementById('reciprocity-label');
        showVisualCue(reciprocityLabel, '+', 'text-[#3E8638]');
        const reciprocityScoreContainer = document.getElementById('reciprocity-score').parentElement;
        setTimeout(() => {
          showVisualCue(reciprocityScoreContainer, '+0.2', 'text-green-500');
          setTimeout(() => {
            const reciprocityScore = document.getElementById('reciprocity-score');
            reciprocityScore.textContent = (parseFloat(reciprocityScore.textContent) + 0.2).toFixed(1);
          }, 100);
        }, 300);
        const walletItems = document.getElementById('wallet-items');
        if (!document.getElementById('units-en-resguardo')) {
          const newWalletItem = document.createElement('div');
          newWalletItem.id = 'units-en-resguardo';
          newWalletItem.className = 'flex items-center';
          newWalletItem.innerHTML = `
                    <span class="material-icons text-2xl text-gray-400 mr-4">lock</span>
                    <span class="font-medium text-gray-800">Ünits en Resguardo</span>
                    <span class="ml-auto text-gray-800">500.00</span>
                `;
          walletItems.appendChild(newWalletItem);
        }
      });
    }
    const fullMoonChallenge = document.getElementById('full-moon-challenge');
    const eventModal = document.getElementById('event-modal');
    const closeEventModalBtn = document.getElementById('close-event-modal-btn');
    if (fullMoonChallenge) {
      fullMoonChallenge.addEventListener('click', (e) => {
        e.stopPropagation();
        eventModal.classList.add('active');
      });
    }
    if (closeEventModalBtn) {
      closeEventModalBtn.addEventListener('click', () => {
        eventModal.classList.remove('active');
      });
    }
    if (eventModal) {
      eventModal.addEventListener('click', (e) => {
        if (e.target === eventModal) {
          eventModal.classList.remove('active');
        }
      });
    }
    const planets = document.querySelectorAll('.planet');
    const planetSidebar = document.getElementById('planet-sidebar');
    const sidebarTitle = document.getElementById('sidebar-title');
    const sidebarContent = document.getElementById('sidebar-content');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');
    const planetData = {
      'Iniciación en Marketplace': {
        challenges: ['Realiza tu primera compra', 'Vende un artículo', 'Obtén 5 estrellas como vendedor'],
        courses: ['Curso: Fotografía de Producto', 'Curso: Marketing para Principiantes'],
        actions: ['Publicar un nuevo producto']
      },
      'Fundamentos de CoomÜnity': {
        challenges: ['Completa tu perfil al 100%', 'Invita a 3 amigos', 'Únete a un grupo de interés'],
        courses: [],
        actions: []
      },
    };
    function openPlanetSidebar(planetName) {
      const data = planetData[planetName] || {
        challenges: [],
        courses: [],
        actions: []
      };
      sidebarTitle.textContent = planetName;
      let contentHTML = '';
      if (data.challenges.length > 0) {
        contentHTML += '<h3 class="font-semibold text-lg mb-2 text-blue-300">Retos Específicos:</h3><ul class="list-disc list-inside space-y-1 mb-6">';
        data.challenges.forEach(challenge => {
          contentHTML += `<li>${challenge}</li>`;
        });
        contentHTML += '</ul>';
      }
      if (data.courses.length > 0) {
        contentHTML += '<h3 class="font-semibold text-lg mb-2 text-green-300">Cursos en ÜPlay:</h3><ul class="list-disc list-inside space-y-1 mb-6">';
        data.courses.forEach(course => {
          contentHTML += `<li><a href="#" class="hover:underline">${course}</a></li>`;
        });
        contentHTML += '</ul>';
      }
      if (data.actions.length > 0) {
        contentHTML += '<h3 class="font-semibold text-lg mb-2 text-yellow-300">Acciones Recomendadas:</h3>';
        data.actions.forEach(action => {
          contentHTML += `<button class="w-full mt-2 text-center bg-yellow-500 text-black font-medium py-2 rounded-lg hover:bg-yellow-400 transition-colors">${action}</button>`;
        });
      }
      if (!contentHTML) {
        contentHTML = '<p class="text-gray-400">¡Ya has conquistado este planeta! Sigue explorando la galaxia.</p>';
      }
      sidebarContent.innerHTML = contentHTML;
      planetSidebar.classList.remove('translate-x-full');
    }
    function closePlanetSidebar() {
      planetSidebar.classList.add('translate-x-full');
    }
    planets.forEach(planet => {
      planet.addEventListener('click', (e) => {
        e.stopPropagation();
        const planetName = planet.querySelector('.planet-label').textContent;
        openPlanetSidebar(planetName);
      });
    });
    if (closeSidebarBtn) {
      closeSidebarBtn.addEventListener('click', closePlanetSidebar);
    }
    const chronicleButton = document.getElementById('chronicle-button');
    const chroniclePanel = document.getElementById('chronicle-panel');
    const closeChronicleBtn = document.getElementById('close-chronicle-btn');
    function openChroniclePanel() {
      chroniclePanel.classList.add('active');
    }
    function closeChroniclePanel() {
      chroniclePanel.classList.remove('active');
    }
    if (chronicleButton) {
      chronicleButton.addEventListener('click', (e) => {
        e.stopPropagation();
        openChroniclePanel();
      });
    }
    if (closeChronicleBtn) {
      closeChronicleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeChroniclePanel();
      });
    }
    const connectionRequestItem = document.getElementById('connection-request-item');
    const expansionPanel = document.getElementById('connection-request-expansion');
    if (connectionRequestItem) {
      connectionRequestItem.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
          e.stopPropagation();
          expansionPanel.style.maxHeight = '0';
          expansionPanel.style.padding = '0';
          return;
        }
        const isExpanded = expansionPanel.style.maxHeight && expansionPanel.style.maxHeight !== '0px';
        if (isExpanded) {
          expansionPanel.style.maxHeight = '0';
          expansionPanel.style.padding = '0';
        } else {
          expansionPanel.style.maxHeight = expansionPanel.scrollHeight + 'px';
          expansionPanel.style.padding = '0';
        }
      });
    }
    document.addEventListener('DOMContentLoaded', () => {
      const tabs = document.querySelectorAll('#stats-tabs button');
      const contents = {
        global: document.getElementById('global-content'),
        network: document.getElementById('network-content'),
        circles: document.getElementById('circles-content')
      };
      let activeTab = 'global';
      let charts = {};
      const createGlobalChart = () => {
        const ctx = document.getElementById('reciprocityChart');
        if (ctx && !charts.global) {
          const labels = Array.from({
            length: 30
          }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (29 - i));
            return `${d.getDate()}/${d.getMonth() + 1}`;
          });
          const reciprocityData = Array.from({
            length: 30
          }, () => 80 + Math.random() * 20);
          const contributionData = Array.from({
            length: 30
          }, () => 200 + Math.random() * 300);
          charts.global = new Chart(ctx, {
            type: 'line',
            data: {
              labels: labels,
              datasets: [{
                label: 'Balance de Reciprocidad',
                data: reciprocityData,
                borderColor: '#3E8638',
                backgroundColor: 'rgba(62, 134, 56, 0.1)',
                fill: true,
                tension: 0.4
              }, {
                label: 'Aportes al Bien Común',
                data: contributionData,
                borderColor: '#5C2483',
                backgroundColor: 'rgba(92, 36, 131, 0.1)',
                fill: true,
                tension: 0.4
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false
            }
          });
        }
      };
      const createNetworkChart = () => {
        const ctx = document.getElementById('networkFlowChart');
        if (ctx && !charts.network) {
          const labels = Array.from({
            length: 30
          }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (29 - i));
            return `${d.getDate()}/${d.getMonth() + 1}`;
          });
          const sentData = Array.from({
            length: 30
          }, () => 50 + Math.random() * 100);
          const receivedData = Array.from({
            length: 30
          }, () => 50 + Math.random() * 100);
          charts.network = new Chart(ctx, {
            type: 'line',
            data: {
              labels: labels,
              datasets: [{
                label: 'Ünits Enviados',
                data: sentData,
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                fill: true,
                tension: 0.4
              }, {
                label: 'Ünits Recibidos',
                data: receivedData,
                borderColor: '#16a34a',
                backgroundColor: 'rgba(22, 163, 74, 0.1)',
                fill: true,
                tension: 0.4
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Volumen de Ünits'
                  }
                }
              }
            }
          });
        }
      };
      const switchTab = (tabName) => {
        if (activeTab === tabName) return;
        tabs.forEach(tab => {
          if (tab.dataset.tab === tabName) {
            tab.classList.remove('text-gray-600', 'hover:bg-gray-300');
            tab.classList.add('bg-white');
          } else {
            tab.classList.remove('bg-white');
            tab.classList.add('text-gray-600', 'hover:bg-gray-300');
          }
        });
        Object.values(contents).forEach(content => content.classList.add('hidden'));
        contents[tabName].classList.remove('hidden');
        activeTab = tabName;
        if (activeTab === 'global') {
          createGlobalChart();
        } else if (activeTab === 'network') {
          createNetworkChart();
        }
      };
      tabs.forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
      });
      // Initial setup
      tabs[0].classList.remove('text-gray-600', 'hover:bg-gray-300');
      tabs[0].classList.add('bg-white');
      contents['global'].classList.remove('hidden');
      createGlobalChart();
    });
  </script>

</body></html>