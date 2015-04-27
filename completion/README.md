# Completion for generate

> Borrowed from gulp, thanks to gulp and the grunt team and Tyler Kellen for creating this.

To enable tasks auto-completion in shell you should add `eval "$(generate --completion=shell)"` in your `.shellrc` file.

## Bash

Add `eval "$(generate --completion=bash)"` to `~/.bashrc`.

## Zsh

Add `eval "$(generate --completion=zsh)"` to `~/.zshrc`.

## Powershell

Add `Invoke-Expression ((generate --completion=powershell) -join [System.Environment]::NewLine)` to `$PROFILE`.

## Fish

Add `generate --completion=fish | source` to `~/.config/fish/config.fish`.
