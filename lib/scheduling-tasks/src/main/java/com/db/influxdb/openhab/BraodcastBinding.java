package com.db.influxdb.openhab;

import java.util.Arrays;
import java.util.List;

import org.springframework.web.client.RestTemplate;

import com.db.influxdb.utility.Url;

public class BraodcastBinding {
	
	public void sendBinding() {
		RestTemplate rt = new RestTemplate();
		String url = Url.raspberryOpenhab+"/rest/bindings";//Raspberry pi(Reading binding data)
		BindingDto[] bindingDto = rt.getForObject(url, BindingDto[].class);
		useRestful(Arrays.asList(bindingDto));//Converting array to arraylist
	}
	
	public void useRestful(List<BindingDto> sdo) {
		RestTemplate r = new RestTemplate();
		String url = Url.serverUrl+"/check/bindings";//server or local
		r.postForEntity(url, sdo, String.class);
	}

}
