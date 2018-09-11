package com.db.influxdb.scheduler.websocketclient;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter;
import org.springframework.web.client.RestTemplate;

import com.db.influxdb.openhab.ExtensionService;
import com.db.influxdb.openhab.InboxDTO;
import com.db.influxdb.openhab.ItemsDTO;
import com.db.influxdb.openhab.ListItemsDTO;
import com.db.influxdb.utility.Url;
import com.google.gson.Gson;

/**
 * This class is an implementation for <code>StompSessionHandlerAdapter</code>.
 * Once a connection is established, We subscribe to /topic/messages and send a
 * sample message to server.
 *
 */
public class MyStompSessionHandler extends StompSessionHandlerAdapter {
	StompSession session;
	
	@Autowired
	private SimpMessagingTemplate mt;
	
	@Override
	public void afterConnected(StompSession session, StompHeaders connectedHeaders) {
		System.out.println("New session established : " + session.getSessionId());
		this.session = session;
		this.session.subscribe("/queue/reply", this);
		System.out.println("Subscribed to /queue/reply");
	}

	@Override
	public void handleException(StompSession session, StompCommand command, StompHeaders headers, byte[] payload,
			Throwable exception) {
		System.out.println("handle exception");
		exception.printStackTrace();
	}

	@Override
	public Type getPayloadType(StompHeaders headers) {
		return String.class;
	}

	@Override
	public void handleFrame(StompHeaders headers, Object payload) {
		String sp = ""+payload;

		System.out.println(headers);

		System.out.println("Received : " + payload);
		
		if(sp.startsWith("discovery"))
			discovery();
		else if(sp.startsWith("install"))
			installDevice(sp);
		else if(sp.startsWith("extuninstall"))
			uninstallDevice(sp);
		else if(sp.startsWith("inbox"))
			inboxSearch();
		else if(sp.startsWith("approve"))
			discoverApprove(sp);
		else if(sp.startsWith("listItems"))
			listOfItem();
		else if(sp.startsWith("linkItem"))
			linkItem(sp);
		
		else if(sp.startsWith("ainstallitem"))
			installitem(sp);
		
		else if(sp.startsWith("uninstallitem"))
			uninstallitem(sp);
		
		
		else if(sp.startsWith("tstate"))
			useRestful(sp);
		else {}
		   
	}
	
	
	/**
	 * A sample message instance.
	 * 
	 * @return instance of <code>Message</code>
	 */


//======================================================
//			CONTROLLING THE ACTUATORS HEAT POINT
//	====================================================

	public void useRestful(String data) {
		String setHeatPoint [] = data.split("~");
		RestTemplate r = new RestTemplate();
		System.out.println(setHeatPoint[1] +" "+ setHeatPoint[2]); //[1]: Things UID.  [2] :value change karna hai
		String url = Url.raspberryOpenhab+"/rest/items/"+setHeatPoint[1];// RaspberryPi ip
																												
		r.postForEntity(url, setHeatPoint[2], String.class);
	}

//========================================================================================
//	AFTER INSTALLING THE "bindings", performing discover for the corresponding bindings
//========================================================================================
	public void discovery() {
		ExtensionService es = new ExtensionService();
		es.exportExtension();
	}
	
//===========================================
//	INSTALLING bindings ON the openHAB
//===========================================
    public void installDevice(String data) {
    	 String arrayData [] = data.split("~");
    	 RestTemplate r = new RestTemplate();
		 String url = Url.raspberryOpenhab+"/rest/extensions/"+arrayData[1]+"/install";
		 r.postForEntity(url, arrayData[1], String.class);
		 scanBinding(arrayData[1]);
		
	}
//=====================================================
//	Scanning binding ON the openHAB after installing it
//=====================================================
    public void scanBinding(String data) {
   	 String arrayData [] = data.split("-");
   	 RestTemplate r = new RestTemplate();
		 String url = Url.raspberryOpenhab+"/rest/discovery/bindings/"+arrayData[1]+"/scan";
		 System.out.println(url);
		 ResponseEntity<String> val = r.postForEntity(url, arrayData[1], String.class);
		 System.out.println(val.getStatusCode()+"  <> "+ val.getBody());
		
	}
    

 //============================================================================
//	SERCHING IN THE 'inbox' after discovery in order to add it into the things
//=============================================================================   
    public void inboxSearch() {    	
     	 RestTemplate r = new RestTemplate();
		 String url = Url.raspberryOpenhab+"/rest/inbox";// Raspberry		 
		 ResponseEntity<Object> o = r.getForEntity(url, Object.class);
         
		 System.out.println(o.getBody());
         Gson g = new Gson();
         String s = g.toJson((List<InboxDTO>)o.getBody());
		 
		 this.session.send("/app/inbox", s); 
	}
  
//==============================================================
//	After searching from 'inbox' adding it to the 'things'
//==============================================================
    public void discoverApprove(String data) {
    	String arrayData [] = data.split("~");
    	 RestTemplate r = new RestTemplate();
    	 String url = Url.raspberryOpenhab+"/rest/inbox/"+arrayData[1]+"/approve";// Raspberry
		 Object o =  r.postForEntity(url, arrayData[1], String.class);
		 //sendResponse("approve~"+o);
	}
    
//=============================================
//	
//==============================================  
	public void uninstallitem(String sp) {
		String arrayData [] = sp.split("~");
   	 RestTemplate r = new RestTemplate();
   	 String url = Url.raspberryOpenhab+"/rest/links/"+arrayData[1]+"/"+arrayData[2];// Raspberry
		 r.delete(url);
		 removeitem(arrayData[1]);
	}
	
//================================================
//	Remove the items
//================================================	
	public void removeitem(String itemname) {
   	 RestTemplate r = new RestTemplate();
   	 String url = Url.raspberryOpenhab+"/rest/items/"+itemname;// Raspberry
		 r.delete(url);
		 listOfItem();
	}

//================================================
//	Add the items from 'things'
//================================================
    public void installitem(String sp) {
    	//System.out.println("install it3m");
    	String arrayData [] = sp.split("~");
      	 RestTemplate r = new RestTemplate();
      	 String name = arrayData[2].replace(":", "_");
      	//System.out.println(name);
      	 Map<String ,Object> v = new HashMap<>();
      	 List<String> arr = new ArrayList<>();
      	 v.put("name", name);
      	 v.put("groupNames",arr);
      	 v.put("label", arrayData[1]);
      	v.put("category", arrayData[3]);
      	v.put("type", arrayData[3]);
      	 
      	 String url = Url.raspberryOpenhab+"/rest/items/"+name;// RaspberryPi
      	 //System.out.println(url);
   		 r.put(url,v);
   		 
   		linkedItems(name, arrayData[2]);
		
	}
    
    public void linkedItems(String name,String uid) {
		
   	 RestTemplate r = new RestTemplate();
   	 String url = Url.raspberryOpenhab+"/rest/links/"+name+"/"+uid;// RaspberryPi
   	Map<String ,Object> v = new HashMap<>();
 	 v.put("itemName", name);
 	 v.put("channelUID",uid);
 	//System.out.println(url);
 	r.put(url,v);
 	listOfItem();
	}
    
//================================================
//	Uninstall the bindings from the openHAB
//================================================
    public void uninstallDevice(String data) {
    	 String arrayData [] = data.split("~");
    	 RestTemplate r = new RestTemplate();
		 String url = Url.raspberryOpenhab+"/rest/extensions/"+arrayData[1]+"/uninstall";// Raspberry
		 r.postForEntity(url, arrayData[1], String.class);
	}
    
//================================================================================
//	List all the items in a list whatever the item we already have in our "items"
//================================================================================ 
    public void listOfItem() {
    	 RestTemplate r = new RestTemplate();
		 String url = Url.raspberryOpenhab+"/rest/things";// Raspberry
         ResponseEntity<Object> o = r.getForEntity(url, Object.class);
         List<ListItemsDTO> listItemDto= new ArrayList<>();
        try {
		 //System.out.println(o.getBody());
		 List<Object> ld = (List<Object>)o.getBody();
         Gson g = new Gson();
         //System.out.println(ld.getClass());
         for(int i=0; i<ld.size();i++) {
        	 Map<String, Object> ml = (Map<String, Object>)ld.get(i);
        	 
        		 ListItemsDTO dto = new ListItemsDTO();
        		 dto.label = (String) ml.get("label");
        		 dto.UID = (String) ml.get("UID");
        		 dto.thingTypeUID = (String) ml.get("thingTypeUID");
        		 dto.bridgeUID = (String) ml.get("bridgeUID");
        		 dto.channels =(List<ItemsDTO>)ml.get("channels");// new ArrayList<>();	
        		 listItemDto.add(dto);
         }

         String s = g.toJson(listItemDto);		
        
		 this.session.send("/app/items",s);
        }catch(Exception e) {    
        	e.printStackTrace();
        }
	}
    
    public void linkItem(String data) {
    	String arrayData [] = data.split("~");
    	 RestTemplate r = new RestTemplate();
		 String url = Url.raspberryOpenhab+"/rest/items/";// RaspberryPi
		 Object o =  r.postForEntity(url, arrayData[1], String.class);
		 sendResponse("approve~"+o);
	}
    
    
    public void sendResponse(String o) {
    	System.out.println("client session : "+this.session.getSessionId()+"   -O"+o);
    	this.session.send("/app/message", o);
    }
}