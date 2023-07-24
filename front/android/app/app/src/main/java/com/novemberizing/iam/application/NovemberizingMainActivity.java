package com.novemberizing.iam.application;

import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import com.google.android.material.card.MaterialCardView;
import com.novemberizing.NovemberizingActivity;

public class NovemberizingMainActivity extends AppCompatActivity {

    private MaterialCardView defaultCard;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        defaultCard = findViewById(R.id.activity_main_default_layout_card);

        defaultCard.setOnClickListener(view -> NovemberizingActivity.move(this, NovemberizingLoginDefaultActivity.class, false));
    }
}
