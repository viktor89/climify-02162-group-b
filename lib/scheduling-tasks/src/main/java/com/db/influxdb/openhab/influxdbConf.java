package com.db.influxdb.openhab;

import java.util.ArrayList;
import java.util.List;

import org.influxdb.InfluxDB;
import org.influxdb.InfluxDBFactory;
import org.influxdb.dto.Query;
import org.influxdb.dto.QueryResult;
import org.influxdb.dto.QueryResult.Result;
import org.influxdb.dto.QueryResult.Series;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import com.db.influxdb.utility.Url;

public class influxdbConf {

	List<DataDTO> listDto = new ArrayList<>();

	public void getData() {
		
		InfluxDB influxDB = InfluxDBFactory.connect(Url.raspberryInfluxDb, "openhab", "openhabuser");//Raspberry pi
		
		try {
		String dbName = "openhab_db";

		// Query query = new Query("SELECT * FROM Indoor_CO2", dbName);
		Query query = new Query("SHOW MEASUREMENTS", dbName);
		QueryResult qr = influxDB.query(query);

		List<Result> ls = qr.getResults();
		for (Result rs : ls) {

			List<Series> list1 = rs.getSeries();
			System.out.println("series ==== " +list1.size());

			for (Series s : list1) {

				List<List<Object>> obs = s.getValues();
				for (List<Object> lo : obs) {
					for (Object o : lo) {
						queryDbValues(influxDB, o);
						//System.out.println(o);
					}
				}
			}
		}
		//System.out.println(influxDB.query(query));
		// influxDB.query(query, 55, queryResult -> System.out.println(queryResult));
		
		useRestful(listDto, influxDB);
		influxDB.close();
		
		} catch (Exception e) {	
			influxDB.close();
			e.printStackTrace();
		}
		
	}

	public void queryDbValues(InfluxDB influxDB, Object measumentName) {

		String dbName = "openhab_db";

		Query query = new Query("SELECT value FROM " + measumentName, dbName);

		QueryResult qr = influxDB.query(query);

		List<Result> ls = qr.getResults();
		for (Result rs : ls) {

			List<Series> list1 = rs.getSeries();

			System.out.println("printing series: "+list1.size());
			for (Series s : list1) {

				List<List<Object>> obs = s.getValues();
				for (List<Object> lo : obs) {
					DataDTO d1 = new DataDTO();
					d1.sensorName = measumentName;
					d1.time = lo.get(0);
					d1.value = lo.get(1);
					listDto.add(d1);
					System.out.println(d1.sensorName +" - "+d1.time+" - "+d1.value);
				}
			}
		}

	}//ufw

	public void useRestful(List<DataDTO> dto, InfluxDB influxDB) {
		RestTemplate r = new RestTemplate();
		//String url = "http://192.168.0.102:8085/check/sensor"; //
		String url = Url.serverUrl+ "/check/sensor";//server or local windows
		ResponseEntity<Integer> dataConfirmation = r.postForEntity(url, dto, Integer.class);
		//Here after getting confirmation 200 from server then deleting the data from raspberry pi. 
		if(dataConfirmation.getBody() == 200) {
			//delete all the series data. 
			influxDB.query(new Query("DELETE WHERE time > 2018-06-09", "openhab_db"));
			
		}
	}

	public static void main(String[] args) {
		influxdbConf obj = new influxdbConf();
		obj.getData();
	}
}
