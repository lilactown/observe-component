# react-streamable

```javascript
import React from 'react';
import {render} from 'react-dom';
import {streamComponent, getStream} from 'react-streamable';

function MyButton(props) {
	return (<button {...props}>Hello</button>);
}

const StreamableButton = streamComponent(MyButton, ['onClick']);

render(<StreamableButton />, Document.getElementById('my-app'));

const clickStream = getStream(StreamableButton).onValue(() => {
	console.log('world!');
});

```
