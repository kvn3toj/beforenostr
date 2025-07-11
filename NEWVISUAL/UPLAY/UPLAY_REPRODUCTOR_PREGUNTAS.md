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
<div class="flex-1 flex flex-col p-6 lg:p-8 overflow-y-auto w-[70%]">
<div class="flex-1 flex flex-col">
<div class="bg-black rounded-lg mb-4 relative">
<div class="aspect-video relative">
<img alt="Video thumbnail" class="w-full h-full object-cover rounded-t-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGnOmtyCL8jdkVv6SRHSIPaVATOL_JDd1uUgYnERpBEIfGb_QBnCkvxF-3ZV9zf8b9sapXdbwB-dhOBAOr9i4BUvI1EHpzwIAXaQZ26A4cXGeg0BaytwqVPTMXsLn1ACqOGCX3S0gNpCTcv2D0WFY7i7beGE6FfXHmqyMzXvyoGd-O6MM8wXAVGki4BUaa2v3CL0uXo4SoP8hHOzMHws6OAeBLFGLJ2Z9cAvcB6LP1qBAYQLa5-l_aerYZ8OzVGCGWTI76Tx1a6r0"/>
<div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden">
<div class="bg-white/90 p-6 rounded-lg shadow-xl text-center">
<h3 class="text-xl font-bold text-gray-800 mb-2">Pausa de Reflexión Guiada</h3>
<p class="text-gray-700 mb-4">¿Cómo se relaciona este concepto con tu proyecto actual?</p>
<textarea class="w-full p-2 border border-gray-300 rounded-lg" placeholder="Escribe tu reflexión..."></textarea>
<button class="mt-4 bg-[var(--one-purple)] text-white font-semibold py-2 px-6 rounded-lg hover:bg-purple-700 transition-colors">Continuar Video</button>
</div>
</div>
<div class="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center hidden">
<p class="text-white text-2xl font-semibold">¿Qué idea clave emerge en este momento?</p>
</div>
</div>
<div class="p-4 bg-gray-800">
<div class="relative h-2 bg-gray-600 rounded-full">
<div class="absolute h-2 bg-[var(--one-purple)] rounded-full" style="width: 10%;"></div>
<div class="absolute h-4 w-4 bg-white rounded-full -top-1" style="left: 10%;"></div>
<div class="absolute h-3 w-3 bg-yellow-400 rounded-full -top-0.5 group" style="left: 35%;">
<div class="absolute bottom-full mb-2 w-max bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      Anotación: "Conectar esto con la idea del compostaje."
                    </div>
</div>
</div>
<div class="flex items-center justify-between text-white mt-2">
<div class="flex items-center gap-4">
<button class="text-white"><span class="material-icons">play_arrow</span></button>
<button class="text-white"><span class="material-icons">pause</span></button>
<div class="text-white text-sm">01:23 / 15:45</div>
</div>
<button class="text-yellow-400" title="Añadir Nota"><span class="material-icons">add_comment</span></button>
<div class="flex items-center gap-4">
<button class="text-white"><span class="material-icons">volume_up</span></button>
<button class="text-white"><span class="material-icons">closed_caption</span></button>
<button class="text-white"><span class="material-icons">settings</span></button>
<button class="text-white"><span class="material-icons">fullscreen</span></button>
</div>
</div>
</div>
<div class="bg-white rounded-b-lg p-4 hidden">
<textarea class="w-full p-2 border border-gray-300 rounded-lg text-sm" placeholder="Escribe tu nota personal para 01:23..."></textarea>
<div class="flex justify-end mt-2">
<button class="text-sm text-gray-500 hover:text-gray-700 mr-2">Cancelar</button>
<button class="text-sm bg-[var(--one-purple)] text-white font-semibold py-1 px-3 rounded-lg hover:bg-purple-700">Guardar Nota</button>
</div>
</div>
</div>
<div class="bg-white rounded-lg shadow p-6 mb-4">
<h1 class="text-2xl lg:text-3xl font-bold text-gray-800 font-montserrat mb-2">Permacultura: Diseñando un Futuro Sostenible</h1>
<div class="flex items-center gap-4 mb-4">
<img alt="Avatar de Zeno" class="h-12 w-12 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxw3_9Z4S-0s-M8kY3e-32l_GgY0F1c3Y_4_g-QdKj1Jg5c8sF9iR2vO0s_w=s96-c"/>
<div>
<p class="font-semibold text-gray-700">Guía: ZENO</p>
<p class="text-sm text-gray-500">Experto en Permacultura y Sistemas Regenerativos</p>
</div>
</div>
<p class="text-gray-600">
              Este video explora los principios de la permacultura como una filosofía de diseño para crear asentamientos humanos sostenibles y sistemas agrícolas autosuficientes. Aprenderás a observar e interactuar con los patrones de la naturaleza para construir un futuro más resiliente y en armonía con el planeta.
            </p>
</div>
<div class="bg-white rounded-lg shadow p-4 flex items-center justify-around">
<button class="flex flex-col items-center text-gray-600 hover:text-[var(--one-purple)] transition-colors">
<span class="material-icons">pause_circle_outline</span>
<span class="text-sm font-medium mt-1">Pausa para Reflexionar</span>
</button>
<button class="flex flex-col items-center text-gray-600 hover:text-[var(--one-purple)] transition-colors">
<span class="material-icons">replay</span>
<span class="text-sm font-medium mt-1">Repetir Idea Clave</span>
</button>
<button class="flex flex-col items-center text-gray-600 hover:text-[var(--one-purple)] transition-colors">
<span class="material-icons">groups</span>
<span class="text-sm font-medium mt-1">Conectar con Otros</span>
</button>
</div>
</div>
</div>
<aside class="w-full max-w-sm bg-white shadow-lg p-6 flex flex-col gap-6 overflow-y-auto w-[30%]">
<div class="flex-1 flex flex-col">
<div class="border-b border-gray-200">
<nav aria-label="Tabs" class="-mb-px flex space-x-6">
<a class="shrink-0 border-b-2 border-[var(--one-purple)] px-1 py-4 text-sm font-medium text-[var(--one-purple)]" href="#">
                Mis Reflexiones
              </a>
<a class="shrink-0 border-b-2 border-transparent px-1 py-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700" href="#">
                Logros Relacionados
              </a>
<a class="shrink-0 border-b-2 border-transparent px-1 py-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap" href="#">
                Guardianes Viendo
              </a>
</nav>
</div>
<div class="mt-6">
<h3 class="text-md font-semibold text-gray-800">¿Qué resonó contigo, Guardián?</h3>
<p class="text-sm text-gray-500 mb-4">Cosecha tus reflexiones post-video.</p>
<textarea class="w-full p-3 border border-gray-300 rounded-lg focus:ring-[var(--one-purple)] focus:border-[var(--one-purple)]" placeholder="Escribe tus pensamientos aquí..." rows="4"></textarea>
<button class="mt-2 w-full bg-[var(--one-purple)] text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
              Guardar Reflexión
            </button>
</div>
<div class="mt-8 space-y-4">
<h4 class="text-md font-semibold text-gray-800">Reflexiones Anteriores:</h4>
<div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
<p class="text-sm text-gray-700">"La idea de 'observar e interactuar' es clave. Antes de actuar, debo entender el sistema. Esto se aplica no solo al jardín, sino a mis proyectos y relaciones."</p>
<p class="text-xs text-gray-400 mt-2 text-right">Hace 2 días</p>
</div>
<div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
<p class="text-sm text-gray-700">"Me impactó el principio de 'no producir desperdicios'. Estoy pensando en cómo puedo aplicar esto en mi vida diaria, empezando por el compostaje."</p>
<p class="text-xs text-gray-400 mt-2 text-right">Hace 1 semana</p>
</div>
</div>
</div>
</aside>
</main>
</div>
<script>
    document.addEventListener('DOMContentLoaded', () => {
      const tabs = document.querySelectorAll('aside nav a');
      const tabsContent = [
        `
        <div class="mt-6">
            <h3 class="text-md font-semibold text-gray-800">¿Qué resonó contigo, Guardián?</h3>
            <p class="text-sm text-gray-500 mb-4">Cosecha tus reflexiones post-video.</p>
            <textarea class="w-full p-3 border border-gray-300 rounded-lg focus:ring-[var(--one-purple)] focus:border-[var(--one-purple)]" rows="4" placeholder="Escribe tus pensamientos aquí..."></textarea>
            <button class="mt-2 w-full bg-[var(--one-purple)] text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
              Guardar Reflexión
            </button>
          </div>
          <div class="mt-8 space-y-4">
            <h4 class="text-md font-semibold text-gray-800">Reflexiones Anteriores:</h4>
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p class="text-sm text-gray-700">"La idea de 'observar e interactuar' es clave. Antes de actuar, debo entender el sistema. Esto se aplica no solo al jardín, sino a mis proyectos y relaciones."</p>
              <p class="text-xs text-gray-400 mt-2 text-right">Hace 2 días</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p class="text-sm text-gray-700">"Me impactó el principio de 'no producir desperdicios'. Estoy pensando en cómo puedo aplicar esto en mi vida diaria, empezando por el compostaje."</p>
              <p class="text-xs text-gray-400 mt-2 text-right">Hace 1 semana</p>
            </div>
          </div>
        `,
        `
        <div class="mt-6 space-y-4">
            <div class="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <span class="material-icons text-4xl text-[var(--triketa-green)]">eco</span>
                <div>
                    <h4 class="font-semibold text-gray-800">Observador de Patrones</h4>
                    <p class="text-sm text-gray-600">Completa el 100% del video.</p>
                </div>
            </div>
            <div class="flex items-center gap-4 p-4 bg-yellow-50 border border-[var(--gold-border)] rounded-lg">
                <span class="material-icons text-4xl text-[var(--gold-border)]">edit</span>
                <div>
                    <h4 class="font-semibold text-gray-800">Cosechador de Sabiduría</h4>
                    <p class="text-sm text-gray-600">Guarda tu primera reflexión.</p>
                </div>
            </div>
            <div class="flex items-center gap-4 p-4 bg-gray-100 rounded-lg opacity-50">
                <span class="material-icons text-4xl text-gray-400">groups</span>
                <div>
                    <h4 class="font-semibold text-gray-500">Conector de Ecosistemas</h4>
                    <p class="text-sm text-gray-500">Inicia un debate sobre el video (Bloqueado).</p>
                </div>
            </div>
             <div class="flex items-center gap-4 p-4 bg-gray-100 rounded-lg opacity-50">
                <span class="material-icons text-4xl text-gray-400">checklist</span>
                <div>
                    <h4 class="font-semibold text-gray-500">Diseñador Regenerativo</h4>
                    <p class="text-sm text-gray-500">Aplica un principio en un reto (Bloqueado).</p>
                </div>
            </div>
        </div>
        `,
        `
        <div class="mt-6">
            <h3 class="text-md font-semibold text-gray-800 mb-4">Guardianes Conectados</h3>
             <div class="space-y-4">
                <div class="flex items-center gap-3">
                    <div class="relative">
                        <img class="h-10 w-10 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxw3_9Z4S-0s-M8kY3e-32l_GgY0F1c3Y_4_g-QdKj1Jg5c8sF9iR2vO0s_w=s96-c" alt="Avatar"/>
                        <span class="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white"></span>
                    </div>
                    <div>
                        <p class="font-semibold text-sm text-gray-800">Ana</p>
                        <p class="text-xs text-gray-500">Viendo ahora</p>
                    </div>
                </div>
                 <div class="flex items-center gap-3">
                    <div class="relative">
                        <img class="h-10 w-10 rounded-full" src="https://lh3.googleusercontent.com/a/ACg8ocJ9X_g-A9qQ8dfc1n5e9b_dZ_eZ-J8n_c8Z-Y_Q8fJq=s96-c" alt="Avatar"/>
                        <span class="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white"></span>
                    </div>
                    <div>
                        <p class="font-semibold text-sm text-gray-800">Carlos</p>
                         <p class="text-xs text-gray-500">Viendo ahora</p>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <div class="relative">
                        <img class="h-10 w-10 rounded-full" src="https://lh3.googleusercontent.com/a-/AOh14Gj3Z_7z8E3f_w-Jg3J_g-e_z_e_e-j_8z9E=s96-c" alt="Avatar"/>
                         <span class="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-gray-400 ring-2 ring-white"></span>
                    </div>
                    <div>
                        <p class="font-semibold text-sm text-gray-500">Elena</p>
                        <p class="text-xs text-gray-400">Inactiva</p>
                    </div>
                </div>
             </div>
        </div>
        `
      ];
      const contentArea = document.querySelector('aside .flex-1.flex.flex-col > div.mt-6, aside .flex-1.flex.flex-col > div.mt-8, aside .flex-1.flex.flex-col > div.space-y-4').parentElement;
      tabs.forEach((tab, index) => {
        tab.addEventListener('click', (e) => {
          e.preventDefault();
          tabs.forEach(t => {
            t.classList.remove('border-[var(--one-purple)]', 'text-[var(--one-purple)]');
            t.classList.add('border-transparent', 'text-gray-500', 'hover:border-gray-300', 'hover:text-gray-700');
          });
          tab.classList.add('border-[var(--one-purple)]', 'text-[var(--one-purple)]');
          tab.classList.remove('border-transparent', 'text-gray-500', 'hover:border-gray-300', 'hover:text-gray-700');
          contentArea.innerHTML = tabsContent[index];
        });
      });
    });
  </script>

</body></html>