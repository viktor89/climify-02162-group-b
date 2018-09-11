package com.db.influxdb.openhab;

import java.util.List;
import java.util.ArrayList;

import org.springframework.web.client.RestTemplate;

import com.db.influxdb.utility.Url;
import com.google.gson.Gson;

public class BroadcastSendorData {
	
	public void getMetaDataInfo() {
		List<SensorData> sdata =  new ArrayList<>();
		RestTemplate rt = new RestTemplate();
		String url = Url.raspberryOpenhab+"/rest/things";//RaspberryPi IP: openHAB port
		SensorDTO[] sensorDto = rt.getForObject(url, SensorDTO[].class);
		for(SensorDTO s : sensorDto)
			sdata.add(getSensorDate(s));
		
		useRestful(sdata);
		
		}
	
	private SensorData getSensorDate(SensorDTO sdto) {
		SensorData sd = new SensorData();
		sd.rasberyPi = new RosberrypiData(RaspberryPiDTO.dataReterive());
		sd.uid = sdto.UID;
		sd.thingTypeUID = sdto.thingTypeUID;
		for(ChannelsDTO cd : sdto.channels) {
			 if(cd.linkedItems != null && cd.linkedItems.size()>0) {
				 sd.sensorItemData.add(getItems(cd.linkedItems.get(0)));
			 }
		}
		return sd;
	}
	
	
	public SensorLinkedItem getItems(String a) {
		RestTemplate rt = new RestTemplate();
		String url = Url.raspberryOpenhab+"/rest/items/" + a;//Raspberry pi(Retrieving LinkedItem details)
		System.out.println("Pringting url ======="+url);
		ItemsData idata = rt.getForObject(url, ItemsData.class);
		   SensorLinkedItem sli = new SensorLinkedItem();
		   sli.label = idata.label;
		   System.out.println("Printing temp data:  " + idata.label);
		   
		   sli.name = idata.name;
		   sli.type = idata.type;
		   sli.state = idata.state;
		   if(idata.stateDescription != null)
		   {
			   sli.readOnly = true;
			   sli.mesurement = idata.stateDescription.pattern.replace("%", "");
		   }
		   
		   return sli;
		}
	
	public void useRestful(List<SensorData> sdo) {
		System.out.println( "Data : "+  (new Gson()).toJson(sdo));
		RestTemplate r = new RestTemplate();
		String url = Url.serverUrl+"/check/sensorMetaData";//Skoleklima ip
		r.postForEntity(url, sdo, String.class);
	}

}
