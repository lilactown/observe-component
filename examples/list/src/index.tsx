import * as React from 'react';
import { render } from 'react-dom';
import { observeComponent, fromComponent } from '../../../rxjs';

const ObservableLi = observeComponent<React.HTMLProps<any>>('onClick')('li');

function App({ currentName }) {
	return(
        <div>
            <span>Selected: { currentName }</span>
            <ul style={styles.ul}>
                {['John', 'Will', 'Marie'].map((name) => 
                    <ObservableLi
                        style={currentName === name ? styles.selected : styles.li}
                        key={name}
                    >
                        { name }
                    </ObservableLi>
                )}
            </ul>
        </div>
	);
}

const styles = {
    ul: {
        listStyle: 'none',
        paddingLeft: 0,
        marginLeft: 0,
        borderBottom: "1px solid #ccc",
    },
    li: {
        border: "1px solid #ccc",
        borderBottom: "0px",
        padding: 5,
    },
    selected: {
        border: "1px solid #ccc",
        borderBottom: "0px",
        backgroundColor: "rgba(16, 127, 242, .2)",
        padding: 5,
    },
};

fromComponent(ObservableLi)
    .map((ev) => ev.props.children)
    .startWith('John')
    .subscribe((name) => {
        render(<App currentName={name} />, document.getElementById('app'));
    });
