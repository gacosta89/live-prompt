# live-prompt 

Simple console with history and redux data flow.

[![Circle CI](https://circleci.com/gh/gacosta89/live-prompt.svg)](https://circleci.com/gh/gacosta89/live-prompt) [![npm version](https://img.shields.io/npm/v/live-prompt.svg?style=flat-square)](https://www.npmjs.com/package/live-prompt) [![npm downloads](https://img.shields.io/npm/dm/live-prompt.svg?style=flat-square)](https://www.npmjs.com/package/live-prompt)

## Contents

- [Description](#description)
- [Install](#install)
- [Features](#features)
- [Getting Started](#getting)
- [Usage](#usage)
- [Example](#example)
- [History Navigation](#history)
- [Thanks](#thanks)

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
      return next(action);
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

## Example

This example will record every committed command to 'commands.txt' and will log the date every 1 minute.

    import livePrompt from 'live-prompt';
    import fs from 'fs';
    
    const commands = fs.createWriteStream('./commands.txt'),
      middleware = store => next => action => {
        if (action.type === 'commit') {
          commands.write(action.data);
        }
        return next(action);
      },
      prompt = livePrompt({middleware});
    
    prompt.start();
    
    setInterval(() => {
      prompt.log('[date]: ' + new Date());
    }, 60000);

## History Navigation

- Navigate through your commands with up and down arrow keys.
- Cancel edit mode hitting ESC once.
- Go back to the last command hitting ESC twice.

## Thanks

- [Eric Eliott](https://medium.com/@_ericelliott)
- [redux](https://reduxframework.com/)
- [immutable-js](https://facebook.github.io/immutable-js/)
- [keypress](https://www.npmjs.com/package/keypress)