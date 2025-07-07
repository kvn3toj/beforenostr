# 🔧 Configuración de Workflows N8N - Sistema de Agentes IA

## 📋 Resumen

Esta guía detalla cómo configurar los workflows de N8N para el sistema de orquestación de agentes IA de CoomÜnity. Cada workflow representa un agente especializado que puede trabajar de forma independiente o coordinada.

## 🌐 Configuración Inicial de N8N

### Instalación con Docker

```bash
# Crear directorio para N8N
mkdir n8n-coomunity && cd n8n-coomunity

# Docker Compose para N8N
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  n8n:
    image: n8nio/n8n:latest
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=coomunity2025
      - N8N_HOST=localhost
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - WEBHOOK_URL=http://localhost:5678/
      - GENERIC_TIMEZONE=America/Mexico_City
    volumes:
      - n8n_data:/home/node/.n8n
    networks:
      - n8n-network

volumes:
  n8n_data:

networks:
  n8n-network:
    driver: bridge
EOF

# Iniciar N8N
docker-compose up -d
```

### Variables de Entorno N8N

```bash
# En N8N Settings > Environment Variables
OPENAI_API_KEY=your-openai-api-key
APIFY_API_TOKEN=your-apify-token
BUFFER_ACCESS_TOKEN=your-buffer-token
SLACK_BOT_TOKEN=your-slack-bot-token
COOMUNITY_BACKEND_URL=http://localhost:3002
COOMUNITY_API_KEY=your-backend-api-key
```

## 🤖 Workflow Master - ANA (Conciencia Orquestadora)

### Configuración del Webhook Master

**URL del Webhook**: `http://localhost:5678/webhook/ai-agents-master`

### Estructura del Workflow ANA

```json
{
  "name": "ANA - Conciencia Orquestadora",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "ai-agents-master",
        "responseMode": "responseNode",
        "options": {}
      },
      "name": "Webhook Master",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "jsCode": "// 🧠 ANA - Análisis y Orquestación de Misiones\nconst mission = $input.first().json;\n\n// Extraer información de la misión\nconst {\n  mission: missionText,\n  missionType,\n  targetAgent,\n  priority = 3,\n  context = '',\n  userId,\n  missionId\n} = mission;\n\n// 🎯 Determinar estrategia de ejecución\nlet strategy = {\n  agents: [],\n  sequence: [],\n  parallelTasks: []\n};\n\n// 🔍 Análisis de tipo de misión\nswitch(missionType) {\n  case 'RESEARCH':\n    strategy = {\n      agents: ['NIRA'],\n      sequence: ['research', 'analysis', 'report'],\n      parallelTasks: []\n    };\n    break;\n    \n  case 'MEDIA_CREATION':\n    strategy = {\n      agents: ['ARIA'],\n      sequence: ['concept', 'creation', 'optimization'],\n      parallelTasks: []\n    };\n    break;\n    \n  case 'PUBLICATION':\n    strategy = {\n      agents: ['HERALDO'],\n      sequence: ['schedule', 'publish', 'monitor'],\n      parallelTasks: []\n    };\n    break;\n    \n  case 'COMPLEX':\n    // 🌟 Misión compleja - múltiples agentes\n    strategy = {\n      agents: ['NIRA', 'ARIA', 'HERALDO'],\n      sequence: ['research', 'creation', 'publication'],\n      parallelTasks: ['notification_start', 'notification_end']\n    };\n    break;\n    \n  default:\n    strategy = {\n      agents: [targetAgent || 'NIRA'],\n      sequence: ['execute'],\n      parallelTasks: []\n    };\n}\n\n// 🎼 Preparar orquestación\nconst orchestration = {\n  missionId,\n  userId,\n  originalMission: missionText,\n  context,\n  priority,\n  strategy,\n  timestamp: new Date().toISOString(),\n  philosophy: {\n    principle: 'Bien Común > bien particular',\n    approach: 'Cooperar > Competir',\n    balance: 'Reciprocidad/Ayni'\n  }\n};\n\n// 📊 Logging de decisión\nconsole.log(`🧠 ANA Decision: Mission ${missionId} will use strategy:`, strategy);\n\nreturn [{\n  json: orchestration\n}];"
      },
      "name": "ANA Analysis",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [460, 300]
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "leftValue": "",
            "typeValidation": "strict"
          },
          "conditions": [
            {
              "leftValue": "={{ $json.strategy.agents }}",
              "rightValue": "NIRA",
              "operator": {
                "type": "array",
                "operation": "contains"
              }
            }
          ]
        },
        "combineOperation": "any"
      },
      "name": "Needs Research?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [680, 300]
    },
    {
      "parameters": {
        "url": "http://localhost:5678/webhook/nira-research",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Content-Type",
              "value": "application/json"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "mission",
              "value": "={{ $json.originalMission }}"
            },
            {
              "name": "context",
              "value": "={{ $json.context }}"
            },
            {
              "name": "missionId",
              "value": "={{ $json.missionId }}"
            }
          ]
        },
        "options": {}
      },
      "name": "Call NIRA",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [900, 200]
    }
  ],
  "connections": {
    "Webhook Master": {
      "main": [
        [
          {
            "node": "ANA Analysis",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "ANA Analysis": {
      "main": [
        [
          {
            "node": "Needs Research?",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Needs Research?": {
      "main": [
        [
          {
            "node": "Call NIRA",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

## 🔍 Workflow NIRA - Agente de Investigación

### Webhook URL: `http://localhost:5678/webhook/nira-research`

```json
{
  "name": "NIRA - Agente de Investigación",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "nira-research",
        "responseMode": "responseNode",
        "options": {}
      },
      "name": "Research Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "jsCode": "// 🔍 NIRA - Especialista en Investigación\nconst input = $input.first().json;\n\n// 📊 Análisis de la misión de investigación\nconst researchPlan = {\n  query: input.mission,\n  context: input.context,\n  missionId: input.missionId,\n  searchStrategies: [],\n  sources: {\n    web: true,\n    academic: false,\n    social: true,\n    news: true\n  },\n  philosophy: 'Buscar la verdad para el bien común'\n};\n\n// 🎯 Determinar estrategias de búsqueda\nif (input.mission.toLowerCase().includes('startup') || input.mission.toLowerCase().includes('empresa')) {\n  researchPlan.searchStrategies.push('company_research');\n  researchPlan.sources.academic = true;\n}\n\nif (input.mission.toLowerCase().includes('mercado') || input.mission.toLowerCase().includes('tendencia')) {\n  researchPlan.searchStrategies.push('market_analysis');\n  researchPlan.sources.social = true;\n}\n\nif (input.mission.toLowerCase().includes('innovación') || input.mission.toLowerCase().includes('tecnología')) {\n  researchPlan.searchStrategies.push('innovation_tracking');\n  researchPlan.sources.academic = true;\n}\n\nconsole.log(`🔍 NIRA Research Plan for ${input.missionId}:`, researchPlan);\n\nreturn [{ json: researchPlan }];"
      },
      "name": "NIRA Planning",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [460, 300]
    },
    {
      "parameters": {
        "resource": "actor",
        "operation": "call",
        "actorId": "apify/web-scraper",
        "runSync": true,
        "datasetMappingMode": "autoMapInputs",
        "additionalFields": {
          "startUrls": [
            {
              "url": "https://www.google.com/search?q={{ encodeURIComponent($json.query) }}"
            }
          ],
          "pageFunction": "async function pageFunction(context) {\n    const { page, request, log } = context;\n    \n    // 🔍 Extraer resultados de búsqueda\n    const results = await page.$$eval('div.g', (elements) => {\n        return elements.slice(0, 10).map(el => {\n            const titleEl = el.querySelector('h3');\n            const linkEl = el.querySelector('a');\n            const snippetEl = el.querySelector('.VwiC3b');\n            \n            return {\n                title: titleEl ? titleEl.textContent : '',\n                url: linkEl ? linkEl.href : '',\n                snippet: snippetEl ? snippetEl.textContent : ''\n            };\n        }).filter(item => item.title && item.url);\n    });\n    \n    return {\n        query: request.userData.query,\n        results: results,\n        timestamp: new Date().toISOString(),\n        philosophy: 'Información para el bien común'\n    };\n}"
        }
      },
      "name": "Web Research",
      "type": "n8n-nodes-base.apify",
      "typeVersion": 1,
      "position": [680, 300]
    },
    {
      "parameters": {
        "model": "gpt-4",
        "messages": {
          "messages": [
            {
              "role": "system",
              "content": "Eres NIRA, el agente de investigación de CoomÜnity. Tu filosofía es 'Buscar la verdad para el bien común'. Analiza la información recopilada y crea un reporte estructurado, objetivo y útil."
            },
            {
              "role": "user",
              "content": "Misión: {{ $('NIRA Planning').first().json.query }}\n\nContexto: {{ $('NIRA Planning').first().json.context }}\n\nResultados de investigación:\n{{ JSON.stringify($json.results, null, 2) }}\n\nCrea un reporte detallado y estructurado que contribuya al bien común."
            }
          ]
        },
        "options": {
          "temperature": 0.3
        }
      },
      "name": "Analysis & Report",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [900, 300]
    },
    {
      "parameters": {
        "url": "{{ $('NIRA Planning').first().json.context.includes('backend') ? process.env.COOMUNITY_BACKEND_URL : 'http://localhost:3002' }}/communications/missions/{{ $('NIRA Planning').first().json.missionId }}/update",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Content-Type",
              "value": "application/json"
            },
            {
              "name": "Authorization",
              "value": "Bearer {{ process.env.COOMUNITY_API_KEY }}"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "status",
              "value": "COMPLETED"
            },
            {
              "name": "result",
              "value": "={{ $json.choices[0].message.content }}"
            },
            {
              "name": "agent",
              "value": "NIRA"
            }
          ]
        }
      },
      "name": "Update Backend",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [1120, 300]
    }
  ],
  "connections": {
    "Research Webhook": {
      "main": [
        [
          {
            "node": "NIRA Planning",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "NIRA Planning": {
      "main": [
        [
          {
            "node": "Web Research",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Web Research": {
      "main": [
        [
          {
            "node": "Analysis & Report",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Analysis & Report": {
      "main": [
        [
          {
            "node": "Update Backend",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

## 🎨 Workflow ARIA - Agente de Medios

### Webhook URL: `http://localhost:5678/webhook/aria-media`

```json
{
  "name": "ARIA - Agente de Medios",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "aria-media",
        "responseMode": "responseNode",
        "options": {}
      },
      "name": "Media Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "jsCode": "// 🎨 ARIA - Especialista en Creación de Medios\nconst input = $input.first().json;\n\n// 🖼️ Análisis de la misión creativa\nconst creativeProject = {\n  mission: input.mission,\n  context: input.context,\n  missionId: input.missionId,\n  mediaType: 'image', // Por defecto\n  style: 'conceptual',\n  dimensions: '1024x1024',\n  philosophy: 'Belleza que inspira transformación'\n};\n\n// 🎯 Determinar tipo de medio y estilo\nif (input.mission.toLowerCase().includes('logo') || input.mission.toLowerCase().includes('marca')) {\n  creativeProject.mediaType = 'logo';\n  creativeProject.style = 'professional';\n  creativeProject.dimensions = '512x512';\n}\n\nif (input.mission.toLowerCase().includes('social') || input.mission.toLowerCase().includes('redes')) {\n  creativeProject.mediaType = 'social_media';\n  creativeProject.dimensions = '1080x1080';\n}\n\nif (input.mission.toLowerCase().includes('banner') || input.mission.toLowerCase().includes('header')) {\n  creativeProject.mediaType = 'banner';\n  creativeProject.dimensions = '1200x630';\n}\n\n// 🌟 Enhancing prompt with CoomÜnity philosophy\nconst enhancedPrompt = `${input.mission}. \nEstilo: Inspirado en la filosofía CoomÜnity de Bien Común, cooperación y reciprocidad (Ayni). \nColores: Tonos naturales y armoniosos que transmitan confianza y crecimiento consciente. \nConcepto: Debe evocar transformación positiva, comunidad y sostenibilidad.`;\n\ncreativeProject.enhancedPrompt = enhancedPrompt;\n\nconsole.log(`🎨 ARIA Creative Project for ${input.missionId}:`, creativeProject);\n\nreturn [{ json: creativeProject }];"
      },
      "name": "ARIA Planning",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [460, 300]
    },
    {
      "parameters": {
        "model": "dall-e-3",
        "prompt": "={{ $json.enhancedPrompt }}",
        "options": {
          "size": "={{ $json.dimensions }}",
          "quality": "hd",
          "style": "natural"
        }
      },
      "name": "Generate Image",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [680, 300]
    },
    {
      "parameters": {
        "jsCode": "// 🖼️ Procesar imagen generada\nconst imageData = $input.first().json;\nconst projectData = $('ARIA Planning').first().json;\n\nconst result = {\n  missionId: projectData.missionId,\n  mediaType: projectData.mediaType,\n  imageUrl: imageData.data[0].url,\n  revisedPrompt: imageData.data[0].revised_prompt,\n  dimensions: projectData.dimensions,\n  philosophy: projectData.philosophy,\n  timestamp: new Date().toISOString(),\n  status: 'completed',\n  message: '🎨 ARIA ha creado una imagen que refleja la belleza y los valores de CoomÜnity'\n};\n\nconsole.log(`🎨 ARIA Completed: ${result.missionId}`);\n\nreturn [{ json: result }];"
      },
      "name": "Process Result",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [900, 300]
    },
    {
      "parameters": {
        "url": "{{ process.env.COOMUNITY_BACKEND_URL }}/communications/missions/{{ $json.missionId }}/update",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Content-Type",
              "value": "application/json"
            },
            {
              "name": "Authorization",
              "value": "Bearer {{ process.env.COOMUNITY_API_KEY }}"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "status",
              "value": "COMPLETED"
            },
            {
              "name": "result",
              "value": "={{ JSON.stringify($json) }}"
            },
            {
              "name": "agent",
              "value": "ARIA"
            }
          ]
        }
      },
      "name": "Update Backend",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [1120, 300]
    }
  ],
  "connections": {
    "Media Webhook": {
      "main": [
        [
          {
            "node": "ARIA Planning",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "ARIA Planning": {
      "main": [
        [
          {
            "node": "Generate Image",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Generate Image": {
      "main": [
        [
          {
            "node": "Process Result",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Process Result": {
      "main": [
        [
          {
            "node": "Update Backend",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

## 📢 Workflow HERALDO - Agente de Publicación

### Webhook URL: `http://localhost:5678/webhook/heraldo-publication`

```json
{
  "name": "HERALDO - Agente de Publicación",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "heraldo-publication",
        "responseMode": "responseNode",
        "options": {}
      },
      "name": "Publication Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "jsCode": "// 📢 HERALDO - Especialista en Publicación\nconst input = $input.first().json;\n\n// 📱 Análisis de la misión de publicación\nconst publicationPlan = {\n  mission: input.mission,\n  context: input.context,\n  missionId: input.missionId,\n  platforms: [],\n  schedule: null,\n  content: {\n    text: '',\n    image: null,\n    hashtags: []\n  },\n  philosophy: 'Mensajero del bien común digital'\n};\n\n// 🎯 Determinar plataformas objetivo\nif (input.mission.toLowerCase().includes('linkedin')) {\n  publicationPlan.platforms.push('linkedin');\n}\nif (input.mission.toLowerCase().includes('twitter') || input.mission.toLowerCase().includes('x.com')) {\n  publicationPlan.platforms.push('twitter');\n}\nif (input.mission.toLowerCase().includes('facebook')) {\n  publicationPlan.platforms.push('facebook');\n}\nif (input.mission.toLowerCase().includes('instagram')) {\n  publicationPlan.platforms.push('instagram');\n}\n\n// Si no se especifica plataforma, usar LinkedIn por defecto\nif (publicationPlan.platforms.length === 0) {\n  publicationPlan.platforms = ['linkedin'];\n}\n\n// 🕐 Determinar horario óptimo\nconst now = new Date();\nconst optimalHour = 10; // 10 AM hora local\nconst scheduleDate = new Date(now);\nscheduleDate.setHours(optimalHour, 0, 0, 0);\n\n// Si ya pasó la hora óptima de hoy, programar para mañana\nif (now.getHours() >= optimalHour) {\n  scheduleDate.setDate(scheduleDate.getDate() + 1);\n}\n\npublicationPlan.schedule = scheduleDate.toISOString();\n\n// 🏷️ Hashtags de CoomÜnity\npublicationPlan.content.hashtags = [\n  '#CoomUnity',\n  '#BienComun',\n  '#EconomiaColaborativa',\n  '#Ayni',\n  '#TransformacionConsciente'\n];\n\nconsole.log(`📢 HERALDO Publication Plan for ${input.missionId}:`, publicationPlan);\n\nreturn [{ json: publicationPlan }];"
      },
      "name": "HERALDO Planning",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [460, 300]
    },
    {
      "parameters": {
        "model": "gpt-4",
        "messages": {
          "messages": [
            {
              "role": "system",
              "content": "Eres HERALDO, el agente de publicación de CoomÜnity. Tu filosofía es 'Mensajero del bien común digital'. Creas contenido para redes sociales que inspire, eduque y promueva los valores de CoomÜnity: Bien Común, Cooperación, Reciprocidad (Ayni) y Transformación Consciente."
            },
            {
              "role": "user",
              "content": "Misión: {{ $json.mission }}\n\nContexto: {{ $json.context }}\n\nPlataformas objetivo: {{ $json.platforms.join(', ') }}\n\nCrea un post atractivo y alineado con la filosofía CoomÜnity. Incluye:\n1. Texto principal (máximo 280 caracteres para Twitter, 500 para LinkedIn)\n2. Call to action\n3. Hashtags relevantes\n\nEl contenido debe inspirar y educar sobre economía colaborativa y bien común."
            }
          ]
        },
        "options": {
          "temperature": 0.7
        }
      },
      "name": "Generate Content",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [680, 300]
    },
    {
      "parameters": {
        "url": "https://api.bufferapp.com/1/updates/create.json",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Authorization",
              "value": "Bearer {{ process.env.BUFFER_ACCESS_TOKEN }}"
            },
            {
              "name": "Content-Type",
              "value": "application/json"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "text",
              "value": "{{ $json.choices[0].message.content }}"
            },
            {
              "name": "profile_ids",
              "value": "{{ process.env.BUFFER_PROFILE_IDS }}"
            },
            {
              "name": "scheduled_at",
              "value": "={{ $('HERALDO Planning').first().json.schedule }}"
            }
          ]
        }
      },
      "name": "Schedule Post",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [900, 300]
    },
    {
      "parameters": {
        "url": "{{ process.env.COOMUNITY_BACKEND_URL }}/communications/missions/{{ $('HERALDO Planning').first().json.missionId }}/update",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Content-Type",
              "value": "application/json"
            },
            {
              "name": "Authorization",
              "value": "Bearer {{ process.env.COOMUNITY_API_KEY }}"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "status",
              "value": "COMPLETED"
            },
            {
              "name": "result",
              "value": "={{ JSON.stringify({ content: $('Generate Content').first().json.choices[0].message.content, scheduled: $('HERALDO Planning').first().json.schedule, platforms: $('HERALDO Planning').first().json.platforms }) }}"
            },
            {
              "name": "agent",
              "value": "HERALDO"
            }
          ]
        }
      },
      "name": "Update Backend",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [1120, 300]
    }
  ],
  "connections": {
    "Publication Webhook": {
      "main": [
        [
          {
            "node": "HERALDO Planning",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "HERALDO Planning": {
      "main": [
        [
          {
            "node": "Generate Content",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Generate Content": {
      "main": [
        [
          {
            "node": "Schedule Post",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Schedule Post": {
      "main": [
        [
          {
            "node": "Update Backend",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

## 🤝 Workflow PAX - Agente Ayudante

### Webhook URL: `http://localhost:5678/webhook/pax-notification`

```json
{
  "name": "PAX - Agente Ayudante",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "pax-notification",
        "responseMode": "responseNode",
        "options": {}
      },
      "name": "Notification Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "jsCode": "// 🤝 PAX - Facilitador de Comunicación\nconst input = $input.first().json;\n\n// 📨 Análisis de la misión de notificación\nconst notificationPlan = {\n  mission: input.mission,\n  context: input.context,\n  missionId: input.missionId,\n  notificationType: 'info',\n  channels: ['slack'],\n  urgency: 'normal',\n  philosophy: 'Puente entre la inteligencia artificial y humana'\n};\n\n// 🎯 Determinar tipo y urgencia\nif (input.mission.toLowerCase().includes('urgente') || input.mission.toLowerCase().includes('crítico')) {\n  notificationPlan.urgency = 'high';\n  notificationPlan.notificationType = 'alert';\n}\n\nif (input.mission.toLowerCase().includes('completado') || input.mission.toLowerCase().includes('éxito')) {\n  notificationPlan.notificationType = 'success';\n}\n\nif (input.mission.toLowerCase().includes('error') || input.mission.toLowerCase().includes('fallo')) {\n  notificationPlan.notificationType = 'error';\n  notificationPlan.urgency = 'high';\n}\n\n// 📱 Determinar canales\nif (input.mission.toLowerCase().includes('email')) {\n  notificationPlan.channels.push('email');\n}\n\nif (input.mission.toLowerCase().includes('sms')) {\n  notificationPlan.channels.push('sms');\n}\n\nconsole.log(`🤝 PAX Notification Plan for ${input.missionId}:`, notificationPlan);\n\nreturn [{ json: notificationPlan }];"
      },
      "name": "PAX Planning",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [460, 300]
    },
    {
      "parameters": {
        "model": "gpt-4",
        "messages": {
          "messages": [
            {
              "role": "system",
              "content": "Eres PAX, el agente ayudante de CoomÜnity. Tu filosofía es 'Puente entre la inteligencia artificial y humana'. Creas notificaciones claras, útiles y empáticas que faciliten la comunicación entre los sistemas IA y el equipo humano."
            },
            {
              "role": "user",
              "content": "Misión: {{ $json.mission }}\n\nContexto: {{ $json.context }}\n\nTipo de notificación: {{ $json.notificationType }}\nUrgencia: {{ $json.urgency }}\n\nCrea una notificación clara y profesional para el equipo. Incluye:\n1. Título descriptivo\n2. Mensaje principal (máximo 200 palabras)\n3. Acciones recomendadas si aplica\n\nTono: Profesional pero cálido, alineado con la filosofía CoomÜnity."
            }
          ]
        },
        "options": {
          "temperature": 0.5
        }
      },
      "name": "Generate Notification",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [680, 300]
    },
    {
      "parameters": {
        "url": "https://slack.com/api/chat.postMessage",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Authorization",
              "value": "Bearer {{ process.env.SLACK_BOT_TOKEN }}"
            },
            {
              "name": "Content-Type",
              "value": "application/json"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "channel",
              "value": "#coomunity-ai-agents"
            },
            {
              "name": "text",
              "value": "🤝 PAX - {{ $('PAX Planning').first().json.notificationType.toUpperCase() }}"
            },
            {
              "name": "blocks",
              "value": "=[\n  {\n    \"type\": \"header\",\n    \"text\": {\n      \"type\": \"plain_text\",\n      \"text\": \"🤝 PAX - Notificación del Sistema de Agentes\"\n    }\n  },\n  {\n    \"type\": \"section\",\n    \"text\": {\n      \"type\": \"mrkdwn\",\n      \"text\": $json.choices[0].message.content\n    }\n  },\n  {\n    \"type\": \"context\",\n    \"elements\": [\n      {\n        \"type\": \"mrkdwn\",\n        \"text\": \"*Misión ID:* \" + $('PAX Planning').first().json.missionId + \" | *Filosofía:* Puente entre IA y humanidad\"\n      }\n    ]\n  }\n]"
            }
          ]
        }
      },
      "name": "Send Slack Notification",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [900, 300]
    },
    {
      "parameters": {
        "url": "{{ process.env.COOMUNITY_BACKEND_URL }}/communications/missions/{{ $('PAX Planning').first().json.missionId }}/update",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Content-Type",
              "value": "application/json"
            },
            {
              "name": "Authorization",
              "value": "Bearer {{ process.env.COOMUNITY_API_KEY }}"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "status",
              "value": "COMPLETED"
            },
            {
              "name": "result",
              "value": "={{ JSON.stringify({ notification: $('Generate Notification').first().json.choices[0].message.content, channels: $('PAX Planning').first().json.channels, urgency: $('PAX Planning').first().json.urgency }) }}"
            },
            {
              "name": "agent",
              "value": "PAX"
            }
          ]
        }
      },
      "name": "Update Backend",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [1120, 300]
    }
  ],
  "connections": {
    "Notification Webhook": {
      "main": [
        [
          {
            "node": "PAX Planning",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "PAX Planning": {
      "main": [
        [
          {
            "node": "Generate Notification",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Generate Notification": {
      "main": [
        [
          {
            "node": "Send Slack Notification",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Send Slack Notification": {
      "main": [
        [
          {
            "node": "Update Backend",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

## 🔧 Configuración de Webhooks de Respuesta

### Endpoint Backend para Actualizaciones

El backend debe tener un endpoint para recibir actualizaciones de N8N:

```typescript
// backend/src/communications/communications.controller.ts

@Post('missions/:missionId/update')
@Roles('admin', 'system')
async updateMissionStatus(
  @Param('missionId') missionId: string,
  @Body() updateDto: {
    status: MissionStatus;
    result?: string;
    agent?: string;
  }
): Promise<{ success: boolean; message: string }> {
  return this.communicationsService.updateMissionFromN8N(
    missionId,
    updateDto
  );
}
```

## 🧪 Testing de Workflows

### Scripts de Prueba

```bash
#!/bin/bash
# test-agents.sh

echo "🧪 Testing CoomÜnity AI Agents System"

# Test ANA (Master Orchestrator)
echo "🧠 Testing ANA - Conciencia Orquestadora"
curl -X POST "http://localhost:5678/webhook/ai-agents-master" \
  -H "Content-Type: application/json" \
  -d '{
    "mission": "Crea una imagen conceptual sobre economía circular",
    "missionType": "MEDIA_CREATION",
    "targetAgent": "ARIA",
    "missionId": "test_001",
    "userId": "test_user"
  }'

# Test NIRA (Research Agent)
echo "🔍 Testing NIRA - Agente de Investigación"
curl -X POST "http://localhost:5678/webhook/nira-research" \
  -H "Content-Type: application/json" \
  -d '{
    "mission": "Investiga las 3 startups más innovadoras en economía circular",
    "context": "Para blog de CoomÜnity",
    "missionId": "test_002"
  }'

# Test ARIA (Media Agent)
echo "🎨 Testing ARIA - Agente de Medios"
curl -X POST "http://localhost:5678/webhook/aria-media" \
  -H "Content-Type: application/json" \
  -d '{
    "mission": "Crea una imagen que represente la cooperación y el bien común",
    "context": "Para redes sociales de CoomÜnity",
    "missionId": "test_003"
  }'

# Test HERALDO (Publication Agent)
echo "📢 Testing HERALDO - Agente de Publicación"
curl -X POST "http://localhost:5678/webhook/heraldo-publication" \
  -H "Content-Type: application/json" \
  -d '{
    "mission": "Publica en LinkedIn sobre los beneficios de la economía colaborativa",
    "context": "Promoción de filosofía CoomÜnity",
    "missionId": "test_004"
  }'

# Test PAX (Helper Agent)
echo "🤝 Testing PAX - Agente Ayudante"
curl -X POST "http://localhost:5678/webhook/pax-notification" \
  -H "Content-Type: application/json" \
  -d '{
    "mission": "Notifica al equipo que la misión de investigación ha sido completada",
    "context": "Misión test_002 completada exitosamente",
    "missionId": "test_005"
  }'

echo "✅ All agent tests dispatched!"
```

## 📊 Monitoreo y Logs

### Dashboard N8N

1. **Executions**: Monitorear todas las ejecuciones de workflows
2. **Logs**: Revisar logs detallados de cada agente
3. **Performance**: Métricas de tiempo de ejecución
4. **Errors**: Tracking de errores y fallos

### Métricas Clave

- **Tiempo de respuesta por agente**
- **Tasa de éxito/fallo**
- **Uso de recursos (tokens, API calls)**
- **Satisfacción del usuario**

## 🌟 Filosofía en los Workflows

Cada workflow implementa los principios CoomÜnity:

- **Bien Común**: Todos los agentes trabajan para el beneficio colectivo
- **Cooperación**: Los agentes se complementan en lugar de competir
- **Reciprocidad (Ayni)**: Balance energético en todas las interacciones
- **Conciencia**: Tecnología al servicio del despertar humano

---

**"En la sinfonía de N8N, cada workflow es un instrumento que contribuye a la melodía del Bien Común."** - Filosofía CoomÜnity
