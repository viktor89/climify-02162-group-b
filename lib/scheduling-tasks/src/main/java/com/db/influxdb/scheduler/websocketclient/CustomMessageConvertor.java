package com.db.influxdb.scheduler.websocketclient;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.converter.MessageConverter;

public class CustomMessageConvertor implements MessageConverter {

	@Override
	public Object fromMessage(Message<?> message, Class<?> targetClass) {
		return null;
	}

	@Override
	public Message<?> toMessage(Object payload, MessageHeaders headers) {
		return null;
	}

}
