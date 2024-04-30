import assert from 'assert'

const InstanceUtils = {
	findFirstChild(target: Instance | any, name: string, recursive = false): Instance | undefined {
		const children = target instanceof Instance ? target.Children : target

		for (const child of children) {
			if (child.getProperty('Name') === name) {
				return child
			}
		}

		if (recursive) {
			const arrays = [children]

			while (arrays.length) {
				for (const desc of arrays.shift()) {
					if (desc.getProperty('Name') === name) {
						return desc
					}

					if (desc.Children.length) {
						arrays.push(desc.Children)
					}
				}
			}
		}

		return undefined
	},

	findFirstChildOfClass(target: Instance | any, className: string, recursive = false): Instance | undefined {
		const children = target instanceof Instance ? target.Children : target

		for (const child of children) {
			if (child.getProperty('ClassName') === className) {
				return child
			}
		}

		if (recursive) {
			const arrays = [children]

			while (arrays.length > 0) {
				for (const desc of arrays.shift()) {
					if (desc.getProperty('ClassName') === className) {
						return desc
					}

					if (desc.Children.length) {
						arrays.push(desc.Children)
					}
				}
			}
		}

		return undefined
	}
}

class InstanceRoot extends Array<Instance> {
	getChildren(): Instance[] {
		return this as Instance[]
	}

	getDescendants(): Instance[] {
		const l = this.getChildren()
		l.forEach(v => l.push(...v.getDescendants()))
		return l
	}

	findFirstChild(name: string, recursive = false) { return InstanceUtils.findFirstChild(this, name, recursive) }
	findFirstChildOfClass(className: string, recursive = false) { return InstanceUtils.findFirstChildOfClass(this, className, recursive) }
}


interface BoolAttr { Bool: boolean }
interface BinaryStringAttr { BinaryString: string}
interface NumberSequenceKeypointAttr { time: number, value: number, envelope: number }
interface NumberSequenceAttr { NumberSequence: { keypoints: NumberSequenceKeypointAttr[] }}
interface RectAttr { Rect: number[][] }
interface CFrameAttr { CFrame: { position: number[], orientation: number[][] } }
interface NumberRangeAttr { NumberRange: number[] }
interface ColorSequenceKeypointAttr { time: number, color: number[] }
interface ColorSequenceAttr { ColorSequence: { keypoints: ColorSequenceKeypointAttr[] }}
interface Vector3Attr { Vector3: number[] }
interface UDim2Attr { UDim2: number[][] }
interface Vector2Attr { Vector2: number[] }
interface Color3Attr { Color3: number[] }
interface BrickColorAttr { BrickColor: number }
interface Float64Attr { Float64: number }
interface UDimAttr { UDim: number[] }
export type AttributeValue = Partial<BoolAttr | BinaryStringAttr | NumberSequenceAttr | RectAttr | CFrameAttr | NumberRangeAttr | ColorSequenceAttr | Vector3Attr | UDim2Attr | Vector2Attr | Color3Attr | BrickColorAttr | Float64Attr | UDimAttr>

function isBoolAttr(obj: any): obj is BoolAttr {
	return typeof obj == 'object' && typeof obj.Bool == 'boolean'
}
function isStringAttr(obj: any): obj is BinaryStringAttr {
	return typeof obj == 'object' && typeof obj.BinaryString == 'string'
}
function isNumSequenceKeyPtAttr(obj: any): obj is NumberSequenceKeypointAttr {
	return typeof obj == 'object' && typeof obj.time == 'number' && typeof obj.value == 'number' && typeof obj.envelope == 'number'
}
function isNumberSequenceAttr(obj: any): obj is NumberSequenceAttr {
	return typeof obj == 'object' && typeof obj.NumberSequence == 'object' && 
		Array.isArray(obj.NumberSequence.keypoints) && obj.NumberSequence.keypoints.every(isNumSequenceKeyPtAttr)
}
function isRectAttr(obj: any): obj is RectAttr {
	return typeof obj == 'object' && Array.isArray(obj.Rect) && obj.Rect.length == 2 &&
		obj.Rect.every((v: unknown) => Array.isArray(v) && v.length == 2)
}
function isCFrameAttr(obj: any): obj is CFrameAttr {
	return typeof obj == 'object' && typeof obj.CFrame == 'object' && Array.isArray(obj.CFrame.position) &&
		obj.CFrame.position.length == 3 && obj.CFrame.position.every((v: unknown) => typeof v == 'number') && 
		Array.isArray(obj.CFrame.orientation) && obj.CFrame.orientation.length == 3 && 
		obj.CFrame.orientation.every((v: unknown) => Array.isArray(v) && 
			v.length == 3 && v.every((v2: unknown) => typeof v2 == 'number'))
}
function isNumberRangeAttr(obj: any): obj is NumberRangeAttr {
	return typeof obj == 'object' && Array.isArray(obj.NumberRange) && 
		obj.NumberRange.every((v: unknown) => typeof v == 'number') && obj.NumberRange.length == 2
}
function isColorSequenceKeyPtAttr(obj: any): obj is ColorSequenceKeypointAttr {
	return typeof obj == 'object' && typeof obj.time == 'number' && Array.isArray(obj.color)
		&& obj.color.every((v: unknown) => typeof v == 'number') && obj.color.length == 3
}
function isColorSequenceAttr(obj: any): obj is ColorSequenceAttr {
	return typeof obj == 'object' && typeof obj.ColorSequence == 'object' &&
		Array.isArray(obj.ColorSequence.keypoints) && obj.ColorSequence.keypoints.every(isColorSequenceKeyPtAttr)
}
function isVector3Attr(obj: any): obj is Vector3Attr {
	return typeof obj == 'object' && Array.isArray(obj.Vector3) && 
		obj.Vector3.every((v: unknown) => typeof v == 'number') && obj.Vector3.length == 3
}
function isUDim2Attr(obj: any): obj is UDim2Attr {
	return typeof obj == 'object' && Array.isArray(obj.UDim2) && obj.UDim2.length == 2 &&
		obj.UDim2.every((v: unknown) => Array.isArray(v) && v.every((v2: unknown) => typeof v2 == 'number') && 
			v.length == 2)
}
function isVector2Attr(obj: any): obj is Vector2Attr {
	return typeof obj == 'object' && Array.isArray(obj.Vector2) && 
		obj.Vector2.every((v: unknown) => typeof v == 'number') && obj.Vector2.length == 2
}
function isColor3Attr(obj: any): obj is Color3Attr {
	return typeof obj == 'object' && Array.isArray(obj.Color3) && 
		obj.Color3.every((v: unknown) => typeof v == 'number') && obj.Color3.length == 3
}
function isBrickColorAttr(obj: any): obj is BrickColorAttr {
	return typeof obj == 'object' && typeof obj.BrickColor == 'number'
}
function isNumberAttr(obj: any): obj is Float64Attr {
	return typeof obj == 'object' && typeof obj.Float64 == 'number'
}
function isUDimAttr(obj: any): obj is UDimAttr {
	return typeof obj == 'object' && Array.isArray(obj.UDim) && obj.UDim.length == 2 &&
		obj.UDim.every((v: unknown) => typeof v == 'number')
}

export const AttrAssertions = {
	isBoolAttr,
	isStringAttr,
	isNumberSequenceAttr,
	isRectAttr,
	isCFrameAttr,
	isNumberRangeAttr,
	isColorSequenceAttr,
	isVector3Attr,
	isUDim2Attr,
	isVector2Attr,
	isColor3Attr,
	isBrickColorAttr,
	isNumberAttr,
	isUDimAttr,
	isFloat64Attr: isNumberAttr
}

type AttributeJSValue = boolean | string | number | NumberSequenceKeypointAttr[] | number[][] | { position: number[], orientation: number[][] } | { lower: number, upper: number } | ColorSequenceKeypointAttr[] | { x: number, y: number, z: number } | { x: { scale: number, offset: number }, y: { scale: number, offset: number }} | { x: number, y: number } | { r: number, g: number, b: number } | { scale: number, offset: number } | { BrickColor: number }

class Instance {
	readonly Children: Instance[] = [];
	readonly Properties: object = {};
	Attributes: {[key: string]: AttributeJSValue} = {};

	get ClassName(): string {
		return this.Properties['ClassName'].value
	}

	get Name(): string {
		return this.Properties['Name'].value
	}

	get Parent(): Instance | InstanceRoot | undefined {
		return this.Properties['Parent'].value
	}

	getFullName(): string {
		if (this.Parent && !(this.Parent instanceof InstanceRoot)) {
			return `${this.Parent.getFullName()}.${this.Name}`
		} else {
			return `${this.Name}`
		}
	}

	static new(className: string) {
		assert(typeof className === 'string', 'className is not a string')
		return new Instance(className)
	}

	constructor(className: string) {
		assert(typeof className === 'string', 'className is not a string')

		this.Children = []

		this.setProperty('ClassName', className, 'string')
		this.setProperty('Name', 'Instance', 'string')
		this.setProperty('Parent', undefined, 'Instance')
	}

	setProperty(name: string, value: any, type: any) {
		if (!type) {
			if (typeof value === 'boolean') {
				type = 'bool'
			} else if (value instanceof Instance) {
				type = 'Instance'
			} else {
				throw new TypeError('You need to specify property type since it cannot be inferred')
			}
		}

		var descriptor = this.Properties[name]
		if (descriptor) {
			assert(descriptor.type === type, `Property type mismatch: ${type} !== ${descriptor.type}`)

			if (name === 'Parent' && descriptor.value instanceof Instance) {
				const index = descriptor.value.Children.indexOf(this)
				if (index !== -1)
					descriptor.value.Children.splice(index, 1)
			}

			descriptor.value = value
		} else
			descriptor = this.Properties[name] = { type, value }

		if (name === 'Parent' && descriptor.value instanceof Instance)
			descriptor.value.Children.push(this)

		if (name !== 'Children' && name !== 'Properties' && !(name in Object.getPrototypeOf(this)))
			this[name] = value
	}

	getProperty(name: string, caseInsensitive: boolean = false) {
		const descriptor = this.Properties[name] || caseInsensitive && Object.entries(this.Properties).find(x => x[0].toLowerCase() === name.toLowerCase())?.[1]
		return descriptor ? descriptor.value : undefined
	}

	getChildren() {
		return this.Children
	}

	getDescendants(): Instance[] {
		const desc = this.Children
		desc.forEach(inst => {
			desc.push(...inst.getDescendants())
		})
		return desc
	}

	hasProperty(name: string, caseInsensitive: boolean = false) {
		return name in this.Properties || caseInsensitive && !Object.entries(this.Properties).find(x => x[0].toLowerCase() === name.toLowerCase())
	}

	findFirstChild(name: string, recursive = false) { return InstanceUtils.findFirstChild(this, name, recursive) }
	findFirstChildOfClass(className: string, recursive = false) { return InstanceUtils.findFirstChildOfClass(this, className, recursive) }

	getAttribute(name: string): AttributeJSValue | undefined {
		return this.Attributes[name]
	}
}

export { Instance, InstanceRoot }