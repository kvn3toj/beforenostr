-- ===============================================================================
-- 🎮 COOMUNITY GAMIFIER DATABASE - SQL EXPLORATION SESSION
-- ===============================================================================
-- Database: gamifier_db (PostgreSQL)
-- Backend: NestJS (Port 3002)
-- Generated: 2025-06-12
-- 
-- This session contains useful queries for exploring and managing the CoomÜnity
-- Gamifier database, organized by functional areas.
-- ===============================================================================

-- 📊 DATABASE OVERVIEW QUERIES
-- ===============================================================================

-- Get all tables and their row counts
SELECT 
    schemaname,
    tablename,
    n_tup_ins as "Total Inserts",
    n_tup_upd as "Total Updates",
    n_tup_del as "Total Deletes",
    n_live_tup as "Live Rows",
    n_dead_tup as "Dead Rows"
FROM pg_stat_user_tables 
ORDER BY n_live_tup DESC;

-- Database size and table sizes
SELECT 
    pg_size_pretty(pg_database_size('gamifier_db')) as "Database Size";

SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as "Size"
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- 👥 USER MANAGEMENT QUERIES
-- ===============================================================================

-- All users with their roles and status
SELECT 
    u.id,
    u.email,
    u.name,
    u.username,
    u.status,
    u.is_active,
    u.created_at,
    STRING_AGG(r.name, ', ') as roles
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
GROUP BY u.id, u.email, u.name, u.username, u.status, u.is_active, u.created_at
ORDER BY u.created_at DESC;

-- User activity summary
SELECT 
    u.email,
    u.name,
    COUNT(DISTINCT ua.id) as "Answers Given",
    COUNT(DISTINCT m.id) as "Merits Earned",
    COUNT(DISTINCT t.id) as "Tokens",
    COUNT(DISTINCT p.id) as "Publications",
    COUNT(DISTINCT c.id) as "Comments"
FROM users u
LEFT JOIN user_answers ua ON u.id = ua.user_id
LEFT JOIN merits m ON u.id = m.user_id
LEFT JOIN tokens t ON u.id = t.user_id
LEFT JOIN publications p ON u.id = p.user_id
LEFT JOIN comments c ON u.id = c.user_id
WHERE u.is_active = true
GROUP BY u.id, u.email, u.name
ORDER BY "Merits Earned" DESC, "Answers Given" DESC;

-- 🎬 CONTENT MANAGEMENT QUERIES
-- ===============================================================================

-- Mundos overview with content statistics
SELECT 
    m.id,
    m.name,
    m.description,
    m.is_active,
    COUNT(DISTINCT p.id) as "Playlists",
    COUNT(DISTINCT vi.id) as "Video Items",
    COUNT(DISTINCT w.id) as "Worlds",
    m.created_at
FROM mundos m
LEFT JOIN playlists p ON m.id = p.mundo_id
LEFT JOIN video_items vi ON p.id = vi.playlist_id
LEFT JOIN worlds w ON m.id = w.mundo_id
GROUP BY m.id, m.name, m.description, m.is_active, m.created_at
ORDER BY "Video Items" DESC;

-- Playlists with video content details
SELECT 
    p.id,
    p.name,
    m.name as "Mundo",
    p.order_in_mundo,
    COUNT(vi.id) as "Video Count",
    AVG(vi.duration) as "Avg Duration (seconds)",
    COUNT(q.id) as "Total Questions",
    p.is_active,
    p.created_at
FROM playlists p
JOIN mundos m ON p.mundo_id = m.id
LEFT JOIN video_items vi ON p.id = vi.playlist_id AND vi.is_deleted = false
LEFT JOIN questions q ON vi.id = q.video_item_id
GROUP BY p.id, p.name, m.name, p.order_in_mundo, p.is_active, p.created_at
ORDER BY m.name, p.order_in_mundo;

-- Video items with engagement metrics
SELECT 
    vi.id,
    vi.title,
    p.name as "Playlist",
    vi.platform,
    vi.duration,
    vi.language,
    COUNT(DISTINCT q.id) as "Questions",
    COUNT(DISTINCT ua.id) as "User Answers",
    COUNT(DISTINCT s.id) as "Subtitles",
    vi.is_active,
    vi.created_at
FROM video_items vi
JOIN playlists p ON vi.playlist_id = p.id
LEFT JOIN questions q ON vi.id = q.video_item_id
LEFT JOIN user_answers ua ON q.id = ua.question_id
LEFT JOIN subtitles s ON vi.id = s.video_item_id
WHERE vi.is_deleted = false
GROUP BY vi.id, vi.title, p.name, vi.platform, vi.duration, vi.language, vi.is_active, vi.created_at
ORDER BY "User Answers" DESC, "Questions" DESC;

-- 🎯 GAMIFICATION QUERIES
-- ===============================================================================

-- Merit system overview
SELECT 
    m.type,
    m.source,
    COUNT(*) as "Count",
    SUM(m.amount) as "Total Amount",
    AVG(m.amount) as "Average Amount",
    MIN(m.amount) as "Min Amount",
    MAX(m.amount) as "Max Amount"
FROM merits m
GROUP BY m.type, m.source
ORDER BY "Total Amount" DESC;

-- Top users by merits
SELECT 
    u.email,
    u.name,
    COUNT(m.id) as "Merit Count",
    SUM(m.amount) as "Total Merits",
    AVG(m.amount) as "Avg Merit"
FROM users u
JOIN merits m ON u.id = m.user_id
GROUP BY u.id, u.email, u.name
ORDER BY "Total Merits" DESC
LIMIT 20;

-- Token distribution
SELECT 
    t.type,
    t.status,
    COUNT(*) as "Count",
    SUM(t.amount) as "Total Amount",
    AVG(t.amount) as "Average Amount"
FROM tokens t
GROUP BY t.type, t.status
ORDER BY "Total Amount" DESC;

-- Wallet balances overview
SELECT 
    u.email,
    w.balance_units,
    w.balance_toins,
    w.status,
    COUNT(tt.id) as "Transactions To",
    COUNT(tf.id) as "Transactions From"
FROM wallets w
JOIN users u ON w.user_id = u.id
LEFT JOIN transactions tt ON w.user_id = tt.to_user_id
LEFT JOIN transactions tf ON w.user_id = tf.from_user_id
GROUP BY u.email, w.balance_units, w.balance_toins, w.status
ORDER BY w.balance_units DESC;

-- 🎮 ACTIVITY & ENGAGEMENT QUERIES
-- ===============================================================================

-- Question performance analysis
SELECT 
    q.type,
    q.language_code,
    COUNT(*) as "Total Questions",
    COUNT(DISTINCT q.video_item_id) as "Videos with Questions",
    COUNT(ua.id) as "Total Answers",
    ROUND(
        COUNT(CASE WHEN ua.is_correct = true THEN 1 END) * 100.0 / 
        NULLIF(COUNT(ua.id), 0), 2
    ) as "Correct Answer %"
FROM questions q
LEFT JOIN user_answers ua ON q.id = ua.question_id
GROUP BY q.type, q.language_code
ORDER BY "Total Questions" DESC;

-- User engagement by video
SELECT 
    vi.title,
    p.name as "Playlist",
    COUNT(DISTINCT ua.user_id) as "Unique Users",
    COUNT(ua.id) as "Total Answers",
    ROUND(AVG(CASE WHEN ua.is_correct = true THEN 1.0 ELSE 0.0 END) * 100, 2) as "Success Rate %",
    SUM(ua.ondas_earned) as "Total Ondas Earned"
FROM video_items vi
JOIN playlists p ON vi.playlist_id = p.id
JOIN questions q ON vi.id = q.video_item_id
JOIN user_answers ua ON q.id = ua.question_id
WHERE vi.is_deleted = false
GROUP BY vi.id, vi.title, p.name
HAVING COUNT(ua.id) > 0
ORDER BY "Unique Users" DESC, "Total Answers" DESC;

-- 🌍 WORLDS & EXPERIENCES QUERIES
-- ===============================================================================

-- Worlds overview with stages and experiences
SELECT 
    w.id,
    w.name,
    w.type,
    w.status,
    u.email as "Creator",
    COUNT(DISTINCT s.id) as "Stages",
    COUNT(DISTINCT e.id) as "Experiences",
    COUNT(DISTINCT a.id) as "Activities",
    w.created_at
FROM worlds w
JOIN users u ON w.creator_id = u.id
LEFT JOIN stages s ON w.id = s.world_id
LEFT JOIN experiences e ON s.id = e.stage_id
LEFT JOIN activities a ON e.id = a.experience_id
GROUP BY w.id, w.name, w.type, w.status, u.email, w.created_at
ORDER BY "Activities" DESC;

-- Experience engagement analysis
SELECT 
    e.title,
    e.type,
    e.gamification_framework,
    w.name as "World",
    s.name as "Stage",
    COUNT(DISTINCT a.id) as "Activities",
    COUNT(DISTINCT aq.id) as "Questions",
    COUNT(DISTINCT ua.id) as "User Answers"
FROM experiences e
JOIN stages s ON e.stage_id = s.id
JOIN worlds w ON s.world_id = w.id
LEFT JOIN activities a ON e.id = a.experience_id
LEFT JOIN activity_questions aq ON a.id = aq.activity_id
LEFT JOIN user_answers ua ON aq.id = ua.activity_question_id
GROUP BY e.id, e.title, e.type, e.gamification_framework, w.name, s.name
ORDER BY "User Answers" DESC;

-- 🏆 CHALLENGES & REWARDS QUERIES
-- ===============================================================================

-- Active challenges overview
SELECT 
    c.id,
    c.title,
    c.type,
    c.status,
    c.start_date,
    c.end_date,
    COUNT(DISTINCT cr.id) as "Rewards",
    COUNT(DISTINCT uc.id) as "Participants",
    COUNT(CASE WHEN uc.status = 'COMPLETED' THEN 1 END) as "Completed",
    ROUND(
        COUNT(CASE WHEN uc.status = 'COMPLETED' THEN 1 END) * 100.0 / 
        NULLIF(COUNT(DISTINCT uc.id), 0), 2
    ) as "Completion Rate %"
FROM challenges c
LEFT JOIN challenge_rewards cr ON c.id = cr.challenge_id
LEFT JOIN user_challenges uc ON c.id = uc.challenge_id
GROUP BY c.id, c.title, c.type, c.status, c.start_date, c.end_date
ORDER BY c.start_date DESC;

-- User challenge progress
SELECT 
    u.email,
    c.title as "Challenge",
    uc.status,
    uc.progress,
    uc.started_at,
    uc.completed_at,
    CASE 
        WHEN uc.completed_at IS NOT NULL THEN 
            EXTRACT(EPOCH FROM (uc.completed_at - uc.started_at))/3600
        ELSE 
            EXTRACT(EPOCH FROM (NOW() - uc.started_at))/3600
    END as "Hours Spent"
FROM user_challenges uc
JOIN users u ON uc.user_id = u.id
JOIN challenges c ON uc.challenge_id = c.id
ORDER BY uc.started_at DESC;

-- 📊 ANALYTICS & REPORTING QUERIES
-- ===============================================================================

-- Daily activity analytics
SELECT 
    DATE(ad.timestamp) as "Date",
    ad.event_type,
    COUNT(*) as "Event Count",
    COUNT(DISTINCT ad.user_id) as "Unique Users",
    COUNT(DISTINCT ad.session_id) as "Unique Sessions"
FROM analytics_data ad
WHERE ad.timestamp >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(ad.timestamp), ad.event_type
ORDER BY "Date" DESC, "Event Count" DESC;

-- User engagement trends
SELECT 
    DATE_TRUNC('week', ad.timestamp) as "Week",
    COUNT(DISTINCT ad.user_id) as "Active Users",
    COUNT(*) as "Total Events",
    COUNT(DISTINCT ad.session_id) as "Sessions",
    ROUND(COUNT(*)::numeric / COUNT(DISTINCT ad.user_id), 2) as "Events per User"
FROM analytics_data ad
WHERE ad.timestamp >= CURRENT_DATE - INTERVAL '12 weeks'
GROUP BY DATE_TRUNC('week', ad.timestamp)
ORDER BY "Week" DESC;

-- 🔧 SYSTEM MAINTENANCE QUERIES
-- ===============================================================================

-- Recent logs by level
SELECT 
    level,
    COUNT(*) as "Count",
    MAX(timestamp) as "Latest"
FROM logs
WHERE timestamp >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY level
ORDER BY "Count" DESC;

-- Configuration settings
SELECT 
    key,
    value,
    type,
    updated_at
FROM configurations
ORDER BY type, key;

-- Database performance insights
SELECT 
    schemaname,
    tablename,
    seq_scan as "Sequential Scans",
    seq_tup_read as "Sequential Reads",
    idx_scan as "Index Scans",
    idx_tup_fetch as "Index Reads",
    n_tup_ins as "Inserts",
    n_tup_upd as "Updates",
    n_tup_del as "Deletes"
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY seq_scan DESC;

-- 🚀 QUICK UTILITY QUERIES
-- ===============================================================================

-- Count all records in each table
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL SELECT 'mundos', COUNT(*) FROM mundos
UNION ALL SELECT 'playlists', COUNT(*) FROM playlists
UNION ALL SELECT 'video_items', COUNT(*) FROM video_items
UNION ALL SELECT 'questions', COUNT(*) FROM questions
UNION ALL SELECT 'user_answers', COUNT(*) FROM user_answers
UNION ALL SELECT 'merits', COUNT(*) FROM merits
UNION ALL SELECT 'tokens', COUNT(*) FROM tokens
UNION ALL SELECT 'wallets', COUNT(*) FROM wallets
UNION ALL SELECT 'transactions', COUNT(*) FROM transactions
UNION ALL SELECT 'worlds', COUNT(*) FROM worlds
UNION ALL SELECT 'experiences', COUNT(*) FROM experiences
UNION ALL SELECT 'activities', COUNT(*) FROM activities
UNION ALL SELECT 'challenges', COUNT(*) FROM challenges
ORDER BY count DESC;

-- Recent activity across the platform
SELECT 
    'User Registration' as activity,
    COUNT(*) as count,
    MAX(created_at) as latest
FROM users 
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
UNION ALL
SELECT 
    'Video Items Added',
    COUNT(*),
    MAX(created_at)
FROM video_items 
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
UNION ALL
SELECT 
    'User Answers',
    COUNT(*),
    MAX(created_at)
FROM user_answers 
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
UNION ALL
SELECT 
    'Merits Earned',
    COUNT(*),
    MAX(created_at)
FROM merits 
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY count DESC;

-- ===============================================================================
-- 🎯 READY TO EXPLORE!
-- 
-- Instructions:
-- 1. Select any query above and execute it
-- 2. Modify queries as needed for your specific analysis
-- 3. Use Ctrl+/ to comment/uncomment sections
-- 4. Results will show in the SQLTools Results panel
-- 
-- Happy exploring your CoomÜnity Gamifier database! 🚀
-- ===============================================================================
