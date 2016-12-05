# observe-component

```javascript
import React from 'react';
import {render} from 'react-dom';
import {observeComponent, fromComponent} from 'observe-component/kefir';

const ObservableButton = observeComponent('onClick')('button');

function MyButton(props) {
	return (<ObservableButton>Hello</ObservableButton>);
}

render(<MyButton />, Document.getElementById('my-app'));

const clickStream =
	fromComponent(ObservableButton)
	.onValue(() => {
		console.log('world!');
	});

```

## Installation

```bash
npm install --save observe-component
```

You will also need to install your choice of [Kefir](https://github.com/rpominov/kefir) or [RxJS](https://github.com/Reactive-Extensions/RxJS), and [React](https://github.com/facebook/react) if they're not already a part of your project:

## API

#### `observeComponent(...events)(Component)`

`observeComponent(...events)` returns a function that, when applied to a React component, returns a higher-order `ObservableComponent` with an attached stream of the specified events. Supports all events supported by React's event system.

Example:
```javascript
const ObservableDiv = observeComponent('onMouseDown', 'onMouseUp')('div');
```

#### `fromComponent(observeComponent, ...events)`
Returns the stream attached to the `ObservableComponent`. Optional string `event` parameters can be supplied to return a stream only containing those events.

fromComponent streams emit a `ComponentEvent` object.

Example:
```javascript
const ObservableDiv = observeComponent('onMouseDown', 'onMouseUp')('div');

// will log all 'onMouseDown' and 'onMouseUp' events
fromComponent(ObservableDiv).log()

// will only log 'onMouseUp' events
fromComponent(ObservableDiv, 'onMouseUp').log();
```

#### `ComponentEvent`

The `ComponentEvent` object contains two properties:
- `type` : a string which identifies the event that has occurred, e.g.: 'onClick', 'onScroll'
- `value` : typically the React library `SyntheticEvent` (see: [Event System](https://facebook.github.io/react/docs/events.html))

## But why?

Because Functional Reactive Programming is pretty cool, and so is React. However, React's API is not very FRP-friendly; the necessity to wire up events by hand using buses (or subjects, in RxJS-speak) easily leads us to the [Bus of Doom](https://gist.github.com/jonifreeman/5131428a9f04b69a76ae), and in general is finnicky and boilerplate-y to connect an observer to React.

There are also plenty of libraries for connecting streams to React, but very few (none that I've found) that transition React events to streams, enabling a fully functional reactive architecture.

## Dependencies

At the moment, `observe-component` allows a consumer to use either [Kefir](https://rpominov.github.io/kefir/) or [RxJS](https://github.com/Reactive-Extensions/RxJS) for reactive streams. Support for more FRP libraries might become available if it is highly desired. To use your choice of library, you can import like so:

```javascript
/* ES6 module syntax */
// kefir.js
import {observeComponent, fromComponent} from 'observe-component/kefir';

// ...
const Button = observeComponent('onClick')('button');
const clickStream =
	fromComponent(Button, 'onClick')
	.onValue((e) => console.log(e));

// => ComponentEvent { type: 'onClick', value: SyntheticEvent }
```

```javascript
// RxJS
import {observeComponent, fromComponent} from 'observe-component/rx';

// ...
const Button = observeComponent('onClick')('button');
const clickStream =
	fromComponent(Button, 'onClick')
	.subscribe((e) => console.log(e));

// => ComponentEvent { type: 'onClick', value: SyntheticEvent }
```

## Examples
For these examples, I will use the Kefir library. RxJS is quite similar.

### Components as stateless functions

```javascript
import React, {Component} from 'react';
import {render} from 'react-dom';
import {observeComponent, fromComponent} from 'observe-component/kefir';

const ObservableInput = observeComponent('onChange')('input');

function MyApp(props) {
	return (
		<div>
			<div>Hello {this.props.name}!</div>
			<ObservableInput type="text" />
		</div>
	);
}

const nameStream =
	fromComponent(ObservableInput)
	/* The streams values contain two properties:
		'type': The type of the event that was triggered, e.g. 'onChange'
		'value': The React library `SyntheticEvent`
	*/
	.map(({type, value}) => value.target.value)
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

const ObservableWidget = observeComponent('onClick', 'onChange')(MyWidget);
const widgetStream = 
	fromComponent(ObservableWidget)
	.onValue(({type, value}) => {
		if (type === 'onClick') {
			console.log('clicked');
		}
		else if (type === 'onChange') {
			console.log('changed: '+value.target.value);
		}
	});
```

However, you are **strongly** encouraged to create streams out of basic components and merge them, rather than manually pass the event handlers yourself.

Also, if we can get away with it, we'd always like to use stateless functions as components. :)

```javascript
import {merge} from 'kefir';

// Create Observable button and Observable inputs
const ObservableButton = observeComponent('onClick')('button');
const ObservableInput = observeComponent('onChange')('input');

// Component is simply a function from props to view
function MyWidget(props) {
	return (
		<div>
			<ObservableButton>Click me!</ObservableButton>
			<ObservableInput defaultValue="Change me!" />
		</div>
	);
}

// We construct our application from the two streams
const widgetStream = 
	merge([
		fromComponent(ObservableButton),
		fromComponent(ObservableInput),
	])
	.onValue(({type, value}) => {
		if (type === 'onClick') {
			console.log('clicked');
		}
		else if (type === 'onChange') {
			console.log('changed: '+value.target.value);
		}
	});
```



## License

MIT


