# Inline Math for Notion

This script adds support for inline math to Notion - rerendering edited formulas automatically.

## Installation

1. Install the [Violentmonkey](https://violentmonkey.github.io/) browser extension.
1. Within Violentmonkey, import the script from `https://raw.githubusercontent.com/jonhue/notion-inline-math/master/index.js`.

## Usage

To create an inline math block, in a regular inline codeblock surround your LaTex code with `$$`. When your cursor leaves the block, the script will automatically render the formula.

Originally inspired by https://github.com/evertheylen/notion-inline-math.
