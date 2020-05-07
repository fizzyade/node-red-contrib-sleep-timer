/*
 * MIT License
 * 
 * Copyright (c) 2020 Adrian Carpenter
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

module.exports = function(RED) {
	function validateValue(value, defaultValue) 
	{
		if (isNaN(value))
			return(defaultValue)

		if (value===undefined)
			return(defaultValue)

		if (value<=0)
			return(defaultValue)

		return(value)
	}

	function updateStatus(node) 
	{
		if (node.isRunning) {
			node.status({fill:"green",shape:"ring",text:"Running"});
		} else {
			node.status({fill:"red",shape:"dot",text:"Stopped"});
		}
	}

	function sendControlMessage(node, msg, payload)
	{
		msg = RED.util.cloneMessage(msg)

		msg.topic = ''
		msg.payload = payload

		node.send([msg, null, null])     
	}

	function sendSetMessage(node, msg)
	{
		msg = RED.util.cloneMessage(msg)

		msg.topic = ''
		msg.payload = node.timeout

		node.send([null, null, msg])     
	}

	function sendTickMessage(node, msg)
	{
		msg = RED.util.cloneMessage(msg)

		msg.topic = ''
		msg.payload = node.timeout

		node.send([null, msg, null])     
	}

    function SleepTimerNode(config) 
    {
        RED.nodes.createNode(this,config);

        var node = this;

        node.defaultPeriod = validateValue(config.defaultPeriod, 60)
        node.defaultAdjustment = validateValue(config.defaultAdjustment, 60)
        node.timeout = 0
        node.isRunning = false
        node.timerObject = null

        updateStatus(node)

        node.on('input', function(msg) {
			switch(msg.topic) {
			case "start":
				value = validateValue(msg.payload, node.defaultPeriod)*60

			    if (!node.isRunning) {
					sendControlMessage(node, msg, 'started')
			    } else {
			    	if (value<node.timeout)
			    		return
			    }
			    
			    node.timeout = value
			    node.isRunning = true
			    
			    sendSetMessage(node, msg)

			    updateStatus(node)
			    
			    break
			    
			case "stop":
			    if (!node.isRunning) {
					return
			    }
			    
			    node.isRunning = false
			    node.timeout =0

			    sendControlMessage(node, msg, 'stopped')

			    updateStatus(node)

			    break
			    
			case "increment":
				value = validateValue(msg.payload, node.defaultAdjustment)*60

			    if (node.isRunning) {
					node.timeout += value
			    } else {
					node.timeout = value

					sendControlMessage(node, msg, 'started')
			    }

			    node.isRunning = true

			    sendSetMessage(node, msg)

			    updateStatus(node)
			    
			    break
			    
			case "remaining":
			    if (node.timeout>0) {
					sendSetMessage(node, msg)
			    }   
			    
			    return
			    
			case "decrement":

			    if (!node.isRunning)
					return

			    value = node.timeout-(validateValue(msg.payload, node.defaultAdjustment)*60)
			    
			    if (value<0) {
					node.isRunning = false
					node.timeout = 0
					
					sendControlMessage(node, msg, 'stopped')
				} else {
					node.isRunning = true
					node.timeout = value
					
					sendSetMessage(node, msg)
			    }

			    updateStatus(node)
			    
			    break
			}

			if (!node.timerObject) {
				node.timerObject = setInterval(function() {
				    if (node.isRunning) {
						if (node.timeout<=0) {
						    node.isRunning = false
						    node.timeout = 0;
						    
						    clearInterval(node.timerObject)

						    node.timerObject = null

							sendControlMessage(node, msg, 'timeout')

							updateStatus(node)

						    return
						} else {
						    node.timeout--
						}

						sendTickMessage(node, msg)
				    }
				}, 1000);
			}
		});
    }

    RED.nodes.registerType("sleep-timer", SleepTimerNode);
}
