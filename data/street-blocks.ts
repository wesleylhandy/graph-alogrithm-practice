import { randomBoolean } from "../utils/random-boolean";

/**
 * Generates a List of Objects with identical keys mapped to a random boolean value.
 * 
 * @example
 * [{
 *  gym: true,
 *  school: false,
 *  store: false
 * }]
 */
export function generateStreetBlocks<BlockAttribute extends string = string>(
    attributes: BlockAttribute[],
    numberOfBlocks: number,
): Record<BlockAttribute, boolean>[] {
    return new Array(numberOfBlocks)
        .fill(null)
        .map(generateStreetBlock(attributes))
}

function generateStreetBlock<BlockAttribute extends string = string>(
    attributes: BlockAttribute[],
): (_: null) => Record<BlockAttribute, boolean> {
    return (): Record<BlockAttribute, boolean> => {
        return attributes.reduce(applyAttributeToBlock, {} as Record<BlockAttribute, boolean>)
    }
}

function applyAttributeToBlock<BlockAttribute extends string = string>(
    block: Record<BlockAttribute, boolean>,
    attribute: BlockAttribute,
): Record<BlockAttribute, boolean> {
    block[attribute] = randomBoolean(-0.1);
    return block;
}
