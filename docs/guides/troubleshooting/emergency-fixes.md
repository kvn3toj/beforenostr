# ⚡ EMERGENCY FIXES - COOMUNITY
**🚨 PRIORIDAD MÁXIMA | ⏱️ Soluciones Inmediatas | 🔧 Crisis Resolution**

---

## 🚨 **PROBLEMAS CRÍTICOS Y SOLUCIONES INMEDIATAS**

### **🔥 CRISIS LEVEL 1: SISTEMA COMPLETAMENTE CAÍDO**

#### **❌ SuperApp No Carga (Error 404/500)**
```bash
# DIAGNÓSTICO INMEDIATO (30 segundos)
curl -I https://superapp-peach.vercel.app
# Si no responde HTTP 200:

# SOLUCIÓN A: Vercel deployment issue
cd Demo/apps/superapp-unified
vercel --prod --force

# SOLUCIÓN B: Si A falla, rollback
vercel rollback
```

#### **❌ Backend No Responde (API Down)**
```bash
# DIAGNÓSTICO INMEDIATO (30 segundos)
curl https://backend-production-80bb.up.railway.app/health
# Si no responde:

# SOLUCIÓN A: Railway restart
railway redeploy --service=backend

# SOLUCIÓN B: Check logs
railway logs --service=backend --lines=20

# SOLUCIÓN C: Emergency local fallback
cd backend && npm run start:dev
# Actualizar frontend a http://localhost:3002
```

#### **❌ Database Connection Lost**
```bash
# DIAGNÓSTICO (1 minuto)
railway logs --service=backend | grep -i "database\|postgres"

# SOLUCIÓN A: Railway restart database
railway restart --service=postgres

# SOLUCIÓN B: Check connection string
railway variables --service=backend | grep DATABASE_URL

# SOLUCIÓN C: If corrupted, restore backup
# Contact Railway support for backup restore
```

---

### **🔥 CRISIS LEVEL 2: FUNCIONALIDAD CRÍTICA ROTA**

#### **❌ Login/Authentication Failing**
```bash
# DIAGNÓSTICO RÁPIDO
curl -X POST "https://backend-production-80bb.up.railway.app/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@gamifier.com", "password": "admin123"}'

# Si falla:
# SOLUCIÓN A: Check JWT secret
railway variables --service=backend | grep JWT_SECRET

# SOLUCIÓN B: Reset auth service
# Restart backend service specifically
railway restart --service=backend

# SOLUCIÓN C: Enable mock auth temporarily
cd Demo/apps/superapp-unified
echo "VITE_ENABLE_MOCK_AUTH=true" >> .env.production
vercel --prod
```

#### **❌ Critical Feature Broken (ÜPlay, Marketplace)**
```bash
# DIAGNÓSTICO: Check specific module
curl https://backend-production-80bb.up.railway.app/api/[module]
# Replace [module] with: uplay, marketplace, users

# SOLUCIÓN A: Rollback to last working commit
git log --oneline -10
git revert [COMMIT_HASH]
git push origin main

# SOLUCIÓN B: Hotfix deployment
# Fix critical issue locally
# Test fix
# Fast deployment:
git add .
git commit -m "HOTFIX: critical [module] issue"
git push origin main
```

---

### **🔥 CRISIS LEVEL 3: PERFORMANCE DEGRADATION**

#### **❌ Extremely Slow Loading (>10 seconds)**
```bash
# DIAGNÓSTICO PERFORMANCE
lighthouse https://superapp-peach.vercel.app --output=json

# SOLUCIÓN A: Clear Vercel cache
vercel --prod --force

# SOLUCIÓN B: Check Railway resource usage
railway metrics --service=backend

# SOLUCIÓN C: Scale Railway resources temporarily
# From Railway dashboard: increase memory/CPU

# SOLUCIÓN D: Enable maintenance mode
echo "Under maintenance - back in 10 minutes" > maintenance.html
# Deploy maintenance page temporarily
```

#### **❌ High Error Rate (>5% requests failing)**
```bash
# DIAGNÓSTICO ERROR RATE
railway logs --service=backend --lines=50 | grep -i "error\|exception"

# SOLUCIÓN A: Identify error pattern
# Fix most frequent error first

# SOLUCIÓN B: Rate limiting
# Implement emergency rate limiting if being attacked

# SOLUCIÓN C: Scale resources
# Increase Railway plan temporarily if traffic spike
```

---

## 🛠️ **HERRAMIENTAS DE DIAGNÓSTICO RÁPIDO**

### **📊 Health Check Commands (30 segundos)**
```bash
#!/bin/bash
# Save as emergency-health-check.sh

echo "🔍 EMERGENCY HEALTH CHECK"
echo "========================"

# Frontend check
echo "📱 Frontend:"
curl -I https://superapp-peach.vercel.app | head -1

# Backend check  
echo "🔧 Backend:"
curl -s https://backend-production-80bb.up.railway.app/health | head -1

# Auth check
echo "🔐 Auth:"
curl -s -X POST "https://backend-production-80bb.up.railway.app/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@gamifier.com", "password": "admin123"}' | \
  grep -q "access_token" && echo "✅ OK" || echo "❌ FAILED"

# Database check
echo "🗄️ Database:"
railway logs --service=backend --lines=5 | grep -q "Database connection" && echo "✅ OK" || echo "❌ CHECK LOGS"

echo ""
echo "🎯 If any FAILED, use solutions above ⬆️"
```

### **📈 Performance Quick Check**
```bash
#!/bin/bash
# Performance emergency check

echo "⚡ PERFORMANCE CHECK"
echo "==================="

# Page load time
echo "📊 Page Load Time:"
curl -w "%{time_total}s" -o /dev/null -s https://superapp-peach.vercel.app

# API response time
echo "🔧 API Response Time:"
curl -w "%{time_total}s" -o /dev/null -s https://backend-production-80bb.up.railway.app/health

# Railway resource usage
echo "💾 Railway Resources:"
railway metrics --service=backend
```

---

## 🚨 **ESCALATION PROCEDURES**

### **📞 WHEN TO ESCALATE**

#### **🔥 Immediate Escalation (call/message now):**
- System down >1 hour
- Data loss detected
- Security breach suspected
- >50% users affected

#### **⚠️ Standard Escalation (within 2 hours):**
- Performance degraded >4 hours
- Critical feature broken >2 hours
- Error rate >10%
- Unable to deploy fixes

#### **📋 Documentation Escalation (within 24 hours):**
- Recurring issues
- Resource limits reached
- User complaints increasing
- Need architecture changes

### **📱 Emergency Contacts**
```
PRIMARY: Development Team Lead
SECONDARY: Infrastructure Support  
TERTIARY: Platform Support (Railway/Vercel)
```

---

## 🎯 **PREVENTION MEASURES**

### **🔄 Daily Monitoring (Automated)**
```bash
# Add to cron job (every 15 minutes)
0,15,30,45 * * * * /path/to/emergency-health-check.sh

# Email alert if any check fails
# Slack notification if critical
```

### **📊 Weekly Health Review**
- [ ] Check all emergency procedures work
- [ ] Review escalation contacts
- [ ] Update troubleshooting docs
- [ ] Test backup/restore procedures

### **🛡️ Proactive Measures**
- **Monitoring**: UptimeRobot + Railway alerts
- **Backups**: Daily database backups
- **Documentation**: Keep this doc updated
- **Testing**: Monthly disaster recovery test

---

## 📚 **RELATED DOCUMENTATION**

### **🔍 Detailed Troubleshooting:**
- [Common Issues](./common-issues.md) - Non-critical problems
- [Debugging Workflows](./debugging-workflows.md) - Systematic debugging
- [Railway Resolution](../../deployment/environments/railway-resolution.md) - Railway specific

### **🏗️ Architecture References:**
- [System Overview](../../architecture/current/system-overview.md) - Understanding the system
- [Monitoring Setup](../../operations/monitoring/setup-guide.md) - Monitoring configuration

### **📋 Checklists:**
- [Deployment Checklist](../../references/checklists/deployment-checklist.md) - Pre-deployment checks
- [Testing Checklist](../../references/checklists/testing-checklist.md) - Testing procedures

---

## 🌟 **POST-INCIDENT PROCEDURES**

### **📝 AFTER RESOLVING EMERGENCY:**

#### **Immediate (within 1 hour):**
- [ ] Document what happened
- [ ] Document solution applied  
- [ ] Verify system fully restored
- [ ] Notify stakeholders resolution

#### **Short-term (within 24 hours):**
- [ ] Conduct incident retrospective
- [ ] Identify root cause
- [ ] Plan prevention measures
- [ ] Update documentation

#### **Long-term (within 1 week):**
- [ ] Implement prevention measures
- [ ] Update monitoring/alerts
- [ ] Review escalation procedures
- [ ] Share learnings with team

---

**🚨 Remember: In an emergency, the priority is RESOLUTION first, then LEARNING. Stay calm, follow procedures, and don't hesitate to escalate if needed. Every emergency is an opportunity to make the system more resilient! 🛡️✨**