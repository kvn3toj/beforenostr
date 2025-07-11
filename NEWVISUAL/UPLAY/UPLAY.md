<!DOCTYPE html>
<html lang="es"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>ÜPlay - CoomUnity Immersive</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&amp;family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<style type="text/tailwindcss">
    body {
      font-family: 'Inter', sans-serif;
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
    @keyframes nebula {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }
    .bg-nebula {
      background: linear-gradient(270deg, #0a0112, #1a082b, #0a0112);
      background-size: 400% 400%;
      animation: nebula 30s ease infinite;
    }
    .hud-bg {
      background-color: rgba(26, 12, 45, 0.7);
      backdrop-filter: blur(5px);
    }
    .question-card-bg {
      background-color: rgba(92, 36, 131, 0.25);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .timer-bar-inner {
      animation: countdown 5s linear forwards;
    }
    @keyframes countdown {
      from {
        width: 100%;
      }
      to {
        width: 0%;
      }
    }
    .quick-action-card.fade-out {
      animation: fade-out 0.5s ease-out forwards;
    }
    @keyframes fade-out {
      from {
        opacity: 1;
        transform: scale(1);
      }
      to {
        opacity: 0;
        transform: scale(0.95);
      }
    }
    .answer-button.correct {
      animation: flash-green 0.8s ease-out;
    }
    @keyframes flash-green {
      50% {
        border-color: var(--triketa-green);
        box-shadow: 0 0 15px var(--triketa-green);
      }
    }
    .answer-button.incorrect {
      animation: flash-red 0.8s ease-out;
    }
    @keyframes flash-red {
      50% {
        border-color: var(--duo-magenta);
        box-shadow: 0 0 15px var(--duo-magenta);
      }
    }
    .feedback-icon {
      animation: pop-in 0.5s ease-out;
    }
    @keyframes pop-in {
      from {
        transform: scale(0.5);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }
    .reward-notification {
      animation: fade-in-up 0.5s ease-out forwards;
    }
    @keyframes fade-in-up {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .hud-ondas-pop {
      animation: pop-glow 0.5s ease-out;
    }
    @keyframes pop-glow {
      50% {
        transform: scale(1.2);
        filter: drop-shadow(0 0 8px #3E8638);
      }
    }
  </style>
</head>
<body class="bg-nebula text-white">
<div class="relative flex flex-col h-screen w-screen items-center justify-center">
<div class="absolute top-5 right-5 hud-bg p-3 rounded-xl shadow-lg" id="hud">
<h3 class="text-xs font-semibold text-gray-300 mb-2 px-1">Métricas en vivo</h3>
<div class="flex items-center space-x-5">
<div class="flex items-center space-x-2">
<span class="material-icons text-xl text-cyan-300">bar_chart</span>
<div>
<p class="text-sm font-bold">Nivel 5</p>
<p class="text-xs text-gray-400">Guardián</p>
</div>
</div>
<div class="flex items-center space-x-2" id="hud-ondas">
<span class="material-icons text-xl text-purple-300">waves</span>
<div>
<p class="text-sm font-bold">3,450</p>
<p class="text-xs text-gray-400">Öndas</p>
</div>
</div>
<div class="flex items-center space-x-2">
<span class="material-icons text-xl text-yellow-300">star</span>
<div>
<p class="text-sm font-bold">1,280</p>
<p class="text-xs text-gray-400">Mëritos</p>
</div>
</div>
</div>
</div>
<div class="w-full max-w-6xl aspect-video bg-black rounded-lg shadow-2xl flex items-center justify-center opacity-20">
<span class="material-icons text-6xl text-gray-500">play_circle_filled</span>
</div>
<div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
<div class="question-card-bg w-full max-w-xl rounded-2xl shadow-2xl p-8 flex flex-col quick-action-card" id="quick-action-card">
<div class="flex items-center justify-between mb-4">
<div class="flex items-center">
<span class="material-icons text-3xl text-yellow-300 mr-3">bolt</span>
<h2 class="text-2xl font-bold font-montserrat">Acción Rápida</h2>
</div>
<div class="flex items-center gap-2 reward-notification hidden" id="reward-notification">
<span class="font-bold text-lg text-[var(--triketa-green)]">+75 Öndas</span>
<span class="material-icons text-2xl text-[var(--triketa-green)]">waves</span>
</div>
</div>
<p class="text-xl lg:text-2xl text-gray-100 mb-8 text-center flex-grow flex items-center justify-center">¿Cuál es el principio fundamental de Reciprocidad en CoomÜnity?</p>
<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
<button class="answer-button bg-white/10 p-6 rounded-lg border-2 border-white/20 hover:bg-white/20 cursor-pointer transition text-center text-lg font-semibold flex items-center justify-center gap-4 h-28" id="incorrect-option">
<span class="feedback-icon material-icons text-3xl text-[var(--duo-magenta)] hidden">close</span> Dar sin esperar nada a cambio.
          </button>
<button class="answer-button bg-white/10 p-6 rounded-lg border-2 border-white/20 hover:bg-white/20 cursor-pointer transition text-center text-lg font-semibold flex items-center justify-center gap-4 h-28" id="correct-option">
<span class="feedback-icon material-icons text-3xl text-[var(--triketa-green)] hidden">check_circle</span> El intercambio equitativo de valor.
          </button>
</div>
<div class="w-full">
<p class="text-xs text-gray-400 mb-2 text-center">Tiempo restante</p>
<div class="w-full bg-gray-200/20 rounded-full h-2.5">
<div class="bg-gradient-to-r from-yellow-400 to-orange-500 h-2.5 rounded-full timer-bar-inner" id="timer-bar"></div>
</div>
</div>
</div>
</div>
<div class="absolute bottom-5 w-full max-w-6xl px-4">
<div class="relative h-2 bg-gray-500/50 rounded-full group">
<div class="absolute h-2 bg-[var(--one-purple)] rounded-full" style="width: 25%;"></div>
<div class="absolute h-4 w-4 bg-white rounded-full -top-1 shadow-md" style="left: 25%;"></div>
<div class="absolute h-4 w-4 bg-yellow-400 border-2 border-white rounded-full -top-1 cursor-pointer" style="left: 25%;">
<div class="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Pregunta</div>
</div>
</div>
<div class="flex items-center justify-between text-white mt-3">
<div class="flex items-center gap-4">
<button class="text-white"><span class="material-icons text-3xl">play_arrow</span></button>
<button class="text-white"><span class="material-icons text-3xl">pause</span></button>
<div class="text-white text-sm">03:56 / 15:45</div>
</div>
<div class="flex items-center gap-4">
<button class="text-white"><span class="material-icons">volume_up</span></button>
<button class="text-white"><span class="material-icons">closed_caption</span></button>
<button class="text-white"><span class="material-icons">settings</span></button>
<button class="text-white"><span class="material-icons">fullscreen_exit</span></button>
</div>
</div>
</div>
</div>
<script>
    document.addEventListener('DOMContentLoaded', () => {
      const card = document.getElementById('quick-action-card');
      const timerBar = document.getElementById('timer-bar');
      const correctOption = document.getElementById('correct-option');
      const incorrectOption = document.getElementById('incorrect-option');
      const rewardNotification = document.getElementById('reward-notification');
      const hudOndas = document.getElementById('hud-ondas');
      const ondasCountEl = hudOndas.querySelector('p:first-child');
      let currentOndas = parseInt(ondasCountEl.textContent.replace(',', ''));
      const DURATION = 5000; // 5 seconds for the quick action
      let cardVisible = true;
      const fadeOutCard = () => {
        if (!cardVisible) return;
        cardVisible = false;
        card.classList.add('fade-out');
        setTimeout(() => {
          // In a real app, this would be removed or hidden completely
          card.style.display = 'none';
        }, 500);
      };
      const timer = setTimeout(fadeOutCard, DURATION);
      timerBar.style.animationDuration = `${DURATION/1000}s`;
      function handleAnswer(button, isCorrect) {
        if (!cardVisible) return;
        clearTimeout(timer);
        // Disable both buttons
        correctOption.disabled = true;
        incorrectOption.disabled = true;
        const icon = button.querySelector('.feedback-icon');
        icon.classList.remove('hidden');
        if (isCorrect) {
          button.classList.add('correct', 'border-[var(--triketa-green)]');
          rewardNotification.classList.remove('hidden');
          hudOndas.classList.add('hud-ondas-pop');
          setTimeout(() => {
            ondasCountEl.textContent = (currentOndas + 75).toLocaleString('en-US');
            hudOndas.classList.remove('hud-ondas-pop');
          }, 500);
        } else {
          button.classList.add('incorrect', 'border-[var(--duo-magenta)]');
        }
        setTimeout(fadeOutCard, 1200);
      }
      correctOption.addEventListener('click', () => handleAnswer(correctOption, true));
      incorrectOption.addEventListener('click', () => handleAnswer(incorrectOption, false));
    });
  </script>

</body></html>