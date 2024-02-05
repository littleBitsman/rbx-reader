import ByteReader from './ByteReader'
import BinaryParser, { ParserResult } from './BinaryParser'
import XmlParser from './XmlParser'
import { readFileSync, PathOrFileDescriptor } from 'node:fs'

export type Result = Omit<ParserResult, 'reader' | 'arrays' | 'arrayIndex' | 'sharedStrings' | 'groups' | 'meta'>

export function parseFile(buffer: ArrayBuffer): Result {
    if (!Buffer.from(buffer).includes(0x00)) {
        return XmlParser.parse(buffer)
    }
    const reader = new ByteReader(buffer)
    if (reader.String(7) !== '<roblox')
        throw new Error('Invalid RBXM/RBXL file');

    if(reader.Byte() === 0x21) {
        const { result, instances } = BinaryParser.parse(buffer)
        return { result, instances }
    }
    throw new Error('Invalid file')
}

export function readFile(file: PathOrFileDescriptor) {
    return parseFile(readFileSync(file))
}
