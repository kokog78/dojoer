package hu.arksys.dojoer.model;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class Counters {

	private Map<String, Integer> values = new HashMap<String, Integer>();
	private int maxValue;
	
	public synchronized void setMaxValue(int maxValue) {
		this.maxValue = maxValue;
	}
	
	public synchronized int getMaxValue() {
		return maxValue;
	}
	
	public synchronized int incValue(String key) {
		Integer value = values.get(key);
		if (value == null) {
			value = 1;
		} else {
			value += 1;
		}
		values.put(key, value);
		return value;
	}
	
	public synchronized int decValue(String key) {
		Integer value = values.get(key);
		if (value == null) {
			value = 0;
		} else if (value > 0) {
			value -= 1;
		}
		values.put(key, value);
		return value;
	}
	
	public synchronized int getValue(String key) {
		Integer value = values.get(key);
		if (value == null) {
			return 0;
		} else {
			return value;
		}
	}
	
	public synchronized List<Counter> getValues() {
		return values.entrySet().stream()
			.map(entry -> Counter.of(entry.getKey(), entry.getValue() == null ? 0 : entry.getValue(), maxValue))
			.sorted((c1, c2) -> c2.value - c1.value)
			.collect(Collectors.toList());
	}
	
	public synchronized void reset() {
		values.clear();
	}
	
}
