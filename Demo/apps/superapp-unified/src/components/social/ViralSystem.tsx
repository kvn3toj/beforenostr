import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Avatar,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Grid,
  Stack,
  Badge,
  Paper,
  Zoom,
  Slide,
  Alert,
} from '@mui/material'
import {
  Share as ShareIcon,
  ContentCopy as CopyIcon,
  WhatsApp as WhatsAppIcon,
  Telegram as TelegramIcon,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
  QrCode as QrCodeIcon,
  EmojiEvents as TrophyIcon,
  Group as GroupIcon,
  Star as StarIcon,
  TrendingUp as TrendingIcon,
  CardGiftcard as GiftIcon,
  AccountBalance as WalletIcon,
  CheckCircle as CheckIcon,
  Timer as TimerIcon,
  Leaderboard as LeaderboardIcon,
  Close as CloseIcon,
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { triggerReward, triggerHapticFeedback } from '../../lib/gameFeelSystem'

// Types
interface ReferralReward {
  id: string
  type: 'REFERRER' | 'REFEREE'
  meritos: number
  lukas: number
  bonus?: string
  condition: string
}

interface ReferralStats {
  totalReferrals: number
  successfulReferrals: number
  pendingReferrals: number
  totalEarned: {
    meritos: number
    lukas: number
  }
  currentTier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND'
  nextTierProgress: number
}

interface ShareableContent {
  id: string
  type: 'ACHIEVEMENT' | 'CHALLENGE' | 'MARKETPLACE_ITEM' | 'CONTENT' | 'GROUP'
  title: string
  description: string
  image?: string
  url: string
  shareCount: number
  viralScore: number
}

interface LeaderboardEntry {
  id: string
  username: string
  avatar: string
  referrals: number
  totalShares: number
  viralScore: number
  rank: number
  badges: string[]
}

const ViralSystem: React.FC = () => {
  const [showReferralDialog, setShowReferralDialog] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [selectedContent, setSelectedContent] = useState<ShareableContent | null>(null)
  const [referralCode, setReferralCode] = useState('')
  const [generatedQR, setGeneratedQR] = useState('')
  
  const queryClient = useQueryClient()

  // Referral system data
  const { data: referralStats } = useQuery<ReferralStats>({
    queryKey: ['referral-stats'],
    queryFn: async () => ({
      totalReferrals: 12,
      successfulReferrals: 8,
      pendingReferrals: 4,
      totalEarned: {
        meritos: 400,
        lukas: 200
      },
      currentTier: 'GOLD' as const,
      nextTierProgress: 65
    })
  })

  const { data: referralRewards } = useQuery<ReferralReward[]>({
    queryKey: ['referral-rewards'],
    queryFn: async () => [
      {
        id: '1',
        type: 'REFERRER',
        meritos: 50,
        lukas: 25,
        condition: 'Por cada persona que se registre con tu código'
      },
      {
        id: '2',
        type: 'REFEREE',
        meritos: 25,
        lukas: 15,
        condition: 'Al registrarte con un código de referido'
      },
      {
        id: '3',
        type: 'REFERRER',
        meritos: 100,
        lukas: 50,
        bonus: '🎯 Bonus Activación',
        condition: 'Cuando el referido complete su primer desafío'
      },
      {
        id: '4',
        type: 'REFERRER',
        meritos: 200,
        lukas: 100,
        bonus: '🚀 Super Bonus',
        condition: 'Cuando el referido alcance 500 Méritos'
      }
    ]
  })

  const { data: leaderboard } = useQuery<LeaderboardEntry[]>({
    queryKey: ['viral-leaderboard'],
    queryFn: async () => [
      {
        id: '1',
        username: 'EcoWarrior',
        avatar: '🌱',
        referrals: 25,
        totalShares: 150,
        viralScore: 890,
        rank: 1,
        badges: ['🥇', '🔥', '🌟']
      },
      {
        id: '2',
        username: 'AyniMaster',
        avatar: '⚖️',
        referrals: 18,
        totalShares: 120,
        viralScore: 720,
        rank: 2,
        badges: ['🥈', '💫']
      },
      {
        id: '3',
        username: 'BienComunero',
        avatar: '🤝',
        referrals: 15,
        totalShares: 95,
        viralScore: 580,
        rank: 3,
        badges: ['🥉', '⭐']
      }
    ]
  })

  // Generate unique referral code
  const generateReferralCode = useMutation({
    mutationFn: async () => {
      // In real app, this would call the backend
      const code = `COOM${Math.random().toString(36).substring(2, 8).toUpperCase()}`
      return { code, qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://coomunity.com/join/${code}` }
    },
    onSuccess: (data) => {
      setReferralCode(data.code)
      setGeneratedQR(data.qrCode)
      toast.success('¡Código de referido generado!', {
        description: `Tu código: ${data.code}`,
        duration: 3000,
      })
    }
  })

  // Share content
  const shareContent = useMutation({
    mutationFn: async ({ content, platform }: { content: ShareableContent, platform: string }) => {
      // Track the share
      return { success: true, platform, contentId: content.id }
    },
    onSuccess: (data) => {
      triggerReward('MERITOS', 5)
      triggerHapticFeedback('success')
      toast.success('¡Contenido compartido!', {
        description: '+5 Méritos por compartir',
        duration: 2000,
      })
    }
  })

  const handleShare = (content: ShareableContent, platform: string) => {
    let shareUrl = ''
    const text = `¡Descubre ${content.title} en CoomÜnity! ${content.description}`
    
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${content.url}`)}`
        break
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(content.url)}&text=${encodeURIComponent(text)}`
        break
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(content.url)}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(content.url)}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(content.url)}`
        break
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(content.title)}&body=${encodeURIComponent(`${text} ${content.url}`)}`
        break
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400')
      shareContent.mutate({ content, platform })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    triggerHapticFeedback('light')
    toast.success('¡Copiado al portapapeles!')
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'BRONZE': return '#CD7F32'
      case 'SILVER': return '#C0C0C0'
      case 'GOLD': return '#FFD700'
      case 'PLATINUM': return '#E5E4E2'
      case 'DIAMOND': return '#B9F2FF'
      default: return '#CDAB5A'
    }
  }

  const mockShareableContent: ShareableContent = {
    id: '1',
    type: 'ACHIEVEMENT',
    title: '¡Logré el equilibrio Ayni!',
    description: 'Completé mi primer intercambio perfecto en CoomÜnity',
    url: 'https://coomunity.com/achievement/ayni-balance',
    shareCount: 45,
    viralScore: 120
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3, color: '#CDAB5A' }}>
        🚀 Sistema Viral CoomÜnity
      </Typography>

      <Grid container spacing={3}>
        {/* Referral Stats Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  💫 Programa de Referidos
                </Typography>
                <Chip 
                  label={referralStats?.currentTier || 'BRONZE'}
                  sx={{ 
                    backgroundColor: getTierColor(referralStats?.currentTier || 'BRONZE'),
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
              </Box>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight="bold" color="primary">
                      {referralStats?.totalReferrals || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total Referidos
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight="bold" color="success.main">
                      {referralStats?.successfulReferrals || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Exitosos
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight="bold" color="warning.main">
                      {referralStats?.pendingReferrals || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Pendientes
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Progreso al próximo nivel:
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={referralStats?.nextTierProgress || 0}
                  sx={{ 
                    height: 8,
                    borderRadius: 4,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#CDAB5A'
                    }
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {referralStats?.nextTierProgress || 0}% completado
                </Typography>
              </Box>

              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Chip 
                  icon={<TrophyIcon />}
                  label={`${referralStats?.totalEarned.meritos || 0} Méritos`}
                  color="warning"
                  variant="outlined"
                />
                <Chip 
                  icon={<WalletIcon />}
                  label={`${referralStats?.totalEarned.lukas || 0} Lükas`}
                  color="success"
                  variant="outlined"
                />
              </Stack>

              <Button
                variant="contained"
                fullWidth
                startIcon={<ShareIcon />}
                onClick={() => setShowReferralDialog(true)}
                sx={{ 
                  backgroundColor: '#CDAB5A',
                  '&:hover': { backgroundColor: '#B8954A' }
                }}
              >
                Invitar Amigos
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Rewards Structure */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                🎁 Recompensas por Referidos
              </Typography>
              
              {referralRewards?.map((reward) => (
                <Box key={reward.id} sx={{ mb: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Chip 
                      label={reward.type === 'REFERRER' ? 'Para ti' : 'Para ellos'}
                      size="small"
                      color={reward.type === 'REFERRER' ? 'primary' : 'secondary'}
                    />
                    {reward.bonus && (
                      <Chip label={reward.bonus} size="small" color="warning" />
                    )}
                  </Box>
                  
                  <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                    <Chip size="small" label={`+${reward.meritos} Méritos`} />
                    <Chip size="small" label={`+${reward.lukas} Lükas`} />
                  </Stack>
                  
                  <Typography variant="body2" color="text.secondary">
                    {reward.condition}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Viral Leaderboard */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  🏆 Leaderboard Viral
                </Typography>
                <Button
                  startIcon={<ShareIcon />}
                  onClick={() => setShowShareDialog(true)}
                  variant="outlined"
                  color="primary"
                >
                  Compartir Logro
                </Button>
              </Box>

              <List>
                {leaderboard?.map((entry) => (
                  <ListItem key={entry.id} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 1 }}>
                    <ListItemAvatar>
                      <Badge badgeContent={entry.rank} color="primary">
                        <Avatar sx={{ backgroundColor: '#CDAB5A' }}>
                          {entry.avatar}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography fontWeight="bold">{entry.username}</Typography>
                          {entry.badges.map((badge, index) => (
                            <span key={index} style={{ fontSize: '1.2em' }}>{badge}</span>
                          ))}
                        </Box>
                      }
                      secondary={
                        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                          <Chip size="small" label={`${entry.referrals} referidos`} />
                          <Chip size="small" label={`${entry.totalShares} compartidas`} />
                          <Chip size="small" label={`${entry.viralScore} puntos`} color="primary" />
                        </Stack>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Referral Dialog */}
      <Dialog 
        open={showReferralDialog} 
        onClose={() => setShowReferralDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">🚀 Invita y Gana</Typography>
            <IconButton onClick={() => setShowReferralDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Invita a tus amigos a CoomÜnity y ganen recompensas juntos
            </Typography>
            
            {!referralCode ? (
              <Button
                variant="contained"
                onClick={() => generateReferralCode.mutate()}
                disabled={generateReferralCode.isPending}
                sx={{ backgroundColor: '#CDAB5A' }}
              >
                {generateReferralCode.isPending ? 'Generando...' : 'Generar Código de Invitación'}
              </Button>
            ) : (
              <Box>
                <Paper sx={{ p: 2, mb: 2, backgroundColor: 'grey.50' }}>
                  <Typography variant="h4" fontWeight="bold" color="primary" sx={{ mb: 1 }}>
                    {referralCode}
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<CopyIcon />}
                    onClick={() => copyToClipboard(referralCode)}
                  >
                    Copiar Código
                  </Button>
                </Paper>

                {generatedQR && (
                  <Box sx={{ mb: 3 }}>
                    <img src={generatedQR} alt="QR Code" style={{ maxWidth: '150px' }} />
                    <Typography variant="caption" display="block">
                      Código QR para compartir
                    </Typography>
                  </Box>
                )}

                <Typography variant="h6" sx={{ mb: 2 }}>
                  Compartir en:
                </Typography>
                
                <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
                  <IconButton 
                    onClick={() => handleShare(mockShareableContent, 'whatsapp')}
                    sx={{ backgroundColor: '#25D366', color: 'white', '&:hover': { backgroundColor: '#20B858' } }}
                  >
                    <WhatsAppIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleShare(mockShareableContent, 'telegram')}
                    sx={{ backgroundColor: '#0088CC', color: 'white', '&:hover': { backgroundColor: '#0077B3' } }}
                  >
                    <TelegramIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleShare(mockShareableContent, 'twitter')}
                    sx={{ backgroundColor: '#1DA1F2', color: 'white', '&:hover': { backgroundColor: '#1A91DA' } }}
                  >
                    <TwitterIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleShare(mockShareableContent, 'facebook')}
                    sx={{ backgroundColor: '#4267B2', color: 'white', '&:hover': { backgroundColor: '#365899' } }}
                  >
                    <FacebookIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleShare(mockShareableContent, 'email')}
                    sx={{ backgroundColor: '#EA4335', color: 'white', '&:hover': { backgroundColor: '#D33B2C' } }}
                  >
                    <EmailIcon />
                  </IconButton>
                </Stack>
              </Box>
            )}
          </Box>
        </DialogContent>
      </Dialog>

      {/* Share Achievement Dialog */}
      <Dialog 
        open={showShareDialog} 
        onClose={() => setShowShareDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          🌟 Compartir tu Progreso
        </DialogTitle>
        
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            ¡Cada vez que compartes ganas +5 Méritos!
          </Alert>
          
          <Card sx={{ mb: 2, backgroundColor: 'grey.50' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                {mockShareableContent.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {mockShareableContent.description}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Chip size="small" label={`${mockShareableContent.shareCount} compartidas`} />
                <Chip size="small" label={`${mockShareableContent.viralScore} puntos virales`} sx={{ ml: 1 }} />
              </Box>
            </CardContent>
          </Card>

          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Compartir en:
          </Typography>
          
          <Grid container spacing={2}>
            {[
              { platform: 'whatsapp', icon: <WhatsAppIcon />, color: '#25D366', label: 'WhatsApp' },
              { platform: 'telegram', icon: <TelegramIcon />, color: '#0088CC', label: 'Telegram' },
              { platform: 'twitter', icon: <TwitterIcon />, color: '#1DA1F2', label: 'Twitter' },
              { platform: 'facebook', icon: <FacebookIcon />, color: '#4267B2', label: 'Facebook' },
              { platform: 'linkedin', icon: <LinkedInIcon />, color: '#0077B5', label: 'LinkedIn' },
              { platform: 'email', icon: <EmailIcon />, color: '#EA4335', label: 'Email' }
            ].map((social) => (
              <Grid item xs={6} sm={4} key={social.platform}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={social.icon}
                  onClick={() => handleShare(mockShareableContent, social.platform)}
                  sx={{ 
                    borderColor: social.color,
                    color: social.color,
                    '&:hover': {
                      backgroundColor: social.color,
                      color: 'white'
                    }
                  }}
                >
                  {social.label}
                </Button>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default ViralSystem