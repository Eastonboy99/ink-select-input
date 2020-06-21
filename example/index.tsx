"use strict";

import * as React from 'react';
import { render, Box, Text } from 'ink';
import SelectInput, { Item } from '../'


const App = () => {
    const handleSelect = (item: Item) => {
        // `item` = { label: 'First', value: 'first' }
        console.log(item);
        
	};

	const items = [{
		label: 'First',
		value: 'first'
	}, {
		label: 'Second',
		value: 'second'
	}, {
		label: 'Third',
		value: 'third'
	}];
        return <SelectInput items={items} onSelect={handleSelect}/>
    
}

render(React.createElement(App));
