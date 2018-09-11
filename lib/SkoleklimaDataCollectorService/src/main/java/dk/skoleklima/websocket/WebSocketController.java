package dk.skoleklima.websocket;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionConnectedEvent;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;

import dk.skoleklima.dto.ListItemsDTO;
import dk.skoleklima.model.Inbox;

@Controller
public class WebSocketController {

	@Autowired
	private SimpMessageSendingOperations messagingTemplate;
	
	@EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
		System.out.println("Received a new web socket connection : "+event.getTimestamp());
    }


	@MessageMapping("/message")
	@SendTo("/queue/reply")
	public String processMessageFromClient(@Payload String message) throws Exception {
		System.out.println(message);
		String name = new Gson().fromJson(message, Map.class).get("name").toString();
		//messagingTemplate.convertAndSend("/queue/reply", name);
		return name;
	}
	
	@MessageMapping("/inbox")
	@SendTo("/queue/inbox")
	public List<Inbox> processMessageFromInbox(@Payload String inbox) throws Exception {
		ObjectMapper mapper = new ObjectMapper();
		List<Inbox> mo = mapper.readValue(inbox, new TypeReference<List<Inbox>>(){});

		return mo;
	}
	
	@MessageMapping("/items")
	@SendTo("/queue/items")
	public List<ListItemsDTO> processMessageFromItems(@Payload String items) throws Exception {
		
		ObjectMapper mapper = new ObjectMapper();
		
		List<ListItemsDTO> mo = mapper.readValue(items, new TypeReference<List<ListItemsDTO>>(){});

		return mo;
	}
	
	@MessageExceptionHandler
    @SendTo("/queue/errors")
    public String handleException(Throwable exception) {
		exception.printStackTrace();
        return exception.getMessage();
    }

}
