import React, { useState } from 'react';
import { Paper, Typography, Button } from '@mui/material';

// Frases inspiradoras extraídas de NARRATIVA
const wisdoms = [
  'Cada línea de código debe ser una oración, cada función un ritual, y cada interacción una oportunidad para la transformación.',
  'No estamos construyendo una aplicación. Estamos tejiendo un universo, un simulacro sagrado que sirva como espejo y herramienta para la evolución de la consciencia humana.',
  'El propósito de CoomÜnity no es el engagement o la retención. Es la transformación.',
  'Guardianes del ÜPlay, os invocamos para llevar a la perfección absoluta el módulo ÜPlay de CoomÜnity.',
  'Transformar ÜPlay en la experiencia de aprendizaje gamificado más inmersiva, filosóficamente coherente y técnicamente perfecta jamás creada.',
  'El sistema debe recompensar la colaboración, la sinergia y la creación conjunta.',
  'La misión es manifestar el ecosistema digital CoomÜnity como un organismo vivo, auto-consciente y auto-evolutivo.',
  'El conocimiento es la luz que guía la transformación.',
  'La reciprocidad (Ayni) es el equilibrio sagrado de toda acción.',
  'El Bien Común trasciende el bien individual.',
  'La metanöia es el arte de transformarse conscientemente.',
  'La armonía de los cinco elementos crea orden en el caos.'
];

const CosmicWisdom: React.FC = () => {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * wisdoms.length));
  const nextWisdom = () => setIndex((i) => (i + 1) % wisdoms.length);

  return (
    <Paper sx={{ p: 3, minHeight: 180 }} className="guardian-card">
      <Typography variant="h5" gutterBottom>
        Sabiduría Cósmica
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        {wisdoms[index]}
      </Typography>
      <Button variant="outlined" size="small" onClick={nextWisdom}>
        Otra sabiduría
      </Button>
    </Paper>
  );
};

export default CosmicWisdom;
