export const getDirection = (destinationName) => {
  const northDestinations = [
    'Aéroport Charles de Gaulle',
    'Mitry-Claye',
    'Charles de Gaulle',
    'CDG',
    'Villepinte',
    'Sevran',
    'Aulnay',
    'Blanc-Mesnil',
    'Drancy',
    'Le Bourget',
    'La Courneuve'
  ];
  
  const southDestinations = [
    'Massy',
    'Robinson',
    'Saint-Rémy-lès-Chevreuse',
    'Orsay',
    'Dourdan',
    'Bagneux',
    'Antony',
    'Bourg-la-Reine',
    'Laplace',
    'Cité Universitaire'
  ];
  
  const dest = destinationName.toLowerCase();
  
  if (northDestinations.some(d => dest.includes(d.toLowerCase()))) {
    return 'north';
  }
  if (southDestinations.some(d => dest.includes(d.toLowerCase()))) {
    return 'south';
  }
  
  return 'unknown';
};