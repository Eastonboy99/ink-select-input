import React from 'react';
import { Text } from 'ink';

interface ItemProps {
	isSelected?: boolean,
	label: string
}

const Item: React.FC<ItemProps> = ({ isSelected = false, label }) => (isSelected)
	? <Text color='blue'>{label}</Text>
	: <Text> {label} </Text>
	;
// Item.propTypes = {
// 	isSelected: PropTypes.bool,
// 	label: PropTypes.string.isRequired
// };

// Item.defaultProps = {
// 	isSelected: false
// };

export default Item;
