import ByteReader from './ByteReader'
import BinaryParser, { ParserResult } from './BinaryParser'
import XmlParser from './XmlParser'
import { readFileSync, PathOrFileDescriptor } from 'node:fs'

export type Result = Omit<ParserResult, 'reader' | 'arrays' | 'arrayIndex' | 'sharedStrings' | 'groups' | 'meta'>

export function parseBuffer(buffer: ArrayBuffer): Result {
    try {
        return XmlParser.parse(buffer)
    } catch { }
    const reader = new ByteReader(buffer)

    if (Buffer.from(reader.Array(7)).toString('utf8') !== '<roblox')
        throw new Error('Invalid RBXM/RBXL file')

    if (reader.Byte() === 0x21) {
        const { result, instances } = BinaryParser.parse(buffer)
        return { result, instances }
    }
    throw new Error('Invalid file')
}

export function readFile(file: PathOrFileDescriptor) {
    return parseBuffer(readFileSync(file))
}
