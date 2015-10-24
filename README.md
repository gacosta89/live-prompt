# live-prompt

Node console with history.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Contents

- [Description](#description)
- [Install](#install)
- [Features](#features)
- [History navigation](#history navigation)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Description

This is a Node console built in with redux architecture.

## Install

live-prompt can be installed via npm.

    npm install live-prompt

## Features

- It remembers your commands, and you can navigate around them with the arrow keys.

## Getting Started

    import livePrompt from 'live-prompt';

    const prompt = livePrompt(options);

# livePrompt()

Default options:
    options = {
      stdin = process.stdin,
      stdout = process.stdout,
      middleware = undefined,
      prompt = 'live-prompt:$ ',
      bye = 'see you soon!',
      encoding = 'utf8'
    }

- @param {Object} [options.stdin] Readable stream.
- @param {Object} [options.stdout] Writable stream.
- @param {Function} [options.middleware] Redux middleware function.
- @param {String} [options.prompt] Prompt.
- @param {Object} [options.bye] Final greeting.
- @param {String} [options.encoding] Stdin encoding.
- @returns {Object} {{log}} Returns a prompt object with a log method.

# Middleware function

This is a common redux middleware function:

    middleware = store => next => action => {
      ...
    }

# Actions:

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

# Log

livePrompt() returns an object with a log method that has this signature.

    log (txt)


## History Navigation

- Navigate through your commands with up and down arrow keys.
- Cancel edit mode hitting ESC once.
- Go back to the last command hitting ESC twice.