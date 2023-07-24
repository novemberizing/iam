package com.novemberizing.iam.application;

import android.os.Bundle;
import android.util.Log;
import android.widget.Button;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.google.android.material.textfield.TextInputEditText;
import com.novemberizing.NovemberizingActivity;
import com.novemberizing.NovemberizingSnackbar;
import com.novemberizing.NovemberizingStr;
import com.novemberizing.iam.NovemberizingIam;
import com.novemberizing.iam.NovemberizingIamGoogleLogin;

public class NovemberizingLoginDefaultActivity extends AppCompatActivity {
    private static final String Tag = "LoginDefaultActivity";
    private Button login;
    private TextView signup;
    private TextInputEditText identity;
    private TextInputEditText password;

    private NovemberizingIamGoogleLogin google;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login_default);

        login = findViewById(R.id.activity_login_default_login_button);
        signup = findViewById(R.id.activity_login_default_signup_text);
        identity = findViewById(R.id.activity_login_default_identity_edit);
        password = findViewById(R.id.activity_login_default_password_edit);

        google = new NovemberizingIamGoogleLogin(this, findViewById(R.id.activity_login_default_social_google_image), getString(R.string.default_web_client_id), o -> {
            Log.e(Tag, o.toString());

            NovemberizingSnackbar.show(findViewById(R.id.activity_login_default_layout), "Succeed to google login");
        });

        login.setOnClickListener(view -> NovemberizingIam.login(identity, password, o -> {
            NovemberizingSnackbar.show(findViewById(R.id.activity_login_default_layout), "Succeed to identity and password");
        }));

        NovemberizingActivity.linkify(signup, "Sign up", view -> NovemberizingActivity.move(this, NovemberizingSignupDefaultActivity.class, false));
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();

        login = null;
        signup = null;
        google = null;
    }
}
