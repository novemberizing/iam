package com.novemberizing;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.novemberizing.gson.NovemberizingGsonDateAdapter;

import java.util.Date;

public class NovemberizingGson {
    private static Gson gson = null;

    public static void gen() {
        synchronized (NovemberizingGson.class) {
            GsonBuilder builder = new GsonBuilder();

            builder.disableHtmlEscaping();
            builder.registerTypeAdapter(Date.class, new NovemberizingGsonDateAdapter());

            gson = builder.create();
        }
    }

    public static String to(JsonElement element) {
        return gson.toJson(element);
    }

    public static Gson get() {
        return gson;
    }
}
