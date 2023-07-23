package com.novemberizing;

import android.net.Uri;

import java.net.URL;
import java.util.Map;

public class NovemberizingUrl {

    public static String build(String base, String path) {
        Uri uri = Uri.parse(base);
        Uri.Builder builder = uri.buildUpon();
        builder.path(path);
        uri = builder.build();

        return uri.toString();
    }

    public static String build(String base, String path, Map<String, String> query) {
        Uri uri = Uri.parse(base);
        Uri.Builder builder = uri.buildUpon();
        builder.path(path);
        for(Map.Entry<String, String> entry : query.entrySet()) {
            builder.appendQueryParameter(entry.getKey(), entry.getValue());
        }
        uri = builder.build();

        return uri.toString();
    }
}
