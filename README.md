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

## Installation

```bash
npm install --save react-streamable
```

You will also need to install [Kefir](https://github.com/rpominov/kefir) and [React](https://github.com/facebook/react) if they're not already a part of your project:

```bash
npm install --save kefir
npm install --save react
```

## API

#### `streamComponent(Component, events[])`
Returns a higher-order `StreamableComponent` with an attached stream of the specified events. Supports all events supported by React's event system.

Example:
```javascript
const StreamingDiv = streamComponent('div', ['onMouseDown', 'onMouseUp']);
```

#### `fromComponent(StreamableComponent, [ events[] ])`
Returns the stream attached to the `StreamableComponent`. An optional array of `events` can be supplied to return a stream only containing those events.

fromComponent streams emit a `StreamingComponentEvent` object.

Example:
```javascript
const StreamingDiv = streamComponent('div', ['onMouseDown', 'onMouseUp']);

// will log all 'onMouseDown' and 'onMouseUp' events
fromComponent(StreamingDiv).log()

// will only log 'onMouseUp' events
fromComponent(StreamingDiv, ['onMouseUp']).log();
```

#### `StreamingComponentEvent`

The `StreamingComponentEvent` object contains two properties:
- `type` : a string which identifies the event that has occurred, e.g.: 'onClick', 'onScroll'
- `event` : the React library `SyntheticEvent` (see: [Event System](https://facebook.github.io/react/docs/events.html))

## But why?

Because Functional Reactive Programming is pretty cool, and so is React. However, React's API is not very FRP-friendly; the necessity to wire up events by hand using buses (or subjects, in RxJS-speak) easily leads us to the [Bus of Doom](https://gist.github.com/jonifreeman/5131428a9f04b69a76ae), and in general is finnicky and boilerplate-y to connect an observer to React.

There are also plenty of libraries for connecting streams to React, but very few (none that I've found) that transition React events to streams, enabling a fully functional reactive architecture.

## Dependencies

At the moment, `react-streamable` depends directly on [Kefir](https://rpominov.github.io/kefir/) for streams. There is no reason for this. The library could easibly be ported to RxJS/Bacon.js/Fairmont/whatever. Under the hood, it uses Kefir's `pool` object (basically an equivalent to RxJS' `Subject`, or Bacon's `Bus`) to abstract the events into streams; we really never escape the bus, we just hide it. I'm interested in trying to create a portable version that can work with any reactive programming library.

## More examples

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
		'type': The type of the event that was triggered, e.g. 'onChange'
		'event': The React library <SyntheticEvent>
	*/
	.map(({type, event}) => event.target.value)
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
	.onValue(({type, event}) => {
		if (type === 'onClick') {
			console.log('clicked');
		}
		else if (type === 'onChange') {
			console.log('changed: '+event.target.value);
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
	.onValue(({type, event}) => {
		if (type === 'onClick') {
			console.log('clicked');
		}
		else if (type === 'onChange') {
			console.log('changed: '+event.target.value);
		}
	});
```

## License

MIT


