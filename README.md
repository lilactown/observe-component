# observe-component

```javascript
import React from 'react';
import { render } from 'react-dom';
import { observeComponent, fromComponent } from 'observe-component/kefir';

const ObservableButton = observeComponent('onClick')('button');

function MyButton(props) {
	return (<ObservableButton>Hello</ObservableButton>);
}

render(<MyButton />, Document.getElementById('my-app'));

const clickObservable =
	fromComponent(ObservableButton);

clickObservable
	.onValue(() => {
		console.log('world!');
	});

```

## Installation

```bash
npm install --save observe-component
```

You will also need to install your choice of [Kefir](https://github.com/rpominov/kefir), 
[RxJS (v4)](https://github.com/Reactive-Extensions/RxJS), or [RxJS (v5+)](https://github.com/ReactiveX/rxjs), and [React](https://github.com/facebook/react) if they're not already a part of your project.

## API

#### `observeComponent(...events)(Component)`

`observeComponent(...events)` returns a function that, when applied to a React component, returns a higher-order `ObservableComponent` with an attached observable of the specified events. Supports all events supported by React's event system.

Example:
```javascript
const ObservableDiv = observeComponent('onMouseDown', 'onMouseUp')('div');
```

#### `fromComponent(observeComponent, ...events)`
Returns the observable attached to the `ObservableComponent`. Optional string `event` parameters can be supplied to return a observable only containing those events.

fromComponent observables emit a `ComponentEvent` object.

Example:
```javascript
const ObservableDiv = observeComponent('onMouseDown', 'onMouseUp')('div');

// with the Kefir library, we can use the `log()` operator,
// which will log all 'onMouseDown' and 'onMouseUp' events
fromComponent(ObservableDiv).log()

// will only log 'onMouseUp' events
fromComponent(ObservableDiv, 'onMouseUp').log();
```

#### `ComponentEvent`

The `ComponentEvent` object contains three properties:
- `type` : a string which identifies the event that has occurred, e.g.: 'onClick', 'onScroll'
- `value` : typically the React library `SyntheticEvent` (see: [Event System](https://facebook.github.io/react/docs/events.html))
- `props` : the props of the observed component at event trigger 

## But why?

Because Functional Reactive Programming is pretty cool, and so is React. However, React's API is not very FRP-friendly; the necessity to wire up events by hand using buses (or subjects, in RxJS-speak) easily leads us to the [Bus of Doom](https://gist.github.com/jonifreeman/5131428a9f04b69a76ae), and in general is finnicky and boilerplate-y to connect an observer to React.

There are also plenty of libraries for connecting observables to React, but very few (none that I've found) that transition React events to observables, enabling a fully functional reactive architecture.

## Dependencies

At the moment, `observe-component` allows a consumer to use either [Kefir](https://rpominov.github.io/kefir/), [RxJS v4](https://github.com/Reactive-Extensions/RxJS) or [RxJS v5](https://github.com/ReactiveX/rxjs) for observables. Support for more FRP libraries might become available if it is highly desired. To use your choice of library, you can import like so:

```javascript
/* ES6 module syntax */
// kefir.js
import { observeComponent, fromComponent } from 'observe-component/kefir';

// ...
const Button = observeComponent('onClick')('button');
const clickObservable =
	fromComponent(Button, 'onClick')

clickObservable
	.onValue((e) => console.log(e));

// => ComponentEvent { type: 'onClick', value: SyntheticEvent, props: {} }
```

```javascript
// RxJS v4
import { observeComponent, fromComponent } from 'observe-component/rx';

// ...
const Button = observeComponent('onClick')('button');
const clickObservable =
	fromComponent(Button, 'onClick');

clickObservable
	.subscribe((e) => console.log(e));

// => ComponentEvent { type: 'onClick', value: SyntheticEvent, props: {} }
```

```javascript
// RxJS v5+
import { observeComponent, fromComponent } from 'observe-component/rxjs';

// ...
const Button = observeComponent('onClick')('button');
const clickObservable =
	fromComponent(Button, 'onClick');

clickObservable
	.subscribe((e) => console.log(e));

// => ComponentEvent { type: 'onClick', value: SyntheticEvent, props: {} }
```

## Examples
For these examples, I will use the Kefir library. RxJS is quite similar.

### Components as stateless functions

```javascript
import React, { Component } from 'react';
import { render } from 'react-dom';
import { observeComponent, fromComponent } from 'observe-component/kefir';

const ObservableInput = observeComponent('onChange')('input');

function MyApp(props) {
	return (
		<div>
			<div>Hello {this.props.name}!</div>
			<ObservableInput type="text" value={props.name} />
		</div>
	);
}

const nameObservable =
	fromComponent(ObservableInput)
	/* The observables values contain three properties:
		'type': The type of the event that was triggered, e.g. 'onChange'
		'value': The React library `SyntheticEvent`
		'props': the current props on the component
	*/
	.map(({ value }) => value.target.value);

nameObservable
	.onValue((name) => 
		render(<MyApp name={name} />, document.getElementById('my-app'))
	);

```

### Dynamic lists

```javascript
const ObservableItem = observeComponent('onClick')('li');

function MyList(props) {
	return (
        <div>
            <span>Selected: { currentName }</span>
            <ul style={styles.ul}>
                {['John', 'Will', 'Marie'].map((name) => 
                    <ObservableLi key={name}>
                        { name }
                    </ObservableLi>
                )}
            </ul>
        </div>
	);
}

fromComponent(ObservableLi)
    .map((ev) => ev.props.children)
    .startWith('John')
    .subscribe((name) => {
        render(<App currentName={name} />, document.getElementById('app'));
    });

```

### You can observable any kind of component

...as long as you pass event handlers to the appropriately. The library simply passes special handlers to React's event system (`on<Event>`) to abstract them into observables.

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
const widgetObservable = 
	fromComponent(ObservableWidget);

widgetObservable
	.onValue(({type, value}) => {
		if (type === 'onClick') {
			console.log('clicked');
		}
		else if (type === 'onChange') {
			console.log('changed: '+value.target.value);
		}
	});
```

However, you are **strongly** encouraged to create observables out of basic components and merge them, rather than manually pass the event handlers yourself.

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

// We construct our application from the two observables
const widgetObservable = 
	merge([
		fromComponent(ObservableButton),
		fromComponent(ObservableInput),
	]);

widgetObservable
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


