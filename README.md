# live-prompt [![Travis-CI](https://circleci.com/gh/gacosta89/live-prompt.svg)](https://circleci.com/gh/gacosta89/live-prompt)

Node console with history.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Contents

- [Description](#description)
- [Install](#install)
- [Features](#features)
- [Getting Started](#getting)
- [Usage](#usage)
- [History Navigation](#history)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Description

This is a Node console built in with redux architecture.

## Install

live-prompt can be installed via npm.

    npm install live-prompt

## Features

- It remembers your commands and you can navigate around them with the arrow keys.

## Getting Started

    import livePrompt from 'live-prompt';
    
    const options = {...},
      prompt = livePrompt(options);
    
    prompt.start();
    
    prompt.log('Hey!!');
    
    prompt.stop();

## Usage

### Options

Default options:

    options = {
      stdin = process.stdin,
      stdout = process.stdout,
      middleware = undefined,
      prompt = 'live-prompt:$ ',
      bye = 'see you soon!',
      onCtrlC = undefined,
      encoding = 'utf8'
    }

- @param {Object} [options.stdin] Readable stream.
- @param {Object} [options.stdout] Writable stream.
- @param {Function} [options.middleware] Redux middleware function.
- @param {String} [options.prompt] Prompt.
- @param {Object} [options.bye] Final greeting.
- @param {Function} [options.onCtrlC] Callback to be called when ctrl-c is pressed.
- @param {String} [options.encoding] Stdin encoding.

### Prompt Object

livePrompt() returns an object with the next methods.

    {
      start () {},
      stop () {},
      log (txt) {}
    }

Start: sets stdin raw mode true, sets the encoding and subscribes for 'keypress' events.

Stop: unsubscribes stdin from 'keypress' events.

Log: logs txt to the stdout without loosing your command.

### Middleware function

This is a common redux middleware function:

    middleware = store => next => action => {
      ...
    }

### Actions:

Commit is dispatched when you hit return.

    {type: 'commit', data: 'command...'}

Prev is dispatched when you hit up arrow key.

    {type: 'prev'}

Next is dispatched when you hit down arrow key.

    {type: 'next'}

Cancel is dispatched when you hit ESC key.

    {type: 'cancel'}

Backspace is dispatched when you hit backspace key.

    {type: 'backspace'}

Any other key will be dispatched as chunk.

    {type: 'chunk', data: 'chunk...'}

### Data Tree Structure
This is the data tree of the state.

    {
      history: {
        commands: [...], // array of committed commands.
        index: 0, // current index of the commands array. 
      },
      present: {
        buffer: '...', // it is the current command you are editing/navigating.
        current: '...', // keeps your last input while you are navigating around the history.
      }
    }

Attention: The value of index being equal to the count of commands means that we are editing the present command.

## History Navigation

- Navigate through your commands with up and down arrow keys.
- Cancel edit mode hitting ESC once.
- Go back to the last command hitting ESC twice.