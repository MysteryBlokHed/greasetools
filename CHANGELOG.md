# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## 0.2.0

### Added

- Automatically generated documentation
- localStorage fallback for all values functions
- Function to generate a UserScript header from an object
- Function to delete a value with full typing support
- Function to get an object with all available keys and values
- Full typing for the `@require`'d version of the library
- Required `@grant`'s to function docs

### Changed

- Refactored functions and files named `config` to use the word `values` instead
- Moved related functions to their own files

## 0.1.0

### Added

- Function to asynchronously get config options from GreaseMonkey
- Function to wrap config options with a Proxy to change GreaseMonkey config option on set
- Function to wrap GM.getValue with better typing for specific config options
