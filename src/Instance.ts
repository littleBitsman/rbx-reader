import assert from 'assert'

const InstanceUtils = {
	findFirstChild(target: Instance | any, name: string, recursive = false): Instance | undefined {
		const children = target instanceof Instance ? target.Children : target
		
		for(const child of children) {
			if(child.getProperty('Name') === name) {
				return child
			}
		}
		
		if(recursive) {
			const arrays = [children]
			
			while(arrays.length) {
				for(const desc of arrays.shift()) {
					if(desc.getProperty('Name') === name) {
						return desc
					}
					
					if(desc.Children.length) {
						arrays.push(desc.Children)
					}
				}
			}
		}
		
		return undefined
	},
	
	findFirstChildOfClass(target: Instance | any, className: string, recursive = false): Instance | undefined {
		const children = target instanceof Instance ? target.Children : target
		
		for(const child of children) {
			if(child.getProperty('ClassName') === className) {
				return child
			}
		}
		
		if(recursive) {
			const arrays = [children]
			
			while(arrays.length) {
				for(const desc of arrays.shift()) {
					if(desc.getProperty('ClassName') === className) {
						return desc
					}
					
					if(desc.Children.length) {
						arrays.push(desc.Children)
					}
				}
			}
		}
		
		return undefined
	}
}

class InstanceRoot extends Array<Instance> {
	getDescendants(): Instance[] {
		const l: Instance[] = []
		l.push(...this)
		l.forEach(v => l.push(...v.getDescendants()))
		return []
	}

	findFirstChild(name: string, recursive = false) { return InstanceUtils.findFirstChild(this, name, recursive) }
	findFirstChildOfClass(className: string, recursive = false) { return InstanceUtils.findFirstChildOfClass(this, className, recursive) }
}

class Instance {
    Children: Instance[] = [];
    Properties: object = {};

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
		if(!type) {
			if(typeof value === 'boolean') {
				type = 'bool'
			} else if(value instanceof Instance) {
				type = 'Instance'
			} else {
				throw new TypeError('You need to specify property type')
			}
		}

		var descriptor = this.Properties[name]
		if(descriptor) {
			assert(descriptor.type === type, `Property type mismatch ${type} !== ${descriptor.type}`)

			if(name === 'Parent' && descriptor.value instanceof Instance) {
				const index = descriptor.value.Children.indexOf(this)
				if(index !== -1) {
					descriptor.value.Children.splice(index, 1)
				}
			}

			descriptor.value = value
		} else {
			descriptor = this.Properties[name] = { type, value }
		}

		if(name === 'Parent') {
			if(descriptor.value instanceof Instance) {
				descriptor.value.Children.push(this)
			}
		}

		if(name !== 'Children' && name !== 'Properties' && !(name in Object.getPrototypeOf(this))) {
			(this as any)[name] = value
		}
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
}

export {Instance, InstanceRoot}