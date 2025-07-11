<!DOCTYPE html>
<html lang="es"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>CoomÜnity Home</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Kollektif:wght@400&amp;family=Montserrat:wght@400;500;600;700&amp;family=Roboto:wght@400;500;700&amp;display=swap" rel="stylesheet"/>
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
        color: #FBBE24;font-size: 1.75rem;
        animation: sparkle-animation 1.5s infinite;
        filter: drop-shadow(0 0 3px #FBBF24);
      }
      @keyframes sparkle-animation {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.2) rotate(15deg); opacity: 0.8; }
      }
    .notification-expansion {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.5s ease-in-out, padding 0.5s ease-in-out;
    }
  </style>
</head>
<body class="flex">
<aside class="w-64 min-h-screen bg-white p-4 flex flex-col justify-between border-r border-gray-200">
<div>
<div class="text-2xl font-bold mb-8 ml-3">CoomÜnity</div>
<nav class="space-y-1">
<a class="sidebar-nav-item active" href="#">
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
<a class="sidebar-nav-item" href="#">
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
<section class="cosmic-card mb-8">
<div class="flex justify-between items-start mb-6">
<div>
<h2 class="section-title">Tu Propósito Hoy</h2>
<p class="text-gray-500 mt-1">Descubre cómo puedes crecer y contribuir hoy.</p>
</div>
<div class="flex items-center space-x-4">
<span class="material-icons-outlined text-gray-500 cursor-pointer">search</span>
<div class="relative">
<span class="material-icons-outlined text-gray-500 cursor-pointer">notifications</span>
<span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">2</span>
</div>
<span class="material-icons-outlined text-gray-500 cursor-pointer">apps</span>
</div>
</div>
<div class="flex items-center justify-between">
<div class="flex items-center space-x-4">
<svg class="w-10 h-10" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" style="color: #5C2483;" viewBox="0 0 24 24">
<path d="M12 2L9.8 8.2 3 10l5.8 4.2L7.6 22 12 18l4.4 4-1.2-7.8L21 10l-6.8-1.8L12 2z"></path>
</svg>
<div>
<h3 class="montserrat font-bold text-gray-800">Ayuda a Carlos con su mudanza</h3>
<p class="kollektif text-gray-500">Está a 500m de ti. ¡Un favor más para tu red!</p>
</div>
</div>
<button class="ghost-button">Ver Propuesta</button>
</div>
</section>
<section class="mb-6">
<h2 class="section-title mb-4">Módulos Principales</h2>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
<div class="cosmic-card module-card flex items-center order-1">
<span class="material-icons-outlined pin-icon">push_pin</span>
<span class="material-icons module-icon text-purple-500 text-4xl mr-4">group</span>
<div>
<h3 class="font-bold text-[#3C3C3B]">ÜSocial</h3>
<p class="card-subtitle">Conecta y crece con tu comunidad.</p>
</div>
</div>
<div class="cosmic-card module-card flex items-center order-2">
<span class="material-icons-outlined pin-icon">push_pin</span>
<span class="material-icons module-icon text-green-500 text-4xl mr-4">shopping_cart</span>
<div>
<h3 class="font-bold text-[#3C3C3B]">Marketplace</h3>
<p class="card-subtitle">Intercambia productos y servicios.</p>
</div>
</div>
<div class="cosmic-card module-card flex items-center order-3">
<span class="material-icons-outlined pin-icon">push_pin</span>
<span class="material-icons module-icon text-pink-500 text-4xl mr-4">play_circle_outline</span>
<div>
<h3 class="font-bold text-[#3C3C3B]">ÜPlay</h3>
<p class="card-subtitle">Centro de Entretenimiento Interactivo.</p>
</div>
</div>
<div class="cosmic-card module-card flex items-center order-4">
<span class="material-icons-outlined pin-icon">push_pin</span>
<span class="material-icons module-icon text-green-500 text-4xl mr-4">school</span>
<div>
<h3 class="font-bold text-[#3C3C3B]">LETS</h3>
<p class="card-subtitle">Aprende, enseña y comparte conocimiento.</p>
</div>
</div>
<div class="cosmic-card module-card flex items-center order-5">
<span class="material-icons-outlined pin-icon">push_pin</span>
<span class="material-icons module-icon text-purple-500 text-4xl mr-4">emoji_events</span>
<div>
<h3 class="font-bold text-[#3C3C3B]">Retos</h3>
<p class="card-subtitle">Supérate con desafíos personalizados.</p>
</div>
</div>
<div class="cosmic-card module-card flex items-center order-6">
<span class="material-icons-outlined pin-icon">push_pin</span>
<span class="material-icons module-icon text-blue-500 text-4xl mr-4">account_balance_wallet</span>
<div>
<h3 class="font-bold text-[#3C3C3B]">Billetera</h3>
<p class="card-subtitle">Gestiona tu patrimonio digital.</p>
</div>
</div>
</div>
</section>
<a class="cosmic-card cosmic-card-interactive mb-6 block no-underline text-current" href="#" id="reciprocity-card">
<h2 class="section-title mb-6">Balance de Reciprocidad Cósmico</h2>
<div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
<div class="flex flex-col items-center justify-center md:col-span-1">
<div class="relative w-40 h-40 radial-chart-glow transition-all duration-300">
<svg class="w-full h-full" viewBox="0 0 100 100">
<defs>
<linearGradient id="triketa-gradient" x1="0%" x2="100%" y1="0%" y2="100%">
<stop offset="0%" style="stop-color:#004134;stop-opacity:1"></stop>
<stop offset="100%" style="stop-color:#3E8638;stop-opacity:1"></stop>
</linearGradient>
</defs>
<circle class="text-gray-200" cx="50" cy="50" fill="transparent" r="45" stroke="currentColor" stroke-width="10"></circle>
<circle class="progress-ring__circle" cx="50" cy="50" fill="transparent" r="45" stroke="url(#triketa-gradient)" stroke-dasharray="282.743338823" stroke-dashoffset="0" stroke-width="10"></circle>
</svg>
<div class="absolute inset-0 flex flex-col items-center justify-center">
<span class="text-3xl font-bold text-gray-800" id="reciprocity-percentage">100%</span>
</div>
</div>
<p class="data-label mt-2 text-center font-medium relative" id="reciprocity-label">Balance de Reciprocidad</p>
</div>
<div class="grid grid-cols-2 gap-x-8 gap-y-6 md:col-span-2">
<div class="flex items-center space-x-4">
<span class="material-icons text-3xl text-gray-400">favorite_border</span>
<div class="relative">
<p class="text-2xl font-bold text-gray-800" id="reciprocity-score">10.0</p>
<p class="text-sm kollektif" style="color:#706F6F;">Puntaje Reciprocidad</p>
</div>
</div>
<div class="flex items-center space-x-4">
<span class="material-icons text-3xl text-gray-400">volunteer_activism</span>
<div>
<p class="text-2xl font-bold text-gray-800">118</p>
<p class="text-sm kollektif" style="color:#706F6F;">Aportes al Bien Común</p>
</div>
</div>
<div class="flex items-center space-x-4">
<span class="material-icons text-3xl text-gray-400">trending_up</span>
<div>
<p class="text-2xl font-bold text-green-500">5.08%</p>
<p class="text-sm kollektif" style="color:#706F6F;">Crecimiento Semanal</p>
</div>
</div>
<div class="flex items-center space-x-4">
<span class="material-icons text-3xl text-gray-400">swap_horiz</span>
<div>
<p class="text-2xl font-bold text-gray-800">205</p>
<p class="text-sm kollektif" style="color:#706F6F;">Transacciones</p>
</div>
</div>
</div>
</div>
</a>
<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
<div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
<div class="cosmic-card flex flex-col justify-between" id="billetera-card">
<div>
<div class="flex justify-between items-start mb-4">
<h2 class="section-title">Billetera</h2>
<span class="material-icons text-gray-400">more_horiz</span>
</div>
<div class="mb-6">
<p class="data-label">Balance Total:</p>
<p class="text-4xl data-metric" id="balance-total">$2,847.52</p>
</div>
<div class="space-y-4" id="wallet-items">
<div class="flex items-center">
<span class="material-icons text-2xl text-blue-500 mr-4">savings</span>
<span class="font-medium text-gray-800">Lükas</span>
<span class="ml-auto text-gray-800">L 1,250.00</span>
</div>
<div class="flex items-center">
<span class="material-icons text-2xl text-purple-500 mr-4">waves</span>
<span class="font-medium text-gray-800">Öndas</span>
<span class="ml-auto text-gray-800">Ö 890.00</span>
</div>
<div class="flex items-center">
<span class="material-icons text-2xl text-yellow-500 mr-4">military_tech</span>
<span class="font-medium text-gray-800">Méritos</span>
<span class="ml-auto text-gray-800">M 340.00</span>
</div>
</div>
</div>
<div class="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
<button class="flex items-center py-2 px-3 text-[#005CA9] font-semibold hover:bg-blue-50 transition-colors text-sm rounded-lg" id="add-funds-btn">
<span class="material-icons mr-2 text-base">add</span>
<span>Añadir</span>
</button>
<button class="flex items-center py-2 px-3 text-[#005CA9] font-semibold hover:bg-blue-50 transition-colors text-sm rounded-lg">
<span class="material-icons mr-2 text-base">swap_horiz</span>
<span>Cambiar</span>
</button>
<button class="flex items-center justify-center py-2 px-4 rounded-lg bg-[#005CA9] text-white font-semibold hover:bg-blue-800 transition-colors text-sm flex-grow ml-4" id="send-btn">
<span class="material-icons mr-2 text-base">send</span>
<span>Enviar</span>
</button>
</div>
</div>
<div class="flex flex-col">
<a class="cosmic-card cosmic-card-interactive flex flex-col no-underline text-current mb-6" href="#" id="journey-card">
<h2 class="section-title mb-4">Tu Viaje del Guardián</h2>
<div class="mb-4">
<div class="flex justify-between items-center text-sm font-medium text-gray-600 mb-1">
<span class="data-label">Progreso del Viaje</span>
</div>
<div class="w-full bg-gray-200 rounded-full h-2.5">
<div class="bg-gradient-to-r from-purple-400 to-purple-600 h-2.5 rounded-full" style="width: 25%"></div>
</div>
</div>
<div class="space-y-4">
<div>
<div class="flex justify-between items-center text-sm font-medium text-gray-600 mb-1">
<span class="data-label">Primer Intercambio de Valor</span>
<span class="data-label">1/1</span>
</div>
<div class="w-full bg-gray-200 rounded-full h-2.5">
<div class="bg-green-500 h-2.5 rounded-full" style="width: 100%; transition: width 0.5s ease-in-out;"></div>
</div>
</div>
<div>
<div class="flex justify-between items-center text-sm font-medium text-gray-600 mb-1">
<span class="data-label">Completar 5 Retos</span>
<span class="data-label">0/5</span>
</div>
<div class="w-full bg-gray-200 rounded-full h-2.5">
<div class="bg-blue-500 h-2.5 rounded-full" style="width: 0%"></div>
</div>
</div>
<div>
<div class="flex justify-between items-center text-sm font-medium text-gray-600 mb-1">
<span class="data-label">Alcanzar 10 Conexiones</span>
<span class="data-label">3/10</span>
</div>
<div class="w-full bg-gray-200 rounded-full h-2.5">
<div class="bg-pink-500 h-2.5 rounded-full" style="width: 30%"></div>
</div>
</div>
</div>
<div class="mt-auto pt-4">
<div class="w-full py-2 border border-purple-500 rounded-lg text-gray-800 font-medium text-center hover:bg-purple-500 hover:text-white transition-colors duration-300">Ver Journey Completo</div>
</div>
</a>
<section class="lg:col-span-2 cosmic-card">
<div class="flex flex-wrap justify-between items-center mb-4 gap-4">
<h2 class="section-title">Oportunidades de Reciprocidad en tu Comunidad</h2>
<div class="relative">
<select class="pl-4 pr-8 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
<option>Todas las categorías</option>
<option>Diseño</option>
<option>Ayuda Física</option>
<option>Mentoría</option>
<option>Desarrollo</option>
</select>
</div>
</div>
<div class="flex overflow-x-auto space-x-4 pb-4">
<div class="cosmic-card flex-shrink-0 w-[300px] flex flex-col border border-yellow-200 shadow-sm relative bg-yellow-50">
<span class="material-icons suggestion-sparkle">auto_awesome</span>
<h3 class="font-bold text-gray-800 mb-2">Necesito ayuda con diseño de logo</h3>
<div class="flex items-center mb-4">
<img alt="Avatar de Ana" class="w-8 h-8 rounded-full mr-2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuACHLXa8Fcr6nM66bQJZNKms9tBR1lYNs5RqlAkUE8dugP1VH7EkHE9tg84gTaoo8MAFofjbp368CyJB84ZZMQ3NUh2C41oKhK1J54-4EPMRk0dT25KK7wT_VWj_3EWqOpp6q9deEinGsFmsh4YFlc3d5Jv8OZAHApO8x6cMr0F2TfvdceVcEiuSHocRzjN__ouo_rzOjDh1B-3Eyvl4eDvGoOwle-T6C_bJArr8TeMrMe76Uo-Y__DRJpOInekHpEilcr-81PN1x_4"/>
<span class="text-sm text-gray-600">Ana Lopez</span>
</div>
<div class="mb-4">
<span class="text-sm font-semibold text-purple-600">Recompensa:</span>
<p class="text-lg font-bold text-gray-800">500 Ünits</p>
</div>
<div class="mt-auto flex space-x-2">
<button class="flex-1 py-2 px-4 rounded-lg bg-[#005CA9] text-white font-semibold hover:bg-blue-800 transition-colors text-sm" id="view-proposal-btn">Ver Propuesta</button>
<button class="flex-1 py-2 px-4 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors text-sm">Iniciar Conversación</button>
</div>
</div>
<div class="cosmic-card flex-shrink-0 w-[300px] flex flex-col border border-gray-100 shadow-sm">
<h3 class="font-bold text-gray-800 mb-2">Clases de guitarra para principiantes</h3>
<div class="flex items-center mb-4">
<img alt="Avatar de Carlos" class="w-8 h-8 rounded-full mr-2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdOPiP_A8MiOyWl92fBso1M6v2kzGyyHTJUXexr_TVbjNmhptxWRfOkqtw0s7ywlXzDOU9uTooGNTxCKoFmTflrZhKoPoT680eSXunLM9xCEhYHbxNhMCvOCkNn9eLQygN_1luXwW67Ud1ybCCWaMYYLRQAb8hv1odAngktSIEYijg-EVT8Gbe8f-DK9WbEp0zd13RJV_blUIg860N2j2uQHNeVgt1nIkyDmUKviJzMJ46_YAob4-QKg-l099gnI4r8GWenGFfa4hH"/>
<span class="text-sm text-gray-600">Carlos Pérez</span>
</div>
<div class="mb-4">
<span class="text-sm font-semibold text-green-600">Recompensa:</span>
<p class="text-lg font-bold text-gray-800">1 Favor (clase de cocina)</p>
</div>
<div class="mt-auto flex space-x-2">
<button class="flex-1 py-2 px-4 rounded-lg bg-[#005CA9] text-white font-semibold hover:bg-blue-800 transition-colors text-sm">Ver Propuesta</button>
<button class="flex-1 py-2 px-4 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors text-sm">Iniciar Conversación</button>
</div>
</div>
<div class="cosmic-card flex-shrink-0 w-[300px] flex flex-col border border-gray-100 shadow-sm">
<h3 class="font-bold text-gray-800 mb-2">Busco ayuda para cuidar mi jardín</h3>
<div class="flex items-center mb-4">
<img alt="Avatar de Sofia" class="w-8 h-8 rounded-full mr-2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkqeYDEY0R_yA8slyobEvA3nbunNPheuLd15so8GTSRXEDkLmlPRmvhoEPg2SMhCIVSZb51QBnAc8S4eyX5QcDAd6fBk39o9LevMzT3yxI2yCUnMh9o9-WNC4nyzJT-4mP7W7lw9XCy4xu8efnlGUQs1EjQHgR2G_Qde9fThSU6focezH_TA-feaP1Ibb4nyhnDVziShGT_SDqzK_zF3V0cE2iEzEJQtVArHOxJm1ka7CELD3asVzEyW7JMqRRh_nCBDCyclK0XlcX"/>
<span class="text-sm text-gray-600">Sofia Rodriguez</span>
</div>
<div class="mb-4">
<span class="text-sm font-semibold text-purple-600">Recompensa:</span>
<p class="text-lg font-bold text-gray-800">250 Ünits</p>
</div>
<div class="mt-auto flex space-x-2">
<button class="flex-1 py-2 px-4 rounded-lg bg-[#005CA9] text-white font-semibold hover:bg-blue-800 transition-colors text-sm">Ver Propuesta</button>
<button class="flex-1 py-2 px-4 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors text-sm">Iniciar Conversación</button>
</div>
</div>
</div>
<div class="mt-6 flex justify-center">
<button class="ghost-button">Ver Más Oportunidades</button>
</div>
</section>
</div>
</div>
<div class="space-y-6 lg:col-span-1">
<div class="cosmic-card">
<h2 class="section-title mb-4">Acciones Rápidas</h2>
<div class="flex flex-wrap gap-3">
<button class="quick-action-pill" id="create-challenge-btn">
<span class="material-icons text-pink-500">add</span>
<span class="text-sm font-medium">Crear Reto</span>
</button>
<a class="quick-action-pill" href="#">
<span class="material-icons text-green-500">emoji_events</span>
<span class="text-sm font-medium">Unirse a Reto</span>
</a>
<a class="quick-action-pill" href="#">
<span class="material-icons text-purple-500">school</span>
<span class="text-sm font-medium">Aprender</span>
</a>
<a class="quick-action-pill" href="#">
<span class="material-icons text-blue-500">group_add</span>
<span class="text-sm font-medium">Invitar</span>
</a>
<a class="quick-action-pill" href="#">
<span class="material-icons text-indigo-500">storefront</span>
<span class="text-sm font-medium">Comprar</span>
</a>
</div>
</div>
<div class="cosmic-card">
<div class="flex justify-between items-center mb-4">
<h2 class="section-title">Notificaciones</h2>
<a class="text-sm text-blue-600 font-medium" href="#">4 sin leer</a>
</div>
<div class="space-y-4" id="notifications-list">
<div class="flex items-start space-x-4 p-2 rounded-lg bg-yellow-50 border border-yellow-200">
<div class="w-10 h-10 rounded-lg bg-yellow-400 flex items-center justify-center shrink-0">
<span class="material-icons text-white">emoji_events</span>
</div>
<div>
<p class="font-semibold text-gray-800">Nuevo Logro: Comerciante del Bien Común</p>
<p class="text-sm text-gray-600">Has completado tu primer intercambio. ¡Tu viaje avanza!</p>
</div>
</div>
<div class="flex items-center space-x-4">
<div class="w-10 h-10 rounded-lg bg-yellow-400 flex items-center justify-center">
<span class="material-icons text-white">emoji_events</span>
</div>
<div>
<p class="text-gray-800">Nuevo Logro: Maestro del Agua <span class="text-gray-500 text-sm">1h</span></p>
</div>
</div>
<div class="cursor-pointer" id="connection-request-item">
<div class="flex items-center space-x-4">
<div class="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
<span class="material-icons text-white">person_add</span>
</div>
<div>
<p class="text-gray-800">María Elena quiere conectar contigo <span class="text-gray-500 text-sm">15m</span></p>
</div>
</div>
<div class="notification-expansion p-0 mt-2" id="connection-request-expansion">
<div class="bg-gray-100 rounded-lg p-4">
<div class="flex items-center mb-4">
<img alt="Avatar de María Elena" class="w-12 h-12 rounded-full mr-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoGOkMJbVl7WEJfLiUwNJV-J60_kqtQPE_XisU9HJsAUzMRIs5glFEe5EqAfPl1N7HIMKglQ_lyLHDhQnrqnN4pZv3eVHgfDrACJhoKJGZpT1jR-Dt5Og2RvuU3H5SrheKymcHiLCINnSB2HsNp3T9OsggvTWYbSSi7szt-FJXn0P1xpVx4dZfzqxomPR2XbgFJVrBUq-M2RylK0jYpyNX7kn9Tuhj4lgmHQZB6i6xR8TKLIrs9MMliIWhkvupIKSKVRbijtOk_K_s"/>
<div>
<p class="font-semibold text-lg text-gray-800">María Elena</p>
<div class="flex items-center text-sm text-gray-500 mt-1">
<span class="material-icons-outlined text-yellow-500 mr-1 text-base">star</span>
<span>Puntaje de Reciprocidad: <strong>8.9</strong></span>
</div>
</div>
</div>
<div class="flex justify-end space-x-3">
<button class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">Ahora no</button>
<button class="px-4 py-2 text-sm font-medium text-white rounded-lg" style="background-color: #3E8638;">Aceptar Conexión</button>
</div>
</div>
</div>
</div>
<div class="flex items-center space-x-4">
<div class="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
<span class="material-icons text-white">account_balance_wallet</span>
</div>
<div>
<p class="text-gray-800">+250 Öndas recibidas <span class="text-gray-500 text-sm">30m</span></p>
</div>
</div>
<div class="flex items-center space-x-4">
<div class="w-10 h-10 rounded-lg bg-pink-500 flex items-center justify-center">
<span class="material-icons text-white">sell</span>
</div>
<div>
<p class="text-gray-800">¡Oferta Especial en cursos! <span class="text-gray-500 text-sm">1h</span></p>
</div>
</div>
</div>
<button class="w-full mt-6 text-center text-blue-600 font-medium py-2 rounded-lg hover:bg-blue-50">Ver Todas</button>
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
    reciprocityCard.addEventListener('click', (e) => {
      e.preventDefault();
      dataModal.classList.add('active');
    });
    closeDataModalBtn.addEventListener('click', () => {
      dataModal.classList.remove('active');
    });
    dataModal.addEventListener('click', (e) => {
      if (e.target === dataModal) {
        dataModal.classList.remove('active');
      }
    });
    journeyCard.addEventListener('click', (e) => {
      e.preventDefault();
      journeyModal.classList.add('active');
    });
    closeJourneyModalBtn.addEventListener('click', () => {
      journeyModal.classList.remove('active');
      closePlanetSidebar();
      closeChroniclePanel();
    });
    journeyModal.addEventListener('click', (e) => {
      if (e.target === journeyModal && !document.getElementById('planet-sidebar').contains(e.target) && !document.getElementById('chronicle-panel').contains(e.target)) {
        journeyModal.classList.remove('active');
        closePlanetSidebar();
        closeChroniclePanel();
      }
    });
    sendBtn.addEventListener('click', (e) => {
      e.preventDefault();
      sendModal.classList.add('active');
    });
    closeSendModalBtn.addEventListener('click', () => {
      sendModal.classList.remove('active');
    });
    sendModal.addEventListener('click', (e) => {
      if (e.target === sendModal) {
        sendModal.classList.remove('active');
      }
    });
    addFundsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      addFundsModal.classList.add('active');
    });
    closeAddFundsModalBtn.addEventListener('click', () => {
      addFundsModal.classList.remove('active');
    });
    addFundsModal.addEventListener('click', (e) => {
      if (e.target === addFundsModal) {
        addFundsModal.classList.remove('active');
      }
    });
    createChallengeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      createChallengeModal.classList.add('active');
    });
    closeCreateChallengeModalBtn.addEventListener('click', () => {
      createChallengeModal.classList.remove('active');
    });
    createChallengeModal.addEventListener('click', (e) => {
      if (e.target === createChallengeModal) {
        createChallengeModal.classList.remove('active');
      }
    });
    viewProposalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      reciprocityProposalModal.classList.add('active');
    });
    closeReciprocityProposalModalBtn.addEventListener('click', () => {
      reciprocityProposalModal.classList.remove('active');
    });
    reciprocityProposalModal.addEventListener('click', (e) => {
      if (e.target === reciprocityProposalModal) {
        reciprocityProposalModal.classList.remove('active');
      }
    });
    function showVisualCue(element, content, colorClass) {
      // Remove any existing cue
      const existingCue = element.querySelector('.visual-cue');
      if (existingCue) {
        existingCue.remove();
      }
      const cue = document.createElement('span');
      cue.className = `visual-cue ${colorClass}`;
      cue.textContent = content;
      element.appendChild(cue);
      // Clean up after animation
      cue.addEventListener('animationend', () => {
        cue.remove();
      });
    }
    acceptExchangeBtn.addEventListener('click', () => {
      // Close modal
      reciprocityProposalModal.classList.remove('active');
      // Show toast
      toastMessage.textContent = '¡Intercambio aceptado! Los 500 Ünits están en resguardo hasta la finalización.';
      toastMessage.classList.add('show');
      setTimeout(() => {
        toastMessage.classList.remove('show');
      }, 5000);
      // --- START EDIT ---
      // Update Journey Card
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
      // Add Notification
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
      // Update notification count
      const unreadCountEl = document.querySelector('a.text-blue-600.font-medium');
      if (unreadCountEl) {
        let currentCount = parseInt(unreadCountEl.textContent.match(/\d+/)[0]);
        unreadCountEl.textContent = `${currentCount + 1} sin leer`;
      }
      // Animate Reciprocity Card
      const reciprocityLabel = document.getElementById('reciprocity-label');
      showVisualCue(reciprocityLabel, '+', 'text-[#3E8638]');
      const reciprocityScoreContainer = document.getElementById('reciprocity-score').parentElement;
      setTimeout(() => {
        showVisualCue(reciprocityScoreContainer, '+0.2', 'text-green-500');
        // Update score after a slight delay for better visual effect
        setTimeout(() => {
          const reciprocityScore = document.getElementById('reciprocity-score');
          reciprocityScore.textContent = (parseFloat(reciprocityScore.textContent) + 0.2).toFixed(1);
        }, 100);
      }, 300); // Stagger the second animation
      // --- END EDIT ---
      // Update Billetera card (Original Logic)
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
    // Event Modal Logic
    const fullMoonChallenge = document.getElementById('full-moon-challenge');
    const eventModal = document.getElementById('event-modal');
    const closeEventModalBtn = document.getElementById('close-event-modal-btn');
    fullMoonChallenge.addEventListener('click', (e) => {
      e.stopPropagation();
      eventModal.classList.add('active');
    });
    closeEventModalBtn.addEventListener('click', () => {
      eventModal.classList.remove('active');
    });
    eventModal.addEventListener('click', (e) => {
      if (e.target === eventModal) {
        eventModal.classList.remove('active');
      }
    });
    // Planet Interaction Logic
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
      // ... add data for other planets
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
    closeSidebarBtn.addEventListener('click', closePlanetSidebar);
    // Chronicle Panel Logic
    const chronicleButton = document.getElementById('chronicle-button');
    const chroniclePanel = document.getElementById('chronicle-panel');
    const closeChronicleBtn = document.getElementById('close-chronicle-btn');
    function openChroniclePanel() {
      chroniclePanel.classList.add('active');
    }
    function closeChroniclePanel() {
      chroniclePanel.classList.remove('active');
    }
    chronicleButton.addEventListener('click', (e) => {
      e.stopPropagation();
      openChroniclePanel();
    });
    closeChronicleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeChroniclePanel();
    });
    // Connection Request Logic
    const connectionRequestItem = document.getElementById('connection-request-item');
    const expansionPanel = document.getElementById('connection-request-expansion');
    connectionRequestItem.addEventListener('click', (e) => {
        // Stop propagation if clicking on buttons
        if(e.target.tagName === 'BUTTON') {
            e.stopPropagation();
            // Handle button clicks here if needed, or let them bubble up to their own listeners
             expansionPanel.style.maxHeight = '0';
             expansionPanel.style.padding = '0';
            return;
        }
        const isExpanded = expansionPanel.style.maxHeight && expansionPanel.style.maxHeight !== '0px';
        if(isExpanded) {
            expansionPanel.style.maxHeight = '0';
            expansionPanel.style.padding = '0';
        } else {
            // scrollHeight gives the height of the content, even if it's not visible.
            expansionPanel.style.maxHeight = expansionPanel.scrollHeight + 'px';
            expansionPanel.style.padding = '0'; // The inner container has padding
        }
    });
  </script>

</body></html>