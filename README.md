# react-streamable

```javascript
import React from 'react';
import {render} from 'react-dom';
import {observableComponent, fromComponent} from 'react-streamable';

const StreamingButton = observableComponent('button', ['onClick']);

function MyButton(props) {
	return (<StreamingButton>Hello</StreamingButton>);
}

render(<MyButton />, Document.getElementById('my-app'));

const clickStream =
	fromComponent(StreamingButton)
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

#### `observableComponent(Component, events[])`
Returns a higher-order `ObservableComponent` with an attached stream of the specified events. Supports all events supported by React's event system.

Example:
```javascript
const StreamingDiv = observableComponent('div', ['onMouseDown', 'onMouseUp']);
```

#### `fromComponent(ObservableComponent, [ events[] ])`
Returns the stream attached to the `StreamableComponent`. An optional array of `events` can be supplied to return a stream only containing those events.

fromComponent streams emit a `ComponentEvent` object.

Example:
```javascript
const StreamingDiv = observableComponent('div', ['onMouseDown', 'onMouseUp']);

// will log all 'onMouseDown' and 'onMouseUp' events
fromComponent(StreamingDiv).log()

// will only log 'onMouseUp' events
fromComponent(StreamingDiv, ['onMouseUp']).log();
```

#### `ComponentEvent`

The `ComponentEvent` object contains two properties:
- `type` : a string which identifies the event that has occurred, e.g.: 'onClick', 'onScroll'
- `event` : the React library `SyntheticEvent` (see: [Event System](https://facebook.github.io/react/docs/events.html))

## But why?

Because Functional Reactive Programming is pretty cool, and so is React. However, React's API is not very FRP-friendly; the necessity to wire up events by hand using buses (or subjects, in RxJS-speak) easily leads us to the [Bus of Doom](https://gist.github.com/jonifreeman/5131428a9f04b69a76ae), and in general is finnicky and boilerplate-y to connect an observer to React.

There are also plenty of libraries for connecting streams to React, but very few (none that I've found) that transition React events to streams, enabling a fully functional reactive architecture.

## Dependencies

At the moment, `react-streamable` depends directly on [Kefir](https://rpominov.github.io/kefir/) for reactive streams. There is no reason for this. The library could easibly be ported to RxJS/Bacon.js/Fairmont/whatever. Under the hood, it uses Kefir's `pool` object (basically an equivalent to RxJS' `Subject`, or Bacon's `Bus`) to abstract the events into streams; we really never escape the bus, we just hide it. I'm interested in trying to create a portable version that can work with any reactive programming library.

## Examples

### Components as stateless functions

```javascript
import React, {Component} from 'react';
import {render} from 'react-dom';
import {observableComponent, fromComponent} from 'react-streamable';

const StreamingInput = observableComponent('input', ['onChange']);

function MyApp(props) {
	return (
		<div>
			<div>Hello {this.props.name}!</div>
			<StreamingInput type="text" />
		</div>
	);
}

const nameStream =
	fromComponent(StreamingInput)
	/* The streams values contain two properties:
		'type': The type of the event that was triggered, e.g. 'onChange'
		'event': The React library `SyntheticEvent`
	*/
	.map(({type, event}) => event.target.value)
	.onValue((name) => 
		render(<MyApp name={name} />, document.getElementById('my-app'))
	);

```

### You can stream any kind of component
...as long as you pass event handlers to the appropriate elements. The library simply passes special handlers to React's event system (`on<Event>`) to abstract them into streams.

```javascript
class MyWidget extends React.Component {
	render() {
		return (
			<div>
				<button onClick={this.props.onClick}>Click me!</button>
				<input onChange={this.props.onChange} defaultValue="Change me!" />
			</div>
		);
	}
}

const StreamingWidget = observableComponent(MyWidget, ['onClick', 'onChange']);
const widgetStream = 
	fromComponent(StreamingWidget)
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

Also, if we can get away with it, we'd always like to use stateless functions as components. :)

```javascript
import {merge} from 'kefir';

// Create streamable button and streamable inputs
const StreamingButton = observableComponent('button', ['onClick']);
const StreamingInput = observableComponent('input', ['onChange']);

// Component is simply a function from props to view
function MyWidget(props) {
	return (
		<div>
			<StreamingButton>Click me!</StreamingButton>
			<StreamingInput defaultValue="Change me!" />
		</div>
	);
}

// We construct our application from the two streams
const widgetStream = 
	merge([
		fromComponent(StreamingButton),
		fromComponent(StreamingInput),
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


