package com.db.influxdb.openhab;

import java.io.IOException;
import java.util.List;

import org.json.JSONArray;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import com.db.influxdb.utility.Url;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;

public class ExtensionService {
	
	public void exportExtension() {
		RestTemplate r = new RestTemplate();
		 String url = Url.raspberryOpenhab+"/rest/extensions";// Raspberry
		 String serverUrl = Url.serverUrl+"/check/extensionMetaData";//server or local
		 ResponseEntity<Object> o = r.getForEntity(url, Object.class);
         
		 List<ExtensionDTO> map1 = (List<ExtensionDTO>)o.getBody();
		 
		
		 
		 r.postForEntity(serverUrl, map1, String.class);
		 
	}
	


}
