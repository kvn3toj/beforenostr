import { PrismaClient } from '@prisma/client';
import { Locale } from '@/lib/i18n';

const prisma = new PrismaClient();

// Categories data
const categoriesData = [
  {
    name: 'established',
    description: 'Questions about your relationship with established norms and systems',
    displayOrder: 1,
    translations: {
      es: {
        name: 'Lo Establecido',
        description: 'Preguntas sobre tu relación con las normas y sistemas establecidos',
      },
      en: {
        name: 'The Established',
        description: 'Questions about your relationship with established norms and systems',
      },
      pt: {
        name: 'O Estabelecido',
        description: 'Perguntas sobre sua relação com normas e sistemas estabelecidos',
      }
    }
  },
  {
    name: 'creativity',
    description: 'Questions about your creative mindset and approach to problems',
    displayOrder: 2,
    translations: {
      es: {
        name: 'Creatividad',
        description: 'Preguntas sobre tu mentalidad creativa y enfoque de problemas',
      },
      en: {
        name: 'Creativity',
        description: 'Questions about your creative mindset and approach to problems',
      },
      pt: {
        name: 'Criatividade',
        description: 'Perguntas sobre sua mentalidade criativa e abordagem de problemas',
      }
    }
  },
  {
    name: 'innovation',
    description: 'Questions about your approach to innovation and change',
    displayOrder: 3,
    translations: {
      es: {
        name: 'Innovación',
        description: 'Preguntas sobre tu enfoque de la innovación y el cambio',
      },
      en: {
        name: 'Innovation',
        description: 'Questions about your approach to innovation and change',
      },
      pt: {
        name: 'Inovação',
        description: 'Perguntas sobre sua abordagem à inovação e mudança',
      }
    }
  },
  {
    name: 'leadership',
    description: 'Questions about your leadership style and approach',
    displayOrder: 4,
    translations: {
      es: {
        name: 'Liderazgo',
        description: 'Preguntas sobre tu estilo de liderazgo y enfoque',
      },
      en: {
        name: 'Leadership',
        description: 'Questions about your leadership style and approach',
      },
      pt: {
        name: 'Liderança',
        description: 'Perguntas sobre seu estilo de liderança e abordagem',
      }
    }
  },
  {
    name: 'entrepreneurship',
    description: 'Questions about your entrepreneurial mindset and approach',
    displayOrder: 5,
    translations: {
      es: {
        name: 'Emprendimiento',
        description: 'Preguntas sobre tu mentalidad y enfoque emprendedor',
      },
      en: {
        name: 'Entrepreneurship',
        description: 'Questions about your entrepreneurial mindset and approach',
      },
      pt: {
        name: 'Empreendedorismo',
        description: 'Perguntas sobre sua mentalidade e abordagem empreendedora',
      }
    }
  }
];

// Set of questions for each category, with translations
// For demonstration purposes, we'll create 5 questions for each category
const createQuestionsData = () => {
  const questionSets = [
    // Established
    [
      {
        text: 'En el mundo de los negocios es mejor cooperar que competir',
        isRedRightSide: true,
        translations: {
          en: 'In the business world, it\'s better to cooperate than compete',
          pt: 'No mundo dos negócios é melhor cooperar do que competir'
        }
      },
      {
        text: 'Tratar de cambiar al mundo con pequeñas acciones es perder el tiempo',
        isRedRightSide: false,
        translations: {
          en: 'Trying to change the world with small actions is a waste of time',
          pt: 'Tentar mudar o mundo com pequenas ações é perder tempo'
        }
      },
      {
        text: 'Para mejorar la economía hay que apoyar al emprendedor local',
        isRedRightSide: true,
        translations: {
          en: 'To improve the economy, we must support local entrepreneurs',
          pt: 'Para melhorar a economia, devemos apoiar o empreendedor local'
        }
      },
      {
        text: 'Vivir de mi propósito es un cuento de hadas',
        isRedRightSide: false,
        translations: {
          en: 'Living from my purpose is a fairy tale',
          pt: 'Viver do meu propósito é um conto de fadas'
        }
      },
      {
        text: 'Para ganar siempre hay que aplicar la regla del "vivo bobo"',
        isRedRightSide: false,
        translations: {
          en: 'To always win, you have to apply the "smart fool" rule',
          pt: 'Para ganhar sempre, você precisa aplicar a regra do "esperto-tolo"'
        }
      }
    ],
    // Creativity
    [
      {
        text: 'Prefiero seguir un método probado que experimentar con nuevas ideas',
        isRedRightSide: false,
        translations: {
          en: 'I prefer to follow a proven method rather than experiment with new ideas',
          pt: 'Prefiro seguir um método comprovado em vez de experimentar novas ideias'
        }
      },
      {
        text: 'La creatividad es una habilidad que se puede desarrollar, no un talento innato',
        isRedRightSide: true,
        translations: {
          en: 'Creativity is a skill that can be developed, not an innate talent',
          pt: 'A criatividade é uma habilidade que pode ser desenvolvida, não um talento inato'
        }
      },
      {
        text: 'Me siento cómodo con la ambigüedad y la incertidumbre',
        isRedRightSide: true,
        translations: {
          en: 'I feel comfortable with ambiguity and uncertainty',
          pt: 'Me sinto confortável com ambiguidade e incerteza'
        }
      },
      {
        text: 'Regularmente busco inspiración fuera de mi área de expertise',
        isRedRightSide: true,
        translations: {
          en: 'I regularly seek inspiration outside my area of expertise',
          pt: 'Regularmente busco inspiração fora da minha área de especialização'
        }
      },
      {
        text: 'Las limitaciones y restricciones suelen bloquear mi creatividad',
        isRedRightSide: false,
        translations: {
          en: 'Limitations and restrictions usually block my creativity',
          pt: 'Limitações e restrições geralmente bloqueiam minha criatividade'
        }
      }
    ],
    // Innovation
    [
      {
        text: 'Estoy dispuesto a cuestionar el status quo incluso cuando es incómodo',
        isRedRightSide: true,
        translations: {
          en: 'I am willing to question the status quo even when it\'s uncomfortable',
          pt: 'Estou disposto a questionar o status quo mesmo quando é desconfortável'
        }
      },
      {
        text: 'Prefiero adaptar ideas existentes que crear algo completamente nuevo',
        isRedRightSide: false,
        translations: {
          en: 'I prefer to adapt existing ideas rather than create something completely new',
          pt: 'Prefiro adaptar ideias existentes em vez de criar algo completamente novo'
        }
      },
      {
        text: 'Aprendo activamente de mis fracasos y los veo como oportunidades',
        isRedRightSide: true,
        translations: {
          en: 'I actively learn from my failures and see them as opportunities',
          pt: 'Aprendo ativamente com meus fracassos e os vejo como oportunidades'
        }
      },
      {
        text: 'La mayoría de las innovaciones exitosas provienen de momentos "eureka" y no de trabajo duro',
        isRedRightSide: false,
        translations: {
          en: 'Most successful innovations come from "eureka" moments, not hard work',
          pt: 'A maioria das inovações bem-sucedidas vem de momentos "eureka", não de trabalho árduo'
        }
      },
      {
        text: 'Me gusta romper procesos existentes para encontrar formas más eficientes de hacer las cosas',
        isRedRightSide: true,
        translations: {
          en: 'I like to break existing processes to find more efficient ways of doing things',
          pt: 'Gosto de quebrar processos existentes para encontrar maneiras mais eficientes de fazer as coisas'
        }
      }
    ],
    // Leadership
    [
      {
        text: 'Un buen líder siempre sabe la respuesta correcta',
        isRedRightSide: false,
        translations: {
          en: 'A good leader always knows the right answer',
          pt: 'Um bom líder sempre sabe a resposta certa'
        }
      },
      {
        text: 'Prefiero colaborar con otros que tomar decisiones por mi cuenta',
        isRedRightSide: true,
        translations: {
          en: 'I prefer to collaborate with others rather than make decisions on my own',
          pt: 'Prefiro colaborar com outros em vez de tomar decisões por conta própria'
        }
      },
      {
        text: 'Los mejores líderes son aquellos que nutren y desarrollan a otros',
        isRedRightSide: true,
        translations: {
          en: 'The best leaders are those who nurture and develop others',
          pt: 'Os melhores líderes são aqueles que nutrem e desenvolvem os outros'
        }
      },
      {
        text: 'La autoridad en una organización debe ser respetada, incluso cuando no estás de acuerdo',
        isRedRightSide: false,
        translations: {
          en: 'Authority in an organization should be respected, even when you disagree',
          pt: 'A autoridade em uma organização deve ser respeitada, mesmo quando você discorda'
        }
      },
      {
        text: 'Estoy cómodo liderando situaciones ambiguas sin tener todas las respuestas',
        isRedRightSide: true,
        translations: {
          en: 'I am comfortable leading ambiguous situations without having all the answers',
          pt: 'Estou confortável liderando situações ambíguas sem ter todas as respostas'
        }
      }
    ],
    // Entrepreneurship
    [
      {
        text: 'Prefiero la seguridad de un trabajo estable que el riesgo de emprender',
        isRedRightSide: false,
        translations: {
          en: 'I prefer the security of a stable job to the risk of entrepreneurship',
          pt: 'Prefiro a segurança de um trabalho estável ao risco de empreender'
        }
      },
      {
        text: 'Estoy dispuesto a persistir ante múltiples fracasos antes de rendirme',
        isRedRightSide: true,
        translations: {
          en: 'I am willing to persist through multiple failures before giving up',
          pt: 'Estou disposto a persistir através de múltiplos fracassos antes de desistir'
        }
      },
      {
        text: 'A menudo veo oportunidades de negocio donde otros no las ven',
        isRedRightSide: true,
        translations: {
          en: 'I often see business opportunities where others don\'t',
          pt: 'Frequentemente vejo oportunidades de negócios onde outros não veem'
        }
      },
      {
        text: 'Estoy cómodo tomando decisiones que implican riesgo financiero',
        isRedRightSide: true,
        translations: {
          en: 'I am comfortable making decisions that involve financial risk',
          pt: 'Estou confortável tomando decisões que envolvem risco financeiro'
        }
      },
      {
        text: 'Un buen plan de negocios es más importante que adaptarse rápidamente a los cambios del mercado',
        isRedRightSide: false,
        translations: {
          en: 'A good business plan is more important than adapting quickly to market changes',
          pt: 'Um bom plano de negócios é mais importante do que se adaptar rapidamente às mudanças de mercado'
        }
      }
    ]
  ];

  return questionSets;
};

// Seed function to populate the database
export async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Create categories for each language
    for (const language of ['es', 'en', 'pt'] as Locale[]) {
      console.log(`Creating categories for language: ${language}`);

      for (const category of categoriesData) {
        const translation = category.translations[language];

        await prisma.category.upsert({
          where: {
            name_language: {
              name: language === 'es' ? category.name : translation.name,
              language,
            },
          },
          update: {
            description: translation.description,
            displayOrder: category.displayOrder,
          },
          create: {
            name: language === 'es' ? category.name : translation.name,
            description: translation.description,
            displayOrder: category.displayOrder,
            language,
          },
        });
      }
    }

    // Create questions for each category and language
    const questionSets = createQuestionsData();

    for (const language of ['es', 'en', 'pt'] as Locale[]) {
      console.log(`Creating questions for language: ${language}`);

      for (let categoryIndex = 0; categoryIndex < categoriesData.length; categoryIndex++) {
        const category = categoriesData[categoryIndex];
        const questions = questionSets[categoryIndex];

        // Get the category ID
        const categoryRecord = await prisma.category.findFirst({
          where: {
            name: language === 'es' ? category.name : category.translations[language].name,
            language,
          },
        });

        if (!categoryRecord) {
          console.error(`Category not found: ${category.name} (${language})`);
          continue;
        }

        // Create questions for this category
        for (let questionIndex = 0; questionIndex < questions.length; questionIndex++) {
          const question = questions[questionIndex];
          const questionText = language === 'es' ? question.text : question.translations[language];

          await prisma.question.upsert({
            where: {
              id: `${categoryRecord.id}-${questionIndex + 1}-${language}`,
            },
            update: {
              text: questionText,
              isRedRightSide: question.isRedRightSide,
              displayOrder: questionIndex + 1,
            },
            create: {
              id: `${categoryRecord.id}-${questionIndex + 1}-${language}`,
              text: questionText,
              categoryId: categoryRecord.id,
              isRedRightSide: question.isRedRightSide,
              displayOrder: questionIndex + 1,
              language,
            },
          });
        }
      }
    }

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Only run the seed function if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => console.log('Seeding completed!'))
    .catch((e) => console.error('Error in seeding:', e));
}

export default seedDatabase;
