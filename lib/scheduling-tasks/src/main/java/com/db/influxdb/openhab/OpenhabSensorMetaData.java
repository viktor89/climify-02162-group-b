package com.db.influxdb.openhab;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.influxdb.InfluxDB;
import org.influxdb.InfluxDBFactory;
import org.influxdb.dto.Query;
import org.influxdb.dto.QueryResult;
import org.influxdb.dto.QueryResult.Result;
import org.influxdb.dto.QueryResult.Series;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import com.db.influxdb.utility.Url;

public class OpenhabSensorMetaData {

	
	public void getMetaDataInfo() {
		RestTemplate rt = new RestTemplate();
		
		String url = Url.raspberryOpenhab+"/rest/things";//RaspberryPi
		SensorDTO[] sensorDto = rt.getForObject(url, SensorDTO[].class);
		//useRestful(Arrays.asList(sensorDto));//Converting array to arraylist(Metadata)
		prepareBackup(Arrays.asList(sensorDto));//Converting array to arraylist¨
	
	}
	
	public void prepareBackup(List<SensorDTO> lsd) //prepare data to send together.
	{
		Map<Object,Map<Object, Map<Object,Object>>> master = new HashMap<>();	
		for(SensorDTO s : lsd) {
			Map<Object, Map<Object,Object>> map = new HashMap<>();
			for(ChannelsDTO cdto : s.channels) {
				if(cdto.linkedItems != null && cdto.linkedItems.size()>0)
					queryDbValues(cdto.linkedItems.get(0), map);
			}
			master.put(s.UID.replace(":", "-"), map);
		}

		sendInfluxData(master);
		}
	
	public void queryDbValues( String measumentName,Map<Object, Map<Object,Object>> map ) {
		InfluxDB influxDB = InfluxDBFactory.connect(Url.raspberryInfluxDb, "openhab", "openhabuser");//Raspberry pi

		String dbName = "openhab_db";

		Query query = new Query("SELECT * FROM " + measumentName, dbName);

		QueryResult qr = influxDB.query(query);

		List<Result> ls = qr.getResults();
		for (Result rs : ls) {

			List<Series> list1 = rs.getSeries();

			//System.out.println("printing series: "+list1.size());
			if(list1 != null)
			for (Series s : list1) {

				List<List<Object>> obs = s.getValues();
				for (List<Object> lo : obs) {
				Map<Object,Object> m = map.get(lo.get(0));
				   if(m == null) {					   
					   m = new HashMap<>();
					   m.put(measumentName, lo.get(1));
					   map.put(lo.get(0), m);
				   }
				   else {
					   m.put(measumentName, lo.get(1));
				   }
				}
			}
		}
		influxDB.close();
	}
	
	public void useRestful(List<SensorDTO> sdo) {
		RestTemplate r = new RestTemplate();
		String url = Url.serverUrl+"/check/sensorMetaData";//server or local
		r.postForEntity(url, sdo, String.class);
	}
	
	public void sendInfluxData(Map<Object,Map<Object, Map<Object,Object>>> mapData) {
		RestTemplate r = new RestTemplate();
		//String url = "http://192.168.0.102:8085/check/sensor"; //
		String url = Url.serverUrl+"/check/sensor";//server or local windows
		ResponseEntity<Integer> dataConfirmation = r.postForEntity(url, mapData, Integer.class);
		//Here after getting confirmation 200 from server then deleting the data from raspberry pi. 
	if(dataConfirmation.getBody() == 200) {	
		deleteDataToRaspberryPi();
	}
}

	public void deleteDataToRaspberryPi() {
		InfluxDB influxDB = InfluxDBFactory.connect("raspberryInfluxDb", "openhab", "openhabuser"); //Raspberry pi
		influxDB.query(new Query("DELETE WHERE time > 2018-06-09", "openhab_db"));
		influxDB.close();
	}
}
