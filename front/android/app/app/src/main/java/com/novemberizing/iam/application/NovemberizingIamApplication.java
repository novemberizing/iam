package com.novemberizing.iam.application;

import android.app.Application;

import com.novemberizing.NovemberizingGson;
import com.novemberizing.NovemberizingVolley;

public class NovemberizingIamApplication extends Application {
    @Override
    public void onCreate(){
        super.onCreate();

        NovemberizingGson.gen();
        NovemberizingVolley.gen(this);
    }

    @Override
    public void onTerminate(){
        super.onTerminate();
    }
}
