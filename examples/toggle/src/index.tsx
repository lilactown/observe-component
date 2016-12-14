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
	// scan is like `reduce` for observables
	// in this case, each event emitted we just flip the value of boolean `p`
	.scan((p, _) => !p, false)
	.startWith(false) // we trigger the initial render with a state of false
	.map((p) => p ? "On" : "Off") // map the internal state of our app to the display state
	.subscribe((text) => // subscribe to our observable to start our app
		// render our up with each update to our state
		render(<App text={text} />, document.getElementById('app'))
	);
