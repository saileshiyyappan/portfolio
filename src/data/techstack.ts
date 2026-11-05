import techstackJson from '@/content/techstack.json';

export interface TechnologyBadgeDefinition {
  src: string;
}

export interface TechnologyCategory {
  category: string;
  order: number;
  badges: TechnologyBadgeDefinition[];
}

export const technologyCategories = (techstackJson as TechnologyCategory[])
  .slice()
  .sort((a, b) => a.order - b.order);

const fallbackBadge: TechnologyBadgeDefinition = { src: '/assets/badges/default.svg' };
const badgeByFileName = new Map(
  technologyCategories.flatMap((category) => category.badges.map((badge) => [badge.src.split('/').pop()?.replace(/\.svg$/i, ''), badge] as const)),
);

const technologyAliases: Record<string, string> = {
  'c++': 'cpp',
  'arduino framework': 'arduino-framework',
  'platformio ide': 'platformio-ide',
  'bluetooth low energy (ble)': 'bluetooth-low-energy',
  'wi-fi': 'wifi',
  'pcb design': 'pcb-design',
  'embedded firmware': 'embedded_firmware',
  'sensors & actuators': 'sensors_actuators',
  'serial communication': 'serial_communication',
  'micro sd': 'microsd',
  'google gemini api': 'gemini-api',
  'openai api': 'openai-api',
  'machine learning': 'machine-learning',
  'data processing': 'data-processing',
  'data analysis': 'data_analysis',
  'prompt engineering': 'prompt_engineering',
  'rule-based intelligence': 'rule_based_intelligence',
  'ai-assisted systems': 'ai_assisted_systems',
  'ai workflows': 'ai_workflows',
  'cloud firestore': 'cloud-firestore',
  'firebase storage': 'firebase-storage',
  'google cloud platform': 'google-cloud',
  'cloud storage': 'cloud-storage',
  'next.js': 'nextjs',
  'node.js': 'nodejs',
  'express.js': 'expressjs',
  'tailwind css': 'tailwind-css',
  'rest api': 'rest-api',
  'responsive web design': 'responsive_web_design',
  'vs code': 'vscode',
  'product design': 'product_design',
  'rapid prototyping': 'rapid_prototyping',
  'cad design': 'cad_design',
  'system design': 'system_design',
  'modular architecture': 'modular_architecture',
  'embedded architecture': 'embedded_architecture',
  'api design': 'api_design',
  'workflow design': 'workflow_design',
  'research writing': 'research_writing',
  'ieee format': 'ieee_format',
  'literature review': 'literature_review',
  'experimental design': 'experimental_design',
  'patent drafting': 'patent_drafting',
  'prior art search': 'prior_art_search',
  'technical drawings': 'technical_drawings',
  'product innovation': 'product_innovation',
};

function toFileName(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function resolveTechnologyBadge(name: string): TechnologyBadgeDefinition {
  const normalizedName = name.trim().toLowerCase();
  const fileName = technologyAliases[normalizedName] || toFileName(normalizedName);
  return badgeByFileName.get(fileName) || fallbackBadge;
}
