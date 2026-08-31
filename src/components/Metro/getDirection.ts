export type Direction = 'north' | 'south' | 'unknown';

// IDFM tags every journey with the line's own Aller/Retour direction, which is
// independent of where the train actually terminates. That distinction matters:
// during travaux the terminus changes (Denfert-Rochereau is currently the
// northern terminus instead of the usual CDG / Mitry-Claye), and a list of
// destination names silently drops every train the moment that happens.
//
// Observed on RER B at Bagneux: Retour heads toward Paris (north), Aller heads
// away from it (south). Flip this map if a line ever reads the other way.
const DIRECTION_REF: Record<string, Direction> = {
  Retour: 'north',
  Aller: 'south',
};

// Fallback only, for a journey with no DirectionRef. Deliberately short: these
// are the stable ends of the line, not the ones travaux move around.
const NORTH_DESTINATIONS = [
  'denfert', 'cite universitaire', 'gentilly', 'laplace', 'arcueil',
  'port royal', 'luxembourg', 'saint michel', 'chatelet', 'gare du nord',
  'la plaine', 'stade de france', 'le bourget', 'drancy', 'blanc mesnil',
  'la courneuve', 'aulnay', 'sevran', 'villepinte', 'parc des expositions',
  'mitry', 'claye', 'charles de gaulle', 'cdg', 'roissy', 'aeroport',
];

const SOUTH_DESTINATIONS = [
  'bourg la reine', 'robinson', 'antony', 'fontaine michalon', 'les baconnets',
  'massy', 'palaiseau', 'orsay', 'bures', 'gif', 'courcelle', 'saint remy',
  'chevreuse', 'dourdan', 'etampes',
];

// Destination names arrive with inconsistent hyphens and accents, so flatten
// both sides before comparing. NFD splits an accented letter into a base letter
// plus a combining mark, and the marks are the only non-ASCII left afterwards.
const normalise = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .split('')
    .filter((char) => char.charCodeAt(0) < 128)
    .join('')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

interface JourneyLike {
  DirectionRef?: { value?: string };
  DestinationName?: { value: string }[];
}

export const getDirection = (journey: JourneyLike): Direction => {
  const ref = journey?.DirectionRef?.value;
  if (ref && DIRECTION_REF[ref]) {
    return DIRECTION_REF[ref];
  }

  const dest = normalise(journey?.DestinationName?.[0]?.value ?? '');
  if (!dest) return 'unknown';

  if (NORTH_DESTINATIONS.some((d) => dest.includes(d))) return 'north';
  if (SOUTH_DESTINATIONS.some((d) => dest.includes(d))) return 'south';

  return 'unknown';
};
