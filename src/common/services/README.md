

HOST
	SERVER (hostname, port)  <---> ServiceProvider <---> Application
		^									^
		|									|
		|								Service
		|									|
		v									v
	CLIENT (browser or server) <---> ServiceConsumer
	
	
	Application
		provides Service on Server
	
	Service
		are deployed on Server through ServiceProvider
	
	Server
		