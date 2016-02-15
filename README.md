# react-streamable

```javascript
import React from 'react';
import {render} from 'react-dom';
import {streamComponent, fromComponent} from 'react-streamable';

const StreamableButton = streamComponent('button', ['onClick']);

function MyButton(props) {
	return (<StreamableButton>Hello</StreamableButton>);
}

render(<MyButton />, Document.getElementById('my-app'));

const clickStream =
	fromComponent(StreamableButton)
	.onValue(() => {
		console.log('world!');
	});

```

## But why?

Because Functional Reactive Programming is pretty cool, and so is React. However, React's API is not very FRP-friendly; the necessity to use event buses (or subjects, in RxJS-speak) can lead us to the [Bus of Doom](https://gist.github.com/jonifreeman/5131428a9f04b69a76ae), and in general is finnicky and boilerplate-y to connect an observer to React.

There are also plenty of libraries for connecting streams to React, but very few (none that I've found) that transition React events to streams, enabling a fully functional reactive architecture.

### A slightly more complex example

```javascript
import React, {Component} from 'react';
import {render} from 'react-dom';
import {streamComponent, fromComponent} from 'react-streamable';

const StreamableInput = streamComponent('input', ['onChange']);

class MyApp extends Component {
	render() {
		return (
			<div>
				<div>Hello {this.props.name}!</div>
				<StreamableInput type="text" />
			</div>
		);
	}
}

const nameStream =
	fromComponent(StreamableInput)
	/* The streams values contain two properties:
		'event': The name of the event that was triggered, e.g. 'onChange'
		'e': The React SyntheticEvent
	*/
	.map(({event, e}) => e.target.value)
	.onValue((name) => 
		render(<MyApp name={name} />, document.getElementById('my-app'))
	);

```

### You can stream any component
...as long as you pass event handlers to the appropriate elements. The library simply passes special handlers to React's event system (`on<Event>`) to abstract them into one stream.

```javascript
function MyWidget(props) {
	return (
		<div>
			<button onClick={props.onClick}>Click me!</button>
			<input onChange={props.onChange} defaultValue="Change me!" />
		</div>
	);
}

const StreamableWidget = streamComponent(MyWidget, ['onClick', 'onChange']);
const widgetStream = 
	fromComponent(StreamableWidget)
	.onValue(({event, e}) => {
		if (event === 'onClick') {
			console.log('clicked');
		}
		else if (event === 'onChange') {
			console.log('changed: '+e.target.value);
		}
	});
```

However, you are **strongly** encouraged to create streams out of basic components and merge them, rather than manually pass the event handlers yourself. 

```javascript
import {merge} from 'kefir';

const StreamableButton = streamComponent('button', ['onClick']);
const StreamableInput = streamComponent('input', ['onChange']);

function MyWidget(props) {
	return (
		<div>
			<StreamableButton>Click me!</StreamableButton>
			<StreamableInput defaultValue="Change me!" />
		</div>
	);
}

const widgetStream = 
	merge([
		fromComponent(StreamableButton),
		fromComponent(StreamableInput),
	])
	.onValue(({event, e}) => {
		if (event === 'onClick') {
			console.log('clicked');
		}
		else if (event === 'onChange') {
			console.log('changed: '+e.target.value);
		}
	});
```

