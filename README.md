# react-streamable

```javascript
import React from 'react';
import {render} from 'react-dom';
import {streamComponent, getStream} from 'react-streamable';

const StreamableButton = streamComponent('button', ['onClick']);

function MyButton(props) {
	return (<StreamableButton>Hello</StreamableButton>);
}

render(<MyButton />, Document.getElementById('my-app'));

const clickStream = getStream(StreamableButton).onValue(() => {
	console.log('world!');
});

```

## A slightly more complex example

```javascript
import React, {Component} from 'react';
import {render} from 'react-dom';
import {streamComponent, getStream} from 'react-streamable';

const StreamableButton = streamComponent('button', ['onClick']);

class MyApp extends Component {
	render() {
		return (
			<div>
				Counter: {this.props.count}
				<StreamableButton> +1</StreamableButton>
			</div>
		);
	}
}

const countStream = getStream(StreamableButton)
	.scan((prevCount) => prevCount + 1)
	.onValue((count) => 
		render(<MyApp count={count} />, document.getElementById('my-app'))
	);

```
