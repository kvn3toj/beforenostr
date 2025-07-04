import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Avatar,
  Chip,
  Paper,
  Card,
  CardMedia,
  CardContent,
  Button
} from '@mui/material';

// Enhanced interfaces representing community-centric marketplace
interface CommunityService {
  id: string;
  name: string;
  description: string;
  category: 'Skill Exchange' | 'Sustainable Goods' | 'Social Impact';
  provider: {
    name: string;
    avatar: string;
    meritoScore: number;
  };
  öndas: number; // Energy units representing community value
  image: string;
}

const communityServices: CommunityService[] = [
  {
    id: 'skill-1',
    name: 'Taller de Diseño en Permacultura Urbana',
    description: 'Diseño colaborativo de sistemas alimentarios resilientes y jardines comunitarios sostenibles. Transformando espacios urbanos en ecosistemas regenerativos.',
    category: 'Skill Exchange',
    provider: {
      name: 'María Transformadora',
      avatar: '/avatars/maria-permaculture.png',
      meritoScore: 92
    },
    öndas: 45,
    image: '/images/permaculture-community-garden.jpg'
  },
  {
    id: 'goods-1',
    name: 'Biblioteca Viva de Semillas Comunitarias',
    description: 'Programa de preservación de diversidad agrícola y intercambio de conocimientos ancestrales. Rescatando y compartiendo semillas locales no modificadas genéticamente.',
    category: 'Sustainable Goods',
    provider: {
      name: 'Colectivo Semillas Vivas',
      avatar: '/avatars/seed-collective.png',
      meritoScore: 88
    },
    öndas: 38,
    image: '/images/seed-exchange-community.jpg'
  },
  {
    id: 'impact-1',
    name: 'Círculo de Sanación Comunitaria Integral',
    description: 'Iniciativa holística de bienestar que integra medicina tradicional, apoyo psicoemocional y prácticas de autocuidado colectivo. Fortaleciendo la resiliencia comunitaria desde la sanación.',
    category: 'Social Impact',
    provider: {
      name: 'Carlos Sanación',
      avatar: '/avatars/carlos-health.png',
      meritoScore: 85
    },
    öndas: 52,
    image: '/images/holistic-wellness-circle.jpg'
  }
];

const ReciprocityNetwork: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredServices = selectedCategory
    ? communityServices.filter(service => service.category === selectedCategory)
    : communityServices;

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        CoomÜnity Reciprocity Marketplace
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        {['Skill Exchange', 'Sustainable Goods', 'Social Impact'].map(category => (
          <Chip
            key={category}
            label={category}
            onClick={() => setSelectedCategory(
              selectedCategory === category ? null : category
            )}
            color={selectedCategory === category ? 'primary' : 'default'}
            sx={{ mr: 1 }}
          />
        ))}
      </Box>

      <Grid container spacing={3}>
        {filteredServices.map(service => (
          <Grid item xs={12} sm={6} md={4} key={service.id}>
            <Card sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.3s',
              '&:hover': { transform: 'scale(1.05)' }
            }}>
              <CardMedia
                component="img"
                height="200"
                image={service.image}
                alt={service.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6">
                  {service.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {service.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <Avatar
                    src={service.provider.avatar}
                    sx={{ width: 40, height: 40, mr: 2 }}
                  />
                  <Box>
                    <Typography variant="body2">
                      {service.provider.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Mëritos: {service.provider.meritoScore} |
                      Öndas: {service.öndas}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
              <Button
                variant="contained"
                color="primary"
                sx={{ m: 2 }}
              >
                Explore Collaboration
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ReciprocityNetwork;
