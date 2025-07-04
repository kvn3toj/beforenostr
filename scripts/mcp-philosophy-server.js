#!/usr/bin/env node

/**
 * 🌟 CoomÜnity Philosophy Guardian MCP Server
 *
 * Este servidor MCP especializado asegura que todas las sugerencias de código,
 * arquitectura y decisiones de desarrollo se alineen con los principios fundamentales
 * de CoomÜnity: Reciprocidad (Ayni), Bien Común, y Economía Sagrada.
 *
 * @author CoomÜnity Guardianes Digitales
 * @philosophy Bien Común > bien particular
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

// Configuración filosófica CoomÜnity
const PHILOSOPHY_PRINCIPLES = {
  reciprocity: {
    name: "Reciprocidad (Ayni)",
    description: "Intercambio equilibrado de valor que beneficia a todas las partes",
    keywords: ["ayni", "reciprocidad", "intercambio", "equilibrio", "mutual"],
    antiPatterns: ["extracción", "explotación", "unilateral", "predatorio"]
  },
  bienComun: {
    name: "Bien Común",
    description: "Priorizar el beneficio colectivo sobre el individual",
    keywords: ["bien común", "colectivo", "comunidad", "compartido", "inclusivo"],
    antiPatterns: ["privado", "exclusivo", "individualista", "egoísta"]
  },
  economySagrada: {
    name: "Economía Sagrada",
    description: "Sistema económico basado en abundancia, colaboración y regeneración",
    keywords: ["abundancia", "colaboración", "regenerativo", "sostenible", "sagrado"],
    antiPatterns: ["escasez", "competencia", "extractivo", "destructivo"]
  },
  meritos: {
    name: "Mëritos",
    description: "Sistema de recompensas basado en contribuciones al Bien Común",
    keywords: ["méritos", "reconocimiento", "contribución", "impacto positivo"],
    antiPatterns: ["puntos vacíos", "gamificación adictiva", "manipulación"]
  },
  ondas: {
    name: "Öndas",
    description: "Unidades de energía vibracional por contribuciones conscientes",
    keywords: ["öndas", "energía", "vibración", "consciencia", "positivo"],
    antiPatterns: ["energía negativa", "toxicidad", "conflicto", "drama"]
  }
};

class PhilosophyGuardianServer {
  constructor() {
    this.server = new Server(
      {
        name: 'coomunity-philosophy-guardian',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'validate_philosophy_alignment',
            description: 'Validates if code or feature aligns with CoomÜnity philosophy',
            inputSchema: {
              type: 'object',
              properties: {
                feature_description: {
                  type: 'string',
                  description: 'Description of the feature or code to validate'
                },
                code_snippet: {
                  type: 'string',
                  description: 'Optional code snippet to analyze'
                },
                context: {
                  type: 'string',
                  description: 'Context about the implementation (UI, backend, etc.)'
                }
              },
              required: ['feature_description']
            }
          },
          {
            name: 'suggest_philosophy_improvements',
            description: 'Suggests improvements to better align with CoomÜnity principles',
            inputSchema: {
              type: 'object',
              properties: {
                current_implementation: {
                  type: 'string',
                  description: 'Current implementation or approach'
                },
                module: {
                  type: 'string',
                  enum: ['marketplace', 'uplay', 'social', 'ustats'],
                  description: 'CoomÜnity module context'
                }
              },
              required: ['current_implementation']
            }
          },
          {
            name: 'generate_philosophy_metrics',
            description: 'Generates metrics to measure philosophy alignment in implementations',
            inputSchema: {
              type: 'object',
              properties: {
                feature_area: {
                  type: 'string',
                  description: 'Area of the application to generate metrics for'
                }
              },
              required: ['feature_area']
            }
          }
        ]
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      switch (request.params.name) {
        case 'validate_philosophy_alignment':
          return await this.validatePhilosophyAlignment(request.params.arguments);
        case 'suggest_philosophy_improvements':
          return await this.suggestPhilosophyImprovements(request.params.arguments);
        case 'generate_philosophy_metrics':
          return await this.generatePhilosophyMetrics(request.params.arguments);
        default:
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${request.params.name}`
          );
      }
    });
  }

  async validatePhilosophyAlignment({ feature_description, code_snippet, context }) {
    const alignment = this.analyzeAlignment(feature_description + ' ' + (code_snippet || ''));

    const result = {
      overall_alignment: alignment.score,
      aligned_principles: alignment.aligned,
      misaligned_aspects: alignment.misaligned,
      recommendations: this.generateRecommendations(alignment),
      philosophy_score: {
        reciprocity: alignment.principles.reciprocity,
        bien_comun: alignment.principles.bienComun,
        economia_sagrada: alignment.principles.economySagrada,
        meritos: alignment.principles.meritos,
        ondas: alignment.principles.ondas
      }
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  }

  async suggestPhilosophyImprovements({ current_implementation, module }) {
    const improvements = this.generateImprovements(current_implementation, module);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(improvements, null, 2)
        }
      ]
    };
  }

  async generatePhilosophyMetrics({ feature_area }) {
    const metrics = {
      reciprocity_metrics: [
        "Balance de valor intercambiado",
        "Satisfacción mutua en transacciones",
        "Tiempo de resolución de desequilibrios"
      ],
      bien_comun_metrics: [
        "Porcentaje de decisiones que benefician a la comunidad",
        "Participación en iniciativas colectivas",
        "Impacto positivo medible en la comunidad"
      ],
      economia_sagrada_metrics: [
        "Recursos regenerados vs consumidos",
        "Colaboraciones exitosas vs competencias",
        "Nivel de abundancia percibida"
      ],
      meritos_metrics: [
        "Mëritos ganados por contribuciones al Bien Común",
        "Diversidad de tipos de contribuciones",
        "Consistencia en contribuciones positivas"
      ],
      ondas_metrics: [
        "Öndas generadas por interacciones positivas",
        "Nivel de consciencia en las acciones",
        "Impacto vibracional en la comunidad"
      ]
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(metrics, null, 2)
        }
      ]
    };
  }

  analyzeAlignment(text) {
    const lowerText = text.toLowerCase();
    let score = 0;
    const aligned = [];
    const misaligned = [];
    const principles = {};

    Object.entries(PHILOSOPHY_PRINCIPLES).forEach(([key, principle]) => {
      let principleScore = 0;

      // Check for positive keywords
      principle.keywords.forEach(keyword => {
        if (lowerText.includes(keyword)) {
          principleScore += 10;
          aligned.push(`${principle.name}: incluye "${keyword}"`);
        }
      });

      // Check for anti-patterns
      principle.antiPatterns.forEach(antiPattern => {
        if (lowerText.includes(antiPattern)) {
          principleScore -= 15;
          misaligned.push(`${principle.name}: contiene anti-patrón "${antiPattern}"`);
        }
      });

      principles[key] = Math.max(0, Math.min(100, principleScore + 50));
      score += principles[key];
    });

    return {
      score: Math.round(score / Object.keys(PHILOSOPHY_PRINCIPLES).length),
      aligned,
      misaligned,
      principles
    };
  }

  generateRecommendations(alignment) {
    const recommendations = [];

    if (alignment.score < 70) {
      recommendations.push("🌟 Considera integrar más principios de Reciprocidad en el diseño");
      recommendations.push("🤝 Asegúrate de que la funcionalidad beneficie al Bien Común");
      recommendations.push("💫 Incluye elementos que generen Öndas positivas");
    }

    if (alignment.principles.reciprocity < 60) {
      recommendations.push("⚖️ Añade mecanismos que aseguren intercambio equilibrado de valor");
    }

    if (alignment.principles.bienComun < 60) {
      recommendations.push("🌍 Prioriza el beneficio colectivo sobre las ganancias individuales");
    }

    return recommendations;
  }

  generateImprovements(implementation, module) {
    const improvements = {
      current_analysis: this.analyzeAlignment(implementation),
      module_specific_suggestions: this.getModuleSuggestions(module),
      code_patterns: this.getPhilosophyCodePatterns(module),
      ui_ux_guidelines: this.getPhilosophyUXGuidelines(module)
    };

    return improvements;
  }

  getModuleSuggestions(module) {
    const suggestions = {
      marketplace: [
        "Implementar sistema de reputación basado en Reciprocidad",
        "Incluir métricas de impacto en Bien Común para cada transacción",
        "Añadir sistema de resolución colaborativa de conflictos"
      ],
      uplay: [
        "Integrar preguntas que fomenten reflexión sobre Bien Común",
        "Otorgar Mëritos por compartir conocimiento con la comunidad",
        "Incluir pausas conscientes para generar Öndas positivas"
      ],
      social: [
        "Priorizar conexiones basadas en contribuciones al Bien Común",
        "Implementar sistemas de mediación para resolver conflictos",
        "Fomentar colaboración sobre competencia"
      ],
      ustats: [
        "Mostrar métricas de impacto en la comunidad",
        "Visualizar balance de Reciprocidad personal",
        "Incluir indicadores de contribución al Bien Común"
      ]
    };

    return suggestions[module] || ["Aplicar principios generales de CoomÜnity"];
  }

  getPhilosophyCodePatterns(module) {
    return [
      "// Reciprocidad: Esta función asegura intercambio equilibrado",
      "// Bien Común: Prioriza beneficio colectivo",
      "// Mëritos: Recompensa contribuciones positivas",
      "// Öndas: Genera energía vibracional positiva"
    ];
  }

  getPhilosophyUXGuidelines(module) {
    return [
      "UI debe promover colaboración sobre competencia",
      "Colores y formas que generen sensación de armonía",
      "Textos que fomenten la consciencia y reflexión",
      "Interacciones que celebren el Bien Común"
    ];
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('🌟 CoomÜnity Philosophy Guardian MCP Server started');
  }
}

const server = new PhilosophyGuardianServer();
server.run().catch(console.error);
