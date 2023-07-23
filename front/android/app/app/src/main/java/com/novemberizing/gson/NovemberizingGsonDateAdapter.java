package com.novemberizing.gson;

import android.util.Log;

import com.google.gson.TypeAdapter;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class NovemberizingGsonDateAdapter extends TypeAdapter<Date> {
    private static final String Tag = "NovemberizingGsonDateAdapter";

    @Override
    public void write(JsonWriter out, Date value) throws IOException {
        SimpleDateFormat simple = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault());
        String str = simple.format(value);
        out.value(str);
    }

    @Override
    public Date read(JsonReader in) throws IOException {
        if(in.hasNext()) {
            String value = in.nextString();
            SimpleDateFormat simple = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault());
            try {
                return simple.parse(value);
            } catch (ParseException e) {
                Log.e(Tag, e.toString());
            }
        }

        return null;
    }
}
