import { generateStreetBlocks } from "./data/street-blocks";
import { findShortestWalk } from "./problems/find-shortest-walk";

// TODO: Implement calling via cli using process.argv
function main(): void {

    const preferredFeatures = ['gym', 'school', 'store'];
    const availableFeatures = ['gym', 'school', 'store', 'restaurant', 'bakery'];
    const numberOfStreetBlocks = 6;

    const blocks = generateStreetBlocks(availableFeatures, numberOfStreetBlocks);
    console.log(blocks);

    console.log(findShortestWalk({
        blocks,
        preferredFeatures,
    }));
}

main();