import { toast } from 'sonner'

// Types
interface ParticleEffect {
  id: string
  x: number
  y: number
  color: string
  size: number
  velocity: { x: number; y: number }
  life: number
  maxLife: number
}

interface RewardAnimation {
  type: 'MERITOS' | 'LUKAS' | 'RECIPROCIDAD' | 'ACHIEVEMENT' | 'LEVEL_UP'
  amount: number
  element?: HTMLElement
  callback?: () => void
}

interface SoundEffect {
  name: string
  url: string
  volume: number
}

// Sound Effects Library
const SOUND_EFFECTS: Record<string, SoundEffect> = {
  MERIT_GAINED: {
    name: 'merit_gained',
    url: '/sounds/merit-chime.mp3',
    volume: 0.6
  },
  LUKAS_EARNED: {
    name: 'lukas_earned', 
    url: '/sounds/coin-collect.mp3',
    volume: 0.7
  },
  ACHIEVEMENT_UNLOCKED: {
    name: 'achievement',
    url: '/sounds/achievement-fanfare.mp3',
    volume: 0.8
  },
  LEVEL_UP: {
    name: 'level_up',
    url: '/sounds/level-up.mp3',
    volume: 0.9
  },
  NOTIFICATION_ARRIVE: {
    name: 'notification',
    url: '/sounds/gentle-ping.mp3',
    volume: 0.5
  },
  EXCHANGE_SUCCESS: {
    name: 'exchange',
    url: '/sounds/success-bell.mp3',
    volume: 0.6
  },
  CHALLENGE_COMPLETE: {
    name: 'challenge',
    url: '/sounds/victory-chord.mp3',
    volume: 0.7
  },
  RECIPROCIDAD_BALANCE: {
    name: 'reciprocidad',
    url: '/sounds/harmony-chime.mp3',
    volume: 0.6
  }
}

class GameFeelSystem {
  private audioContext: AudioContext | null = null
  private soundBuffers: Map<string, AudioBuffer> = new Map()
  private particles: ParticleEffect[] = []
  private animationFrameId: number | null = null
  private canvas: HTMLCanvasElement | null = null
  private ctx: CanvasRenderingContext2D | null = null
  private isInitialized = false

  async initialize() {
    if (this.isInitialized) return

    try {
      // Initialize Web Audio Context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      // Create particle canvas
      this.createParticleCanvas()
      
      // Preload sound effects
      await this.preloadSounds()
      
      this.isInitialized = true
      console.log('🎮 GameFeelSystem initialized successfully')
    } catch (error) {
      console.warn('GameFeelSystem initialization failed:', error)
    }
  }

  private createParticleCanvas() {
    this.canvas = document.createElement('canvas')
    this.canvas.id = 'particle-canvas'
    this.canvas.style.position = 'fixed'
    this.canvas.style.top = '0'
    this.canvas.style.left = '0'
    this.canvas.style.width = '100vw'
    this.canvas.style.height = '100vh'
    this.canvas.style.pointerEvents = 'none'
    this.canvas.style.zIndex = '9999'
    
    this.ctx = this.canvas.getContext('2d')
    
    // Set canvas size
    this.resizeCanvas()
    window.addEventListener('resize', () => this.resizeCanvas())
    
    document.body.appendChild(this.canvas)
    this.startParticleLoop()
  }

  private resizeCanvas() {
    if (!this.canvas) return
    
    this.canvas.width = window.innerWidth * window.devicePixelRatio
    this.canvas.height = window.innerHeight * window.devicePixelRatio
    this.canvas.style.width = window.innerWidth + 'px'
    this.canvas.style.height = window.innerHeight + 'px'
    
    if (this.ctx) {
      this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
  }

  private async preloadSounds() {
    if (!this.audioContext) return

    const promises = Object.values(SOUND_EFFECTS).map(async (sound) => {
      try {
        const response = await fetch(sound.url)
        const arrayBuffer = await response.arrayBuffer()
        const audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer)
        this.soundBuffers.set(sound.name, audioBuffer)
      } catch (error) {
        console.warn(`Failed to load sound: ${sound.name}`, error)
      }
    })

    await Promise.all(promises)
  }

  // Haptic Feedback
  triggerHaptic(pattern: 'light' | 'medium' | 'heavy' | 'success' | 'error' = 'light') {
    if (!navigator.vibrate) return

    const patterns = {
      light: [10],
      medium: [50],
      heavy: [100],
      success: [50, 50, 100],
      error: [100, 50, 100, 50, 100]
    }

    navigator.vibrate(patterns[pattern])
  }

  // Sound Effects
  playSound(soundName: keyof typeof SOUND_EFFECTS, volume: number = 1) {
    if (!this.audioContext || !this.isInitialized) return

    const soundEffect = SOUND_EFFECTS[soundName]
    const buffer = this.soundBuffers.get(soundEffect.name)
    
    if (!buffer) return

    const source = this.audioContext.createBufferSource()
    const gainNode = this.audioContext.createGain()
    
    source.buffer = buffer
    gainNode.gain.value = soundEffect.volume * volume
    
    source.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    
    source.start()
  }

  // Particle Effects
  createParticleExplosion(x: number, y: number, color: string, count: number = 20) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count
      const speed = Math.random() * 5 + 2
      
      this.particles.push({
        id: `particle_${Date.now()}_${i}`,
        x,
        y,
        color,
        size: Math.random() * 8 + 4,
        velocity: {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed
        },
        life: 60,
        maxLife: 60
      })
    }
  }

  private startParticleLoop() {
    const animate = () => {
      this.updateParticles()
      this.renderParticles()
      this.animationFrameId = requestAnimationFrame(animate)
    }
    animate()
  }

  private updateParticles() {
    this.particles = this.particles.filter(particle => {
      particle.x += particle.velocity.x
      particle.y += particle.velocity.y
      particle.velocity.y += 0.2 // gravity
      particle.velocity.x *= 0.98 // air resistance
      particle.life--
      
      return particle.life > 0
    })
  }

  private renderParticles() {
    if (!this.ctx || !this.canvas) return

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    
    this.particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife
      this.ctx!.save()
      this.ctx!.globalAlpha = alpha
      this.ctx!.fillStyle = particle.color
      this.ctx!.beginPath()
      this.ctx!.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2)
      this.ctx!.fill()
      this.ctx!.restore()
    })
  }

  // Main Reward Animation System
  triggerRewardAnimation(reward: RewardAnimation) {
    const element = reward.element || document.querySelector('.app-header')
    if (!element) return

    const rect = element.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    switch (reward.type) {
      case 'MERITOS':
        this.animateMeritosGain(centerX, centerY, reward.amount)
        break
      case 'LUKAS':
        this.animateLukasGain(centerX, centerY, reward.amount)
        break
      case 'RECIPROCIDAD':
        this.animateReciprocidadBalance(centerX, centerY)
        break
      case 'ACHIEVEMENT':
        this.animateAchievement(centerX, centerY)
        break
      case 'LEVEL_UP':
        this.animateLevelUp(centerX, centerY)
        break
    }

    reward.callback?.()
  }

  private animateMeritosGain(x: number, y: number, amount: number) {
    // Haptic feedback
    this.triggerHaptic('success')
    
    // Sound effect
    this.playSound('MERIT_GAINED')
    
    // Particle explosion
    this.createParticleExplosion(x, y, '#F59E0B', 15)
    
    // Toast with custom styling
    toast.success(`+${amount} Méritos ganados!`, {
      description: 'Tu contribución al Bien Común es valorada',
      duration: 3000,
      style: {
        background: 'linear-gradient(135deg, #F59E0B, #CDAB5A)',
        color: 'white',
        border: 'none',
        boxShadow: '0 8px 32px rgba(245, 158, 11, 0.3)',
      },
    })

    // Floating number animation
    this.createFloatingNumber(`+${amount}`, x, y, '#F59E0B', '🏆')
  }

  private animateLukasGain(x: number, y: number, amount: number) {
    this.triggerHaptic('medium')
    this.playSound('LUKAS_EARNED')
    this.createParticleExplosion(x, y, '#10B981', 12)
    
    toast.success(`+${amount} Lükas obtenidos!`, {
      description: 'Moneda comunitaria añadida a tu wallet',
      duration: 3000,
      style: {
        background: 'linear-gradient(135deg, #10B981, #059669)',
        color: 'white',
        border: 'none',
        boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
      },
    })

    this.createFloatingNumber(`+${amount}`, x, y, '#10B981', '💰')
  }

  private animateReciprocidadBalance(x: number, y: number) {
    this.triggerHaptic('light')
    this.playSound('RECIPROCIDAD_BALANCE')
    
    // Create rainbow particle effect
    const colors = ['#CDAB5A', '#10B981', '#3B82F6', '#8B5CF6', '#EF4444']
    colors.forEach((color, i) => {
      setTimeout(() => {
        this.createParticleExplosion(x, y, color, 8)
      }, i * 100)
    })

    toast.success('¡Equilibrio Reciprocidad alcanzado!', {
      description: 'Has encontrado el balance perfecto entre dar y recibir',
      duration: 4000,
      style: {
        background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
        color: 'white',
        border: 'none',
        boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
      },
    })
  }

  private animateAchievement(x: number, y: number) {
    this.triggerHaptic('heavy')
    this.playSound('ACHIEVEMENT_UNLOCKED')
    this.createParticleExplosion(x, y, '#CDAB5A', 25)

    toast.success('¡Logro Desbloqueado!', {
      description: 'Has alcanzado un nuevo hito en tu aventura',
      duration: 5000,
      style: {
        background: 'linear-gradient(135deg, #CDAB5A, #B8954A)',
        color: 'white',
        border: 'none',
        boxShadow: '0 8px 32px rgba(205, 171, 90, 0.3)',
      },
    })
  }

  private animateLevelUp(x: number, y: number) {
    this.triggerHaptic('heavy')
    this.playSound('LEVEL_UP')
    
    // Multiple particle explosions
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        this.createParticleExplosion(x, y, '#EF4444', 20)
      }, i * 200)
    }

    toast.success('¡Subiste de Nivel!', {
      description: 'Nuevas funcionalidades desbloqueadas',
      duration: 6000,
      style: {
        background: 'linear-gradient(135deg, #EF4444, #DC2626)',
        color: 'white',
        border: 'none',
        boxShadow: '0 8px 32px rgba(239, 68, 68, 0.3)',
      },
    })
  }

  private createFloatingNumber(text: string, x: number, y: number, color: string, emoji: string) {
    const element = document.createElement('div')
    element.textContent = `${emoji} ${text}`
    element.style.position = 'fixed'
    element.style.left = `${x}px`
    element.style.top = `${y}px`
    element.style.color = color
    element.style.fontSize = '24px'
    element.style.fontWeight = 'bold'
    element.style.pointerEvents = 'none'
    element.style.zIndex = '10000'
    element.style.transform = 'translate(-50%, -50%)'
    element.style.textShadow = '2px 2px 4px rgba(0,0,0,0.3)'
    
    document.body.appendChild(element)

    // Animate upward and fade
    let opacity = 1
    let yOffset = 0
    
    const animate = () => {
      yOffset -= 2
      opacity -= 0.02
      
      element.style.transform = `translate(-50%, ${-50 + yOffset}px)`
      element.style.opacity = opacity.toString()
      
      if (opacity > 0) {
        requestAnimationFrame(animate)
      } else {
        document.body.removeChild(element)
      }
    }
    
    animate()
  }

  // Screen shake effect
  triggerScreenShake(intensity: number = 5, duration: number = 500) {
    const root = document.documentElement
    const startTime = Date.now()
    
    const shake = () => {
      const elapsed = Date.now() - startTime
      const progress = elapsed / duration
      
      if (progress < 1) {
        const shakeAmount = intensity * (1 - progress)
        const offsetX = (Math.random() - 0.5) * shakeAmount
        const offsetY = (Math.random() - 0.5) * shakeAmount
        
        root.style.transform = `translate(${offsetX}px, ${offsetY}px)`
        requestAnimationFrame(shake)
      } else {
        root.style.transform = 'translate(0px, 0px)'
      }
    }
    
    shake()
  }

  // Micro-interactions for UI elements
  addMicroInteraction(element: HTMLElement, type: 'hover' | 'click' | 'focus' = 'hover') {
    if (type === 'hover') {
      element.addEventListener('mouseenter', () => {
        element.style.transform = 'translateY(-2px) scale(1.02)'
        element.style.transition = 'all 0.2s ease'
        element.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)'
      })
      
      element.addEventListener('mouseleave', () => {
        element.style.transform = 'translateY(0px) scale(1)'
        element.style.boxShadow = 'none'
      })
    }
    
    if (type === 'click') {
      element.addEventListener('click', () => {
        this.triggerHaptic('light')
        element.style.transform = 'scale(0.95)'
        setTimeout(() => {
          element.style.transform = 'scale(1)'
        }, 100)
      })
    }
  }

  // Cleanup
  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
    }
    
    if (this.canvas) {
      document.body.removeChild(this.canvas)
    }
    
    if (this.audioContext) {
      this.audioContext.close()
    }
    
    this.isInitialized = false
  }
}

// Create singleton instance
export const gameFeelSystem = new GameFeelSystem()

// Auto-initialize when DOM is ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      gameFeelSystem.initialize()
    })
  } else {
    gameFeelSystem.initialize()
  }
}

// Helper functions for easy use
export const triggerReward = (type: RewardAnimation['type'], amount: number, element?: HTMLElement) => {
  gameFeelSystem.triggerRewardAnimation({ type, amount, element })
}

export const playGameSound = (sound: keyof typeof SOUND_EFFECTS) => {
  gameFeelSystem.playSound(sound)
}

export const triggerHapticFeedback = (pattern: 'light' | 'medium' | 'heavy' | 'success' | 'error' = 'light') => {
  gameFeelSystem.triggerHaptic(pattern)
}

export const addButtonInteraction = (element: HTMLElement) => {
  gameFeelSystem.addMicroInteraction(element, 'click')
}

export const addHoverEffect = (element: HTMLElement) => {
  gameFeelSystem.addMicroInteraction(element, 'hover')
}

export default gameFeelSystem