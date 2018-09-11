package com.db.influxdb.scheduler.websocketclient;

import javax.annotation.PostConstruct;

import org.springframework.messaging.converter.StringMessageConverter;
import org.springframework.messaging.simp.stomp.StompSessionHandler;
import org.springframework.scheduling.concurrent.ConcurrentTaskScheduler;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.client.WebSocketClient;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;

import com.db.influxdb.utility.Url;

@Component
public class WebsocketClient {
	
	@PostConstruct
	public void cli() {
		//SpringApplication.run(Application.class, args);
		
		//Handshake for server websoclket. 
		 String URL = Url.serverSocketUrl+"/greeting";//Skoleklima ip

	        WebSocketClient client = new StandardWebSocketClient();
	        WebSocketStompClient stompClient = new WebSocketStompClient(client);

	        stompClient.setMessageConverter(new StringMessageConverter());
	        stompClient.setTaskScheduler(new ConcurrentTaskScheduler());

	        StompSessionHandler sessionHandler = new MyStompSessionHandler();
	       // stompClient.start();
	        stompClient.connect(URL, sessionHandler);
	  
	 
	      // new Scanner(System.in).nextLine(); // Don't close immediately.
	    

	}

}
