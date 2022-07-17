import { isNumber } from "../utils/is-number";

// TODO: Consider Allowing Grid of Street Blocks, and Adding Generation of Adjacency List
// TODO: Consider changing return type to list all the blocks matching shortest walk rather than a single block

export type BlockWithShortestWalk = [number, number] | [null, null]
export type StreetBlock = Record<string, boolean>;

interface FindShortestWalkArgs {
    preferredFeatures: string[];
    blocks: StreetBlock[];
}

/**
 * Returns a Tuple that indicates the index and length of walk for moving into a block close to desired features.
 * Blocks are generated randomly from a set of possible available features.
 * 
 * 
 * @see https://www.youtube.com/watch?v=rw4s4M3hFfs
 */
export function findShortestWalk({
    preferredFeatures,
    blocks,
}: FindShortestWalkArgs): BlockWithShortestWalk {

    const availableFeatures = blocks.length > 0 ? Object.keys(blocks[0]) : [];

    const graphRecords = generateEmptyGraphRecords(blocks);

    const distances: (number | null)[] = [];

    for (let index = 0; index < graphRecords.length; index++) {
        distances.push(calculateGraphDistance({ blocks, graphRecords, index, preferredFeatures, availableFeatures }));
    }

    return distances.reduce<BlockWithShortestWalk>((blockWithShortestWalk, distance, index) => {
        if (isNumber(distance)) {
            if (isNumber(blockWithShortestWalk[1]) && blockWithShortestWalk[1] < distance) {
                return blockWithShortestWalk;
            }
            return [index, distance];
        }
        return blockWithShortestWalk;
    }, [null, null]);
}

interface CalculateGraphDistanceArgs {
    blocks: StreetBlock[];
    graphRecords: ReturnType<typeof generateEmptyGraphRecords>;
    index: number;
    preferredFeatures: string[];
    availableFeatures: string[];
}

function calculateGraphDistance({
    availableFeatures,
    blocks,
    graphRecords,
    index,
    preferredFeatures,
}: CalculateGraphDistanceArgs): number | null {
    for (const feature of availableFeatures) {
        if (graphRecords[index][feature] === null) {
            const visited = new Set([index]);

            graphRecords[index][feature] = minumumDistance(filterByIsNumber([
                findClosestFeature({ blocks, graphRecords, originalIndex: index, indexToSearch: index + 1, feature, visited }),
                findClosestFeature({ blocks, graphRecords, originalIndex: index, indexToSearch: index - 1, feature, visited }),
            ]));
        }
    }
    return Object.entries(graphRecords[index]).reduce<number | null>((distance, record) => {
        if (preferredFeatures.includes(record[0])) {
            return isNumber(record[1]) ? Math.max(record[1], distance ?? 0) : record[1];
        }
        return distance
    }, null);
}

interface FindClosestFeatureArgs {
    blocks: StreetBlock[];
    indexToSearch: number;
    feature: string;
    graphRecords: ReturnType<typeof generateEmptyGraphRecords>;
    originalIndex: number;
    visited: Set<number>;
}

function findClosestFeature({
    blocks,
    indexToSearch,
    feature,
    graphRecords,
    originalIndex,
    visited,
}: FindClosestFeatureArgs): number | null {
    if (indexToSearch < 0 || indexToSearch > graphRecords.length - 1) return null;
    if (visited.has(indexToSearch)) return null;

    visited.add(indexToSearch);

    if (blocks[indexToSearch][feature]) {
        return Math.abs(indexToSearch - originalIndex);
    }

    const currentFeatureDistance = graphRecords[indexToSearch][feature]; 

    if (isNumber(currentFeatureDistance)) {
        return Math.abs(indexToSearch - originalIndex) + currentFeatureDistance;
    }

    return minumumDistance(filterByIsNumber([
        findClosestFeature({ blocks, graphRecords, originalIndex: indexToSearch, indexToSearch: indexToSearch + 1, feature, visited }),
        findClosestFeature({ blocks, graphRecords, originalIndex: indexToSearch, indexToSearch: indexToSearch - 1, feature, visited }),
    ]))
}

type GraphRecord = Record<string, number | null>;

function generateEmptyGraphRecords(blocks: StreetBlock[]): GraphRecord[] {
    return blocks.map((value, index) => {
        const graph: GraphRecord = {};
        Object.keys(value).forEach(key => {
            graph[key] = blocks[index][key] ? 0 : null;
        });
        return graph;
    });
}

function filterByIsNumber(array: (number | null)[]): number[] {
    return array.filter(isNumber);
}

function minumumDistance(distances: number[]): number | null {
    return distances.length > 0 ? Math.min(...distances, Number.POSITIVE_INFINITY) : null;
}
