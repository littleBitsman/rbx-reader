import ByteReader from './ByteReader'
import BinaryParser, { ParserResult } from './BinaryParser'

type Result = Omit<ParserResult, 'reader' | 'arrays' | 'arrayIndex'>

export function parseFile(buffer: ArrayBuffer): Result {
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