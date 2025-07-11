<!DOCTYPE html>
<html lang="es"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>CoomÜnity LETS</title>
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
<style>
        body {
            font-family: 'Inter', sans-serif;
        }
        .main-content {
            background-color: #F9FAFB;
        }
        .sidebar {
            background-color: #FFFFFF;
        }
        .active-link {
            background-color: #F3E8FF;
            color: #5C2483;
            font-weight: 600;
        }
    </style>
</head>
<body class="bg-gray-100">
<div class="flex h-screen">
<aside class="sidebar w-64 flex flex-col justify-between p-4 border-r">
<div>
<h1 class="text-2xl font-bold mb-8">CoomÜnity</h1>
<nav class="space-y-2">
<a class="flex items-center p-2 rounded-lg hover:bg-gray-100" href="#">
<span class="material-icons mr-3">home</span> Inicio
                    </a>
<a class="flex items-center p-2 rounded-lg hover:bg-gray-100" href="#">
<span class="material-icons mr-3">storefront</span> Marketplace
                    </a>
<a class="flex items-center p-2 rounded-lg active-link" href="#">
<span class="material-icons mr-3">swap_horiz</span> LETS
                    </a>
<a class="flex items-center p-2 rounded-lg hover:bg-gray-100" href="#">
<span class="material-icons mr-3">play_circle_outline</span> UPlay
                    </a>
<a class="flex items-center p-2 rounded-lg hover:bg-gray-100" href="#">
<span class="material-icons mr-3">people_alt</span> USocial
                    </a>
<a class="flex items-center p-2 rounded-lg hover:bg-gray-100" href="#">
<span class="material-icons mr-3">emoji_events</span> Retos
                    </a>
<a class="flex items-center p-2 rounded-lg hover:bg-gray-100" href="#">
<span class="material-icons mr-3">account_balance_wallet</span> Billetera
                    </a>
<a class="flex items-center p-2 rounded-lg hover:bg-gray-100" href="#">
<span class="material-icons mr-3">bar_chart</span> Estadísticas
                    </a>
</nav>
</div>
<div class="space-y-4">
<a class="flex items-center space-x-3 p-2 rounded-lg" href="#">
<img alt="Admin user avatar" class="w-8 h-8 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2cWf0d0_WOcLdTcOj17ksjMt17b6fLdzVjNPMs6n3DF8PxmNp76SATRhFy0hQL9QVm1nfb7eTAWfpUZukraRWmZBRtOXJ19NYz73_0oh659aVBwoYJGI5O7yesN6aU9ntraLeDAsOvfQA_5bdAE5xK42PRMEZBpFIDobsQEnxLEXmTMsDOpg32jdIumv-OtlCwocFtEpHE4iZZZrkN7fJu5r6-g4OyLMsjCthiiKePqTWzX88HtSxkDPxVYlu8g8stPg-CaOVPvs"/>
<div>
<p class="font-semibold text-sm">Admin</p>
<p class="text-xs text-gray-500">admin@gomiller.com</p>
</div>
<span class="material-icons text-gray-400">chevron_right</span>
</a>
<a class="flex items-center p-2 rounded-lg hover:bg-gray-100" href="#">
<span class="material-icons mr-3">settings</span> Configuración
                </a>
<a class="flex items-center p-2 rounded-lg hover:bg-gray-100" href="#">
<span class="material-icons mr-3">help_outline</span> Ayuda
                </a>
<p class="text-xs text-gray-400">v18.0 - Claridad Organica</p>
</div>
</aside>
<main class="main-content flex-1 p-8 overflow-y-auto">
<header class="mb-8">
<h1 class="text-4xl font-bold text-gray-800">Sistema de Intercambio Local (LETS)</h1>
<p class="text-gray-500">Aquí tu tiempo y tus habilidades son la moneda más valiosa</p>
</header>
<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
<div class="bg-white p-6 rounded-xl shadow-sm border">
<div class="flex items-center mb-2">
<span class="material-icons text-gray-700 mr-2">watch_later</span>
<h2 class="text-lg font-semibold text-gray-700">Mi Balance de Tiempo</h2>
</div>
<p class="text-5xl font-bold text-gray-900 mb-4">4h Netas</p>
<div class="flex justify-between text-sm">
<div>
<p class="text-gray-500">Dados</p>
<p class="font-bold text-green-600 text-lg">150</p>
</div>
<div>
<p class="text-gray-500">Recibidos</p>
<p class="font-bold text-red-600 text-lg">30</p>
</div>
</div>
</div>
<div class="bg-white p-6 rounded-xl shadow-sm border">
<div class="flex items-center mb-2">
<span class="material-icons text-gray-700 mr-2">favorite</span>
<h2 class="text-lg font-semibold text-gray-700">Mis Favores</h2>
</div>
<p class="text-5xl font-bold text-gray-900 mb-4">12</p>
<div class="flex justify-between text-sm">
<div>
<p class="text-gray-500">Ofrecidos</p>
<p class="font-bold text-blue-600 text-lg">8</p>
</div>
<div>
<p class="text-gray-500">Recibidos</p>
<p class="font-bold text-purple-600 text-lg">4</p>
</div>
</div>
</div>
<div class="bg-white p-6 rounded-xl shadow-sm border">
<div class="flex items-center mb-2">
<span class="material-icons text-gray-700 mr-2">lightbulb</span>
<h2 class="text-lg font-semibold text-gray-700">Propuestas Activas</h2>
</div>
<p class="text-5xl font-bold text-gray-900 mb-4">5</p>
<div class="flex justify-between text-sm">
<div>
<p class="text-gray-500">Ofertas</p>
<p class="font-bold text-gray-800 text-lg">3</p>
</div>
<div>
<p class="text-gray-500">Solicitudes</p>
<p class="font-bold text-gray-800 text-lg">2</p>
</div>
</div>
</div>
</div>
<div class="flex justify-between items-center mb-6">
<div class="relative flex-grow">
<span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
<input class="pl-10 pr-4 py-2 border rounded-lg w-full max-w-md" placeholder="Buscar por palabra clave" type="text"/>
</div>
<div class="flex items-center space-x-4">
<select class="border rounded-lg px-4 py-2">
<option>Todas las Categorías</option>
</select>
</div>
</div>
<div class="flex justify-between items-center mb-6 border-b">
<div class="flex space-x-8">
<button class="py-3 border-b-2 border-purple-600 font-semibold text-purple-600">Ofertas de la CoomÜnity</button>
<button class="py-3 text-gray-500 hover:text-gray-700">Solicitudes de Ayuda</button>
</div>
<button class="bg-[#5C2483] text-white px-6 py-2 rounded-lg font-semibold flex items-center space-x-2 hover:bg-purple-700" id="openModalBtn">
<span class="material-icons">add</span>
<span>Crear Nueva Propuesta</span>
</button>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
<div class="bg-white rounded-xl shadow-sm border p-6">
<div class="flex items-center mb-4">
<img alt="Avatar of Carlos Roca" class="w-12 h-12 rounded-full mr-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAONkIuI3VcRzdxGtH7VO5SE25RH2ckCHWfCRd5Ood-zdBueWLiDPwtBCCtRdGzkNy80KELAxrF_LUDxGm4rHOIHO4H9D7BF7uo3fUXKJi29ls74qtfHuJ8m6RfdfzIQZaygUisU4MXE_LWGt3gKIS4exOJBT5u1dHzbcjipyoR2FQWueYpyhhBRO71JPqptHtyyj1s67rG2B7144eAKP0FTlUVoZVC9u-iXfbOFR7KwVkEwzcuiO78PEKv5He9zRIVd0hkP97jt58"/>
<div>
<p class="font-bold">Carlos Roca</p>
<p class="text-sm text-gray-500">Ofrece:</p>
</div>
</div>
<p class="text-lg font-semibold mb-4">1 hora de Asesoría en Finanzas</p>
<div class="flex justify-center my-4">
<span class="material-icons text-purple-600 text-3xl">swap_horiz</span>
</div>
<div class="bg-gray-50 p-4 rounded-lg">
<p class="text-sm text-gray-500">A cambio de:</p>
<p class="font-semibold">2 horas de Jardinería</p>
</div>
</div>
<div class="bg-white rounded-xl shadow-sm border p-6">
<div class="flex items-center mb-4">
<img alt="Avatar of Sofía Marín" class="w-12 h-12 rounded-full mr-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAONkIuI3VcRzdxGtH7VO5SE25RH2ckCHWfCRd5Ood-zdBueWLiDPwtBCCtRdGzkNy80KELAxrF_LUDxGm4rHOIHO4H9D7BF7uo3fUXKJi29ls74qtfHuJ8m6RfdfzIQZaygUisU4MXE_LWGt3gKIS4exOJBT5u1dHzbcjipyoR2FQWueYpyhhBRO71JPqptHtyyj1s67rG2B7144eAKP0FTlUVoZVC9u-iXfbOFR7KwVkEwzcuiO78PEKv5He9zRIVd0hkP97jt58"/>
<div>
<p class="font-bold">Sofía Marín</p>
<p class="text-sm text-gray-500">Ofrece:</p>
</div>
</div>
<p class="text-lg font-semibold mb-4">Clases de Guitarra (principiante)</p>
<div class="flex justify-center my-4">
<span class="material-icons text-purple-600 text-3xl">swap_horiz</span>
</div>
<div class="bg-gray-50 p-4 rounded-lg">
<p class="text-sm text-gray-500">A cambio de:</p>
<p class="font-semibold">Reparación de bicicleta</p>
</div>
</div>
</div>
</main>
</div>
<div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 hidden" id="proposalModal">
<div class="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-8 m-4 max-h-screen overflow-y-auto relative">
<button class="absolute top-4 right-4 text-gray-500 hover:text-gray-800" id="closeModalBtn">
<span class="material-icons">close</span>
</button>
<div class="text-center mb-8">
<h2 class="text-3xl font-bold text-gray-800">Comparte tu Valor con la CoomÜnity</h2>
<p class="text-gray-500 mt-2">Define qué ofreces y qué tipo de reciprocidad buscas a cambio.</p>
</div>
<form>
<div class="mb-8">
<h3 class="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Lo que yo ofrezco:</h3>
<div class="space-y-6">
<div>
<label class="block text-sm font-medium text-gray-700 mb-1" for="offerTitle">Título de la Oferta</label>
<input class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500" id="offerTitle" name="offerTitle" placeholder="Ej: 1 Hora de Clase de Cocina Italiana" type="text"/>
</div>
<div>
<label class="block text-sm font-medium text-gray-700 mb-1" for="category">Categoría</label>
<select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 bg-white" id="category" name="category">
<option>Asesoría</option>
<option>Habilidades Manuales</option>
<option>Bienestar</option>
<option>Clases y Tutorías</option>
<option>Tecnología</option>
</select>
</div>
<div>
<label class="block text-sm font-medium text-gray-700 mb-1" for="description">Descripción Detallada</label>
<textarea class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500" id="description" name="description" placeholder="Describe tu habilidad o servicio con más detalle..." rows="4"></textarea>
</div>
</div>
</div>
<div class="mb-8">
<h3 class="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">A cambio, busco:</h3>
<div class="space-y-4">
<div class="flex items-center">
<input class="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300" id="tiempoPorTiempo" name="reciprocity" type="radio"/>
<label class="ml-3 block text-sm font-medium text-gray-700" for="tiempoPorTiempo">
                                Tiempo por Tiempo <span class="text-gray-500 font-normal">(ej: una hora de mi tiempo por una hora del tuyo)</span>
</label>
</div>
<div class="flex items-center">
<input class="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300" id="habilidadPorHabilidad" name="reciprocity" type="radio"/>
<label class="ml-3 block text-sm font-medium text-gray-700" for="habilidadPorHabilidad">
                                Habilidad por Habilidad <span class="text-gray-500 font-normal">(ej: mi habilidad de cocina por tu habilidad de jardinería)</span>
</label>
</div>
<div class="flex items-center">
<input class="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300" id="unFavor" name="reciprocity" type="radio"/>
<label class="ml-3 block text-sm font-medium text-gray-700" for="unFavor">
                                Un Favor <span class="text-gray-500 font-normal">(un acto de gratitud que se registrará en el balance de favores)</span>
</label>
</div>
<div class="pt-2">
<input class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm" id="skillSought" name="skillSought" placeholder="Especifica la habilidad que buscas (si aplica)" type="text"/>
</div>
</div>
</div>
<div class="flex justify-end">
<button class="w-full bg-[#5C2483] text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-purple-800 transition-colors duration-300" type="submit">
                        Publicar Propuesta de Intercambio
                    </button>
</div>
</form>
</div>
</div>
<script>
        const openModalBtn = document.getElementById('openModalBtn');
        const closeModalBtn = document.getElementById('closeModalBtn');
        const modal = document.getElementById('proposalModal');
        openModalBtn.addEventListener('click', () => {
            modal.classList.remove('hidden');
        });
        closeModalBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                 modal.classList.add('hidden');
            }
        });
    </script>

</body></html>