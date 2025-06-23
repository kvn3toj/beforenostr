import React from 'react';
import {
  Tooltip,
  Box,
  Typography,
  Chip,
  alpha,
  useTheme,
} from '@mui/material';
import {
  AutoAwesome,
  Psychology,
  Groups,
  TrendingUp,
  Handshake,
  Lightbulb,
  EmojiEvents,
  Star,
} from '@mui/icons-material';
import { AireComponent } from '../universal/UniversalComponent';

// ===== 🧠 TIPOS Y CONCEPTOS COOMUNITY ===== //
export type CoomunityConcept =
  | 'ayni'
  | 'trust'
  | 'community'
  | 'balance'
  | 'meritos'
  | 'ondas'
  | 'lukas'
  | 'bien-comun'
  | 'interactions'
  | 'exchanges';

export type UserLevel = 'newcomer' | 'beginner' | 'intermediate' | 'advanced';

interface SmartTooltipProps {
  concept: CoomunityConcept;
  userLevel: UserLevel;
  children: React.ReactElement;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  autoShow?: boolean;
}

// ===== 📚 CONTENIDO EDUCATIVO POR CONCEPTO Y NIVEL ===== //
const TOOLTIP_CONTENT: Record<CoomunityConcept, Record<UserLevel, {
  title: string;
  description: string;
  tip: string;
  icon: React.ReactNode;
  color: string;
}>> = {
  ayni: {
    newcomer: {
      title: "🤝 Ayni - Reciprocidad",
      description: "Ayni es el principio andino de reciprocidad: cuando das, recibes. En CoomÜnity, cada intercambio busca el equilibrio.",
      tip: "💡 Tip: Ofrecer tu ayuda es la mejor forma de recibir apoyo de la comunidad.",
      icon: <Handshake />,
      color: "#E91E63"
    },
    beginner: {
      title: "🤝 Principio de Ayni",
      description: "La reciprocidad equilibrada crea confianza comunitaria. Cada acción positiva genera ondas de bien común.",
      tip: "💡 Observa cómo tus contribuciones afectan tu balance de confianza.",
      icon: <Handshake />,
      color: "#E91E63"
    },
    intermediate: {
      title: "🤝 Sistema Ayni Avanzado",
      description: "Ayni trasciende el intercambio material: incluye conocimiento, tiempo, energía y propósito compartido.",
      tip: "💡 Explora formas creativas de contribuir al bien común.",
      icon: <Handshake />,
      color: "#E91E63"
    },
    advanced: {
      title: "🤝 Maestría en Ayni",
      description: "Como guardián de reciprocidad, tu ejemplo inspira a otros. Ayni se convierte en tu filosofía de vida.",
      tip: "💡 Mentora a nuevos miembros en los principios de reciprocidad.",
      icon: <Handshake />,
      color: "#E91E63"
    }
  },

  trust: {
    newcomer: {
      title: "⭐ Confianza Comunitaria",
      description: "La confianza se construye con cada interacción positiva. Es la base de nuestra comunidad.",
      tip: "💡 Tip: Cumple tus compromisos y sé auténtico en tus intercambios.",
      icon: <Star />,
      color: "#FF9800"
    },
    beginner: {
      title: "⭐ Sistema de Confianza",
      description: "Tu reputación se basa en tus acciones consistentes y el impacto positivo que generas.",
      tip: "💡 La transparencia y honestidad fortalecen tu perfil de confianza.",
      icon: <Star />,
      color: "#FF9800"
    },
    intermediate: {
      title: "⭐ Red de Confianza",
      description: "Participas en círculos de confianza donde las recomendaciones mutuas amplifican oportunidades.",
      tip: "💡 Conecta personas afines para fortalecer la red de confianza.",
      icon: <Star />,
      color: "#FF9800"
    },
    advanced: {
      title: "⭐ Arquitecto de Confianza",
      description: "Como referente comunitario, tu confianza permite validar y guiar a otros miembros.",
      tip: "💡 Usa tu influencia para crear espacios seguros de colaboración.",
      icon: <Star />,
      color: "#FF9800"
    }
  },

  community: {
    newcomer: {
      title: "👥 Comunidad CoomÜnity",
      description: "Somos una red de personas que priorizan el bien común sobre el beneficio individual.",
      tip: "💡 Tip: Participa en conversaciones y comparte tus experiencias.",
      icon: <Groups />,
      color: "#2196F3"
    },
    beginner: {
      title: "👥 Dinámicas Comunitarias",
      description: "La comunidad se fortalece cuando cada miembro contribuye desde sus talentos únicos.",
      tip: "💡 Descubre en qué círculos puedes aportar más valor.",
      icon: <Groups />,
      color: "#2196F3"
    },
    intermediate: {
      title: "👥 Liderazgo Comunitario",
      description: "Participas activamente en la toma de decisiones y facilitación de espacios colaborativos.",
      tip: "💡 Propón iniciativas que beneficien al colectivo.",
      icon: <Groups />,
      color: "#2196F3"
    },
    advanced: {
      title: "👥 Guardián Comunitario",
      description: "Tu visión sistémica ayuda a mantener la coherencia filosófica y práctica de la comunidad.",
      tip: "💡 Facilita procesos de crecimiento y sanación comunitaria.",
      icon: <Groups />,
      color: "#2196F3"
    }
  },

  balance: {
    newcomer: {
      title: "⚖️ Balance Ayni",
      description: "Tu balance muestra la armonía entre lo que das y recibes en la comunidad.",
      tip: "💡 Tip: Un balance equilibrado refleja participación sana en la comunidad.",
      icon: <AutoAwesome />,
      color: "#9C27B0"
    },
    beginner: {
      title: "⚖️ Equilibrio Dinámico",
      description: "El balance fluctúa naturalmente. Lo importante es la intención de reciprocidad.",
      tip: "💡 Observa patrones en tu balance para entender tus hábitos de intercambio.",
      icon: <AutoAwesome />,
      color: "#9C27B0"
    },
    intermediate: {
      title: "⚖️ Armonía Sistémica",
      description: "Comprendes que el balance personal contribuye al equilibrio de toda la red.",
      tip: "💡 Ayuda a otros miembros a encontrar su equilibrio natural.",
      icon: <AutoAwesome />,
      color: "#9C27B0"
    },
    advanced: {
      title: "⚖️ Maestría del Equilibrio",
      description: "Tu balance es un ejemplo de sostenibilidad y reciprocidad consciente.",
      tip: "💡 Enseña principios de equilibrio a través de tu práctica diaria.",
      icon: <AutoAwesome />,
      color: "#9C27B0"
    }
  },

  meritos: {
    newcomer: {
      title: "🏆 Mëritos",
      description: "Los Mëritos reconocen tus contribuciones al bien común. Se ganan con acciones valiosas.",
      tip: "💡 Tip: Ayuda a otros, comparte conocimiento y participa activamente.",
      icon: <EmojiEvents />,
      color: "#4CAF50"
    },
    beginner: {
      title: "🏆 Sistema de Mëritos",
      description: "Los Mëritos reflejan tu impacto positivo y abren nuevas oportunidades en la plataforma.",
      tip: "💡 Enfócate en la calidad de tus contribuciones, no en la cantidad.",
      icon: <EmojiEvents />,
      color: "#4CAF50"
    },
    intermediate: {
      title: "🏆 Reconocimiento Comunitario",
      description: "Tus Mëritos te posicionan como referente y multiplican tu capacidad de impacto.",
      tip: "💡 Usa tu reconocimiento para elevar a otros miembros de la comunidad.",
      icon: <EmojiEvents />,
      color: "#4CAF50"
    },
    advanced: {
      title: "🏆 Guardián de Mëritos",
      description: "Tu nivel de Mëritos te permite validar contribuciones y guiar el crecimiento comunitario.",
      tip: "💡 Sé generoso en reconocer el valor que otros aportan.",
      icon: <EmojiEvents />,
      color: "#4CAF50"
    }
  },

  ondas: {
    newcomer: {
      title: "🌊 Öndas",
      description: "Las Öndas son energía positiva que se expande por la red cuando contribuyes al bien común.",
      tip: "💡 Tip: Cada acción positiva genera ondas que benefician a toda la comunidad.",
      icon: <TrendingUp />,
      color: "#00BCD4"
    },
    beginner: {
      title: "🌊 Energía Vibracional",
      description: "Las Öndas miden el impacto energético de tus acciones en el campo colectivo.",
      tip: "💡 Actúa desde el corazón para generar Öndas de alta vibración.",
      icon: <TrendingUp />,
      color: "#00BCD4"
    },
    intermediate: {
      title: "🌊 Amplificador de Öndas",
      description: "Tu presencia consciente amplifica las Öndas positivas de toda la comunidad.",
      tip: "💡 Practica la coherencia entre pensamiento, emoción y acción.",
      icon: <TrendingUp />,
      color: "#00BCD4"
    },
    advanced: {
      title: "🌊 Maestro de Öndas",
      description: "Eres un faro de frecuencia elevada que eleva naturalmente el campo colectivo.",
      tip: "💡 Tu estado de consciencia es tu mayor contribución a la comunidad.",
      icon: <TrendingUp />,
      color: "#00BCD4"
    }
  },

  lukas: {
    newcomer: {
      title: "💰 Lükas",
      description: "Lükas es nuestra moneda interna para intercambios locales. Facilita el comercio sin dinero tradicional.",
      tip: "💡 Tip: Gana Lükas ofreciendo productos o servicios a la comunidad.",
      icon: <AutoAwesome />,
      color: "#FFC107"
    },
    beginner: {
      title: "💰 Economía Lükas",
      description: "Lükas circula en nuestra economía local, creando abundancia sin acumulación.",
      tip: "💡 Usa Lükas para acceder a bienes y servicios dentro de la red.",
      icon: <AutoAwesome />,
      color: "#FFC107"
    },
    intermediate: {
      title: "💰 Facilitador Lükas",
      description: "Entiendes cómo Lükas fortalece la economía local y reduces dependencia del dinero externo.",
      tip: "💡 Promueve el uso de Lükas en tu círculo para fortalecer la economía comunitaria.",
      icon: <AutoAwesome />,
      color: "#FFC107"
    },
    advanced: {
      title: "💰 Arquitecto Económico",
      description: "Tu manejo de Lükas contribuye al diseño de una economía regenerativa y justa.",
      tip: "💡 Educa sobre economía alternativa y facilita su implementación.",
      icon: <AutoAwesome />,
      color: "#FFC107"
    }
  },

  'bien-comun': {
    newcomer: {
      title: "🌍 Bien Común",
      description: "El Bien Común es nuestro norte. Priorizamos el beneficio colectivo sobre el individual.",
      tip: "💡 Tip: En cada decisión, pregúntate: ¿esto beneficia a la comunidad?",
      icon: <Lightbulb />,
      color: "#8BC34A"
    },
    beginner: {
      title: "🌍 Filosofía del Bien Común",
      description: "Comprendes que el bienestar personal y colectivo están interconectados.",
      tip: "💡 Busca soluciones ganar-ganar en todos tus intercambios.",
      icon: <Lightbulb />,
      color: "#8BC34A"
    },
    intermediate: {
      title: "🌍 Agente del Bien Común",
      description: "Tus acciones están alineadas conscientemente con el beneficio del conjunto.",
      tip: "💡 Inspira a otros con ejemplos concretos de bien común en acción.",
      icon: <Lightbulb />,
      color: "#8BC34A"
    },
    advanced: {
      title: "🌍 Guardián del Bien Común",
      description: "Tu sabiduría sistémica guía a la comunidad hacia decisiones que benefician a todos.",
      tip: "💡 Facilita procesos donde emerjan soluciones de bien común.",
      icon: <Lightbulb />,
      color: "#8BC34A"
    }
  },

  interactions: {
    newcomer: {
      title: "💬 Interacciones Sociales",
      description: "Cada like, comentario y compartir fortalece los lazos comunitarios.",
      tip: "💡 Tip: Interactúa de forma auténtica y constructiva con otros miembros.",
      icon: <Psychology />,
      color: "#607D8B"
    },
    beginner: {
      title: "💬 Comunicación Consciente",
      description: "Tus interacciones reflejan los valores de la comunidad y nutren relaciones sanas.",
      tip: "💡 Practica escucha activa y comunicación no violenta.",
      icon: <Psychology />,
      color: "#607D8B"
    },
    intermediate: {
      title: "💬 Facilitador Social",
      description: "Generas espacios de diálogo constructivo y conexión significativa entre miembros.",
      tip: "💡 Haz preguntas que inviten a la reflexión y el intercambio profundo.",
      icon: <Psychology />,
      color: "#607D8B"
    },
    advanced: {
      title: "💬 Maestro de Comunicación",
      description: "Tu habilidad comunicativa eleva la calidad del discurso comunitario.",
      tip: "💡 Modela comunicación consciente para inspirar a otros.",
      icon: <Psychology />,
      color: "#607D8B"
    }
  },

  exchanges: {
    newcomer: {
      title: "🔄 Intercambios Ayni",
      description: "Los intercambios van más allá del comercio: son oportunidades de conexión y crecimiento mutuo.",
      tip: "💡 Tip: Cada intercambio es una oportunidad de practicar reciprocidad.",
      icon: <Handshake />,
      color: "#E91E63"
    },
    beginner: {
      title: "🔄 Ecosistema de Intercambio",
      description: "Participas en una economía basada en confianza, reciprocidad y beneficio mutuo.",
      tip: "💡 Explora diferentes formas de intercambio: tiempo, conocimiento, recursos.",
      icon: <Handshake />,
      color: "#E91E63"
    },
    intermediate: {
      title: "🔄 Facilitador de Intercambios",
      description: "Conectas personas y recursos, multiplicando las oportunidades de colaboración.",
      tip: "💡 Identifica necesidades y ofertas complementarias en tu red.",
      icon: <Handshake />,
      color: "#E91E63"
    },
    advanced: {
      title: "🔄 Arquitecto de Colaboración",
      description: "Diseñas sistemas de intercambio que optimizan el flujo de valor en la comunidad.",
      tip: "💡 Innova en modelos de intercambio que fortalezcan el bien común.",
      icon: <Handshake />,
      color: "#E91E63"
    }
  }
};

// ===== 🎨 COMPONENTE SMART TOOLTIP ===== //
export const SmartTooltip: React.FC<SmartTooltipProps> = ({
  concept,
  userLevel,
  children,
  placement = 'top',
  autoShow = false
}) => {
  const theme = useTheme();
  const content = TOOLTIP_CONTENT[concept]?.[userLevel];

  if (!content) {
    // Fallback si no hay contenido para el concepto/nivel
    return children;
  }

  return (
    <Tooltip
      title={
        <Box sx={{ p: 2, maxWidth: 320 }}>
          {/* Header con icono y título */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Box
              sx={{
                color: content.color,
                display: 'flex',
                alignItems: 'center',
                fontSize: 20
              }}
            >
              {content.icon}
            </Box>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                fontSize: '0.9rem'
              }}
            >
              {content.title}
            </Typography>
            <Chip
              label={userLevel}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.65rem',
                bgcolor: alpha(content.color, 0.1),
                color: content.color,
                fontWeight: 600
              }}
            />
          </Box>

          {/* Descripción */}
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              lineHeight: 1.4,
              mb: 1.5,
              fontSize: '0.8rem'
            }}
          >
            {content.description}
          </Typography>

          {/* Tip práctico */}
          <Box
            sx={{
              p: 1.5,
              bgcolor: alpha(content.color, 0.05),
              borderRadius: 2,
              borderLeft: `3px solid ${content.color}`
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: content.color,
                fontWeight: 600,
                fontSize: '0.75rem',
                lineHeight: 1.3
              }}
            >
              {content.tip}
            </Typography>
          </Box>
        </Box>
      }
      placement={placement}
      arrow
      enterDelay={300}
      leaveDelay={100}
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: alpha(theme.palette.background.paper, 0.95),
            color: 'text.primary',
            boxShadow: theme.shadows[8],
            border: `1px solid ${theme.palette.divider}`,
            '& .MuiTooltip-arrow': {
              color: alpha(theme.palette.background.paper, 0.95)
            }
          }
        }
      }}
    >
      <Box
        component="span"
        sx={{
          cursor: 'help',
          display: 'inline-block',
          '&:hover': {
            transform: 'translateY(-1px)',
            transition: 'transform 0.2s ease'
          }
        }}
      >
        {children}
      </Box>
    </Tooltip>
  );
};

export default SmartTooltip;
