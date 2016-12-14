import * as React from 'react';
import { render } from 'react-dom';
import { observeComponent, fromComponent } from '../../../rxjs';

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
	.scan((p, _) => !p, false)
	.startWith(false)
	.map((x) => x ? "On" : "Off")
	.subscribe((text) =>
		render(<App text={text} />, document.getElementById('app'))
	);
