import React from 'react';
import styled from 'styled-components';

const Menu = styled.div`
	position: fixed;
	z-index: 100;
	top: 50px;
	left: 0;
	width: 100vw;

	display: flex;
	justify-content: center;
	align-items: center;
	height: 20px;

	background: black;
	color: white;
	border-top: 1px solid white;
	font-size: .8rem;
`;

function SubMenuBar(props) {
	const { title, children } = props;

	return (
		<Menu>
	          options here
		</Menu>
	);
}

export default SubMenuBar;

