export class ComponentEvent {
	type: string;
	value: any;
	props: any;
	constructor(type: string, value: any, props: any) {
		this.type = type;
		this.value = value;
		this.props = props;
	}
}
