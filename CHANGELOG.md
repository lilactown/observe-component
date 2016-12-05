# 2.x to 3.0.0

## observeComponent

Old signature: `observeComponent(Component, events) -> ObservableComponent`
New signature: `observeComponent(...events) -> fn(Component) -> ObservableComponent`

`observeComponent` now is a higher-order function (it returns a function) to make the API support composability with other higher-order component libraries.

It also accepts an indefinite number of `event` string arguments instead of passing them in as an array.

Example:

```javascript
// old (2.x) API
const ObservableInput = observeComponent('input', ['onChange', 'onBlur']);

// current (3.0) API
const ObservableInput = observeComponent('onChange', 'onBlur')('input');
```

## fromComponent

Old signature: `fromComponent(ObservableComponent, events = []) -> Observable<ComponentEvent>`
New signature: `fromComponent(ObservableComponent, ...events) -> Observable<ComponentEvent>`

`fromComponent` now accepts an indefinite number of `event` string arguments instead of passing them in as an array.

Example:

```javascript
// old (2.x) API
const changeStream = fromComponent(ObservableInput, ['onChange']);
const changeAndBlurStream = fromComponent(ObservableInput, ['onChange', 'onBlur']);

// current (3.0) API
const changeStream = fromComponent(ObservableInput, 'onChange');
const changeAndBlurStream = fromComponent(ObservableInput, 'onChange', 'onBlur');
```

## ComponentEvent

The `ComponentEvent` emitted by the `ObservableComponent` observables was changed from `{ type: String, event: Object }` to `{ type: String, value: Object }`. This is because for instances that don't emit a SyntheticEvent (e.g. adding a handler for React Native's TextInput `onChangeText` emits a string), the `event` name did not make much sense. Changing it to `value` is more general and allows for a more agnostic, extendable API.

Example:

```javascript
// old (2.x) API
changeStream.subscribe(({ type, event }) => console.log(event.target.value));

// current (3.0) API
changeStream.subscribe(({ type, value }) => console.log(value.target.value));
```
