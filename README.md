# Sumologic Connector
[![Build Status](https://travis-ci.org/Reekoh/sumologic-connector.svg)](https://travis-ci.org/Reekoh/sumologic-connector)
![Dependencies](https://img.shields.io/david/Reekoh/sumologic-connector.svg)
![Dependencies](https://img.shields.io/david/dev/Reekoh/sumologic-connector.svg)
![Built With](https://img.shields.io/badge/built%20with-gulp-red.svg)

Sumologic Connector Plugin for the Reekoh IoT Platform. Integrates a Reekoh instance to Sumologic to push and synchronize device data to the Sumologic platform.

## Description
This plugin saves all data from the devices connected to the Reekoh Instance to Sumologic.

## Configuration
To configure this plugin a Sumologic account and collector is needed in order to provide an HTTP Source(a URL pointing to a specific Sumologic collector).
This HTTP Source is then injected to the plugin from the platform.