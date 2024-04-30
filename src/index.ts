import ByteReader from './ByteReader'
import BinaryParser, { ParserResult } from './BinaryParser'
import XmlParser from './XmlParser'
import { readFileSync, PathOrFileDescriptor } from 'node:fs'
import { parse_attrs } from './attributes-parser/attributes_parser'
import { AttrAssertions, AttributeValue } from './Instance'

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

export function parseAttributes(attributesSerializeBuf: ArrayBufferLike) {
    const result: Map<string, object> = parse_attrs(Buffer.from(attributesSerializeBuf))
    const Attributes: { [key: string]: AttributeValue } = {}
    result.forEach((v, k) => {
        Attributes[k] = v
    })

    const finalAttrs: { [key: string]: any } = {}
    Object.keys(Attributes).forEach(k => {
        const v = Attributes[k]
        if (AttrAssertions.isBoolAttr(v))
            finalAttrs[k] = v.Bool
        else if (AttrAssertions.isStringAttr(v))
            finalAttrs[k] = v.BinaryString
        else if (AttrAssertions.isNumberSequenceAttr(v))
            finalAttrs[k] = v.NumberSequence
        else if (AttrAssertions.isRectAttr(v))
            finalAttrs[k] = v.Rect
        else if (AttrAssertions.isCFrameAttr(v))
            finalAttrs[k] = v.CFrame
        else if (AttrAssertions.isNumberRangeAttr(v))
            finalAttrs[k] = {
                lower: v.NumberRange[0],
                upper: v.NumberRange[1]
            }
        else if (AttrAssertions.isColorSequenceAttr(v))
            finalAttrs[k] = v.ColorSequence
        else if (AttrAssertions.isVector3Attr(v))
            finalAttrs[k] = {
                x: v.Vector3[0],
                y: v.Vector3[1],
                z: v.Vector3[2]
            }
        else if (AttrAssertions.isUDim2Attr(v))
            finalAttrs[k] = {
                x: {
                    scale: v.UDim2[0][0],
                    offset: v.UDim2[0][1]
                },
                y: {
                    scale: v.UDim2[1][0],
                    offset: v.UDim2[1][1]
                }
            }
        else if (AttrAssertions.isVector2Attr(v))
            finalAttrs[k] = {
                x: v.Vector2[0],
                y: v.Vector2[1]
            }
        else if (AttrAssertions.isColor3Attr(v))
            finalAttrs[k] = {
                r: v.Color3[0],
                g: v.Color3[1],
                b: v.Color3[2]
            }
        else if (AttrAssertions.isNumberAttr(v))
            finalAttrs[k] = v.Float64
        else if (AttrAssertions.isUDimAttr(v))
            finalAttrs[k] = {
                scale: v.UDim[0],
                offset: v.UDim[1]
            }
        else if (AttrAssertions.isBrickColorAttr(v))
            finalAttrs[k] = {
                ...v
            }
    })
    return Attributes
}
