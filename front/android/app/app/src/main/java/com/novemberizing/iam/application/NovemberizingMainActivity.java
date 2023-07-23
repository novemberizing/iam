package com.novemberizing.iam.application;

import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import com.novemberizing.NovemberizingActivity;

public class NovemberizingMainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        NovemberizingActivity.move(this, NovemberizingLoginDefaultActivity.class);
    }
}
