package com.novemberizing.iam;

import android.text.Editable;
import android.util.Log;

import com.google.android.material.textfield.TextInputEditText;
import com.google.gson.JsonObject;
import com.novemberizing.NovemberizingMap;
import com.novemberizing.NovemberizingStr;
import com.novemberizing.NovemberizingUrl;
import com.novemberizing.NovemberizingVolley;
import com.novemberizing.function.NovemberizingOn;
import com.novemberizing.object.NovemberizingPair;

import java.util.Map;

public class NovemberizingIam {
    public static final String Tag = "NovemberizingIam";
    private static final String base = "https://novemberizing.com";
    private static final String signin = "/iam/signin";

    public static void login(TextInputEditText identity, TextInputEditText password, NovemberizingOn<JsonObject> callback) {
        // TODO: MAP 을 쉽게 만들 수 있도록 하자.
        Map<String, String> queries = NovemberizingMap.gen(NovemberizingPair.gen("identity", NovemberizingStr.get(identity.getText())),
                                                           NovemberizingPair.gen("password", NovemberizingStr.get(password.getText())));

        String url = NovemberizingUrl.build(NovemberizingIam.base, NovemberizingIam.signin, queries);

        NovemberizingVolley.json(url, JsonObject.class, callback::on, e -> Log.e(Tag, e.toString()));
    }

    public static void login(String identity, String password) {
        Log.e(Tag, "implement this");
    }

    public static void google(String token, NovemberizingOn<JsonObject> callback) {
        String url = NovemberizingUrl.build(NovemberizingIam.base, NovemberizingIam.signin);
        Map<String, String> header = NovemberizingMap.gen(NovemberizingPair.gen("Authorization", "Google " + token));

        NovemberizingVolley.json(url, header, JsonObject.class, callback::on, e -> Log.e(Tag, e.toString()));

        Log.e(Tag, "implement this");
    }

    public static void signup() {
        Log.e(Tag, "implement this");
    }
}
