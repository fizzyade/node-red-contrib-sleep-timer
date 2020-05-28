# node-red-contrib-sleep-timer

This node implements the behaviour (logic) of a TV sleep timer, it it designed to be used with nodes that provide communications to TV's.

The project homepage is https://github.com/fizzyade/node-red-contrib-sleep-timer

## Features

* Easy to use, specicifically designed to operate as a TV sleep timer and requires no extra logic to be added which would be required when using a generic timer module.
* Provides methods for *starting*, *stopping*, *querying*, *incrementing* and *decrementing* the timer.
* Has 3 outputs to enable easy interfacing
  * Control - the control output provides state change messages ("started", "stopped", or "timeout").
  * Tick - the tick output provides information as the timer counts down (number of seconds left).
  * Set - the set output provides information when the timer duration is set (number of seconds left) (outputs when timer receives **start**, **increment**, **decrement**, or **remaining** message).

### Behaviour

The logic on the sleep timer is as follows:

* When a **start** message (msg.topic) is received the timer will be set to either the default or payload timeout period (if supplied in msg.payload).

  ***Notes:***

  *The timer will NOT be set if the current value is greater than the requested timeout.*

  *If the timer is set, then the Control output will send a message with the payload **started**.  If the timer is already running, then this message will not be output.*

  *A message containing the new timeout value will be output on the Set output.*

* When a **stop** message (msg.topic) is received the timer will be stopped.  

  ***Notes:***

  *If the timer is running then a **stopped** message will be sent on the control output, if the timer is not running then no message will be output.*

* When a **increment** message is received the timer will be incremented by either the default adjustment or payload timeout period (if supplied).

  ***Notes:***

  *If the timer is running then the current timeout will be adjusted by the provided period.*

  *If the timer is not running, then the timer will be started and set to the adjustment period, a **started** message will be output on the Control output.*

  *A message containing the new timeout value will be output on the Set output.*

* When a **decrement** message is received the timer will be decremented by either the default adjustment or payload timeout period (if supplied).

  ***Notes:***

  *If the timer is not running then nothing will happen.*

  *If the timer is running and the current timeout value is less than the adjustment period, then the timer is stopped and a **stopped** message is output on the Control output.  Otherwise the the timer will be decremented by the given amount.*

  *A message containing the new timeout value will be output on the Set output providing the timer was not stopped by the decrement command.*

* When a **remaining** message is received, the timer will output the current timeout value on the set output.

### Configuration

The node provides default settings for:

* Default Period - the default time (in minutes) that the sleep timer will run for when no value is provided in the control payload.
* Default Adjustment - the default adjustment time (in minutes) that the sleep timer will be adjustmed by when no value is provided in the control payload. 

### License

This project is open source and is released under the MIT License

Distributed as-is; no warranty is given.

