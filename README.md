# observe-component

```javascript
import React from 'react';
import {render} from 'react-dom';
import {observeComponent, fromComponent} from 'observe-component/kefir';

const StreamingButton = observeComponent('button', ['onClick']);

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
npm install --save observe-component
```

You will also need to install your choice of [Kefir](https://github.com/rpominov/kefir) or [RxJS](https://github.com/Reactive-Extensions/RxJS), and [React](https://github.com/facebook/react) if they're not already a part of your project:

```bash
npm install --save kefir
npm install --save react
```

## API

#### `observeComponent(Component, events[])`
Returns a higher-order `ObservableComponent` with an attached stream of the specified events. Supports all events supported by React's event system.

Example:
```javascript
const StreamingDiv = observeComponent('div', ['onMouseDown', 'onMouseUp']);
```

#### `fromComponent(observeComponent, [ events[] ])`
Returns the stream attached to the `ObservableComponent`. An optional array of `events` can be supplied to return a stream only containing those events.

fromComponent streams emit a `ComponentEvent` object.

Example:
```javascript
const StreamingDiv = observeComponent('div', ['onMouseDown', 'onMouseUp']);

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

At the moment, `observe-component` allows a consumer to use either [Kefir](https://rpominov.github.io/kefir/) or [RxJS](https://github.com/Reactive-Extensions/RxJS) for reactive streams. Support for more FRP libraries is coming in the future. To use your choice of library, you can import like so:

```javascript
/* ES6 module syntax */
// kefir.js
import {observeComponent, fromComponent} from 'observe-component/kefir';

// ...
const Button = observeComponent('button', ['onClick'])
const clickStream =
	fromComponent(Button, ['onClick'])
	.onValue((e) => console.log(e));

// => ComponentEvent { type: 'onClick', event: SyntheticEvent }
```

```javascript
// RxJS
import {observeComponent, fromComponent} from 'observe-component/rx';

// ...
const Button = observeComponent('button', ['onClick'])
const clickStream =
	fromComponent(Button, ['onClick'])
	.subscribe((e) => console.log(e));

// => ComponentEvent { type: 'onClick', event: SyntheticEvent }
```

## Examples
For these examples, I will use the Kefir library. RxJS is quite similar.

### Components as stateless functions

```javascript
import React, {Component} from 'react';
import {render} from 'react-dom';
import {observeComponent, fromComponent} from 'observe-component/kefir';

const StreamingInput = observeComponent('input', ['onChange']);

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

const StreamingWidget = observeComponent(MyWidget, ['onClick', 'onChange']);
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

// Create Observable button and Observable inputs
const StreamingButton = observeComponent('button', ['onClick']);
const StreamingInput = observeComponent('input', ['onChange']);

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


