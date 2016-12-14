import * as React from 'react';
import { render } from 'react-dom';
import { observeComponent, fromComponent } from '../../../kefir';

const Button = observeComponent('onClick')('button');
const clickStream = fromComponent(Button);

function App(props) {
	return(
		<div>
			<Button>{props.text}</Button>
		</div>
	);
}

clickStream
	// scan passes the previous value as the first argument
	// to it's predicate. We initialize it with `false` (off).
	.scan((p) => !p, false)
	.map((x) => x ? "On" : "Off")
	.onValue((text) =>
		render(<App text={text} />, document.getElementById('app'))
	);
