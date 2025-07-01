import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { IncomingWebhook } from '@slack/webhook';
// Temporalmente importar desde monitoring hasta que movamos el DTO
import { ConsistencyCheckResultDto } from '../../monitoring/dto/health-report.dto';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private emailTransporter: nodemailer.Transporter | null = null;
  private slackWebhook: IncomingWebhook | null = null;

  constructor() {
    this.initializeEmailTransporter();
    this.initializeSlackWebhook();
  }

  private initializeEmailTransporter() {
    try {
      const emailConfig = {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      };

      if (emailConfig.host && emailConfig.auth.user && emailConfig.auth.pass) {
        this.emailTransporter = nodemailer.createTransporter(emailConfig);
        this.logger.log('Email transporter initialized successfully');
      } else {
        this.logger.warn('Email configuration incomplete - email alerts disabled');
      }
    } catch (error) {
      this.logger.error('Failed to initialize email transporter:', error);
    }
  }

  private initializeSlackWebhook() {
    try {
      const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
      if (slackWebhookUrl) {
        this.slackWebhook = new IncomingWebhook(slackWebhookUrl);
        this.logger.log('Slack webhook initialized successfully');
      } else {
        this.logger.warn('Slack webhook URL not configured - Slack alerts disabled');
      }
    } catch (error) {
      this.logger.error('Failed to initialize Slack webhook:', error);
    }
  }

  async sendConsistencyAlert(checkResult: ConsistencyCheckResultDto): Promise<boolean> {
    const threshold = parseInt(process.env.ALERT_THRESHOLD || '5');
    
    if (checkResult.inconsistenciesFound < threshold) {
      this.logger.log(`Inconsistencies (${checkResult.inconsistenciesFound}) below threshold (${threshold}) - no alert sent`);
      return false;
    }

    const alertMessage = this.buildAlertMessage(checkResult);
    let alertsSent = false;

    // Send email alert
    if (this.emailTransporter && process.env.ALERT_EMAIL_ENABLED === 'true') {
      try {
        await this.sendEmailAlert(alertMessage, checkResult);
        alertsSent = true;
        this.logger.log('Email alert sent successfully');
      } catch (error) {
        this.logger.error('Failed to send email alert:', error);
      }
    }

    // Send Slack alert
    if (this.slackWebhook && process.env.ALERT_SLACK_ENABLED === 'true') {
      try {
        await this.sendSlackAlert(alertMessage, checkResult);
        alertsSent = true;
        this.logger.log('Slack alert sent successfully');
      } catch (error) {
        this.logger.error('Failed to send Slack alert:', error);
      }
    }

    return alertsSent;
  }

  private buildAlertMessage(checkResult: ConsistencyCheckResultDto): string {
    const { inconsistenciesFound, totalVideos, problematicVideos } = checkResult;
    
    let message = `🚨 GAMIFIER VIDEO ANALYTICS ALERT\n\n`;
    message += `Consistency check completed at ${checkResult.timestamp}\n`;
    message += `Found ${inconsistenciesFound} inconsistencies out of ${totalVideos} videos checked\n\n`;
    
    if (problematicVideos.length > 0) {
      message += `Problematic videos:\n`;
      problematicVideos.slice(0, 10).forEach(video => {
        message += `- ID ${video.id}: ${video.title}\n`;
        message += `  Issue: ${video.issue}\n`;
        if (video.storedDuration !== null && video.actualDuration !== null) {
          message += `  Stored: ${video.storedDuration}s, Actual: ${video.actualDuration}s\n`;
        }
        message += `\n`;
      });
      
      if (problematicVideos.length > 10) {
        message += `... and ${problematicVideos.length - 10} more videos\n`;
      }
    }
    
    message += `\nExecution time: ${checkResult.executionTime}ms\n`;
    message += `Please check the system dashboard for more details.`;
    
    return message;
  }

  private async sendEmailAlert(message: string, checkResult: ConsistencyCheckResultDto): Promise<void> {
    if (!this.emailTransporter) {
      throw new Error('Email transporter not initialized');
    }

    const recipients = process.env.ALERT_EMAIL_RECIPIENTS?.split(',') || [];
    if (recipients.length === 0) {
      throw new Error('No email recipients configured');
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: recipients.join(','),
      subject: `🚨 GAMIFIER Alert: ${checkResult.inconsistenciesFound} Video Inconsistencies Detected`,
      text: message,
      html: this.formatEmailHtml(message, checkResult),
    };

    await this.emailTransporter.sendMail(mailOptions);
  }

  private async sendSlackAlert(message: string, checkResult: ConsistencyCheckResultDto): Promise<void> {
    if (!this.slackWebhook) {
      throw new Error('Slack webhook not initialized');
    }

    const slackMessage = {
      text: '🚨 GAMIFIER Video Analytics Alert',
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🚨 GAMIFIER Video Analytics Alert',
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Inconsistencies Found:* ${checkResult.inconsistenciesFound}`,
            },
            {
              type: 'mrkdwn',
              text: `*Total Videos Checked:* ${checkResult.totalVideos}`,
            },
            {
              type: 'mrkdwn',
              text: `*Execution Time:* ${checkResult.executionTime}ms`,
            },
            {
              type: 'mrkdwn',
              text: `*Timestamp:* ${checkResult.timestamp}`,
            },
          ],
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Top Issues:*\n${checkResult.problematicVideos.slice(0, 5).map(v => 
              `• ID ${v.id}: ${v.title} - ${v.issue}`
            ).join('\n')}`,
          },
        },
      ],
    };

    await this.slackWebhook.send(slackMessage);
  }

  private formatEmailHtml(message: string, checkResult: ConsistencyCheckResultDto): string {
    return `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #d32f2f; border-bottom: 2px solid #d32f2f; padding-bottom: 10px;">
              🚨 GAMIFIER Video Analytics Alert
            </h2>
            
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #856404;">Summary</h3>
              <ul style="margin: 0;">
                <li><strong>Inconsistencies Found:</strong> ${checkResult.inconsistenciesFound}</li>
                <li><strong>Total Videos Checked:</strong> ${checkResult.totalVideos}</li>
                <li><strong>Execution Time:</strong> ${checkResult.executionTime}ms</li>
                <li><strong>Timestamp:</strong> ${checkResult.timestamp}</li>
              </ul>
            </div>

            ${checkResult.problematicVideos.length > 0 ? `
              <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px; padding: 15px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #721c24;">Problematic Videos</h3>
                <ul>
                  ${checkResult.problematicVideos.slice(0, 10).map(video => `
                    <li style="margin-bottom: 10px;">
                      <strong>ID ${video.id}:</strong> ${video.title}<br>
                      <em>Issue:</em> ${video.issue}
                      ${video.storedDuration !== null && video.actualDuration !== null ? 
                        `<br><em>Duration:</em> Stored ${video.storedDuration}s, Actual ${video.actualDuration}s` : ''}
                    </li>
                  `).join('')}
                </ul>
                ${checkResult.problematicVideos.length > 10 ? 
                  `<p><em>... and ${checkResult.problematicVideos.length - 10} more videos</em></p>` : ''}
              </div>
            ` : ''}

            <div style="background-color: #e7f3ff; border: 1px solid #b3d9ff; border-radius: 5px; padding: 15px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Action Required:</strong> Please check the system dashboard for more details and consider running the auto-correction process if appropriate.</p>
            </div>

            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="font-size: 12px; color: #666; text-align: center;">
              This is an automated alert from the GAMIFIER Video Analytics Monitoring System
            </p>
          </div>
        </body>
      </html>
    `;
  }

  async testEmailConfiguration(): Promise<boolean> {
    if (!this.emailTransporter) {
      return false;
    }

    try {
      await this.emailTransporter.verify();
      return true;
    } catch (error) {
      this.logger.error('Email configuration test failed:', error);
      return false;
    }
  }

  async testSlackConfiguration(): Promise<boolean> {
    if (!this.slackWebhook) {
      return false;
    }

    try {
      await this.slackWebhook.send({
        text: '✅ GAMIFIER Monitoring System - Test message',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '✅ *GAMIFIER Monitoring System*\n\nThis is a test message to verify Slack integration is working correctly.',
            },
          },
        ],
      });
      return true;
    } catch (error) {
      this.logger.error('Slack configuration test failed:', error);
      return false;
    }
  }

  getAlertConfiguration() {
    return {
      emailEnabled: process.env.ALERT_EMAIL_ENABLED === 'true',
      slackEnabled: process.env.ALERT_SLACK_ENABLED === 'true',
      alertThreshold: parseInt(process.env.ALERT_THRESHOLD || '5'),
      emailRecipients: process.env.ALERT_EMAIL_RECIPIENTS?.split(',') || [],
      slackWebhookConfigured: !!process.env.SLACK_WEBHOOK_URL,
      emailConfigured: !!this.emailTransporter,
    };
  }

  /**
   * Envía un reporte de salud del sistema por email y/o Slack
   */
  async sendHealthReport(healthReport: any): Promise<boolean> {
    this.logger.log('📊 Sending system health report...');
    
    let emailSent = false;
    let slackSent = false;

    try {
      // Generar contenido del reporte
      const reportContent = this.generateHealthReportContent(healthReport);
      
      // Enviar por email si está configurado
      if (this.emailTransporter && process.env.ALERT_EMAIL_ENABLED === 'true') {
        emailSent = await this.sendHealthReportEmail(reportContent, healthReport);
      }

      // Enviar por Slack si está configurado
      if (this.slackWebhook && process.env.ALERT_SLACK_ENABLED === 'true') {
        slackSent = await this.sendHealthReportSlack(reportContent, healthReport);
      }

      const success = emailSent || slackSent;
      this.logger.log(`Health report sent - Email: ${emailSent}, Slack: ${slackSent}`);
      
      return success;

    } catch (error) {
      this.logger.error('Failed to send health report:', error);
      return false;
    }
  }

  /**
   * Genera el contenido del reporte de salud
   */
  private generateHealthReportContent(healthReport: any): {
    subject: string;
    text: string;
    html: string;
  } {
    const { period, timestamp, consistencyCheck, performanceMetrics, errorSummary, recommendations } = healthReport;
    
    const subject = `🏥 GAMIFIER ${period.toUpperCase()} Health Report - ${new Date(timestamp).toLocaleDateString()}`;
    
    const text = `
GAMIFIER SYSTEM HEALTH REPORT
=============================

Period: ${period}
Generated: ${new Date(timestamp).toLocaleString()}

CONSISTENCY CHECK
-----------------
Total Videos: ${consistencyCheck.totalVideos}
Inconsistencies Found: ${consistencyCheck.inconsistenciesFound}
Execution Time: ${consistencyCheck.executionTime}ms

PERFORMANCE METRICS
-------------------
Average Calculation Time: ${Math.round(performanceMetrics.averageCalculationTime)}ms
Total Calculations: ${performanceMetrics.totalCalculations}
Cache Hit Ratio: ${Math.round(performanceMetrics.cacheHitRatio)}%
Error Rate: ${Math.round(performanceMetrics.errorRate)}%

METHOD DISTRIBUTION
-------------------
Cache Hits: ${performanceMetrics.methodDistribution.cache_hit}
YouTube API: ${performanceMetrics.methodDistribution.youtube_api}
Scraping: ${performanceMetrics.methodDistribution.scraping}
Estimation: ${performanceMetrics.methodDistribution.estimation}

ERROR SUMMARY
-------------
Total Errors: ${errorSummary.totalErrors}
Critical Errors: ${errorSummary.criticalErrors}

RECOMMENDATIONS
---------------
${recommendations.map((rec: string, index: number) => `${index + 1}. ${rec}`).join('\n')}

---
This is an automated report from GAMIFIER Monitoring System.
    `.trim();

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
        <h1 style="color: #2c3e50; border-bottom: 2px solid #3498db;">🏥 GAMIFIER System Health Report</h1>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3>Report Summary</h3>
          <p><strong>Period:</strong> ${period}</p>
          <p><strong>Generated:</strong> ${new Date(timestamp).toLocaleString()}</p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
          <div style="background: #e8f5e8; padding: 15px; border-radius: 5px;">
            <h3 style="color: #27ae60;">✅ Consistency Check</h3>
            <p><strong>Total Videos:</strong> ${consistencyCheck.totalVideos}</p>
            <p><strong>Inconsistencies:</strong> ${consistencyCheck.inconsistenciesFound}</p>
            <p><strong>Execution Time:</strong> ${consistencyCheck.executionTime}ms</p>
          </div>
          
          <div style="background: #e8f4fd; padding: 15px; border-radius: 5px;">
            <h3 style="color: #3498db;">⚡ Performance</h3>
            <p><strong>Avg Calculation Time:</strong> ${Math.round(performanceMetrics.averageCalculationTime)}ms</p>
            <p><strong>Cache Hit Ratio:</strong> ${Math.round(performanceMetrics.cacheHitRatio)}%</p>
            <p><strong>Error Rate:</strong> ${Math.round(performanceMetrics.errorRate)}%</p>
          </div>
        </div>

        <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #856404;">🔧 Recommendations</h3>
          <ol>
            ${recommendations.map((rec: string) => `<li>${rec}</li>`).join('')}
          </ol>
        </div>

        <div style="background: #f8f9fa; padding: 10px; border-radius: 5px; margin: 20px 0; font-size: 12px; color: #6c757d;">
          <p>This is an automated report from GAMIFIER Monitoring System.</p>
        </div>
      </div>
    `;

    return { subject, text, html };
  }

  /**
   * Envía el reporte de salud por email
   */
  private async sendHealthReportEmail(reportContent: any, healthReport: any): Promise<boolean> {
    try {
      if (!this.emailTransporter) {
        this.logger.warn('Email transporter not available');
        return false;
      }

      const recipients = process.env.ALERT_EMAIL_RECIPIENTS?.split(',') || [];
      if (recipients.length === 0) {
        this.logger.warn('No email recipients configured');
        return false;
      }

      const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: recipients.join(','),
        subject: reportContent.subject,
        text: reportContent.text,
        html: reportContent.html,
      };

      await this.emailTransporter.sendMail(mailOptions);
      this.logger.log(`Health report email sent to ${recipients.length} recipients`);
      return true;

    } catch (error) {
      this.logger.error('Failed to send health report email:', error);
      return false;
    }
  }

  /**
   * Envía el reporte de salud por Slack
   */
  private async sendHealthReportSlack(reportContent: any, healthReport: any): Promise<boolean> {
    try {
      if (!this.slackWebhook) {
        this.logger.warn('Slack webhook not available');
        return false;
      }

      const { consistencyCheck, performanceMetrics, errorSummary } = healthReport;
      
      // Determinar color basado en el estado del sistema
      let color = '#36a64f'; // Verde por defecto
      if (errorSummary.criticalErrors > 0 || consistencyCheck.inconsistenciesFound > 10) {
        color = '#ff0000'; // Rojo para problemas críticos
      } else if (performanceMetrics.errorRate > 5 || performanceMetrics.cacheHitRatio < 50) {
        color = '#ffaa00'; // Amarillo para advertencias
      }

      const slackMessage = {
        text: `🏥 GAMIFIER ${healthReport.period.toUpperCase()} Health Report`,
        attachments: [
          {
            color,
            fields: [
              {
                title: 'Consistency Check',
                value: `${consistencyCheck.inconsistenciesFound} issues found in ${consistencyCheck.totalVideos} videos`,
                short: true
              },
              {
                title: 'Performance',
                value: `${Math.round(performanceMetrics.cacheHitRatio)}% cache hit ratio, ${Math.round(performanceMetrics.errorRate)}% error rate`,
                short: true
              },
              {
                title: 'Errors',
                value: `${errorSummary.totalErrors} total, ${errorSummary.criticalErrors} critical`,
                short: true
              },
              {
                title: 'Recommendations',
                value: healthReport.recommendations.slice(0, 3).join('\n• '),
                short: false
              }
            ],
            footer: 'GAMIFIER Monitoring System',
            ts: new Date(healthReport.timestamp).getTime() / 1000
          }
        ]
      };

      await this.slackWebhook.send(slackMessage);
      this.logger.log('Health report sent to Slack');
      return true;

    } catch (error) {
      this.logger.error('Failed to send health report to Slack:', error);
      return false;
    }
  }

  /**
   * Método adicional para enviar alertas de validación de preguntas
   */
  async sendQuestionValidationAlert(message: string, details: any): Promise<boolean> {
    this.logger.log('📋 Sending question validation alert...');
    
    let alertsSent = false;

    // Enviar por email si está configurado
    if (this.emailTransporter && process.env.ALERT_EMAIL_ENABLED === 'true') {
      try {
        const recipients = process.env.ALERT_EMAIL_RECIPIENTS?.split(',') || [];
        if (recipients.length > 0) {
          await this.emailTransporter.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: recipients.join(','),
            subject: '🔍 GAMIFIER Question Validation Alert',
            text: message,
            html: `<div style="font-family: Arial, sans-serif;">
              <h2>🔍 Question Validation Alert</h2>
              <pre>${message}</pre>
              <hr>
              <p>Details:</p>
              <pre>${JSON.stringify(details, null, 2)}</pre>
            </div>`
          });
          alertsSent = true;
          this.logger.log('Question validation email alert sent');
        }
      } catch (error) {
        this.logger.error('Failed to send question validation email alert:', error);
      }
    }

    // Enviar por Slack si está configurado
    if (this.slackWebhook && process.env.ALERT_SLACK_ENABLED === 'true') {
      try {
        await this.slackWebhook.send({
          text: '🔍 GAMIFIER Question Validation Alert',
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: message
              }
            }
          ]
        });
        alertsSent = true;
        this.logger.log('Question validation Slack alert sent');
      } catch (error) {
        this.logger.error('Failed to send question validation Slack alert:', error);
      }
    }

    return alertsSent;
  }
} 