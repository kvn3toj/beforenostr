/**
 * 🧪 A/B Testing Examples - CoomÜnity Platform
 * 
 * Ejemplos específicos de cómo medir el impacto de las variaciones
 * de densidad de interfaz usando eventos de GA4 y métricas personalizadas.
 * 
 * Este archivo proporciona:
 * - Ejemplos de consultas GA4 para análisis
 * - Métricas específicas de conversión
 * - Comparaciones entre grupos A/B
 * - Scripts para análisis estadístico
 */

class ABTestingAnalytics {
  constructor() {
    this.testName = 'interface_density';
    this.conversionEvents = [
      'button_click',
      'navigation_use', 
      'feature_discovery',
      'task_completion',
      'session_duration'
    ];
    this.comparisonMetrics = new Map();
    this.sessionData = new Map();
    
    this.init();
  }

  init() {
    console.log('🧪 A/B Testing Analytics initialized');
    this.startRealTimeTracking();
    this.setupConversionGoals();
  }

  /**
   * =======================================
   * 📊 MEDICIÓN DE CONVERSIONES ESPECÍFICAS
   * =======================================
   */

  /**
   * Medir tasa de clics en botones principales por grupo
   */
  measureButtonClickRate() {
    const group = this.getUserGroup();
    const buttonClicks = this.getEventCount('button_click');
    const totalPageViews = this.getEventCount('ab_page_view');
    
    const clickRate = totalPageViews > 0 ? (buttonClicks / totalPageViews) * 100 : 0;
    
    this.trackMetric('button_click_rate', {
      group: group,
      click_rate: clickRate,
      button_clicks: buttonClicks,
      page_views: totalPageViews,
      test_name: this.testName
    });

    return {
      group,
      clickRate,
      buttonClicks,
      totalPageViews
    };
  }

  /**
   * Medir uso de navegación adaptativa
   */
  measureNavigationUsage() {
    const group = this.getUserGroup();
    const navigationEvents = this.getEventCount('navigation_use');
    const uniqueSessions = this.getUniqueSessionCount();
    
    const navigationRate = uniqueSessions > 0 ? (navigationEvents / uniqueSessions) * 100 : 0;
    
    this.trackMetric('navigation_usage_rate', {
      group: group,
      navigation_rate: navigationRate,
      navigation_events: navigationEvents,
      unique_sessions: uniqueSessions,
      test_name: this.testName
    });

    return {
      group,
      navigationRate,
      navigationEvents,
      uniqueSessions
    };
  }

  /**
   * Medir descubrimiento de features
   */
  measureFeatureDiscovery() {
    const group = this.getUserGroup();
    const discoveryEvents = this.getEventCount('feature_discovery');
    const uniqueUsers = this.getUniqueUserCount();
    
    const discoveryRate = uniqueUsers > 0 ? (discoveryEvents / uniqueUsers) * 100 : 0;
    
    this.trackMetric('feature_discovery_rate', {
      group: group,
      discovery_rate: discoveryRate,
      discovery_events: discoveryEvents,
      unique_users: uniqueUsers,
      test_name: this.testName
    });

    return {
      group,
      discoveryRate,
      discoveryEvents,
      uniqueUsers
    };
  }

  /**
   * Medir tiempo promedio de sesión
   */
  measureSessionDuration() {
    const group = this.getUserGroup();
    const sessionDurations = this.getSessionDurations();
    
    const avgDuration = sessionDurations.length > 0 
      ? sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length 
      : 0;
    
    const medianDuration = this.calculateMedian(sessionDurations);
    
    this.trackMetric('session_duration_stats', {
      group: group,
      avg_duration_seconds: avgDuration,
      median_duration_seconds: medianDuration,
      total_sessions: sessionDurations.length,
      test_name: this.testName
    });

    return {
      group,
      avgDuration,
      medianDuration,
      totalSessions: sessionDurations.length
    };
  }

  /**
   * =======================================
   * 📈 ANÁLISIS COMPARATIVO GA4
   * =======================================
   */

  /**
   * Generar consultas GA4 para análisis comparativo
   */
  generateGA4Queries() {
    return {
      // Consulta 1: Tasa de conversión por grupo
      conversionRateByGroup: `
        SELECT 
          custom_parameter.value AS test_group,
          COUNT(DISTINCT user_pseudo_id) as unique_users,
          COUNTIF(event_name = 'ab_conversion') as conversions,
          SAFE_DIVIDE(COUNTIF(event_name = 'ab_conversion'), COUNT(DISTINCT user_pseudo_id)) * 100 as conversion_rate
        FROM \`your-project.analytics_xxx.events_*\`
        CROSS JOIN UNNEST(event_params) AS custom_parameter
        WHERE 
          _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)) 
          AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
          AND custom_parameter.key = 'test_name'
          AND custom_parameter.value.string_value = '${this.testName}'
        GROUP BY test_group
        ORDER BY test_group;
      `,

      // Consulta 2: Métricas de engagement por grupo
      engagementByGroup: `
        SELECT 
          test_group.value.string_value AS group_name,
          COUNT(DISTINCT user_pseudo_id) as unique_users,
          COUNT(*) as total_events,
          AVG(session_duration_seconds.value.int_value) as avg_session_duration,
          COUNTIF(event_name = 'navigation_use') as navigation_events,
          COUNTIF(event_name = 'feature_discovery') as feature_discovery_events
        FROM \`your-project.analytics_xxx.events_*\`
        CROSS JOIN UNNEST(event_params) AS test_group
        CROSS JOIN UNNEST(event_params) AS session_duration_seconds
        WHERE 
          _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)) 
          AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
          AND test_group.key = 'group'
          AND session_duration_seconds.key = 'duration_seconds'
          AND event_name IN ('ab_conversion', 'navigation_use', 'feature_discovery', 'session_duration')
        GROUP BY group_name
        ORDER BY group_name;
      `,

      // Consulta 3: Análisis de abandono por grupo
      bounceRateByGroup: `
        WITH session_events AS (
          SELECT 
            user_pseudo_id,
            ga_session_id,
            test_group.value.string_value AS group_name,
            COUNT(*) as events_per_session,
            MAX(event_timestamp) - MIN(event_timestamp) as session_duration_microseconds
          FROM \`your-project.analytics_xxx.events_*\`
          CROSS JOIN UNNEST(event_params) AS test_group
          WHERE 
            _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)) 
            AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
            AND test_group.key = 'group'
            AND event_name IN ('ab_page_view', 'ab_element_interaction', 'ab_conversion')
          GROUP BY user_pseudo_id, ga_session_id, group_name
        )
        SELECT 
          group_name,
          COUNT(*) as total_sessions,
          COUNTIF(events_per_session = 1) as bounce_sessions,
          SAFE_DIVIDE(COUNTIF(events_per_session = 1), COUNT(*)) * 100 as bounce_rate,
          AVG(session_duration_microseconds / 1000000) as avg_session_duration_seconds
        FROM session_events
        GROUP BY group_name
        ORDER BY group_name;
      `,

      // Consulta 4: Funnel de conversión por grupo
      conversionFunnelByGroup: `
        WITH user_events AS (
          SELECT 
            user_pseudo_id,
            test_group.value.string_value AS group_name,
            MAX(CASE WHEN event_name = 'ab_page_view' THEN 1 ELSE 0 END) as viewed_page,
            MAX(CASE WHEN event_name = 'ab_element_interaction' THEN 1 ELSE 0 END) as interacted,
            MAX(CASE WHEN event_name = 'navigation_use' THEN 1 ELSE 0 END) as used_navigation,
            MAX(CASE WHEN event_name = 'feature_discovery' THEN 1 ELSE 0 END) as discovered_feature,
            MAX(CASE WHEN event_name = 'ab_conversion' THEN 1 ELSE 0 END) as converted
          FROM \`your-project.analytics_xxx.events_*\`
          CROSS JOIN UNNEST(event_params) AS test_group
          WHERE 
            _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)) 
            AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
            AND test_group.key = 'group'
          GROUP BY user_pseudo_id, group_name
        )
        SELECT 
          group_name,
          COUNT(*) as total_users,
          SUM(viewed_page) as users_viewed_page,
          SUM(interacted) as users_interacted,
          SUM(used_navigation) as users_used_navigation,
          SUM(discovered_feature) as users_discovered_feature,
          SUM(converted) as users_converted,
          SAFE_DIVIDE(SUM(converted), COUNT(*)) * 100 as overall_conversion_rate
        FROM user_events
        GROUP BY group_name
        ORDER BY group_name;
      `
    };
  }

  /**
   * =======================================
   * 🎯 EJEMPLOS DE COMPARACIÓN DE IMPACTO
   * =======================================
   */

  /**
   * Comparar métricas clave entre grupos A y B
   */
  async compareGroupMetrics() {
    const groupA = await this.getGroupMetrics('A');
    const groupB = await this.getGroupMetrics('B');
    
    const comparison = {
      test_name: this.testName,
      date_range: this.getDateRange(),
      group_a: groupA,
      group_b: groupB,
      statistical_significance: this.calculateStatisticalSignificance(groupA, groupB),
      recommendations: this.generateRecommendations(groupA, groupB)
    };

    console.log('📊 Comparación de Grupos A/B:', comparison);
    return comparison;
  }

  /**
   * Calcular significancia estadística
   */
  calculateStatisticalSignificance(groupA, groupB) {
    // Implementación básica de test chi-cuadrado
    const totalA = groupA.total_users;
    const conversionA = groupA.conversions;
    const totalB = groupB.total_users;
    const conversionB = groupB.conversions;
    
    if (totalA === 0 || totalB === 0) {
      return { significant: false, p_value: null, confidence: 0 };
    }

    const rateA = conversionA / totalA;
    const rateB = conversionB / totalB;
    const pooledRate = (conversionA + conversionB) / (totalA + totalB);
    
    const seA = Math.sqrt(pooledRate * (1 - pooledRate) / totalA);
    const seB = Math.sqrt(pooledRate * (1 - pooledRate) / totalB);
    const seDiff = Math.sqrt(seA * seA + seB * seB);
    
    const zScore = Math.abs(rateA - rateB) / seDiff;
    const pValue = 2 * (1 - this.normalCDF(Math.abs(zScore)));
    
    return {
      significant: pValue < 0.05,
      p_value: pValue,
      confidence: (1 - pValue) * 100,
      z_score: zScore,
      effect_size: ((rateB - rateA) / rateA) * 100 // Porcentaje de cambio
    };
  }

  /**
   * Generar recomendaciones basadas en resultados
   */
  generateRecommendations(groupA, groupB) {
    const recommendations = [];
    
    // Comparar tasas de conversión
    if (groupB.conversion_rate > groupA.conversion_rate * 1.05) {
      recommendations.push({
        type: 'positive',
        metric: 'conversion_rate',
        message: `La densidad compacta (Grupo B) muestra ${((groupB.conversion_rate / groupA.conversion_rate - 1) * 100).toFixed(1)}% mejor tasa de conversión`,
        action: 'Considerar implementar la densidad compacta como estándar'
      });
    } else if (groupA.conversion_rate > groupB.conversion_rate * 1.05) {
      recommendations.push({
        type: 'negative',
        metric: 'conversion_rate',
        message: `La densidad normal (Grupo A) tiene mejor rendimiento en conversiones`,
        action: 'Mantener la densidad actual o revisar la implementación compacta'
      });
    }

    // Comparar tiempo de sesión
    if (groupB.avg_session_duration > groupA.avg_session_duration * 1.1) {
      recommendations.push({
        type: 'positive',
        metric: 'session_duration',
        message: `Los usuarios pasan más tiempo en la versión compacta`,
        action: 'La densidad compacta puede mejorar el engagement'
      });
    }

    // Comparar descubrimiento de features
    if (groupB.feature_discovery_rate > groupA.feature_discovery_rate * 1.05) {
      recommendations.push({
        type: 'positive',
        metric: 'feature_discovery',
        message: `La densidad compacta facilita el descubrimiento de funciones`,
        action: 'Considerar elementos más compactos para mejorar la exploración'
      });
    }

    return recommendations;
  }

  /**
   * =======================================
   * 🛠️ MÉTODOS HELPER
   * =======================================
   */

  getUserGroup() {
    return window.ABTesting ? window.ABTesting.getUserGroup(this.testName) : null;
  }

  getEventCount(eventType) {
    // Simulación - en producción, obtener de GA4
    return Math.floor(Math.random() * 100) + 10;
  }

  getUniqueSessionCount() {
    // Simulación - en producción, obtener de GA4
    return Math.floor(Math.random() * 50) + 5;
  }

  getUniqueUserCount() {
    // Simulación - en producción, obtener de GA4
    return Math.floor(Math.random() * 30) + 3;
  }

  getSessionDurations() {
    // Simulación - en producción, obtener de GA4
    return Array.from({length: 20}, () => Math.floor(Math.random() * 300) + 30);
  }

  async getGroupMetrics(group) {
    // Simulación de métricas - en producción, consultar GA4
    const baseConversions = group === 'A' ? 45 : 52;
    const baseUsers = group === 'A' ? 150 : 148;
    
    return {
      group: group,
      total_users: baseUsers,
      conversions: baseConversions,
      conversion_rate: (baseConversions / baseUsers) * 100,
      avg_session_duration: group === 'A' ? 185 : 210,
      feature_discovery_rate: group === 'A' ? 15.2 : 18.7,
      navigation_usage_rate: group === 'A' ? 67.3 : 72.1
    };
  }

  calculateMedian(arr) {
    const sorted = arr.slice().sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    
    if (sorted.length % 2 === 0) {
      return (sorted[middle - 1] + sorted[middle]) / 2;
    }
    return sorted[middle];
  }

  normalCDF(x) {
    // Aproximación de la función de distribución acumulativa normal
    return 0.5 * (1 + this.erf(x / Math.sqrt(2)));
  }

  erf(x) {
    // Aproximación de la función error
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;

    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
  }

  trackMetric(metricName, data) {
    // Enviar métrica personalizada a GA4
    if (typeof gtag !== 'undefined') {
      gtag('event', 'ab_metric_calculated', {
        metric_name: metricName,
        ...data,
        timestamp: new Date().toISOString()
      });
    }
    
    console.log(`📊 Métrica calculada: ${metricName}`, data);
  }

  getDateRange() {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - (30 * 24 * 60 * 60 * 1000)); // 30 días atrás
    
    return {
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0]
    };
  }

  startRealTimeTracking() {
    // Actualizar métricas cada 30 segundos
    setInterval(() => {
      this.measureButtonClickRate();
      this.measureNavigationUsage();
      this.measureFeatureDiscovery();
      this.measureSessionDuration();
    }, 30000);
  }

  setupConversionGoals() {
    // Configurar objetivos de conversión específicos
    const goals = {
      'high_engagement': {
        description: 'Usuario con alta interacción (>5 acciones)',
        trigger: (sessionData) => sessionData.interactions > 5
      },
      'feature_explorer': {
        description: 'Usuario que descubre múltiples features',
        trigger: (sessionData) => sessionData.featuresDiscovered > 2
      },
      'power_user': {
        description: 'Usuario con sesión larga y múltiples interacciones',
        trigger: (sessionData) => sessionData.sessionDuration > 300 && sessionData.interactions > 10
      }
    };

    this.conversionGoals = goals;
    console.log('🎯 Objetivos de conversión configurados:', Object.keys(goals));
  }

  /**
   * =======================================
   * 📤 EXPORTAR RESULTADOS
   * =======================================
   */

  exportResults() {
    const results = {
      test_configuration: {
        test_name: this.testName,
        start_date: this.getDateRange().start,
        end_date: this.getDateRange().end,
        variants: ['A', 'B']
      },
      ga4_queries: this.generateGA4Queries(),
      sample_metrics: {
        button_click_rate: this.measureButtonClickRate(),
        navigation_usage: this.measureNavigationUsage(),
        feature_discovery: this.measureFeatureDiscovery(),
        session_duration: this.measureSessionDuration()
      },
      analysis_recommendations: [
        'Recopilar datos durante al menos 2 semanas para significancia estadística',
        'Monitorear métricas secundarias como tasa de rebote y tiempo en página',
        'Realizar análisis de cohortes para entender el impacto a largo plazo',
        'A/B test adicionales en diferentes dispositivos y segmentos de usuario'
      ]
    };

    console.log('📊 Resultados exportados:', results);
    return results;
  }
}

// Inicializar analytics si estamos en un entorno de A/B testing
if (typeof window !== 'undefined' && window.ABTesting) {
  window.ABTestingAnalytics = new ABTestingAnalytics();
  
  // Exponer métodos útiles globalmente
  window.exportABResults = () => window.ABTestingAnalytics.exportResults();
  window.compareABGroups = () => window.ABTestingAnalytics.compareGroupMetrics();
  window.getGA4Queries = () => window.ABTestingAnalytics.generateGA4Queries();
}

// Exportar para uso en Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ABTestingAnalytics;
} 