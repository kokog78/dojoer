package hu.arksys.dojoer.model;

public class Counter {

	public String key;
	public int value;
	public int max;
	
	public static Counter of(String key, int value, int max) {
		Counter result = new Counter();
		result.key = key;
		result.value = value;
		result.max = max;
		return result;
	}
}
