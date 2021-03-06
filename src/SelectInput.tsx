import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';
// import isEqual from 'lodash.isequal';
import { arrRotate } from './utils';
import { Box, useStdin } from 'ink';
import Indicator from './Indicator';
import Item from './Item';
// import { string } from 'prop-types';

const ARROW_UP = '\u001B[A';
const ARROW_DOWN = '\u001B[B';
const ENTER = '\r';

interface SelectInputProps {
	items: string[],
	focus: boolean,
	initialIndex: number,
	indicatorComponent: typeof Indicator,
	itemComponent: typeof Item,
	limit: number,
	stdin: NodeJS.ReadStream,
	setRawMode: Function,
	onSelect: Function,
	onHighlight: Function
}

const SelectInput = (props: SelectInputProps) => {



	function hasLimit() {
		const { limit, items } = props;
		return typeof limit === 'number' && items.length > limit;
	}

	function getLimit() {
		const { limit, items } = props;
		if (hasLimit() && limit) {
			return Math.min(limit, items.length);
		}

		return items.length;

	}

	const [state, setState] = React.useState({ rotateIndex: 0, selectedIndex: props.initialIndex })

	const { items, indicatorComponent, itemComponent } = props;
	const { rotateIndex, selectedIndex } = state;
	const limit = getLimit();
	useEffect(() => {
		const { stdin, setRawMode } = props
		setRawMode(true)
		stdin.on('data', handleInput)
		return () => {
			stdin.removeListener('data', handleInput)
			setRawMode(false)
		};
	}, [])

	useEffect(() => {
		setState({
			rotateIndex: 0,
			selectedIndex: 0
		})
	}, [props])



	const handleInput = (data: string) => {
		const { items, focus, onSelect, onHighlight } = props
		const { rotateIndex, selectedIndex } = state;
		// const hasLimit = hasLimit();
		const limit = getLimit();

		if (focus === false) {
			return;
		}

		const s = String(data);

		if (s === ARROW_UP || s === 'k') {
			const lastIndex = (hasLimit() ? limit : items.length) - 1;
			const atFirstIndex = selectedIndex === 0;
			const nextIndex = (hasLimit() ? selectedIndex : lastIndex);
			const nextRotateIndex = atFirstIndex ? rotateIndex + 1 : rotateIndex;
			const nextSelectedIndex = atFirstIndex ? nextIndex : selectedIndex - 1;

			setState({
				rotateIndex: nextRotateIndex,
				selectedIndex: nextSelectedIndex
			});

			const slicedItems = hasLimit() ? arrRotate(items, nextRotateIndex).slice(0, limit) : items;
			onHighlight(slicedItems[nextSelectedIndex]);
		}
		if (s === ARROW_DOWN || s === 'j') {
			const atLastIndex = selectedIndex === (hasLimit() ? limit : items.length) - 1;
			const nextIndex = (hasLimit() ? selectedIndex : 0);
			const nextRotateIndex = atLastIndex ? rotateIndex - 1 : rotateIndex;
			const nextSelectedIndex = atLastIndex ? nextIndex : selectedIndex + 1;

			setState({
				rotateIndex: nextRotateIndex,
				selectedIndex: nextSelectedIndex
			});
			const slicedItems = hasLimit() ? arrRotate(items, nextRotateIndex).slice(0, limit) : items;
			onHighlight(slicedItems[nextSelectedIndex]);
		}
		if (s === ENTER) {
			const slicedItems = hasLimit() ? arrRotate(items, rotateIndex).slice(0, limit) : items;
			onSelect(slicedItems[selectedIndex]);
		}

	}
	const slicedItems = hasLimit() ? arrRotate(items, rotateIndex).slice(0, limit) : items;
	return (
		<Box flexDirection="column">
			{slicedItems.map((item, index) => {
				const isSelected = index === selectedIndex;

				return (
					<Box key={item.key || item.value}>
						{React.createElement(indicatorComponent, { isSelected })}
						{React.createElement(itemComponent, { ...item, isSelected })}
					</Box>
				);
			})}
		</Box>
	)


}

SelectInput.defaultProps = {
	items: [],
	focus: true,
	initialIndex: 0,
	indicatorComponent: Indicator,
	itemComponent: Item,
	limit: null,
	onSelect() { },
	onHighlight() { }
}

// class SelectInput extends PureComponent {
// 	static propTypes = {
// 		items: PropTypes.array,
// 		focus: PropTypes.bool,
// 		initialIndex: PropTypes.number,
// 		indicatorComponent: PropTypes.func,
// 		itemComponent: PropTypes.func,
// 		limit: PropTypes.number,
// 		stdin: PropTypes.object.isRequired,
// 		setRawMode: PropTypes.func.isRequired,
// 		onSelect: PropTypes.func,
// 		onHighlight: PropTypes.func
// 	}

// 	static defaultProps = {
// 		items: [],
// 		focus: true,
// 		initialIndex: 0,
// 		indicatorComponent: Indicator,
// 		itemComponent: Item,
// 		limit: null,
// 		onSelect() { },
// 		onHighlight() { }
// 	}

// 	state = {
// 		rotateIndex: 0,
// 		selectedIndex: this.props.initialIndex
// 	}

// 	render() {
// 		const { items, indicatorComponent, itemComponent } = this.props;
// 		const { rotateIndex, selectedIndex } = this.state;
// 		const limit = this.getLimit();

// 		const slicedItems = this.hasLimit() ? arrRotate(items, rotateIndex).slice(0, limit) : items;

// 		return (
// 			<Box flexDirection="column">
// 				{slicedItems.map((item, index) => {
// 					const isSelected = index === selectedIndex;

// 					return (
// 						<Box key={item.key || item.value}>
// 							{React.createElement(indicatorComponent, { isSelected })}
// 							{React.createElement(itemComponent, { ...item, isSelected })}
// 						</Box>
// 					);
// 				})}
// 			</Box>
// 		);
// 	}

// 	componentDidMount() {
// 		const { stdin, setRawMode } = this.props;

// 		setRawMode(true);
// 		stdin.on('data', this.handleInput);
// 	}

// 	componentWillUnmount() {
// 		const { stdin, setRawMode } = this.props;

// 		stdin.removeListener('data', this.handleInput);
// 		setRawMode(false);
// 	}

// 	componentDidUpdate(prevProps) {
// 		if (!isEqual(prevProps.items, this.props.items)) {
// 			this.setState({ // eslint-disable-line react/no-did-update-set-state
// 				rotateIndex: 0,
// 				selectedIndex: 0
// 			});
// 		}
// 	}

// 	handleInput = data => {
// 		const { items, focus, onSelect, onHighlight } = this.props;
// 		const { rotateIndex, selectedIndex } = this.state;
// 		const hasLimit = this.hasLimit();
// 		const limit = this.getLimit();

// 		if (focus === false) {
// 			return;
// 		}

// 		const s = String(data);

// 		if (s === ARROW_UP || s === 'k') {
// 			const lastIndex = (hasLimit ? limit : items.length) - 1;
// 			const atFirstIndex = selectedIndex === 0;
// 			const nextIndex = (hasLimit ? selectedIndex : lastIndex);
// 			const nextRotateIndex = atFirstIndex ? rotateIndex + 1 : rotateIndex;
// 			const nextSelectedIndex = atFirstIndex ? nextIndex : selectedIndex - 1;

// 			this.setState({
// 				rotateIndex: nextRotateIndex,
// 				selectedIndex: nextSelectedIndex
// 			});

// 			const slicedItems = hasLimit ? arrRotate(items, nextRotateIndex).slice(0, limit) : items;
// 			onHighlight(slicedItems[nextSelectedIndex]);
// 		}

// 		if (s === ARROW_DOWN || s === 'j') {
// 			const atLastIndex = selectedIndex === (hasLimit ? limit : items.length) - 1;
// 			const nextIndex = (hasLimit ? selectedIndex : 0);
// 			const nextRotateIndex = atLastIndex ? rotateIndex - 1 : rotateIndex;
// 			const nextSelectedIndex = atLastIndex ? nextIndex : selectedIndex + 1;

// 			this.setState({
// 				rotateIndex: nextRotateIndex,
// 				selectedIndex: nextSelectedIndex
// 			});

// 			const slicedItems = hasLimit ? arrRotate(items, nextRotateIndex).slice(0, limit) : items;
// 			onHighlight(slicedItems[nextSelectedIndex]);
// 		}

// 		if (s === ENTER) {
// 			const slicedItems = hasLimit ? arrRotate(items, rotateIndex).slice(0, limit) : items;
// 			onSelect(slicedItems[selectedIndex]);
// 		}
// 	}

// 	hasLimit = () => {
// 		const { limit, items } = this.props;

// 		return typeof limit === 'number' && items.length > limit;
// 	}

// 	getLimit = () => {
// 		const { limit, items } = this.props;

// 		if (this.hasLimit()) {
// 			return Math.min(limit, items.length);
// 		}

// 		return items.length;
// 	}
// }

const SelectInputWithStdin = (props: SelectInputProps) => {
	const { stdin, setRawMode } = useStdin()
	if (stdin)
		return <SelectInput {...props} stdin={stdin} setRawMode={setRawMode} />
	else
		throw new Error("Stdin not found");
		
}
export default SelectInputWithStdin

// export default class SelectInputWithStdin extends PureComponent {

// 	render() {
// 		const { stdin, setRawMode } = useStdin()
// 		return (
// 			<SelectInput {...this.props} stdin={stdin} setRawMode={setRawMode} />
// 		);
// 	}
// }

export { Indicator, Item };
