# node-red-contrib-sleep-timer

This node implements the behaviour (logic) of a TV sleep timer, it it designed to be used with nodes that provide communications to TV's.

## Features

* Easy to use, specicifically designed to operate as a TV sleep timer and requires no extra logic to be added which would be required when using a generic timer module.
* Provides methods for *starting*, *stopping*, *querying*, *incrementing* and *decrementing* the timer.
* Has 3 outputs to enable easy interfacing
  * Control - the control output provides state change messages.
  * Tick - the tick output provides information as the timer counts down.
  * Set - the set output provides information when the timer duration is set.

### Configuration

