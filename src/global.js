// global.js
import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
	html, body {
		margin: 0;
		padding: 0;
	}
	*, *::after, *::before {
		box-sizing: border-box;
	}

	body {
		background: ${({ theme }) => theme.primaryBg};
		color: ${({ theme }) => theme.primaryColor};
		height: 100vh;
		text-rendering: optimizeLegibility;
	}

	main {
		position: relative;
		top: 50px;
		margin-top: 25px;
	}

	article ul {
		font-size: .8rem;
		line-height: 1.0rem;
		list-style-type: none;
		padding: 10px;
		border-radius: 5px;
		background-color: #ddd;
	}

	article li:not(:last-child) {
		padding-bottom: 10px;
	}

	.date-prompt {
		border-bottom: 1px solid gray;
		margin-bottom: 20px;
	}

	.steps-container {
	}

	.step-input {
		border: none;
		border-bottom: 1px solid gray;
		width: 50px;
		outline: none;
	}



  `
