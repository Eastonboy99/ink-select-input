import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'ink';

const Item = ({ isSelected, label }) => (isSelected
	? <Text color='blue'>{label}</Text>
	: <Text> {label} </Text>);

Item.propTypes = {
	isSelected: PropTypes.bool,
	label: PropTypes.string.isRequired
};

Item.defaultProps = {
	isSelected: false
};

export default Item;
