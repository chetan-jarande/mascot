import { mascotRegistry } from '../framework/registries/mascotRegistry';
import { NovaMascot } from './NovaMascot';
import { ByteMascot } from './ByteMascot';
import { PipMascot } from './PipMascot';

export function initMascots(): void {
  mascotRegistry.register({
    id: 'nova',
    name: 'Nova',
    description: 'The Cosmic Spark — an energetic bioluminescent companion with fluid emotions.',
    personality: 'Energetic, friendly, encouraging',
    component: NovaMascot,
  });

  mascotRegistry.register({
    id: 'byte',
    name: 'Byte',
    description: 'The Cyber Droid — a retro-futuristic CRT robot with digital matrix expressions.',
    personality: 'Analytical, precise, witty',
    component: ByteMascot,
  });

  mascotRegistry.register({
    id: 'pip',
    name: 'Pip',
    description: 'The Sage Owl — a wise geometric mentor with expressive lenses and plumage.',
    personality: 'Thoughtful, calm, scholarly',
    component: PipMascot,
  });
}
