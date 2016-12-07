export class ComponentEvent {
	type: string;
	value: any;
	constructor(type: string, value: any) {
		this.type = type;
		this.value = value;
	}
}
