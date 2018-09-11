package dk.skoleklima.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.TimeZone;
import java.util.concurrent.TimeUnit;

import org.influxdb.InfluxDB;
import org.influxdb.InfluxDBFactory;
import org.influxdb.dto.Point;
import org.influxdb.dto.Pong;

import dk.skoleklima.utility.Url;

public class InfluxDbUtility {

	
	public void syncronizeData(Map<Object,Map<Object, Map<Object,Object>>> openhabdto ) {

		//InfluxDB influxDB = InfluxDBFactory.connect("http://192.168.0.104:8086", "openhab", "openhabuser");
		InfluxDB influxDB = InfluxDBFactory.connect(Url.serverInfluxDb, "openhab", "openhabuser");//server//windows
		
		
		   Pong response = influxDB.ping();
//		   if (response.getVersion().equalsIgnoreCase("unknown")) {
//		       System.out.println("Error pinging server.");
//		       return;
//		   }
		
		//influxDB.createRetentionPolicy("defaultPolicy", "openhab_db", "30d", 0, true);
		influxDB.createRetentionPolicy("defaultPolicy", "openhab_db", "30d", 1, true);
		influxDB.setRetentionPolicy("defaultPolicy");

		String dbName = "openhab_db";
		
		for(Object ohdata: openhabdto.keySet()) {
			
			Map<Object, Map<Object,Object>> va = openhabdto.get(ohdata);//Table name
			
			for(Object time: va.keySet()) {
				Map<Object,Object> val = va.get(time);//time
				
				for(Object value: val.keySet()) { //value
					
					Point point = Point.measurement(""+ohdata)
							.time(fdate(""+time), TimeUnit.MILLISECONDS)
							.addField(""+value, ""+ val.get(value)).build();
					influxDB.write(dbName, "defaultPolicy", point);
				}
			}
	
		}
		influxDB.close();
	}
	
	private Long fdate(String time)
	{
		SimpleDateFormat format = new SimpleDateFormat(
			    "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US);
			format.setTimeZone(TimeZone.getTimeZone("UTC"));
			
			try {
				return  format.parse(time).getTime();
			} catch (ParseException e) {
				// TODO Auto-generated catch block
				
				e.printStackTrace();
				return System.currentTimeMillis();
			}
			
	}
	
}
