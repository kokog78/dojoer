package hu.arksys.dojoer.server;

import static spark.Spark.*;

import com.owlike.genson.Genson;
import com.owlike.genson.GensonBuilder;

import hu.arksys.dojoer.model.Counters;

public class Server {

	private final static String MIME_JSON = "application/json; charset=UTF-8";
	
	private final Counters counters = new Counters();
	private final Genson genson = new GensonBuilder().setSkipNull(true).create();
	
	public void serve(int port) {
		
		port(port);
		
		staticFiles.location("/app");
		
		delete("/api", (request, response) -> {
			stop();
			return null;
		});
		
		get("/api/counters/:key", (request, response) -> {
			response.type(MIME_JSON);
			String key = request.params("key");
			return counters.getValue(key);
		}, genson::serialize);
		
		put("/api/counters/:key", (request, response) -> {
			response.type(MIME_JSON);
			String key = request.params("key");
			return counters.incValue(key);
		}, genson::serialize);
		
		delete("/api/counters/:key", (request, response) -> {
			response.type(MIME_JSON);
			String key = request.params("key");
			return counters.decValue(key);
		}, genson::serialize);
		
		post("/api/max-counter/:max", (request, response) -> {
			response.type(MIME_JSON);
			String max = request.params("max");
			counters.setMaxValue(Integer.parseInt(max));
			return counters.getMaxValue();
		}, genson::serialize);
		
		get("/api/max-counter", (request, response) -> {
			response.type(MIME_JSON);
			return counters.getMaxValue();
		}, genson::serialize);
		
		delete("/api/counters", (request, response) -> {
			response.type(MIME_JSON);
			counters.reset();
			return 0;
		}, genson::serialize);
		
		get("/api/counters", (request, response) -> {
			response.type(MIME_JSON);
			return counters.getValues();
		}, genson::serialize);
	}
	
	public static void main(String[] args) {
		Server server = new Server();
		server.serve(1832);
	}
	
}
