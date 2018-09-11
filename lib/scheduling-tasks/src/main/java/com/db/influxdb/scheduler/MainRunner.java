package com.db.influxdb.scheduler;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import com.db.influxdb.openhab.RaspberryPiDTO;



@SpringBootApplication
@EnableScheduling
public class MainRunner {
	public static void main(String[] args) throws Exception {
		if(args == null || args.length<3) {
			//System.out.println("Rosberry Pai Detail is required.");
			//System.exit(0);
			 RaspberryPiDTO.data("2860 - Herlev", "Student aprtment 77", "Copenhagen");
		}
		else {
			   RaspberryPiDTO.data(args[0], args[1], args[2]);
		      
		}
		 SpringApplication.run(MainRunner.class);
	}
}


