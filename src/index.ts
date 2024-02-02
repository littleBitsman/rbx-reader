import ByteReader from './ByteReader'
import BinaryParser from './BinaryParser'

export function parseFile(buffer: ArrayBuffer) {
    const reader = new ByteReader(buffer)
    if (reader.String(7) !== '<roblox') {
        throw new Error('Invalid RBXM/RBXL file');
    }

    if(reader.Byte() === 0x21) {
        const { result, instances, groups, sharedStrings, meta } = BinaryParser.parse(buffer)
        return { result, instances, groups, sharedStrings, meta }
    }

    throw new Error('XML not supported.');
}