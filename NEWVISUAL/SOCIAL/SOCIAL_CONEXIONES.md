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
    #social-tabs .tab.active {
        border-bottom-color: #9333ea;
        color: #9333ea;
        font-weight: 600;
    }
    #social-tabs .tab {
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
<div class="col-span-12 space-y-8">
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
<div class="border-b border-gray-200" id="social-tabs">
<nav aria-label="Tabs" class="-mb-px flex space-x-8">
<button class="tab py-4 px-1 text-gray-500 hover:text-purple-600 hover:border-purple-600 whitespace-nowrap">
<span>Círculo Sagrado</span>
</button>
<button class="tab active py-4 px-1 text-gray-500 hover:text-purple-600 hover:border-purple-600 whitespace-nowrap">
<span>Conexiones Conscientes</span>
</button>
<button class="tab py-4 px-1 text-gray-500 hover:text-purple-600 hover:border-purple-600 whitespace-nowrap">
<span>Colaboración Creativa</span>
</button>
<button class="tab py-4 px-1 text-gray-500 hover:text-purple-600 hover:border-purple-600 whitespace-nowrap">
<span>Métricas de Reciprocidad</span>
</button>
</nav>
</div>
<div class="flex gap-8 mt-6">
<div class="w-[35%] bg-white rounded-lg shadow-md p-4 flex flex-col h-[calc(100vh-280px)]">
<div class="relative px-2 mb-4">
<input class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm" placeholder="Buscar conexiones..." type="search"/>
<div class="absolute inset-y-0 left-2 flex items-center pl-3 pointer-events-none">
<span class="material-icons text-gray-400">search</span>
</div>
</div>
<div class="flex-1 overflow-y-auto space-y-1">
<div class="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100">
<div class="relative">
<img alt="Avatar de Elara" class="w-10 h-10 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDui5SXA1l4p97Jaf_0rp4UvhTo_z7RqamsKzt1lY-D1aBcPiP_QJRhuBCfBdXMD7_4ndU_KNFdjkrJS6yjIAhlVUMb_VsvlkBo2LofB2Mnlr6qjjF3U4dg7KpOubFLCoVCTGiGKGB4LZ2NmALpSUo7RliEbnj9I9lyNr3xyZmct71O6eTqQkMh67z-KIyAlBl2H52meerNmWn254XpLnu79IqEwh6yzCUMjJ4sxZGmneVHI9K8UYjnOCjsgHudxL3Kr1UU_JggIaA"/>
<span class="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-yellow-400 ring-2 ring-white"></span>
</div>
<div class="ml-3 flex-1">
<p class="font-semibold text-gray-800 text-sm">Elara</p>
<p class="text-xs text-gray-500 truncate">¡Hola! ¿Cómo estás?</p>
</div>
</div>
<div class="flex items-center p-2 rounded-lg cursor-pointer bg-[#5C2483]/10">
<div class="relative">
<img alt="Avatar de Kael" class="w-10 h-10 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBex4T6bcfErCwycpy2ltIYqLZ68TcPlc02Nwvq78ofgEFuBA5jWaqMZdgBu5eqjl2yQ89uCvX8ChrBvcOh2M_dLBl0THLjGpHFlYpPJ2Caz9PRY1A9QX9mBA4cCtihXyAC_a-Cen-v5S37WNjIILW4p2fT_DeTjjw--Hopv8iTdpYXvHW52ZwbcJOUikzVegyHFnLYqPmNOWwgVmFZdv-m-C1fkZ22WKCpK9mM5h0UbeSIjWzRpsTQ_oG9w4Ea5kNa5KN9JiNU5H8"/>
<span class="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white"></span>
</div>
<div class="ml-3 flex-1">
<p class="font-semibold text-gray-800 text-sm">Kael</p>
<p class="text-xs text-gray-500 truncate">Perfecto, gracias.</p>
</div>
</div>
<div class="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100">
<div class="relative">
<img alt="Avatar de Lyra" class="h-10 w-10 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1h5eG3H-KstkLgMhDBT5qS4yD_5z7lOsF_s4w3j2f-E_E8G4Y6u8C9V2bJ4h8N7pQzW8xR6b-K7jT8f8G9x-V3gXoY-C-K7bT9g0g-I-J-L-A-S9s8O7p-R-V6w4z3"/>
<span class="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-gray-400 ring-2 ring-white"></span>
</div>
<div class="ml-3 flex-1">
<p class="font-semibold text-gray-800 text-sm">Lyra</p>
<p class="text-xs text-gray-500 truncate">Nos vemos en la minga.</p>
</div>
</div>
<div class="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100">
<div class="relative">
<img alt="Avatar" class="h-10 w-10 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfnlBxwwyX-QAq11oAfBylMSU190gDCvKkOVlIDi2nIRC_RMQhRagEBk1TgMQ0K8yVzNjKXMD0MO1LQF9ybKK4iam5WGvmFTXBGKWXRxFtDGJvIWh4p6YOvgWVmg9WRZAao5jjtcikFCwBe-wERQM4D9iXRHT_65fLw6ex0eMNs95oa8jJIiX4r057JViU1zMETyE8c40piWMIm9XyjhVwcksESv_8hW968GWV-NCJrO8gZLH_TjYmHV3gjkGkxdYCPN-W4H45oVI"/>
<span class="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-gray-400 ring-2 ring-white"></span>
</div>
<div class="ml-3 flex-1">
<p class="font-semibold text-gray-800 text-sm">Orion</p>
<p class="text-xs text-gray-500 truncate">Te envié los documentos.</p>
</div>
</div>
<div class="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100">
<div class="relative">
<img alt="Avatar" class="h-10 w-10 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuABdmk_qBgu9g7ow--uIVA6-FsdbWCCXHRyQcg2cYJ2iOCh6Xyp8MF5whjP4eMBzZMvFZNS5-MlefwP7_RAQSSDARc4PcJ81Uj6KlqxNErqJuD7Ozwb5TacSrUJpbIR50s43EesF-K5gDMZb0A2PxzqgVzYOl5cyER0C-ETaKXcnYkvW_69nrqjxmS6Yw85nOz-Kimltza0EfOVVyp1BfBG3KxBtcJiM1nkrgfVRbRoeiPChigV0CfXazla6FWocT-HMBHQ97YREGo"/>
<span class="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white"></span>
</div>
<div class="ml-3 flex-1">
<p class="font-semibold text-gray-800 text-sm">Seraphina</p>
<p class="text-xs text-gray-500 truncate">¡Me encantó la idea!</p>
</div>
</div>
<div class="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100">
<div class="relative">
<img alt="Avatar" class="h-10 w-10 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAh9hR1vVpKoTlWyaWFtqoGr1o5bQgRE2SL_7UQkDj3tQrZjSgwtcdrcvAhpbezFOv94KPw0mK7Z3C28wWU_W0p6PWQs-hBdBSMySjNTF54b7ZRE9811QvYLypGQhat1mUJ6v-VXxgb--k192kML9Zse7vPnKnCn3uGeBwkkYuMtXwqMpEmrGnAM08n84lpk8LODYfJsHanR_hCyXfUy9B2241LaZVAciqnM79DwIcBttVXwWCMToT5AvXnKTYHiy9rucXlvciYKzU"/>
<span class="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-yellow-400 ring-2 ring-white"></span>
</div>
<div class="ml-3 flex-1">
<p class="font-semibold text-gray-800 text-sm">Finn</p>
<p class="text-xs text-gray-500 truncate">Ya casi llego.</p>
</div>
</div>
</div>
</div>
<div class="w-[65%] bg-white rounded-lg shadow-md flex flex-col h-[calc(100vh-280px)]" id="SocialChatArea">
<div class="p-4 border-b border-gray-200 flex items-center space-x-4">
<div class="relative">
<img alt="Avatar de Kael" class="w-10 h-10 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBex4T6bcfErCwycpy2ltIYqLZ68TcPlc02Nwvq78ofgEFuBA5jWaqMZdgBu5eqjl2yQ89uCvX8ChrBvcOh2M_dLBl0THLjGpHFlYpPJ2Caz9PRY1A9QX9mBA4cCtihXyAC_a-Cen-v5S37WNjIILW4p2fT_DeTjjw--Hopv8iTdpYXvHW52ZwbcJOUikzVegyHFnLYqPmNOWwgVmFZdv-m-C1fkZ22WKCpK9mM5h0UbeSIjWzRpsTQ_oG9w4Ea5kNa5KN9JiNU5H8"/>
<span class="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white"></span>
</div>
<div>
<p class="font-semibold text-gray-800">Kael</p>
<p class="text-sm text-green-500">En línea</p>
</div>
</div>
<div class="flex-1 p-6 overflow-y-auto space-y-4">
<div class="flex justify-start">
<div class="bg-[#F3F4F6] text-gray-800 p-3 rounded-lg max-w-xs">
<p>¡Hola! Vi tu post sobre el rincón de meditación, ¡qué maravilla! ¿Me podrías dar más detalles de cómo llegar?</p>
</div>
</div>
<div class="flex justify-end">
<div class="bg-[#005CA9] text-white p-3 rounded-lg max-w-xs">
<p>¡Claro! Está en la esquina noroeste del Parque del Sol, justo detrás del sauce llorón. No tiene pierde. Es un lugar muy especial.</p>
<div class="flex justify-end items-center mt-1">
<span class="text-xs text-gray-300 mr-1">Entregado</span>
<span class="material-icons text-sm text-gray-300">done</span>
</div>
</div>
</div>
<div class="flex justify-start">
<div class="bg-[#F3F4F6] text-gray-800 p-3 rounded-lg max-w-xs">
<p>¡Genial! Mil gracias. Seguramente iré este fin de semana. Necesito un poco de esa paz que describes.</p>
</div>
</div>
<div class="flex justify-end">
<div class="bg-[#005CA9] text-white p-3 rounded-lg max-w-xs">
<p>Perfecto, me cuentas qué tal te parece.</p>
<div class="flex justify-end items-center mt-1">
<span class="text-xs text-blue-300 mr-1">Leído</span>
<span class="material-icons text-sm text-blue-300">done_all</span>
</div>
</div>
</div>
</div>
<div class="p-4 border-t border-gray-200">
<div class="relative">
<input class="w-full pl-4 pr-16 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Escribe tu mensaje..." type="text"/>
<button class="absolute right-2 top-1/2 -translate-y-1/2 bg-[#005CA9] text-white rounded-full p-3 hover:bg-blue-800">
<span class="material-icons">send</span>
</button>
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