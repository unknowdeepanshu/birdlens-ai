import type { BirdInfo } from '../lib/birds';
const entry = (commonName: string, scientificName: string, slug: string, summary: string, habitat: string, distribution: string, diet: string, features: string, fact: string): BirdInfo => ({ commonName, scientificName, summary, habitat, distribution, diet, features, fact, sourceUrl: `https://www.allaboutbirds.org/guide/${slug}/overview`, attribution: 'Original concise paraphrases of Cornell Lab of Ornithology species accounts; follow the reference for full details.' });
export const fieldGuide: Record<string, BirdInfo> = {
  'ABBOTTS BABBLER': {
    commonName: "Abbott's Babbler", scientificName: 'Malacocincla abbotti',
    summary: 'A shy, ground-foraging babbler found in the undergrowth of forests in southern and southeastern Asia.',
    habitat: 'Dense low undergrowth in broadleaf forests, including forest edges.',
    distribution: 'Southern and southeastern Asia, from the Himalayan foothills through parts of mainland Southeast Asia.',
    diet: 'Insects and other small invertebrates, searched for in leaf litter.',
    features: 'Brown upperparts, pale underparts, a grayish face, and a relatively stout bill.',
    fact: 'This secretive bird is often easier to hear than to see in dense undergrowth.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Abbott%27s_babbler',
    attribution: 'Original concise paraphrase of the linked Wikipedia species account (Wikipedia contributors, CC BY-SA 4.0). Verify details with the source.',
  },
  'AMERICAN ROBIN': entry('American Robin', 'Turdus migratorius', 'American_Robin', 'A familiar North American thrush often seen foraging on lawns.', 'Woodlands, gardens, parks, and lawns.', 'Widespread across North America, with seasonal movements.', 'Earthworms, insects, and fruit.', 'Orange breast, gray-brown back, and a broken white eye ring.', 'Robins switch between animal prey and fruit as the seasons change.'),
  'NORTHERN CARDINAL': entry('Northern Cardinal', 'Cardinalis cardinalis', 'Northern_Cardinal', 'A crested songbird with a thick bill and a clear, whistled song.', 'Dense shrubs, woodland edges, and gardens.', 'Eastern and central North America, extending south into Mexico.', 'Seeds, fruit, and insects.', 'Males are red; females are warm brown with reddish accents. Both have a crest.', 'Female cardinals sing as well as males.'),
  'AMERICAN GOLDFINCH': entry('American Goldfinch', 'Spinus tristis', 'American_Goldfinch', 'A small seed-eating finch with an undulating flight.', 'Weedy fields, open areas, and woodland edges.', 'North America; many birds move south in winter.', 'Mostly seeds, especially from thistles and other composite plants.', 'Breeding males are yellow with black wings and a black forehead; winter birds are duller.', 'Goldfinches often nest later in summer, when seed supplies are abundant.'),
  'BLACK-CAPPED CHICKADEE': entry('Black-capped Chickadee', 'Poecile atricapillus', 'Black-capped_Chickadee', 'A small, active woodland bird with a distinctive black cap.', 'Deciduous and mixed forests, parks, and wooded yards.', 'Northern United States and much of Canada.', 'Insects, spiders, seeds, and berries.', 'Black cap and bib, white cheeks, and a small rounded body.', 'Chickadees cache food and return to hidden stores later.'),
  'MALLARD DUCK': entry('Mallard', 'Anas platyrhynchos', 'Mallard', 'A widespread dabbling duck that feeds at the water surface.', 'Ponds, marshes, lakes, rivers, and urban wetlands.', 'Broadly distributed across the Northern Hemisphere and introduced elsewhere.', 'Aquatic plants, seeds, and small invertebrates.', 'Breeding males have a green head; females are mottled brown. Both have a blue wing patch.', 'Mallards often tip forward with their tails up to reach food underwater.'),
  'BALD EAGLE': entry('Bald Eagle', 'Haliaeetus leucocephalus', 'Bald_Eagle', 'A large fish-eating raptor associated with open water.', 'Coasts, lakes, reservoirs, and large rivers.', 'North America.', 'Mostly fish; also carrion, birds, and other animals.', 'Adults have white heads and tails, dark bodies, and large yellow bills; juveniles are mottled.', 'The familiar white head develops only as the bird matures.'),
};
